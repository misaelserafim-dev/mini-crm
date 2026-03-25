import { describe, it, expect, vi } from 'vitest';
import * as appointmentService from './appointment.service';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    appointment: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from '../../lib/prisma';

describe('Agendamentos', () => {

    it('deve validar se os dados chegam corretos na criação', async () => {
        const dadosNovos = { 
            description: 'Fisioterapia na Coluna', 
            patientId: 'id-123' 
        };

        // emula que o prisma criou com sucesso
        vi.mocked(prisma.appointment.create).mockResolvedValue({ 
            id: '1', 
            ...dadosNovos, 
            status: 'AGUARDANDO' 
        } as any);

        const resultado = await appointmentService.createAppointment(dadosNovos);

        expect(resultado.status).toBe('AGUARDANDO');
        expect(resultado.description).toBe('Fisioterapia na Coluna');
    });

    it('deve retornar um array', async () => {
        vi.mocked(prisma.appointment.findMany).mockResolvedValue([
            { id: '1', description: 'Atendimento A', patient: { name: 'João' } }
        ] as any);

        const lista = await appointmentService.listAppointments();

        expect(Array.isArray(lista)).toBe(true);
        expect(lista.length).toBe(1);
    });

   it('deve calterar um status', async () => {
        vi.mocked(prisma.appointment.findUnique).mockResolvedValue({ 
            id: '1', 
            status: 'AGUARDANDO' 
        } as any);

        vi.mocked(prisma.appointment.update).mockResolvedValue({ 
            id: '1', 
            status: 'FINALIZADO' 
        } as any);

        const atualizado = await appointmentService.updateAppointmentStatus('1', 'FINALIZADO');
        expect(atualizado.status).toBe('FINALIZADO');
    });

    it('não deve permitir voltar o status de um agendamento', async () => {
        vi.mocked(prisma.appointment.findUnique).mockResolvedValue({
            id: '1',
            status: 'FINALIZADO'
        } as any);

        await expect(
            appointmentService.updateAppointmentStatus('1', 'AGUARDANDO')
        ).rejects.toThrow("Não pode voltar um status");
    });

});