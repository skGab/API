import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { CreateUserRequest } from '../interfaces';

const users = async (app: FastifyInstance, prisma: PrismaClient) => {
  // GET METHOD
  app.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    const users = await prisma.userinfos.findMany();

    return reply.status(200).send(users);
  });

  // POST METHOD
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

      return reply.send(newUser);
    }
  );
};

export default users;
