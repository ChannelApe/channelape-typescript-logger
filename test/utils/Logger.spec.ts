import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../src/model/LogLevel';
import Logger from '../../src/utils/Logger';

describe('Logger', () => {

  let logger: Logger;
  let sandbox: sinon.SinonSandbox;
  let consoleLogSpy: sinon.SinonSpy;
  let consoleErrorSpy: sinon.SinonSpy;

  beforeEach((done) => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Date.prototype, 'getFullYear').returns(1984);
    sandbox.stub(Date.prototype, 'getMonth').returns(4);
    sandbox.stub(Date.prototype, 'getDate').returns(7);
    sandbox.stub(Date.prototype, 'getHours').returns(3);
    sandbox.stub(Date.prototype, 'getMinutes').returns(9);
    sandbox.stub(Date.prototype, 'getSeconds').returns(5);
    sandbox.stub(Date.prototype, 'getMilliseconds').returns(8);
    consoleLogSpy = sandbox.spy(console, 'log');
    consoleErrorSpy = sandbox.spy(console, 'error');
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  it('constructor should create winston logger with LogLevel of INFO when sent an invalid LogLevel string', () => {
    logger = new Logger('name', 'INVALID_LOG_LEVEL_VALUE');
    assertThatOnlyInfoLevelLogsAndAboveAreCalled(logger);
  });

  it('constructor should create winston logger with correct LogLevel when sent a LogLevel string', () => {
    logger = new Logger('name', 'ERROR');
    logger.error('This error is being reported by a logger with a string for a LogLevel');
    const expectedMessage =
`[1984-05-07 03:09:05.008] [ERROR] name - This error is being reported by a logger with a string for a LogLevel`;
    expect(consoleErrorSpy.args[0][0]).to.equal(expectedMessage);
  });

  it('no logs should be emitted when when logLevel is OFF', () => {
    logger = new Logger('LogName', LogLevel.OFF);
    logger.error('error message');
    expect(consoleErrorSpy.called).to.equal(false, 'No logs should have been emitted when error was called');
    logger.warn('warn message');
    expect(consoleLogSpy.called).to.equal(false, 'No logs should have been emitted when warn was called');
    logger.info('info message');
    expect(consoleLogSpy.called).to.equal(false, 'No logs should have been emitted when info was called');
    logger.debug('debug message');
    expect(consoleErrorSpy.called).to.equal(false, 'No logs should have been emitted when debug was called');
  });

  it('only error, warn, and info level logs should be emitted when when logLevel is VERBOSE', () => {
    logger = new Logger('LogName', LogLevel.VERBOSE);
    logger.error('error message');
    expect(consoleErrorSpy.callCount).to.equal(1, 'only error, warn, and info level logs should be emitted');
    logger.warn('warn message');
    expect(consoleLogSpy.callCount).to.equal(1, 'only error, warn, and info level logs should be emitted');
    logger.info('info message');
    expect(consoleLogSpy.callCount).to.equal(2, 'only error, warn, and info level logs should be emitted');
    logger.debug('debug message');
    expect(consoleErrorSpy.callCount).to.equal(1, 'only error, warn, and info level logs should be emitted');
  });

  it('all logs should be emitted when when logLevel is DEBUG', () => {
    logger = new Logger('LogName', LogLevel.DEBUG);

    logger.error('error message');
    expect(consoleErrorSpy.args[0][0]).to.equal(`[1984-05-07 03:09:05.008] [ERROR] LogName - error message`);
    expect(consoleErrorSpy.callCount).to.equal(1, 'All logs should have been emitted');

    logger.warn('warn message');
    expect(consoleLogSpy.callCount).to.equal(1, 'All logs should have been emitted');
    expect(consoleLogSpy.args[0][0]).to.equal(`[1984-05-07 03:09:05.008] [WARN] LogName - warn message`);

    logger.info('info message');
    expect(consoleLogSpy.args[1][0]).to.equal(`[1984-05-07 03:09:05.008] [INFO] LogName - info message`);
    expect(consoleLogSpy.callCount).to.equal(2, 'All logs should have been emitted');

    logger.debug('debug message');
    expect(consoleErrorSpy.args[1][0]).to.equal(`[1984-05-07 03:09:05.008] [DEBUG] LogName - debug message`);
    expect(consoleErrorSpy.callCount).to.equal(2, 'All logs should have been emitted');
  });

  it('only error level logs should be emitted when when logLevel is ERROR', () => {
    logger = new Logger('LogName', LogLevel.ERROR);
    logger.error('error message');
    expect(consoleErrorSpy.callCount).to.equal(1, 'only error level logs should be emitted');
    logger.warn('warn message');
    expect(consoleLogSpy.callCount).to.equal(0, 'only error level logs should be emitted');
    logger.info('info message');
    expect(consoleLogSpy.callCount).to.equal(0, 'only error level logs should be emitted');
    logger.debug('debug message');
    expect(consoleErrorSpy.callCount).to.equal(1, 'only error level logs should be emitted');
  });

  it('only error and warn level logs should be emitted when when logLevel is WARN', () => {
    logger = new Logger('LogName', LogLevel.WARN);
    logger.error('error message');
    expect(consoleErrorSpy.callCount).to.equal(1, 'only error and warn level logs should be emitted');
    logger.warn('warn message');
    expect(consoleLogSpy.callCount).to.equal(1, 'only error and warn level logs should be emitted');
    logger.info('info message');
    expect(consoleLogSpy.callCount).to.equal(1, 'only error and warn level logs should be emitted');
    logger.debug('debug message');
    expect(consoleErrorSpy.callCount).to.equal(1, 'only error and warn level logs should be emitted');
  });

  it('only error, warn, and info level logs should be emitted when when logLevel is INFO', () => {
    logger = new Logger('LogName', LogLevel.INFO);
    assertThatOnlyInfoLevelLogsAndAboveAreCalled(logger);
  });

  function assertThatOnlyInfoLevelLogsAndAboveAreCalled(logger: Logger): void {
    logger.error('error message');
    expect(consoleErrorSpy.callCount).to.equal(1, 'only error, warn, and info level logs should be emitted');
    logger.warn('warn message');
    expect(consoleLogSpy.callCount).to.equal(1, 'only error, warn, and info level logs should be emitted');
    logger.info('info message');
    expect(consoleLogSpy.callCount).to.equal(2, 'only error, warn, and info level logs should be emitted');
    logger.debug('debug message');
    expect(consoleErrorSpy.callCount).to.equal(1, 'only error, warn, and info level logs should be emitted');
  }
});
