import { api } from '../../api';

export const patientService = {
  listar: () => api.get('/patients').then(res => res.data),

  criar: (date: { name: string; phone: string }) => 
    api.post('/patients', date),

  alterar: (id: string, data: { name?: string; phone?: string }) => 
    api.put(`/patients/${id}`, data).then(res => res.data),

  deletar: (id: string) => 
    api.delete(`/patients/${id}`).then(res => res.data),
};