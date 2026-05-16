import { FastifyInstance } from "fastify";
import { createPatient, getPatients, updatePatient, deletePatient } from "./patient.service";

export async function patientRoutes(app: FastifyInstance) 
{
  // criar
  app.post("/patients", async (request, reply) => {
    const patient = await createPatient(request.body as any);
    return reply.status(201).send(patient);
  });

  // listar
  app.get("/patients", async (request, reply) => {
    const patients = await getPatients();
    return reply.send(patients);
  });

  // alterar
  app.put("/patients/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { name, phone } = request.body as { name?: string; phone?: string };

    if (!name && !phone) {
      return reply.status(400).send({
        message: "dados iguais",
      });
    }
    const patient = await updatePatient(id, { name, phone });
    return reply.send(patient);
  });
  
  // deletar
  app.delete("/patients/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    await deletePatient(id);
    return reply.status(204).send();
  });
}