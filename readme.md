# Vite SCSS Generate Index

This plugin automatically generates `_index.scss` files in every folder of your SCSS project. It is particularly useful when you want to split your SCSS into smaller, manageable fractions, such as BEM modules.
If you need to change import order you can edit generated _index.scss files manually, plugin will not overwrite order of import if imported file already exists in the list.

## Features

- Automatically creates `_index.scss` files in each directory.

## Installation

```bash
npm install @inlite/vite-scss-generate-index
```

## Usage

Add the plugin to your Vite configuration:

```javascript
import { defineConfig } from 'vite';
import viteScssGenerateIndex from 'vite-scss-generate-index';

export default defineConfig({
  plugins: [viteScssGenerateIndex( { src:"src"})],
});
```

## Example

Given the following directory structure:

```
styles/
├── components/
│   ├── button.scss
│   ├── card.scss
│   └── _index.scss
├── layouts/
│   ├── header.scss
│   ├── footer.scss
│   └── _index.scss
└── main.scss
```

The plugin will generate `_index.scss` files that import all SCSS files in their respective directories.