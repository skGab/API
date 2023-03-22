import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import {
  CreateTodoRequest,
  NewTodoRequestRouteInterface,
  TodoParams,
} from '../interfaces';

const tasks = async (app: FastifyInstance, prisma: PrismaClient) => {
  // GET METHOD
  app.get('/todos/:id', async (request, reply) => {
    const { id } = request.params as TodoParams;

    const todos = await prisma.tasks.findMany({ where: { userID: id } });

    return reply.status(404).send(todos);
  });

  // POST METHOD
  app.post<NewTodoRequestRouteInterface>(
    '/todos/new',
    async (
      request: FastifyRequest<{ Body: CreateTodoRequest }>,
      reply: FastifyReply
    ): Promise<CreateTodoRequest> => {
      const task = await prisma.tasks.create({
        data: { text: request.body.text, userID: request.body.userID },
      });

      return reply.send(task);
    }
  );

  // DELETE METHOD
  app.delete(
    '/todos/delete/:id',
    async (request: FastifyRequest<{ Params: TodoParams }>, reply) => {
      const result = await prisma.tasks.delete({
        where: {
          id: request.params.id,
        },
      });

      return reply.status(200).send(result);
    }
  );

  app.delete(
    '/deleteAll/todo/:id',
    async (request: FastifyRequest<{ Params: CreateTodoRequest }>, reply) => {
      const result = await prisma.tasks.deleteMany({
        where: {
          userID: request.params.id,
          complete: false,
        },
      });

      return reply.status(200).send(result);
    }
  );

  app.delete(
    '/deleteAll/done/:id',
    async (request: FastifyRequest<{ Params: CreateTodoRequest }>, reply) => {
      const result = await prisma.tasks.deleteMany({
        where: {
          userID: request.params.id,
          complete: true,
        },
      });

      return reply.status(200).send(result);
    }
  );

  // PUT METHOD
  app.put(
    '/todos/complete/:id',
    async (
      request: FastifyRequest<{
        Params: CreateTodoRequest;
        Body: CreateTodoRequest;
      }>,
      reply
    ) => {
      const task = await prisma.tasks.update({
        where: { id: request.params.id },
        data: { complete: { set: !request.body.complete } },
      });
      reply.send(task);
    }
  );

  app.put(
    '/todos/update/:id',
    async (
      request: FastifyRequest<{
        Params: CreateTodoRequest;
        Body: CreateTodoRequest;
      }>,
      reply
    ) => {
      const task = await prisma.tasks.update({
        where: { id: request.params.id },
        data: { text: request.body.text },
      });
      reply.send(task);
    }
  );
};

export default tasks;
