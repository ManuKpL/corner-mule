import { TestMule } from '../TestMule';

describe('TestMule', () => {
  let testSuite: {
    instance?: TestMule;
    spySource?: { foo: () => number };
  } = {};

  beforeEach(() => {
    testSuite.instance = new TestMule();
    testSuite.spySource = {
      foo() {
        return 0;
      },
    };
  });

  afterAll(() => {
    testSuite = null;
  });

  describe('initialization', () => {
    test('should be defined', () => {
      expect(TestMule).toBeDefined();
    });

    test('should create', () => {
      expect(testSuite.instance).toBeTruthy();
    });

    test('should be created with an empty wrapping object for spies', () => {
      expect(testSuite.instance.spies).toBeTruthy();
      expect(testSuite.instance.spies).toBeInstanceOf(Object);
    });

    test('should not allow adding members to the spies object property', () => {
      expect(() => (testSuite.instance.spies.foo = jest.fn())).toThrowError();
    });

    test('should be created with an empty wrapping object for values', () => {
      expect(testSuite.instance.values).toBeTruthy();
      expect(testSuite.instance.values).toBeInstanceOf(Object);
    });

    test('should allow adding members to the values object property', () => {
      expect(() => (testSuite.instance.values.foo = 'foo')).not.toThrowError();
      expect(testSuite.instance.values).toStrictEqual({ foo: 'foo' });
    });
  });

  describe('addSpy()', () => {
    test('should return the current instance of TestMule after adding to allow chaining', () => {
      expect(
        testSuite.instance.addSpy(testSuite.spySource, 'foo'),
      ).toStrictEqual(testSuite.instance);
    });

    test('given an objet and a method name to spy on, adds a spy to the spies map using the method name', () => {
      testSuite.instance.addSpy(testSuite.spySource, 'foo');
      expect(Object.entries(testSuite.instance.spies)).toHaveLength(1);
      expect(testSuite.instance.spies.foo).toBeDefined();

      testSuite.spySource.foo();
      expect(testSuite.instance.spies.foo).toHaveBeenCalledTimes(1);
    });

    test('given an objet, a method name and a spy name, adds a spy to the spies map using the spy name', () => {
      testSuite.instance.addSpy(testSuite.spySource, 'foo', 'bar');
      expect(Object.entries(testSuite.instance.spies)).toHaveLength(1);
      expect(testSuite.instance.spies.bar).toBeDefined();
      expect(testSuite.instance.spies.foo).toBeUndefined();

      testSuite.spySource.foo();
      expect(testSuite.instance.spies.bar).toHaveBeenCalledTimes(1);
    });

    test('given a method name matching an existing spy, then throws an error', () => {
      testSuite.instance.addSpy(testSuite.spySource, 'foo');
      expect(() =>
        testSuite.instance.addSpy(testSuite.spySource, 'foo'),
      ).toThrowError(
        'A spy with the name [foo] already exists in this test mule',
      );
    });

    test('given a spy name matching an existing spy, then throws an error', () => {
      testSuite.instance.addSpy(testSuite.spySource, 'foo', 'bar');
      expect(() =>
        testSuite.instance.addSpy(testSuite.spySource, 'foo', 'bar'),
      ).toThrowError(
        'A spy with the name [bar] already exists in this test mule',
      );
    });
  });

  describe('removeSpy()', () => {
    beforeEach(() => {
      testSuite.instance.addSpy(testSuite.spySource, 'foo');
    });

    test('should return the current instance of TestMule after removal to allow chaining', () => {
      expect(testSuite.instance.removeSpy('foo')).toStrictEqual(
        testSuite.instance,
      );
    });

    test('given a spy name, then removes the given spy from the spy map', () => {
      testSuite.instance.removeSpy('foo');
      expect(Object.entries(testSuite.instance.spies)).toHaveLength(0);
      expect(testSuite.instance.spies.foo).toBeUndefined();
    });

    test('given a spy name matching no existing spy, then throws an error', () => {
      expect(() => testSuite.instance.removeSpy('bar')).toThrowError(
        'A spy with the name [bar] does not exist in this test mule',
      );
    });
  });

  describe('deleteSpies()', () => {
    test('should return void', () => {
      expect(testSuite.instance.deleteSpies()).toBe(void 0);
    });

    test('given spies already stores in the spies map, then should remove all of them', () => {
      testSuite.instance.addSpy(testSuite.spySource, 'foo');
      testSuite.instance.addSpy({ bar: () => 'bar' }, 'bar');
      testSuite.instance.addSpy({ qux: () => 'qux' }, 'qux');

      expect(Object.entries(testSuite.instance.spies)).toHaveLength(3);

      testSuite.instance.deleteSpies();
      expect(Object.entries(testSuite.instance.spies)).toHaveLength(0);
    });

    test('given no spies stored in the spies map, then should do nothing and not throw an error', () => {
      expect(Object.entries(testSuite.instance.spies)).toHaveLength(0);

      expect(() => testSuite.instance.deleteSpies()).not.toThrowError();
      expect(Object.entries(testSuite.instance.spies)).toHaveLength(0);
    });
  });
});
