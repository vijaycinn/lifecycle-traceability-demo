/**
 * Reconciles task completed hours into Clarity PPM timesheet batch entries.
 * Rejects negative or non-numeric hours to preserve audit integrity.
 */
export function buildClarityTimesheetBatch(tasks) {
  if (!Array.isArray(tasks)) {
    throw new TypeError('tasks must be an array');
  }
  const entries = [];
  let totalHours = 0;

  for (const task of tasks) {
    if (typeof task?.completedHours !== 'number' || Number.isNaN(task.completedHours) || task.completedHours < 0) {
      throw new RangeError(`Invalid completedHours for task ${task?.id ?? 'unknown'}`);
    }
    const delta = Number((task.completedHours - (task.exportedHours ?? 0)).toFixed(2));
    if (delta > 0) {
      entries.push({
        workItemId: task.id,
        clarityProjectId: task.clarityProjectId,
        clarityTaskId: task.clarityTaskId,
        hoursToExport: delta
      });
      totalHours = Number((totalHours + delta).toFixed(2));
    }
  }
  return { entries, totalHours };
}