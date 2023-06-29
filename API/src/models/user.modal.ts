export interface User extends UserProfile{
    email?: string;
    hashedPassword?: string;
}

export interface UserProfile {
    id: number;
    username: string;
    role : string
}

export interface UserUpdate {
   email? : string,
   role? : string,
}

