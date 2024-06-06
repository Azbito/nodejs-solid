import { CheckIn, User } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { InvalidCheckInError } from "./errors/checkin-twice";

interface CheckInUseCaseRequest {
    userId: string
    gymId: string
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(private checkinRepository: CheckInsRepository) {}

    async execute({userId, gymId}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
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