// https://github.com/mcibique/vue-testing-examples#assert-consoleerror-has-not-been-called
import { expect } from 'chai';
import sinon, { SinonSpy } from 'sinon';

beforeEach(function () {
  // tslint:disable:no-console
  if ((console.error as SinonSpy).restore) {
    (console.error as SinonSpy).restore();
  }
  // tslint:ensable:no-console
  sinon.spy(console, 'error');
});

afterEach(function () {
  // tslint:disable:no-console
  const errorMsg = `console.error() has been called ${(console.error as SinonSpy).callCount} times.`;
  expect(console.error, errorMsg).not.to.have.been.called;
  (console.error as SinonSpy).restore();
  // tslint:enable:no-console
});