export interface User extends UserProfile{
    email: string;
    hashedPassword: string;
}

export interface UserSelect extends UserProfile{
    email: string;

}

export interface UserProfile {
    id: number;
    username: string;
    role : string;
    company : string|null
}

export interface UserUpdate {
   email? : string,
   role? : string,
}

export interface UserEditInput {
    email?: string;
    role? : string,
    company? : string|null
}



