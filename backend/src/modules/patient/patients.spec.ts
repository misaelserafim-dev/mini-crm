import { describe, it, expect, vi } from 'vitest';
import * as patientService from './patient.service';
import { prisma } from '../../lib/prisma';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    patient: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('Pacientes', () => {
    it('deve cadastrar um paciente', async () => {
        const dados = { name: 'Misael', phone: '41998989877' };

        vi.mocked(prisma.patient.create).mockResolvedValue({ id: '1', ...dados } as any);

        const resultado = await patientService.createPatient(dados);

        expect(resultado).toHaveProperty('id');
        expect(resultado.name).toBe('Misael');
    });

    it('deve atualizar apenas o telefone', async () => {
        const id = '1';
        const apenasTelefone = { phone: '41998989877' };

        vi.mocked(prisma.patient.update).mockResolvedValue({ 
            id, 
            name: 'Misael',
            ...apenasTelefone 
        } as any);

        const resultado = await patientService.updatePatient(id, apenasTelefone);

        expect(resultado.phone).toBe('41998989877');
        expect(prisma.patient.update).toHaveBeenCalledWith({
            where: { id },
            data: apenasTelefone
        });
    });

    it('deve retornar os pacientes', async () => {
        vi.mocked(prisma.patient.findMany).mockResolvedValue([
            { id: '1', name: 'Jurandir' },
            { id: '2', name: 'Misael S.' }
        ] as any);

        const lista = await patientService.getPatients();

        expect(lista.length).toBe(2);
        expect(Array.isArray(lista)).toBe(true);
    });

    it('deve deletar um paciente', async () => {
        vi.mocked(prisma.patient.delete).mockResolvedValue({ id: '1' } as any);

        const resultado = await patientService.deletePatient('1');

        expect(resultado.id).toBe('1');
        expect(prisma.patient.delete).toHaveBeenCalledWith({
            where: { id: '1' }
        });
    });

    it('deve dar erro se tentar cadastrar sem telefone', async () => {
        const dadosIncompletos = { name: 'Misael' } as any; 

        await expect(
            patientService.createPatient(dadosIncompletos)
        ).rejects.toThrow(); 
    });

});