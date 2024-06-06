import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface GetUserProfileUseCaseRequest {
    userId: string
    password: string
}

interface GetUserProfileUseCaseResponse {
    user?: User
}

export class GetUserProfileUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ userId, password }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
        const user = await this.usersRepository.findById(userId)

        if (!user) {
            throw new InvalidCredentialsError()
        }

        const doPasswordsMatch = await compare(password, user.password_hash)

        if (!doPasswordsMatch) {
            throw new InvalidCredentialsError()
        }

        return { user }
    }
}