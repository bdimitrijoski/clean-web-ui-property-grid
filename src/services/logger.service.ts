/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class Logger {
  private static instance: Logger;
  logEnabled = true;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  error(msg: string, data?: any): void {
    // eslint-disable-next-line no-console
    console.error(msg, data);
  }

  log(msg: string, data?: any): void {
    // eslint-disable-next-line no-console
    if (!this.logEnabled) {
      return;
    }
    console.log(msg, data);
  }
}
