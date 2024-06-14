# cross-shell

[![Node.js CI](https://github.com/liudonghua123/ts-esm-template/actions/workflows/node.js.yml/badge.svg)](https://github.com/liudonghua123/ts-esm-template/actions/workflows/node.js.yml)

This is a simple tool that behaves like [`cross-env`](https://www.npmjs.com/package/cross-env), supporting configuration environments and other frequently used features like [`wildcards expansion`](https://en.wikipedia.org/wiki/Wildcard_character#Filename_patterns), which is not available on Windows.

## Motivation

I tried to add a test script like `node --test ./test/**/*.js`, but it did not work in either [CMD](https://en.wikipedia.org/wiki/Cmd.exe) or [PowerShell](https://docs.microsoft.com/en-us/powershell/) on Windows. I also searched [npmjs.com](https://www.npmjs.com/) but failed to find an existing package that supports `wildcards expansion`. So, I wrote this tool for myself and others who need it.

## How to Use

1. Install `cross-shell` via your package manager, e.g., `npm i --save-dev cross-shell`, `yarn add -D cross-shell`, or `pnpm i -D cross-shell`.
2. Prepend `cross-shell` before the command you want to execute.

## Todos

- [ ] Make the execution output colored, need to support [TTY](https://en.wikipedia.org/wiki/Terminal_emulator).
- [ ] Support `&&` and `||` operations.
- [ ] Support `&` background running.
- [ ] Add more tests.

## License

[MIT License](https://opensource.org/licenses/MIT)

© 2024 liudonghua
