export enum UserType {
    "MANAGER", "TECH"
}

export interface UserInterface {
    name: string,
    email?: string,
    password?: string,
    password_confirmation?: string,
    created_at: string,
    active: boolean,
    type: UserType;
    token?: string;
}