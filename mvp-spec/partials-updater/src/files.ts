import RootPath from "app-root-path";
import fs from "fs";
import path from "path";

const PartialsDir = path.join(RootPath.path, "..", "partials");
const DocumentsDir = path.join(RootPath.path, "..");
const DocumentExts = [ ".md" ]

export const getPartialPath = (file: string): string => path.join(PartialsDir, file);

/** Load a partial based on its name. */
export const loadPartial = (file: string): string => loadFile(file, PartialsDir);

/** Load a document based on its name. */
export const loadDocument = (file: string): string => loadFile(file, DocumentsDir);

/** List the documents by names. */
export const listDocuments = (): string[] => listFiles(DocumentsDir, isDocument);

/** Rewrite a document. */
export function rewriteDocument(name: string, content: string) {
    const fullPath = path.join(DocumentsDir, name);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File doesn't exist. Cannot rewrite: ${fullPath}`)
    }
    fs.writeFileSync(fullPath, content);
}

function loadFile(name: string, dir: string): string {
    const fullPath = path.join(dir, name);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File doesn't exist. Cannot load: ${fullPath}`)
    }
    const content = fs.readFileSync(fullPath);
    const contentStr = content.toString();
    return contentStr;
}

const isDocument = (file :string): boolean => DocumentExts.some(e => file.endsWith(e));

function listFiles(dir: string, filter: (n: string) => boolean): string[] {
    let files = fs.readdirSync(dir);
    let filtered = files.filter(filter);
    return filtered;
}
