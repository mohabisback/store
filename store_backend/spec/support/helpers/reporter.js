const jsr = require('jasmine-spec-reporter');
const DisplayProcessor = jsr.DisplayProcessor;
const SpecReporter = jsr.SpecReporter;
const StacktraceOption = jsr.StacktraceOption;

class CustomProcessor extends DisplayProcessor {
  displayFailedSpec(spec, log) {
    return log;
  }
  displaySpecErrorMessages(spec, log) {
    return '';
  }
  displaySpecStarted(spec, log) {
    return log;
  }
  displaySuccessfulSpec(spec, log) {
    return log;
  }
  displaySummaryErrorMessages(spec, log) {
    return log;
  }
  displaySuite(suite, log) {
    return log;
  }
}

var reporter = new SpecReporter({
  spec: {
    displayStacktrace: StacktraceOption.PRETTY,
    displaySuccessful: true,
    displayFailed: true,
    displayErrorMessages: false,
    displayDuration: false,
    displayPending: true,
  },

  customProcessors: [CustomProcessor],
});

jasmine.getEnv().clearReporters();
//tell jasmine to use my reporter
jasmine.getEnv().addReporter(reporter);
