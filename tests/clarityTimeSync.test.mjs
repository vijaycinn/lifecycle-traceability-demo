import test from 'node:test';
import assert from 'node:assert/strict';
import { buildClarityTimesheetBatch } from '../src/clarityTimeSync.js';

test('computes unexported hours delta for Clarity batch', () => {
  const result = buildClarityTimesheetBatch([
    { id: 13, clarityProjectId: 'PRJ-4102', clarityTaskId: 'TSK-101', completedHours: 5, exportedHours: 2 },
    { id: 16, clarityProjectId: 'PRJ-4102', clarityTaskId: 'TSK-102', completedHours: 8, exportedHours: 8 }
  ]);
  assert.equal(result.totalHours, 3);
  assert.equal(result.entries.length, 1);
  assert.equal(result.entries[0].workItemId, 13);
});

test('rejects negative completedHours', () => {
  assert.throws(
    () => buildClarityTimesheetBatch([{ id: 19, completedHours: -1 }]),
    RangeError
  );
});