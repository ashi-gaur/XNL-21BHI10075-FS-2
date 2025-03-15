@echo off
set NODE_OPTIONS=--no-warnings --experimental-specifier-resolution=node
npx tsx --import-map win-import-map.json server/index.ts