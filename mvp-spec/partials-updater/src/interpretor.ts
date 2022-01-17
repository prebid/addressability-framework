import fs from "fs";
import { getPartialPath, loadPartial } from "./files";
import { LexerToken, LexerTokenType, PartialBeginStartKey, PartialBeginEndKey } from "./lexer";
import * as jq from "node-jq";
import { fileURLToPath } from "url";

interface PartialConfig {
    files: string[];
    block?: string;
    jq?: string;
}

/** Interpret the token to generate the content. */
export async function interpret(tokens: LexerToken[]): Promise<string> {
    let doc = '';
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        switch (token.type) {
            case LexerTokenType.PlainText: {
                doc += token.text;
                break;
            }
            case LexerTokenType.PartialEnd: {
                throw new Error("Partial end without Partial Begin");
                break;
            }
            case LexerTokenType.PartialBegin: {
                i++;
                if (i == tokens.length) {
                    throw new Error(`Partial Begin without Partial End: ${token.text}`);
                }
                let nextToken = tokens[i];
                if (nextToken.type == LexerTokenType.PlainText) {
                    i++;
                    if (i == tokens.length) {
                        throw new Error(`Partial Begin without Partial End: ${token.text}`);
                    }
                }
                nextToken = tokens[i];
                if (nextToken.type != LexerTokenType.PartialEnd) {
                    throw new Error(`Partial Begin without Partial End: ${token.text}`);
                }
                const lineBreak = getLineBreakSymbol(token.text);
                doc += token.text;
                doc += "<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->" + lineBreak;
                doc += await interpretPartialBeginToken(token);
                doc += nextToken.text;
                break;
            }
        }
    }
    return doc;
}

async function interpretPartialBeginToken(token: LexerToken) : Promise<string> {
    const jsonStr = token.text
                    .slice(PartialBeginStartKey.length)
                    .slice(0, -PartialBeginEndKey.length);
    try {
        const config: PartialConfig = JSON.parse(jsonStr);
        if (!config.hasOwnProperty('files') && config.files.length >= 1) {
            throw new Error(`Partial with bad configuration: ${token.text}`)
        }
        
        if (config.hasOwnProperty('jq')) {
            const jsonPaths = config.files.map(getPartialPath);
            const options = (config.files.length > 1) ? { slurp: true } : undefined;
            const json = (await jq.run(config.jq, jsonPaths, options)).toString();
            const partial = getPartialInCodeBlock(json);
            return partial;
        } 
        const partials = config.files.map(loadPartial);
        const lineBreak = getLineBreakSymbol(config.files[0]);
        let merged = partials.join(lineBreak)
        if (config.hasOwnProperty('block')) {
            merged = getPartialInCodeBlock(merged, config.block);
        }
        return merged;
    } catch (e) {
        throw new Error(`Partial with bad configuration: ${token.text} - ${e}`)
    }
}

function getPartialInCodeBlock(partial: string, type: string = "json"): string {
    const lineBreak = getLineBreakSymbol(partial);
    const block = `\`\`\`${type}${lineBreak}${partial}${lineBreak}\`\`\`${lineBreak}`
    return block;
}

function getLineBreakSymbol(str: string): string {
    const indexOfLF = str.indexOf('\n', 1);  // No need to check first-character

    if (indexOfLF === -1) {
        if (str.indexOf('\r') !== -1) 
            return '\r';
        return '\n';
    }

    if (str[indexOfLF - 1] === '\r')
        return '\r\n';
    return '\n';
}
