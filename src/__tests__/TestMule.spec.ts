import { TestMule } from '../TestMule';

describe('TestMule', () => {
  let testSuite: { instance?: TestMule } = {};

  beforeAll(() => {
    testSuite.instance = new TestMule();
  });

  afterAll(() => {
    testSuite = null;
  });

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

  test('should be created with an empty wrapping object for values', () => {
    expect(testSuite.instance.values).toBeTruthy();
    expect(testSuite.instance.values).toBeInstanceOf(Object);
  });
});
