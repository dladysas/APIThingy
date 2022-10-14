const init = require('../init');

describe('init', () => {
    it('should return an array without the last element', () => {
        expect(init([1, 2, 3])).toEqual([1, 2]);
    });
    });
