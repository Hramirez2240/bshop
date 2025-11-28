import { Appointment } from '../types';
import { CANCEL_PENALTY_AMOUNT, CANCEL_PENALTY_WINDOW_HOURS } from '../constants';

export const computeCancellationFee = (appt: Appointment): number => {
  try {
    const apptDate = new Date(`${appt.date}T${appt.time}`);
    const now = new Date();
    const diffMs = apptDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours <= CANCEL_PENALTY_WINDOW_HOURS) {
      return CANCEL_PENALTY_AMOUNT;
    }
    return 0;
  } catch (e) {
    return 0;
  }
};
