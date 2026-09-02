import { apiClient as api } from './axios';

export interface CreatePatientPayload {
  firstName: string;
  lastName: string;
  rut: string;
  phone: string;
  dob: string;
}

export const patientsApi = {
  getMyProfile: async () => {
    const { data } = await api.get('/patients/me');
    return data;
  },
  createMyProfile: async (payload: CreatePatientPayload) => {
    const { data } = await api.post('/patients/me', payload);
    return data;
  },
  checkRut: async (rut: string): Promise<{ exists: boolean }> => {
    const { data } = await api.post('/patients/check-rut', { rut });
    return data;
  },
};
