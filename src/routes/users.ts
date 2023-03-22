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
    const users = await prisma.userinfos.findMany();

    return reply.status(200).send(users);
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

        return reply.send(newUser);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: 'Invalid request body' });
        }
        return reply.send(error);
      }
    }
  );
};

export default users;
