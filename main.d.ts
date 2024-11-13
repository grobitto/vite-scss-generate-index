import { Plugin } from "vite";

declare function scssAutoindexPlugin(params: { src: string, singleQuotes?:boolean }):Plugin;

export default scssAutoindexPlugin;