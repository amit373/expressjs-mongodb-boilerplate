/**
 * System signals which shut down a process
 */
const ShutdownSignal = {
  SIGHUP: 'SIGHUP',
  SIGINT: 'SIGINT',
  SIGQUIT: 'SIGQUIT',
  SIGILL: 'SIGILL',
  SIGTRAP: 'SIGTRAP',
  SIGABRT: 'SIGABRT',
  SIGBUS: 'SIGBUS',
  SIGFPE: 'SIGFPE',
  SIGSEGV: 'SIGSEGV',
  SIGUSR2: 'SIGUSR2',
  SIGTERM: 'SIGTERM',
};

module.exports = { ShutdownSignal };
