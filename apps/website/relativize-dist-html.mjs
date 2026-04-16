import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve(process.argv[2] ?? "dist");

const ATTRIBUTE_PATTERN =
  /\b(href|src|component-url|renderer-url|before-hydration-url)=("|')([^"']+)\2/g;

const HTML_EXTENSIONS = new Set([".html", ".htm"]);

async function main() {
  const htmlFiles = await collectHtmlFiles(distDir);

  await Promise.all(
    htmlFiles.map(async (htmlFile) => {
      const original = await readFile(htmlFile, "utf8");
      const rewritten = rewriteHtmlDocument(original, htmlFile);

      if (rewritten !== original) {
        await writeFile(htmlFile, rewritten, "utf8");
      }
    }),
  );
}

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return collectHtmlFiles(entryPath);
      }

      return HTML_EXTENSIONS.has(path.extname(entry.name)) ? [entryPath] : [];
    }),
  );

  return files.flat();
}

function rewriteHtmlDocument(document, htmlFile) {
  const fromHtmlDirectoryToDistRoot = toPosix(path.relative(path.dirname(htmlFile), distDir)) || ".";

  return document.replace(ATTRIBUTE_PATTERN, (match, attributeName, quote, value) => {
    if (!value.startsWith("/") || value.startsWith("//")) {
      return match;
    }

    const rewrittenValue = relativizeRootPath(value, fromHtmlDirectoryToDistRoot);
    return `${attributeName}=${quote}${rewrittenValue}${quote}`;
  });
}

function relativizeRootPath(value, relativeBase) {
  const [pathname, suffix] = splitPathAndSuffix(value);

  if (pathname === "/") {
    return appendSuffix(joinRelative(relativeBase, "index.html"), suffix);
  }

  const strippedPath = pathname.replace(/^\/+/, "");
  if (strippedPath.length === 0) {
    return appendSuffix(joinRelative(relativeBase, "index.html"), suffix);
  }

  const hasFileExtension = path.posix.extname(pathname) !== "";
  const targetPath = hasFileExtension
    ? strippedPath
    : path.posix.join(strippedPath.replace(/\/+$/, ""), "index.html");

  return appendSuffix(joinRelative(relativeBase, targetPath), suffix);
}

function splitPathAndSuffix(value) {
  const match = value.match(/^([^?#]*)(.*)$/);
  if (match === null) {
    return [value, ""];
  }

  return [match[1], match[2]];
}

function joinRelative(relativeBase, targetPath) {
  return toPosix(path.posix.join(relativeBase, targetPath));
}

function appendSuffix(pathname, suffix) {
  return `${pathname}${suffix}`;
}

function toPosix(value) {
  return value.split(path.sep).join(path.posix.sep);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
