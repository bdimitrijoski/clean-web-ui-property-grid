export class InjectorService {
  private dependencies;

  constructor() {
    this.dependencies = {};
  }

  register(identifier: string, instance: any): void {
    this.dependencies[identifier] = instance;
  }

  get<T>(identifier: string): T {
    return this.dependencies[identifier];
  }

  clear(): void {
    this.dependencies = null;
  }
}
