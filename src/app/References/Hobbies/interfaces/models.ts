export interface IHobby {
    id: string
    name: string
}

// requests
export interface HobbyCreateRequest {
    name: string
}

export interface HobbyUpdateRequest {
    name?: string
}

// responses
export interface HobbiesResponse {
    hobbies: IHobby[]
}

export interface HobbyCreateResponse {
    hobby: IHobby
}
