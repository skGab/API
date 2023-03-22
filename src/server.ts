import fastify, { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import tasks from './routes/tasks';
import users from './routes/users';

const app: FastifyInstance = fastify();

const prisma = new PrismaClient();

tasks(app, prisma);

users(app, prisma);

app
  .listen({
    host: '0.0.0.0',
    port: process.env.Port ? Number(process.env.Port) : 3333,
  })
  .then(() => {
    console.log('HTTP Server Running');
  });
