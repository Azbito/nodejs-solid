import { expect, describe, it, vi, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './auth'
import { InvalidCredentialsError } from './errors/invalid-credentials'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })

    it('should not be able to authenticate', async () => {
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
        expect(() => sut.execute({
            email: 'john@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {
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