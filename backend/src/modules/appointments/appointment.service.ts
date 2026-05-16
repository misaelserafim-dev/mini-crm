import { prisma } from "../../lib/prisma";

// Tipagem para os status
type AppointmentStatus = "AGUARDANDO" | "EM_ATENDIMENTO" | "FINALIZADO";

import { AppError } from "../../errors/AppError";

export async function createAppointment(data: { description: string; patientId: string }) {
  return prisma.appointment.create({
    data,
  });
}

export async function listAppointments(status?: AppointmentStatus) {
  return prisma.appointment.findMany({
    where: {
      status: status, 
    },
    include: {
      patient: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAppointmentById(id: string) {
  return prisma.appointment.findUnique({
    where: { id },
  });
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const appointment = await getAppointmentById(id);
  if (!appointment) throw new AppError("Agendamento não encontrado", 404, "NOT_FOUND");

  const listStatus = { "AGUARDANDO": 1, "EM_ATENDIMENTO": 2, "FINALIZADO": 3 };
  const current = listStatus[appointment.status as AppointmentStatus] ?? 0;
  const next = listStatus[status] ?? 0;

  if (next <= current) {
    throw new AppError("Não pode voltar um status", 400, "INVALID_STATUS_TRANSITION");
  }

  return prisma.appointment.update({
    where: { id },
    data: { status },
  });
}

export async function deleteAppointment(id: string) {
  return prisma.appointment.delete({
    where: { id },
  });
}