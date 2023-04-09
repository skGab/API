import fastify, { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import tasks from './routes/tasks';
import users from './routes/users';
import fastifyCors from '@fastify/cors';

const app: FastifyInstance = fastify();

const prisma = new PrismaClient();

app.register(fastifyCors, {
  origin: true,
});

tasks(app, prisma);

users(app, prisma);

const port = process.env.Port ? Number(process.env.Port) : 3333;

app
  .listen({
    host: '0.0.0.0',
    port: port,
  })
  .then(() => {
    console.log(`Server is running on port ${port}`);
  })
  .catch((error) => {
    console.error('Error  when starting the server:', error);
  });
