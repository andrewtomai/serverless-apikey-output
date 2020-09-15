import * as Helpers from '../lib/helpers'

describe('Helpers', () => {
    describe('#getOutputFile', () => {
        test('Can return the default filename if none is provided', () => {
            expect(Helpers.getOutputFile('dev')).toBe('./.serverless-apikey-output/dev.keys.json');
        })

        test('Can return the path specified in the configuration', () => {
            expect(Helpers.getOutputFile('dev', { file: 'hello' })).toBe('hello');
        })
    })

    describe('#hasSpecifiedKeys', () => {
        test('Returns true if there are specified keys', () => {
            expect(Helpers.hasSpecifiedKeys({ keys: [] })).toBeTruthy();
        })

        test('Returns false if there are no specified keys', () => {
            expect(Helpers.hasSpecifiedKeys()).toBeFalsy();
        })
    })

    describe('#hasSpecifiedFile', () => {
        test('Returns true if there is a specified file', () => {
            expect(Helpers.hasSpecifiedFile({ file: 'hello' })).toBeTruthy();
        })

        test('Returns false if there is no specified file', () => {
            expect(Helpers.hasSpecifiedFile()).toBeFalsy()
        })
    })

    describe('#filterByConfiguration', () => {
        test('Returns the input keys if there are no keys specified in configuration', () => {
            const apiKeys = [{ name: 'hello' }]
            expect(Helpers.filterByConfiguration(apiKeys)).toBe(apiKeys);
        })

        test('Returns matching apiKeys', () => {
            const apiKeys = [{ name: 'hello' }, { name: 'world' }]
            const expected = [{ name: 'hello' }]
            expect(Helpers.filterByConfiguration(apiKeys, { keys: ['hello'] })).toStrictEqual(expected);
        })
    })
})