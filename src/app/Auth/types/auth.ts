import {IProfile} from './profile'

export interface LoginRequest {
    email: string
    password: string
}

export interface SetPasswordRequest {
    reset_id: string
    password: string
}

export interface LoginResponse {
    access_token: string
    refresh_token: string
    profile: IProfile
}

export interface RefreshTokenResponse {
    access_token: string
    refresh_token: string
}
