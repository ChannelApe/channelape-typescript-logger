import { expect } from 'chai';
import * as sinon from 'sinon';
import LogLevel from '../../src/model/LogLevel';
import Logger from '../../src/utils/Logger';

describe('Logger', () => {

  let logger: Logger;
  let sandbox: sinon.SinonSandbox;
  let stdoutSpy: sinon.SinonSpy;

  beforeEach((done) => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Date.prototype, 'getFullYear').returns(1984);
    sandbox.stub(Date.prototype, 'getMonth').returns(4);
    sandbox.stub(Date.prototype, 'getDate').returns(7);
    sandbox.stub(Date.prototype, 'getHours').returns(3);
    sandbox.stub(Date.prototype, 'getMinutes').returns(9);
    sandbox.stub(Date.prototype, 'getSeconds').returns(5);
    sandbox.stub(Date.prototype, 'getMilliseconds').returns(8);
    stdoutSpy = sandbox.spy(process.stdout, 'emit');
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  it('constructor should create winston logger with correct LogLevel when sent a LogLevel string', () => {
    logger = new Logger('name', 'ERROR');
    logger.error('This error is being reported by a logger with a string for a LogLevel');
    const expectedMessage =
      '[1984-05-07 03:09:05.008] [ERROR] name - This error is being reported by a logger with a string for a LogLevel';
    expect(stdoutSpy.args[0][0]).to.equal(expectedMessage);
  });

  it('error() should log when logLevel is ERROR or above', () => {
    logger = new Logger('LogName', LogLevel.ERROR);
    logger.error('error message');
    const expectedMessage = '[1984-05-07 03:09:05.008] [ERROR] LogName - error message';
    expect(stdoutSpy.args[0][0]).to.equal(expectedMessage);
  });

  it('warn() should log when logLevel is WARN or above', () => {
    logger = new Logger('LogName', LogLevel.WARN);
    logger.warn('warn message');
    const expectedMessage = '[1984-05-07 03:09:05.008] [WARN] LogName - warn message';
    expect(stdoutSpy.args[0][0]).to.equal(expectedMessage);
  });

  it('info() should log when logLevel is INFO or above', () => {
    logger = new Logger('LogName', LogLevel.INFO);
    logger.info('info message');
    const expectedMessage = '[1984-05-07 03:09:05.008] [INFO] LogName - info message';
    expect(stdoutSpy.args[0][0]).to.equal(expectedMessage);
  });

  it('debug() should log when logLevel is DEBUG or above', () => {
    logger = new Logger('LogName', LogLevel.DEBUG);
    logger.debug('debug message');
    const expectedMessage = '[1984-05-07 03:09:05.008] [DEBUG] LogName - debug message';
    expect(stdoutSpy.args[0][0]).to.equal(expectedMessage);
  });

  it('no logs should be emitted when when logLevel is OFF', () => {
    logger = new Logger('LogName', LogLevel.OFF);
    logger.error('error message');
    expect(stdoutSpy.called).to.equal(false, 'No logs should have been emitted when error was called');
    logger.warn('warn message');
    expect(stdoutSpy.called).to.equal(false, 'No logs should have been emitted when warn was called');
    logger.info('info message');
    expect(stdoutSpy.called).to.equal(false, 'No logs should have been emitted when info was called');
    logger.debug('debug message');
    expect(stdoutSpy.called).to.equal(false, 'No logs should have been emitted when debug was called');
  });
});
