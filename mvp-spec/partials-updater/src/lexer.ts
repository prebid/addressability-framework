export const PartialBeginStartKey = "<!--partial-begin"
export const PartialBeginEndKey = "-->\r\n"
export const PartialEndKey = "<!--partial-end-->\r\n"

/** All type of tokens for a simplified lexing for partials. */
export enum LexerTokenType {
    PlainText = "TEXT",
    PartialBegin = "PARTIAL_BEGIN",
    PartialEnd = "PARTIAL_END"
}

/** Token describing the different part of a document. */
export interface LexerToken {
    type: LexerTokenType;
    text: string;
}

/** Split a content in tokens. */
export function lex(content: string): LexerToken[] {
    const tokens = new Array<LexerToken>();
    const lines = getLines(content);
    let textAcc = '';
    lines.forEach(line => {
        if (line.startsWith(PartialBeginStartKey) && line.endsWith(PartialBeginEndKey)) {
            if (textAcc != '') {
                const token: LexerToken = {
                    type: LexerTokenType.PlainText,
                    text: textAcc
                };
                tokens.push(token);
                textAcc = '';
            }
            const token: LexerToken = {
                type: LexerTokenType.PartialBegin,
                text: line
            };
            tokens.push(token);
        } else if (line == PartialEndKey) {
            if (textAcc != '') {
                const token: LexerToken = {
                    type: LexerTokenType.PlainText,
                    text: textAcc
                };
                tokens.push(token);
                textAcc ='';
            }
            const token: LexerToken = {
                type: LexerTokenType.PartialEnd,
                text: line
            }
            tokens.push(token);
        } else {
            textAcc += line;
        }
    });
    if (textAcc != '') {
        const token: LexerToken = {
            type: LexerTokenType.PlainText,
            text: textAcc
        };
        tokens.push(token);
        textAcc ='';
    }
    return tokens;
}

/**
 * Split a content in lines including the separators.
 * 
 * @param content String to split in lines
 * @returns An array of lines including the separator.
 */
function getLines(content: string): string[] {
    const separators = [ '\n', '\r\n' ];
    const recuder = (min: string, sep: string): string => 
        min.length < sep.length ? min : sep;
    const minLenght = separators.reduce(recuder).length;
    const lines: string[] = []; 
    let lineStart = 0;
    
    for (let i = minLenght; i < content.length; i++) {
        const filtered = separators.filter(x => x.length <= i - lineStart);
        for (let sep of filtered) {
            const separatorStart = i - sep.length;
            const candidat = content.substring(separatorStart, i);
            if (candidat == sep) {
                const newLine = content.substring(lineStart, i);
                lines.push(newLine);
                lineStart = i;
                break;
            }
        }
    }
    if (lineStart < content.length) {
        const newLine = content.substring(lineStart, content.length);
        lines.push(newLine);
    }
    return lines;
}