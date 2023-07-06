export interface RegisterInput {
    email :string;
    username : string;
    password : string;
    role? : string;
    company? : string
}

export interface LoginInput {
    username : string;
    password :string;
}


export interface PasswordChangeInput extends LoginInput{
    newPassword : string
}
