import LogLevel from '../model/LogLevel';

export default class Logger {
  private readonly logLevel: LogLevel;

  constructor(private readonly loggerName: string, logLevel: LogLevel | string) {
    this.logLevel = this.getLogLevel(logLevel);
  }

  public error(log: string): void {
    this.log(LogLevel.ERROR, log);
  }

  public warn(log: string): void {
    this.log(LogLevel.WARN, log);
  }

  public info(log: string): void {
    this.log(LogLevel.INFO, log);
  }

  public debug(log: string): void {
    this.log(LogLevel.DEBUG, log);
  }

  private log(logLevel: LogLevel, log: string): void {
    if (this.determineIfLogShouldBeEmitted(logLevel)) {
      process.stdout.write(this.formatLog(log, logLevel));
    }
  }

  private determineIfLogShouldBeEmitted(logLevel: LogLevel): boolean {
    if (this.logLevel === LogLevel.VERBOSE || this.logLevel === LogLevel.DEBUG) {
      return true;
    }
    if (this.logLevel === LogLevel.INFO &&
        (logLevel === LogLevel.INFO || logLevel === LogLevel.WARN || logLevel === LogLevel.ERROR)) {
      return true;
    }
    if (this.logLevel === LogLevel.WARN && (logLevel === LogLevel.WARN || logLevel === LogLevel.ERROR)) {
      return true;
    }
    if (this.logLevel === LogLevel.ERROR && logLevel === LogLevel.ERROR) {
      return true;
    }
    return false;
  }

  private getLogLevel(logLevel: LogLevel | string): LogLevel {
    for (const logLevelKey in LogLevel) {
      const currentLogLevel = LogLevel[logLevelKey];
      if (logLevel.toLowerCase() === currentLogLevel) {
        return currentLogLevel as LogLevel;
      }
    }
    return LogLevel.INFO;
  }

  private formatLog(message: string, messageLogLevel: LogLevel): string {
    const now = new Date();
    const timestamp = getTimeStamp(now);
    const level = messageLogLevel.toUpperCase();
    return `[${timestamp}] [${level}] ${this.loggerName} - ${message}`;

    function getTimeStamp(date: Date): string {
      const yyyMmDd = `${date.getFullYear()}-${getMonth(date)}-${getDay(date)}`;
      const time = `${getHours(date)}:${getMinutes(date)}:${getSeconds(date)}.${getMilliseconds(date)}`;
      return `${yyyMmDd} ${time}`;
    }

    function getMonth(date: Date): string {
      return pad(date.getMonth() + 1, -2, '0');
    }

    function getDay(date: Date): string {
      return pad(date.getDate(), -2, '0');
    }

    function getHours(date: Date): string {
      return pad(date.getHours(), -2, '0');
    }

    function getMinutes(date: Date): string {
      return pad(date.getMinutes(), -2, '0');
    }

    function getSeconds(date: Date): string {
      return pad(date.getSeconds(), -2, '0');
    }

    function getMilliseconds(date: Date): string {
      return pad(date.getMilliseconds(), -3, '00');
    }

    function pad(value: number, length: number, leftPad: string): string {
      return (`${leftPad}${value.toString()}`.slice(length));
    }
  }
}
