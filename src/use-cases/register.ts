import { prisma } from "@/lib/prisma";
import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({name, email, password}: RegisterUseCaseRequest) {
        const password_hash = await hash(password, 5)
        const userWithSameEmail = await this.usersRepository.findByEmail(email)
        // const prismaUsersRepository = new PrismaUsersRepository()
    
        await this.usersRepository.create({
            name, email, password_hash
        })
    }
}
