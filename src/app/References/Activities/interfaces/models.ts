export interface IActivity {
    id: string
    name: string
}

// requests
export interface ActivityCreateRequest {
    name: string
}

export interface ActivityUpdateRequest {
    name?: string
}

// responses
export interface ActivitiesResponse {
    activities: IActivity[]
}

export interface ActivityCreateResponse {
    activity: IActivity
}
