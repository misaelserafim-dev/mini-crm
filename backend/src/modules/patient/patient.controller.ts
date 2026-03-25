import { FastifyInstance } from "fastify";
import { createPatient, getPatients, updatePatient,deletePatient } from "./patient.service";

export async function patientRoutes(app: FastifyInstance) 
{
  // criar
  app.post("/patients", async (request, reply) => {
    try {
      const patient = await createPatient(request.body as any);
      return reply.status(201).send(patient);
      
    } catch (error: any) {
      if (error.message === "Nome é obrigatório" || error.message === "Telefone é obrigatório") {
        return reply.status(400).send({ message: error.message });
      }
      
      if (error.code === "P2002") {
        return reply.status(400).send({ message: "Telefone já cadastrado" });
      }

      return reply.status(500).send({ message: "Erro interno" });
    }
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

    try {
      const patient = await updatePatient(id, { name, phone });
      return reply.send(patient);
    }

    catch (error) {
      return reply.status(404).send({
        message: "Paciente não encontrado",
      });
    }
  });
  
  // deletar
  app.delete("/patients/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    try 
    {
      await deletePatient(id);
      return reply.status(204).send();
    }

    catch (error) {
      return reply.status(404).send({
        message: "Paciente não encontrado",
      });
    }
  });
}