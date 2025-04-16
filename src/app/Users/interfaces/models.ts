import {WithSearchParam} from 'common/interfaces/base'

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    SUPPORT = 'support'
}

export interface IUser {
    id: string
    email: string
    role: UserRole
    created_at: string
}

// requests
export interface UsersRequest extends WithSearchParam {
    roles?: UserRole[]
}

export interface UserCreateRequest {
    email: string
    role: UserRole
}

// responses
export interface UsersResponse {
    users: IUser[]
    total_count: number
}
