import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma/users-repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists";
import { makeRegisterUserCase } from "@/use-cases/factories/make-register-use-case";
import { RegisterUseCase } from "@/use-cases/register";
import { hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string(),
        password: z.string().min(6),
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

    try {
        const registerUseCase = makeRegisterUserCase()

        await registerUseCase.execute({
            name, email, password
        })
    } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: err.message})
        }

        throw err
    }

    return reply.status(201).send();
};
