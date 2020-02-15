export class TestMule<T = any> {
  public instance!: T;

  public readonly spies: { [key: string]: jest.SpyInstance } = {};
  public readonly values: { [key: string]: any } = {};
}
