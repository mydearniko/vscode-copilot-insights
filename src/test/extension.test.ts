import * as assert from "assert";

import {
  calculatePercentage,
  formatApiRateLimitStatusText,
  formatMinutesUntilReset,
  normalizePollingIntervalSeconds,
} from "../extension";

suite("Extension Test Suite", () => {
  test("normalizes valid polling intervals", () => {
    assert.strictEqual(normalizePollingIntervalSeconds(undefined), 60);
    assert.strictEqual(normalizePollingIntervalSeconds(60), 60);
    assert.strictEqual(normalizePollingIntervalSeconds(0), 0);
    assert.strictEqual(normalizePollingIntervalSeconds(-15), 0);
    assert.strictEqual(normalizePollingIntervalSeconds(1.4), 1);
    assert.strictEqual(normalizePollingIntervalSeconds(1.6), 2);
  });

  test("falls back when the configured interval is invalid", () => {
    assert.strictEqual(normalizePollingIntervalSeconds(Number.NaN), 60);
    assert.strictEqual(
      normalizePollingIntervalSeconds(Number.POSITIVE_INFINITY),
      60
    );
    assert.strictEqual(normalizePollingIntervalSeconds(undefined, 120), 120);
  });

  test("formats GitHub API rate limit usage text", () => {
    assert.strictEqual(calculatePercentage(3029, 5000), 60.6);
    assert.strictEqual(calculatePercentage(10, 0), 0);
    assert.strictEqual(
      formatMinutesUntilReset(1735689720, 1735689600 * 1000),
      "in 2 min"
    );
    assert.strictEqual(
      formatApiRateLimitStatusText(3029, 5000, 1735689720, 1735689600 * 1000),
      "🚦 3029/5000 (60.6%, in 2 min)"
    );
  });
});
