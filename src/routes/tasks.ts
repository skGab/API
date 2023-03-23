import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  CreateTodoRequest,
  NewTodoRequestRouteInterface,
  TodoParams,
} from '../interfaces';

const tasks = async (app: FastifyInstance, prisma: PrismaClient) => {
  // GET TASKS
  app.get(
    '/todos/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as TodoParams;

        const todos = await prisma.tasks.findMany({ where: { userID: id } });

        return reply.send(todos).status(200);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors = error.flatten().fieldErrors;
          return reply.send(errors);
        }
        return reply.send(error);
      }
    }
  );

  // CREATE TASK
  app.post(
    '/todos/new',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const createTaskSchema = z.object({
          text: z.string(),
          userID: z.string(),
        });

        const body = createTaskSchema.parse(request.body);

        const task = await prisma.tasks.create({
          data: { text: body.text, userID: body.userID },
        });

        return reply.send(task).status(200);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors = error.flatten().fieldErrors;
          return reply.send(errors);
        }
        return reply.send(error);
      }
    }
  );

  // DELETE TASK
  app.delete(
    '/todos/delete/:id',
    async (
      request: FastifyRequest<{ Params: TodoParams }>,
      reply: FastifyReply
    ) => {
      try {
        const result = await prisma.tasks.delete({
          where: {
            id: request.params.id,
          },
        });

        return reply.status(200).send('Tarefa deletada!');
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors = error.flatten().fieldErrors;
          return reply.send(errors);
        }
        return reply.send(error);
      }
    }
  );

  // DELETE ALL TODO TASKS
  app.delete(
    '/deleteAll/todo/:id',
    async (request: FastifyRequest<{ Params: CreateTodoRequest }>, reply) => {
      try {
        const result = await prisma.tasks.deleteMany({
          where: {
            userID: request.params.userID,
            complete: false,
          },
        });

        return reply.status(200).send('Todas as tarefas deletadas!');
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors = error.flatten().fieldErrors;
          return reply.send(errors);
        }
        return reply.send(error);
      }
    }
  );

  // DELETE ALL DONE TASKS
  app.delete(
    '/deleteAll/done/:id',
    async (request: FastifyRequest<{ Params: CreateTodoRequest }>, reply) => {
      try {
        const result = await prisma.tasks.deleteMany({
          where: {
            userID: request.params.userID,
            complete: true,
          },
        });

        return reply.status(200).send('Todas as tarefas deletadas!');
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors = error.flatten().fieldErrors;
          return reply.send(errors);
        }
        return reply.send(error);
      }
    }
  );

  // CHECK AND UNCHECK TASK
  app.put(
    '/todos/complete/:id',
    async (
      request: FastifyRequest<{
        Params: CreateTodoRequest;
        Body: CreateTodoRequest;
      }>,
      reply
    ) => {
      try {
        const task = await prisma.tasks.update({
          where: { id: request.params.id },
          data: { complete: { set: !request.body.complete } },
        });
        reply.send(task).status(200);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors = error.flatten().fieldErrors;
          return reply.send(errors);
        }
        return reply.send(error);
      }
    }
  );

  // EDIT TASK
  app.put(
    '/todos/update/:id',
    async (
      request: FastifyRequest<{
        Params: CreateTodoRequest;
        Body: CreateTodoRequest;
      }>,
      reply
    ) => {
      try {
        const task = await prisma.tasks.update({
          where: { id: request.params.id },
          data: { text: request.body.text },
        });
        reply.send(task);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors = error.flatten().fieldErrors;
          return reply.send(errors);
        }
        return reply.send(error);
      }
    }
  );
};

export default tasks;
