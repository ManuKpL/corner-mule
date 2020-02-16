export class TestMule<T = any> {
  public instance!: T;
  public readonly values: { [key: string]: any } = {};

  private readonly spiesMap = new Map<string, jest.SpyInstance>();

  public get spies(): { [key: string]: jest.SpyInstance } {
    return Object.freeze(Object.fromEntries(this.spiesMap));
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

  public removeSpy(spyName: string): TestMule {
    if (this.spiesMap.has(spyName)) {
      this.spiesMap.delete(spyName);
      return this;
    }

    this.throwSpyError(spyName, 'does not exist');
  }

  private ensureUniqSpies(spyName: string): void {
    if (this.spiesMap.has(spyName)) {
      this.throwSpyError(spyName, 'already exists');
    }
  }

  private throwSpyError(spyName: string, message: string): void {
    throw new Error(
      `A spy with the name [${spyName}] ${message} in this test mule`,
    );
  }
}
