import { describe, it } from 'node:test';
import { hello } from '../src/index.ts';
import assert from 'node:assert';

describe('hello', () => {
    it('should say hello', () => {
        assert.equal(hello(), 'Hello world!');
    });

    it('should say hello to someone', () => {
        assert.equal(hello('you'), 'Hello you!');
    });
});