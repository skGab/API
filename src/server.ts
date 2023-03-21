import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';

import { PrismaClient } from '@prisma/client';

const app: FastifyInstance = fastify();

const prisma = new PrismaClient();

interface TodoParams {
  id: string;
}

// GETTING TASKS
app.get('/todos/:id', async (request, reply) => {
  const { id } = request.params as TodoParams;

  const todos = await prisma.tasks.findMany({ where: { userID: id } });

  reply.send(todos);
});

// GETTING USERS
app.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
  const users = await prisma.userinfos.findMany();

  reply.send(users);
});

app
  .listen({
    host: '0.0.0.0',
    port: process.env.Port ? Number(process.env.Port) : 3333,
  })
  .then(() => {
    console.log('HTTP Server Running');
  });
