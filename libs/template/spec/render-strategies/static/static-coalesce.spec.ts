import { staticCoalesce } from '../../../src/lib/render-strategies/static';
import { priorityTickMap, SchedulingPriority } from '@rx-angular/template';
import { from } from 'rxjs';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { mockConsole } from '@test-helpers';

/** @test {coalesceWith} */
describe('staticCoalesce', () => {
  beforeAll(() => mockConsole());

  it('should coalesce to a scope', (done) => {
    let test = 0;
    const durationSelector = from(Promise.resolve());
    const doWork = () => test++;
    const scope = {};
    const abC = new AbortController();

    staticCoalesce(doWork, durationSelector, scope, abC);
    staticCoalesce(doWork, durationSelector, scope, abC);
    staticCoalesce(doWork, durationSelector, scope, abC);
    staticCoalesce(doWork, durationSelector, scope, abC);
    expect(test).toBe(0);
    Promise.resolve().then(() => {
      expect(test).toBe(1);
      done();
    });
    expect(test).toBe(0);
  });

  it('should work with multiple scopes', (done) => {
    let test = 0;
    const durationSelector = priorityTickMap[SchedulingPriority.Promise];
    const doWork = () => test++;
    const scope = {};
    const scope2 = {};

    staticCoalesce(doWork, durationSelector, scope);
    staticCoalesce(doWork, durationSelector, scope);
    staticCoalesce(doWork, durationSelector, scope2);
    staticCoalesce(doWork, durationSelector, scope2);
    expect(test).toBe(0);

    setTimeout(() => {
      expect(test).toBe(2);
      done();
    },0);

    expect(test).toBe(0);
  });

  it('should stop if aborted', (done) => {
    let test = 0;
    const durationSelector = priorityTickMap[SchedulingPriority.Promise];
    const doWork = () => test++;
    const scope = {};
    const abC = new AbortController();
    staticCoalesce(doWork, durationSelector, scope, abC);
    staticCoalesce(doWork, durationSelector, scope, abC);
    staticCoalesce(doWork, durationSelector, scope, abC);
    staticCoalesce(doWork, durationSelector, scope, abC);
    expect(test).toBe(0);
    abC.abort();
    Promise.resolve().then(() => {
      expect(test).toBe(0);
      done();
    });
    expect(test).toBe(0);
  });

});
