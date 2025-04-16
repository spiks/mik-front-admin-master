import axios, {AxiosRequestConfig, AxiosResponse, CancelTokenSource} from 'axios'
import qs from 'qs'
import {LoginRequest, LoginResponse, RefreshTokenResponse, SetPasswordRequest} from 'app/Auth/types/auth'
import {UserCreateRequest, UserRole, UsersRequest, UsersResponse} from 'app/Users/interfaces/models'
import {
    RegionCreateRequest,
    RegionCreateResponse,
    RegionResponse,
    RegionsRequest,
    RegionsResponse,
    RegionUpdateRequest
} from 'app/References/Regions/interfaces/models'
import {
    StoriesRequest,
    StoriesResponse,
    StoryCreateUpdateRequest,
    StoryCreateResponse,
    StoryResponse
} from 'app/Stories/interfaces/stories'
import {PostCreateRequest, PostCreateResponse, PostResponse, PostsRequest, PostsResponse, PostUpdateRequest} from 'app/Posts/interfaces/models'
import {HobbiesResponse, HobbyCreateRequest, HobbyCreateResponse, HobbyUpdateRequest} from 'app/References/Hobbies/interfaces/models'
import {ActivitiesResponse, ActivityCreateRequest, ActivityCreateResponse, ActivityUpdateRequest} from 'app/References/Activities/interfaces/models'
import {FaqCreateRequest, FaqCreateResponse, FaqListResponse, FaqUpdateRequest} from 'app/Faq/interfaces/models'
import {
    SupportCheckResponse,
    SupportListRequest,
    SupportListResponse, SupportMessageCreateRequest, SupportMessageCreateResponse,
    SupportMessagesRequest,
    SupportMessagesResponse, SupportMessageClientSnapshotResponse,
    SupportResponse
} from 'app/Support/interfaces/models'
import {
    DiseaseCreateRequest,
    DiseaseResponse,
    DiseasesRequest,
    DiseasesResponse,
    DiseaseUpdateRequest
} from 'app/References/Diseases/interfaces/models'
import {
    SupportTopicCreateRequest,
    SupportTopicCreateResponse,
    SupportTopicsResponse,
    SupportTopicUpdateRequest
} from 'app/References/SupportTopics/interfaces/models'
import {
    DocumentCreateRequest,
    DocumentCreateResponse,
    DocumentsResponse,
    DocumentResponse,
    DocumentUpdateRequest
} from 'app/References/Documents/interfaces/models'
import {ProfileChangePasswordRequest} from 'app/Profile/interfaces/models'
import {
    CountriesRequest,
    CountriesResponse,
    CountryCreateRequest,
    CountryCreateResponse,
    CountryResponse,
    CountryUpdateRequest
} from 'app/References/Countries/interfaces/models'
import {
    AdviceCreateRequest,
    AdviceCreateResponse,
    AdviceResponse,
    AdvicesRequest,
    AdvicesResponse,
    AdviceUpdateRequest
} from 'app/Advices/interfaces/models'
import {UploadFileResponse} from 'common/interfaces/files'
import {
    VaccinationCreateUpdateRequest,
    VaccinationCreateResponse,
    VaccinationResponse,
    VaccinationsRequest,
    VaccinationsResponse, PreviousVaccinationsRequest, PreviousVaccinationsResponse
} from 'app/Vaccinations/interfaces/models'
import { IAbout } from 'app/About/interfaces/models'

const responseBody = (response: AxiosResponse) => response?.data

let call: CancelTokenSource

const cancellableRequest = (config: AxiosRequestConfig = {}) => {
    if (call) {
        call.cancel('Only one request allowed at a time.')
    }

    call = axios.CancelToken.source()

    config.cancelToken = call.token

    return axios(config)
}

const customParamsSerializer = (params: any) => qs.stringify(params, {arrayFormat: 'repeat'})

const trimStringValues = (data?: object | object[]) => {
    const trimObjectStringFields = (obj: {[key: string]: any}) => Object.keys(obj).forEach(key =>
        obj[key] = typeof obj[key] === 'string' ? obj[key].trim() : obj[key])

    let requestData: {[key: string]: any} | {[key: string]: any}[]

    if (Array.isArray(data)) {
        requestData = [...data] as {[key: string]: any}[]
        (requestData as {[key: string]: any}[]).map(trimObjectStringFields)
    } else if (data instanceof FormData) {
        requestData = data
    } else {
        requestData = {...data}

        trimObjectStringFields(requestData)
    }

    return requestData
}

