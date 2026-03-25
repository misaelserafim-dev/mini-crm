import { prisma } from "../../lib/prisma";

export async function createPatient(data: { name: string; phone: string }) {
  if (!data.name?.trim()) throw new Error("Nome é obrigatório");
  if (!data.phone?.trim()) throw new Error("Telefone é obrigatório");

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

