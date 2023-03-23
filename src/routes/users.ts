import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { z } from 'zod';

const createUserRequestSchema = z.object({
  email: z.string().email(),
  user: z.string(),
  password: z.string(),
});

const users = async (app: FastifyInstance, prisma: PrismaClient) => {
  // GET METHOD
  app.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const users = await prisma.userinfos.findMany();
      return reply.status(200).send(users);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.flatten().fieldErrors;
        return reply.send(errors);
      }
      return reply.send(error);
    }
  });

  // POST METHOD
  app.post(
    '/users/new',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = createUserRequestSchema.parse(request.body);

        const newUser = await prisma.userinfos.create({
          data: {
            email: body.email,
            user: body.user,
            password: body.password,
          },
        });

        return reply.send(newUser).status(200);
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

export default users;
