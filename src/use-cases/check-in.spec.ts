import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { CheckInUseCase } from './check-in'
import { InvalidCheckInError } from './errors/checkin-twice'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('CheckIn Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should not be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        const month = 1
    
        vi.setSystemTime(new Date(2022, month - 1, 20, 8, 0, 0))
        
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
        })
        
        try {
            await sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
            })
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidCheckInError)
        }
    })

    it('should be able to check in twice but in different days', async () => {
        const month = 1
    
        vi.setSystemTime(new Date(2022, month - 1, 20, 8, 0, 0))
        
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
        })

        vi.setSystemTime(new Date(2022, month - 1, 21, 8, 0, 0))
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
        })


        expect(checkIn.id).toEqual(expect.any(String))
    })
})