import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { Prisma } from '@prisma/client';
import { AppError } from './AppError';

export function appErrorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
      code: error.code,
      details: error.details,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return reply.status(400).send({
        message: 'Valor único violado',
        code: 'UNIQUE_CONSTRAINT',
      });
    }

    if (error.code === 'P2025') {
      return reply.status(404).send({
        message: 'Registro não encontrado',
        code: 'NOT_FOUND',
      });
    }
  }

  request.log?.error(error);

  return reply.status(500).send({
    message: 'Erro interno',
    code: 'INTERNAL_SERVER_ERROR',
  });
}
