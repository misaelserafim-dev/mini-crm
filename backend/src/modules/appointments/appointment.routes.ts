import { FastifyInstance } from "fastify";
import { createAppointment, listAppointments,getAppointmentById, updateAppointmentStatus, deleteAppointment } from "./appointment.service";

export type AppointmentStatus = "AGUARDANDO" | "EM_ATENDIMENTO" | "FINALIZADO";

export async function appointmentRoutes(app: FastifyInstance) {
  // criar agendamentos
  app.post("/appointments", async (request, reply) => {
    const { description, patientId } = request.body as {
      description?: string;
      patientId?: string;
    };

    if (!description || description.trim() === "") {
      return reply.status(400).send({
        message: "Descrição é obrigatória",
      });
    }

    if (!patientId) {
      return reply.status(400).send({
        message: "Paciente é obrigatório",
      });
    }

    try {
      const appointment = await createAppointment({
        description,
        patientId,
      });

      return reply.status(201).send(appointment);
    } catch {
      return reply.status(400).send({
        message: "Erro ao criar agendamento",
      });
    }
  });

  // lista de consultas
  app.get("/appointments", async (request, reply) => {
    // busca por parametros
    const { status } = request.query as { 
      status?: AppointmentStatus 
    };

    try {
      const appointments = await listAppointments(status);
      return reply.send(appointments);
    } 
    catch (error: any) {
      app.log.error(error);
      return reply.status(500).send({ message: "Erro ao listar agendamentos" });
    }
  });

  // alterar status
  app.patch("/appointments/:id/status", async (request, replace) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: AppointmentStatus };

    try {

      const updated = await updateAppointmentStatus(id, status);
      return replace.send(updated);

    } catch (error: any) {
      if (error.message === "Não pode voltar um status") {
        return replace.status(400).send({ message: error.message });
      }
      return replace.status(500).send({ message: "Erro interno" });
    }
  });
  // deletar
  app.delete("/appointments/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
        await deleteAppointment(id);
        return reply.status(204).send();
    } 
    catch (error) {
        return reply.status(404).send({ message: "Agendamento não encontrado" });
    }
  });
}