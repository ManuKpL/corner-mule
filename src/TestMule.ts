export class TestMule<T = any> {
  public instance!: T;
  public readonly values: { [key: string]: any } = {};

  private readonly spiesMap = new Map<string, jest.SpyInstance>();

  public get spies(): { [key: string]: jest.SpyInstance } {
    return Object.fromEntries(this.spiesMap);
  }

  public addSpy(
    source: { [key: string]: any },
    methodName: string,
    spyName = methodName,
  ): TestMule {
    this.ensureUniqSpies(spyName);
    this.spiesMap.set(spyName, jest.spyOn(source, methodName));
    return this;
  }

  private ensureUniqSpies(spyName: string): void {
    if (this.spiesMap.has(spyName)) {
      throw new Error(
        `A spy with the name [${spyName}] already exists in this test mule`,
      );
    }
  }
}
