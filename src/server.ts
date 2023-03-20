import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const app = fastify();

const prisma = new PrismaClient();

app.get('/', async () => {
  const users = await prisma.userinfos.findMany();

  return { users };
});

app
  .listen({
    host: '0.0.0.0',
    port: process.env.Port ? Number(process.env.Port) : 3333,
  })
  .then(() => {
    console.log('HTTP Server Running');
  });
