import { MinimalLocalForage } from '../../_support/MinimalLocalForage';

// Appease jest + react-scripts: "Your test suite must contain at least one test."
it('loads test helpers', () => { /* */ });

export class MinimalLocalForageStub implements MinimalLocalForage {
  private storage: any = {};

  public getItem<T>(key: string, callback?: ((err: any, value: T) => void) | undefined): Promise<T> {
    return this.storage[key];
  }

  public setItem<T>(key: string, value: T, callback?: ((err: any, value: T) => void) | undefined): Promise<T> {
    this.storage[key] = value;
  }
}
