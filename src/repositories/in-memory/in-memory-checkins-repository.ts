import { randomUUID } from "crypto";
import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = [];

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')

        const checkInOnSameDay = this.items.find(checkIn => {
            const checkInDate = dayjs(checkIn.created_at)
            const isOnTheSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

            return checkIn.userId === userId && isOnTheSameDate
        })

        if (!checkInOnSameDay) {
            return null
        }

        return checkInOnSameDay
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn: CheckIn = {
            id: randomUUID(),
            userId: data.userId,
            gymId: data.gymId,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            created_at: new Date(),
        };

        this.items.push(checkIn);

        return checkIn;
    }
}
