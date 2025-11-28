export const hhmmToDate = (dateISO: string, timeHHMM: string): Date => {
  return new Date(`${dateISO}T${timeHHMM}`);
};

export const addMinutesToTime = (timeHHMM: string, minutes: number): string => {
  const [hh, mm] = timeHHMM.split(':').map(Number);
  const date = new Date();
  date.setHours(hh, mm, 0, 0);
  date.setTime(date.getTime() + minutes * 60000);
  const nh = String(date.getHours()).padStart(2, '0');
  const nm = String(date.getMinutes()).padStart(2, '0');
  return `${nh}:${nm}`;
};

export const timeIntervalsOverlap = (startA: Date, endA: Date, startB: Date, endB: Date): boolean => {
  return startA < endB && startB < endA;
};