const requests = {
    post: (url: string, data?: object | object[], cancellable = false, config: AxiosRequestConfig = {}) => {
        const requestData = trimStringValues(data)

        if (cancellable) {
            return cancellableRequest({
                ...config,
                method: 'post',
                url,
                data: trimStringValues(data)
            }).then(responseBody)
        }

        return axios.post(url, requestData, config).then(responseBody)
    },
    patch: (url: string, data?: any) => axios.patch(url, trimStringValues(data)).then(responseBody),
    delete: (url: string, data?: any) => axios.delete(url, data).then(responseBody),
    put: (url: string, data?: any, config?: AxiosRequestConfig) => axios.put(url, trimStringValues(data), config).then(responseBody),
    get: (url: string, config?: AxiosRequestConfig, cancellable = false) => {
        if (cancellable) {
            return cancellableRequest({
                ...config,
                method: 'get',
                paramsSerializer: customParamsSerializer
            }).then(responseBody)
        }

        return axios.get(url, {
            ...config,
            paramsSerializer: customParamsSerializer
        }).then(responseBody)
    }
}

const Auth = {
    login: (data: LoginRequest): Promise<LoginResponse> => requests.post('/auth/login', data),
    refresh: (refresh_token: string): Promise<RefreshTokenResponse> => requests.post('/auth/refresh', {refresh_token}),
    resetPassword: (email: string): Promise<void> => requests.post('/auth/reset-password', {email}),
    setPassword: (data: SetPasswordRequest): Promise<void> => requests.post('/auth/set-password', data)
}

const Users = {
    list: (params: UsersRequest): Promise<UsersResponse> => requests.get('/users', {params}),
    create: (data: UserCreateRequest): Promise<void> => requests.post('/users', data),
    update: (id: string, role: UserRole): Promise<void> => requests.patch(`/users/${id}`, {role}),
    delete: (id: string): Promise<void> => requests.delete(`/users/${id}`)
}

const Regions = {
    list: (params: RegionsRequest): Promise<RegionsResponse> => requests.get('/regions', {params}),
    details: (id: string): Promise<RegionResponse> => requests.get(`/regions/${id}`),
    create: (data: RegionCreateRequest): Promise<RegionCreateResponse> => requests.post('/regions', data),
    update: (id: string, data: RegionUpdateRequest): Promise<void> => requests.patch(`/regions/${id}`, data),
    delete: (id: string): Promise<void> => requests.delete(`/regions/${id}`)
}

const Stories = {
    list: (params: StoriesRequest): Promise<StoriesResponse> => requests.get('/stories', {params}),
    details: (id: string): Promise<StoryResponse> => requests.get(`/stories/${id}`),
    create: (data: StoryCreateUpdateRequest): Promise<StoryCreateResponse> => requests.post('/stories', data),
    update: (id: string, data: StoryCreateUpdateRequest): Promise<void> => requests.patch(`/stories/${id}`, data),
    delete: (id: string): Promise<void> => requests.delete(`/stories/${id}`),
    publish: (id: string): Promise<void> => requests.patch(`/stories/${id}/publish`),
    unpublish: (id: string): Promise<void> => requests.delete(`/stories/${id}/publish`)
}

const Posts = {
    list: (params: PostsRequest): Promise<PostsResponse> => requests.get('/posts', {params}),
    details: (id: string): Promise<PostResponse> => requests.get(`/posts/${id}`),
    create: (data: PostCreateRequest): Promise<PostCreateResponse> => requests.post('/posts', data),
    update: (id: string, data: PostUpdateRequest): Promise<void> => requests.patch(`/posts/${id}`, data),
    delete: (id: string): Promise<void> => requests.delete(`/posts/${id}`),
    publish: (id: string): Promise<void> => requests.patch(`/posts/${id}/publish`),
    unpublish: (id: string): Promise<void> => requests.delete(`/posts/${id}/publish`)
}

const Hobbies = {
    list: (): Promise<HobbiesResponse> => requests.get('/hobbies'),
    create: (data: HobbyCreateRequest): Promise<HobbyCreateResponse> => requests.post('/hobbies', data),
    update: (id: string, data: HobbyUpdateRequest): Promise<void> => requests.patch(`/hobbies/${id}`, data),
    delete: (id: string): Promise<void> => requests.delete(`/hobbies/${id}`)
}

const Activities = {
    list: (): Promise<ActivitiesResponse> => requests.get('/activities'),
    create: (data: ActivityCreateRequest): Promise<ActivityCreateResponse> => requests.post('/activities', data),
    update: (id: string, data: ActivityUpdateRequest): Promise<void> => requests.patch(`/activities/${id}`, data),
    delete: (id: string): Promise<void> => requests.delete(`/activities/${id}`)
}

const Faq = {
    list: (): Promise<FaqListResponse> => requests.get('/faq'),
    create: (data: FaqCreateRequest): Promise<FaqCreateResponse> => requests.post('/faq', data),
    update: (id: string, data: FaqUpdateRequest): Promise<void> => requests.patch(`/faq/${id}`, data),
    delete: (id: string): Promise<void> => requests.delete(`/faq/${id}`)
}

const Support = {
    list: (params: SupportListRequest): Promise<SupportListResponse> => requests.get('/support/requests', {params}),
    details: (id: string): Promise<SupportResponse> => requests.get(`/support/requests/${id}`),
    check: (): Promise<SupportCheckResponse> => requests.get(`/support/check-unread`)
}

