export function daysBetweenJST(startISO: string, endISO: string): number {
  const toJSTDate = (iso: string) => {
    const date = new Date(iso);
    const jstOffset = 9 * 60;
    const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
    const jstTime = new Date(utcTime + (jstOffset * 60000));
    return new Date(jstTime.getFullYear(), jstTime.getMonth(), jstTime.getDate());
  };

  const start = toJSTDate(startISO);
  const end = toJSTDate(endISO);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export function calculateProgress(startDate: string, totalDays: number): { dayIndex: number; progressPct: number } {
  const today = new Date().toISOString().split('T')[0];
  const daysPassed = daysBetweenJST(startDate, today);
  const dayIndex = Math.max(1, daysPassed + 1);
  const progressPct = Math.min(Math.max((dayIndex / totalDays) * 100, 0), 100);

  return { dayIndex, progressPct };
}
