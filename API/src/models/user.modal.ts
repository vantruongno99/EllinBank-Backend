export interface User extends UserProfile{
    email?: string;
    hashedPassword?: string;
}

export interface UserProfile {
    id: number;
    username: string;
}