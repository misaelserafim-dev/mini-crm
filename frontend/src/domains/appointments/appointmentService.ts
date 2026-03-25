import { api } from '../../api';

export type AppointmentStatus = "AGUARDANDO" | "EM_ATENDIMENTO" | "FINALIZADO";

export interface Appointment {
  id: string;
  description: string;
  status: AppointmentStatus;
  patientId: string;
  patient?: {
    name: string;
  };
}

export const appointmentService = {
  listar: () => api.get<Appointment[]>('/appointments').then(res => res.data),
  
  criar: (data: { description: string; patientId: string }) => 
  api.post('/appointments', data).then(res => res.data),

  alterarStatus: (id: string, status: AppointmentStatus) => 
  api.patch(`/appointments/${id}/status`, { status }).then(res => res.data),

  deletar: (id: string) => 
  api.delete(`/appointments/${id}`).then(res => res.data),
};