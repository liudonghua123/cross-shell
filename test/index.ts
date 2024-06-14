import { describe, it } from 'node:test';
import { parse_command, expand_command, execute_command } from '../lib/index.ts';
import assert from 'node:assert';
import debug from 'debug';

const log = debug('cross-shell:test');

const simple_command = 'ls -la .';
const command_with_environments = 'a=123 b=234 ls -la .';
const command_with_wildcards = 'ls -la *';

describe('parse_command', () => {
    it('test command without environments', async () => {
        const command = await parse_command(simple_command);
        log(`parse_command ${simple_command}`, command)
        assert.equal(command.environments.length, 0);
    });

    it('test command with environments', async () => {
        const command = await parse_command(command_with_environments);
        log(`parse_command ${command_with_environments}`, command)
        assert.equal(command.environments.length, 2);
    });
});

describe('expand_command', () => {
    it('test command without environments', async () => {
        const command = await expand_command(simple_command);
        log(`expand_command ${simple_command}`, command)
        assert.equal(simple_command.split(/\s+/).length, command.split(/\s+/).length);
    });

    it('test command with wildcards', async () => {
        const command = await expand_command(command_with_wildcards);
        log(`expand_command ${command_with_wildcards}`, command)
        assert.equal(command.includes('*'), false);
    });
});


describe('execute_command', () => {
    it('test command without environments', async () => {
        try {
            await execute_command(await parse_command(command_with_wildcards));
            log(`execute_command ${simple_command}`)
            assert.ok(true);
        } catch (error) {
            assert.fail(error);
        }
    });
});