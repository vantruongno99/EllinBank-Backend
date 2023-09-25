import { User } from "./user.modal"

export interface CompanyInput {
    name : string
}

export interface CompanyInfo {
    name : string
}

export interface CompanyQueryOption {
    from? : string,
    to? : string,
}

export interface CompanyOutput extends CompanyInput {
    Users? : User[]
}