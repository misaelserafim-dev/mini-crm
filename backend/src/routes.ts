import { FastifyInstance } from "fastify";
import { patientRoutes } from "./modules/patient/patient.controller";
import { appointmentRoutes } from "./modules/appointments/appointment.routes";

export async function routes(app: FastifyInstance) 
{
  app.register(patientRoutes);
  app.register(appointmentRoutes);
}