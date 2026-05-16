import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";

export async function createPatient(data: { name: string; phone: string }) {
  if (!data.name?.trim()) throw new AppError("Nome é obrigatório", 400, "VALIDATION_ERROR", { field: 'name' });
  if (!data.phone?.trim()) throw new AppError("Telefone é obrigatório", 400, "VALIDATION_ERROR", { field: 'phone' });

  return prisma.patient.create({ data });
}
export async function getPatients() 
{
  return prisma.patient.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updatePatient(id: string, data: { name?: string; phone?: string }) 
{
  return prisma.patient.update({
    where: { id },
    data,
  });
}

export async function deletePatient(id: string) 
{
  return prisma.patient.delete({
    where: { id },
  });
}

