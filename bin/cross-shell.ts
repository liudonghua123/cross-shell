#!/usr/bin/env node

import { execute_command, parse_command } from '../lib/index.js'
import type { Command } from '../lib/index.js'
import debug from "debug";

const log = debug("cross-shell:bin");

(async () => {
    // check whether the first -n option is provided, which means dry run
    const dry_run = process.argv[2] === '-n' || process.argv[2] === '--dry-run';
    if (dry_run) {
        process.argv.splice(2, 1);
    }
    const raw_command = process.argv.slice(2).join(' ');
    let command: Command = { command: raw_command, environments: [] };
    // parse the command on windows
    if (process.platform === 'win32') {
        command = await parse_command(raw_command);
        log(`Parsed command: ${JSON.stringify(command)}`);
    }
    if (dry_run) {
        console.log(`Command: ${command.command}, Environments: ${command.environments.map((env) => `${env.name}=${env.value}`).join(' ')}`);
        process.exit(0);
    }
    const output = await execute_command(command);
    console.log(output);
})();