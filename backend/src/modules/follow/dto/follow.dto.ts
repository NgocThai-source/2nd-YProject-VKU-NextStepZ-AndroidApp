import { IsNotEmpty, IsString } from 'class-validator';

export class FollowResponseDto {
    id: string;
    followerId: string;
    followingId: string;
    createdAt: Date;
}

export class FollowStatusDto {
    isFollowing: boolean;
}

export class FollowerCountDto {
    count: number;
}
