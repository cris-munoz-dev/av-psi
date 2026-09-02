import { apiClient as api } from './axios';

export interface BookAppointmentPayload {
  patientId: string;
  date: string;
  modality: 'ONLINE' | 'IN_PERSON';
}

export interface PublicBookAppointmentPayload {
  rut: string;
  date: string;
  modality: 'ONLINE' | 'IN_PERSON';
  reason?: string;
  newPatient?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
  };
}

export const appointmentsApi = {
  getAvailableSlots: async (date: string): Promise<string[]> => {
    const { data } = await api.get(`/appointments/available?date=${date}`);
    return data;
  },
  book: async (payload: BookAppointmentPayload) => {
    const { data } = await api.post('/appointments/book', payload);
    return data;
  },
  publicBook: async (payload: PublicBookAppointmentPayload) => {
    const { data } = await api.post('/appointments/public-book', payload);
    return data;
  }
};