const SupportMessages = {
    list: (id: string, params: SupportMessagesRequest): Promise<SupportMessagesResponse> =>
        requests.get(`/support/requests/${id}/messages`, {params}),
    create: (id: string, data: SupportMessageCreateRequest): Promise<SupportMessageCreateResponse> =>
        requests.post(`/support/requests/${id}/messages`, data),
    client_snapshot: (requestId: string, messageId: string): Promise<SupportMessageClientSnapshotResponse> =>
        requests.get(`/support/requests/${requestId}/messages/${messageId}/client-snapshot`)
}

const SupportTopics = {
    list: (): Promise<SupportTopicsResponse> => requests.get('/support/topics'),
    create: (data: SupportTopicCreateRequest): Promise<SupportTopicCreateResponse> => requests.post('/support/topics', data),
    update: (id: string, data: SupportTopicUpdateRequest): Promise<void> => requests.patch(`/support/topics/${id}`, data),
    delete: (id: string): Promise<void> => requests.delete(`/support/topics/${id}`)
}

const Diseases = {
    list: (params: DiseasesRequest): Promise<DiseasesResponse> => requests.get('/diseases', {params}),
    details: (id: string): Promise<DiseaseResponse> => requests.get(`/diseases/${id}`),
    create: (data: DiseaseCreateRequest[]): Promise<void> => requests.post('/diseases', data),
    update: (id: string, data: DiseaseUpdateRequest): Promise<void> => requests.patch(`/diseases/${id}`, data),
    delete: (id: string): Promise<void> => requests.delete(`/diseases/${id}`)
}

const Documents = {
    list: (): Promise<DocumentsResponse> => requests.get('/documents/legal'),
    details: (id: string): Promise<DocumentResponse> => requests.get(`/documents/legal/${id}`),
    create: (data: DocumentCreateRequest): Promise<DocumentCreateResponse> => requests.post('/documents/legal', data),
    update: (id: string, data: DocumentUpdateRequest): Promise<void> => requests.patch(`/documents/legal/${id}`, data),
    delete: (id: string): Promise<void> => requests.delete(`/documents/legal/${id}`)
}

const Profile = {
    changePassword: (data: ProfileChangePasswordRequest): Promise<void> => requests.patch('/profile/password', data)
}

const Countries = {
    list: (params: CountriesRequest): Promise<CountriesResponse> => requests.get('/countries', {params}),
    details: (id: string): Promise<CountryResponse> => requests.get(`/countries/${id}`),
    create: (data: CountryCreateRequest): Promise<CountryCreateResponse> => requests.post('/countries', data),
    update: (id: string, data: CountryUpdateRequest): Promise<void> => requests.patch(`/countries/${id}`, data),
    delete: (id: string): Promise<void> => requests.delete(`/countries/${id}`)
}

const Advices = {
    list: (params: AdvicesRequest): Promise<AdvicesResponse> => requests.get('/advices', {params}),
    details: (id: string): Promise<AdviceResponse> => requests.get(`/advices/${id}`),
    create: (data: AdviceCreateRequest): Promise<AdviceCreateResponse> => requests.post('/advices', data),
    update: (id: string, data: AdviceUpdateRequest): Promise<void> => requests.patch(`/advices/${id}`, data),
    delete: (id: string): Promise<void> => requests.delete(`/advices/${id}`)
}

const Vaccinations = {
    list: (params: VaccinationsRequest): Promise<VaccinationsResponse> => requests.get('/vaccinations', {params}),
    details: (id: string): Promise<VaccinationResponse> => requests.get(`/vaccinations/${id}`),
    create: (data: VaccinationCreateUpdateRequest): Promise<VaccinationCreateResponse> => requests.post('/vaccinations', data),
    update: (id: string, data: VaccinationCreateUpdateRequest): Promise<void> => requests.patch(`/vaccinations/${id}`, data),
    delete: (id: string): Promise<void> => requests.delete(`/vaccinations/${id}`),
    enabled: (id: string): Promise<void> => requests.post(`/vaccinations/${id}/enable`, {enabled: true}),
    disabled: (id: string): Promise<void> => requests.post(`/vaccinations/${id}/enable`, {enabled: false}),
    previous: (params: PreviousVaccinationsRequest): Promise<PreviousVaccinationsResponse> => requests.get('/vaccinations/previous', {params})
}

const Files = {
    upload: (data: FormData): Promise<UploadFileResponse> => requests.post('/files', data)
}

const About = {
    get: (): Promise<IAbout> => requests.get('/about'),
    update: (data: IAbout) => requests.patch('/about', data)
}

const api = {
    Auth,
    Users,
    Regions,
    Stories,
    Posts,
    Hobbies,
    Activities,
    Faq,
    Support,
    SupportMessages,
    SupportTopics,
    Diseases,
    Documents,
    Profile,
    Countries,
    Advices,
    Vaccinations,
    Files,
    About
}

export default api
