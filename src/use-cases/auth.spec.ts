import { expect, describe, it, vi } from 'vitest'
import { compare, hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './auth'
import { InvalidCredentialsError } from './errors/invalid-credentials'

describe('Register Use Case', () => {
    it('should not be able to authenticate', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        await usersRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password_hash: await hash('123456', 5)
        })

        const { user } = await sut.execute({
            email: 'john@example.com',
            password: '123456'
        })

        expect(user?.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong e-mail', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        expect(() => sut.execute({
            email: 'john@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        await usersRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password_hash: await hash('123456', 5)
        })

        await expect(sut.execute({
            email: 'john@example.com',
            password: 'wrongpassword'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})