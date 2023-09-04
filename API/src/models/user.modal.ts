export interface User extends UserProfile{
    email?: string;
    hashedPassword?: string;
}

export interface UserProfile {
    id: number;
    username: string;
    role : string;
    company : string
}

export interface UserUpdate {
   email? : string,
   role? : string,
}

export interface UserEditInput {
    email?: string;
    role? : string,
    company? : string
}

