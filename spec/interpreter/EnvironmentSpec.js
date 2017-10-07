const Environment = require('../../lang/interpreter/Environment');

describe('Environment', function () {
    it('should have proper initial state', () => {
        let environment = new Environment(null);
        expect(environment.parent).toBeNull();
        expect(environment.vars).toEqual({});
    });

    it('should define proper variable objects', () => {
        let environment = new Environment(null);
        environment.define('name', 'Tommy');
        environment.define('lastName', 'Ben');

        expect(environment.get('name')).toEqual('Tommy');
        expect(environment.get('lastName')).toEqual('Ben');
    });

    it('should pass to child its variable objects', () => {
        let parent = new Environment(null);
        parent.define('name', 'Tommy');
        parent.define('lastName', 'Ben');

        let child = parent.extend();
        expect(child.get('name')).toEqual('Tommy');
        expect(child.get('lastName')).toEqual('Ben');
    });

    it('should return parent environment on lookup when is called on child environment', () => {
        let parent = new Environment(null);
        parent.define('name', 'Tommy');
        parent.define('lastName', 'Ben');

        let child = parent.extend();
        expect(child.lookup('name')).toEqual(parent);
    });

    it('should return child environment on lookup when is called on child environment', () => {
        let parent = new Environment(null);
        parent.define('name', 'Tommy');
        parent.define('lastName', 'Ben');

        let child = parent.extend();
        child.define('childName', 'Lina')
        expect(child.lookup('childName')).toEqual(child);
    });

    it('should throw exception when get is called on empty variables collection', () => {
        let parent = new Environment(null);

        expect(() => {
            parent.get('name');
        }).toThrow(new Error("Undefined variable name"));
    });

    it('should throw exception when get is called on misspelled variable name in variables collection', () => {
        let parent = new Environment(null);
        parent.define('Name', 'Cho')
        expect(() => {
            parent.get('name');
        }).toThrow(new Error("Undefined variable name"));
    });

    it('should throw exception when set is called on non-existing variable in a child environment', () => {
        let parent = new Environment(null);
        let child = parent.extend();
        expect(() => {
            child.set('var', 'error');
        }).toThrow(new Error("Undefined variable var"));
    });

    it('should save variable object when set is called on non-existing variable in a child environment', () => {
        let parent = new Environment(null);
        parent.set('var', 'ok');
        expect(parent.get('var')).toEqual('ok');
    });

    it('should override when define is called', () => {
        let parent = new Environment(null);
        parent.define('var', 'a');
        parent.define('var', 1);

        expect(parent.get('var')).toEqual(1);
    });

    it('should override when set is called', () => {
        let parent = new Environment(null);
        parent.set('var', 'a');
        parent.set('var', 1);

        expect(parent.get('var')).toEqual(1);
    });

    it('should recursively extend environments', () => {
        let current = new Environment(null);
        let environments = [];
        for (let index = 0; index < 50; index++) {
            environments.push(current);
            current.define('scope' + index, 'var' + index);
            current = current.extend();
        }

        for (let index = 0; index < 50; index++) {
            expect(current.get('scope' + index)).toEqual('var' + index);
            expect(current.lookup('scope' + index)).toEqual(environments[index]);
        }
    });
})