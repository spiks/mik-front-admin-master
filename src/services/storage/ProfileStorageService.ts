import {IProfile} from 'app/Auth/types/profile'

import {StorageService} from './StorageService'

class ProfileStorageService extends StorageService {
    key = 'profile_data'

    setProfile = (profile: IProfile) => this.set(this.key, JSON.stringify(profile))

    getProfile = (): IProfile | null => {
        const profile = this.get(this.key)

        return profile && JSON.parse(profile) || null
    }

    removeProfile = () => this.remove(this.key)
}

export const ProfileStorage = new ProfileStorageService()
