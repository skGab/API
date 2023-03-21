import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface,
} from 'fastify';

import { PrismaClient } from '@prisma/client';

const app: FastifyInstance = fastify();

const prisma = new PrismaClient();

interface TodoParams {
  id: string;
}

interface CreateTodoRequest {
  text: string;
  userID: string;
}

interface CreateUserRequest {
  user: string;
  email: string;
  password: string;
}

interface NewTodoRouteGenericInterface extends RouteGenericInterface {
  Body: CreateTodoRequest;
}

// GET METHOD

// GETTING TASKS
app.get('/todos/:id', async (request, reply) => {
  const { id } = request.params as TodoParams;

  const todos = await prisma.tasks.findMany({ where: { userID: id } });

  return reply.status(200).send(todos);
});

// GETTING USERS
app.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
  const users = await prisma.userinfos.findMany();

  return reply.status(200).send(users);
});

// END GET METHOD

// POST METHOD

// POSTING TASKS
app.post<NewTodoRouteGenericInterface>(
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

// CREATING USERS
app.post(
  '/users/new',
  async (request: FastifyRequest<{ Body: CreateUserRequest }>, reply) => {
    const newUser = await prisma.userinfos.create({
      data: {
        email: request.body.email,
        user: request.body.user,
        password: request.body.password,
      },
    });

    return reply.send(newUser)
  }
);

// END POST METHOD
app
  .listen({
    host: '0.0.0.0',
    port: process.env.Port ? Number(process.env.Port) : 3333,
  })
  .then(() => {
    console.log('HTTP Server Running');
  });
