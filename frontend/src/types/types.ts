export interface UserType {
    _id: string,
    firstName: string,
    lastName: string,
    emailId: string
}

export interface UserFormData {
    firstName: string;
    lastName: string;
    emailId: string;
}

export type FormErrorType = {
    [key in keyof UserFormData]?: string;
}