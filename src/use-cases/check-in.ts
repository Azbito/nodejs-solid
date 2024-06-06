import { CheckIn, User } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { InvalidCheckInError } from "./errors/checkin-twice";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found";

interface CheckInUseCaseRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(
        private checkinRepository: CheckInsRepository,
        private gymsRepository: GymsRepository
    ) {}

    async execute({userId, gymId}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundError()
        }

        const checkInOnSameDay = await this.checkinRepository.findByUserIdOnDate(userId, new Date())
        
        if (checkInOnSameDay) {
            throw new InvalidCheckInError()
        }

        const checkIn = await this.checkinRepository.create({
            gymId,
            userId
        })

        return { checkIn }
    }
}