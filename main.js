import fs from "fs";
import path from "path";
import chokidar from "chokidar";

const setupAutoindex = (file, singleQuotes) => {
  const root = path.dirname(file);
  generateIndexFile(root, false);
  let watcher = chokidar.watch(root, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,
  });

  const action = (file) => {
    if (path.basename(file) == "_index.scss") {
      return;
    }
    const dir = path.dirname(file);
    if (dir !== root) {
      generateIndexFile(dir, true);
    }
  };
  // Add event listeners.
  watcher.on("add", action).on("unlink", action);
};

const generateIndexFile = (directoryPath, generate) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // Create _index.scss file if it doesn't exist
    let existingContent = "";
    const indexPath = path.join(directoryPath, "_index.scss");
    if (generate) {
      if (!fs.existsSync(indexPath)) {
        fs.writeFileSync(indexPath, "");
      }

      // Read existing content of _index.scss
      existingContent = fs.readFileSync(indexPath, "utf8");
    }
    const lines = existingContent
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => line.trim());
    const result = [...lines];
    let changed = false;
    // Iterate over files and directories
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);
      if (!(file.endsWith(".scss") || stats.isDirectory())) return;
      if (file == "_index.scss") return;
      if (!stats.isDirectory()) {
        if (file.startsWith("_")) file = file.substring(1);
        file = file.substring(0, file.length - 5);
      }

      if (generate) {
        const importFile = singleQuotes?`'${file}'`:`"${file}"`;
        const line = lines.find((line) => line.includes(importFile));
        const idx = lines.indexOf(line);
        if (idx != -1) {
          lines.splice(idx, 1);
        } else {
          result.push(`@import ${importFile};`);
          changed = true;
        }
      }
      // Recursively process directories
      if (stats.isDirectory()) {
        generateIndexFile(filePath, true);
      }
    });
    if (generate && (changed || lines.length > 0)) {
      lines.forEach((line) => {
        result.splice(result.indexOf(line), 1);
      });
      fs.writeFile(indexPath, result.join("\n") + "\n", () => {});
    }
  });
};

export default function scssAutoindexPlugin(params) {
  let root;
  return {
    name: "css-generate-index",
    apply: "serve",
    enforce: "pre",
    configResolved(config) {
      root = config.root + "/" + params.src;
    },
    resolveId(source) {
      if (source.endsWith(".scss")) {
        setupAutoindex(path.join(root, source), params.singleQuotes || false);
      }
      return null;
    },
  };
}
