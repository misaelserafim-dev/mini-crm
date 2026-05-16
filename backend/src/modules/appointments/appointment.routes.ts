import { FastifyInstance } from "fastify";
import { AppError } from "../../errors/AppError";
import { createAppointment, listAppointments, updateAppointmentStatus, deleteAppointment } from "./appointment.service";

export type AppointmentStatus = "AGUARDANDO" | "EM_ATENDIMENTO" | "FINALIZADO";

export async function appointmentRoutes(app: FastifyInstance) {
  // criar agendamentos
  app.post("/appointments", async (request, reply) => {
    const { description, patientId } = request.body as {
      description?: string;
      patientId?: string;
    };

    if (!description || description.trim() === "") {
      throw new AppError("Descrição é obrigatória", 400, "VALIDATION_ERROR", { field: 'description' });
    }

    if (!patientId) {
      throw new AppError("Paciente é obrigatório", 400, "VALIDATION_ERROR", { field: 'patientId' });
    }

    const appointment = await createAppointment({
      description,
      patientId,
    });

    return reply.status(201).send(appointment);
  });

  // lista de consultas
  app.get("/appointments", async (request, reply) => {
    // busca por parametros
    const { status } = request.query as { 
      status?: AppointmentStatus 
    };

    const appointments = await listAppointments(status);
    return reply.send(appointments);
  });

  // alterar status
  app.patch("/appointments/:id/status", async (request, replace) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: AppointmentStatus };

    const updated = await updateAppointmentStatus(id, status);
    return replace.send(updated);
  });
  // deletar
  app.delete("/appointments/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    await deleteAppointment(id);
    return reply.status(204).send();
  });
}