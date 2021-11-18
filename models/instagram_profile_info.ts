class InstagramProfileInfo {
    username: string
    id: number
    isPrivate: boolean
    postsCount: number
    profilePicUrl: string
    isBusinessAccount: boolean
    isProfessionalAccount: boolean

    constructor(username: string, id: number, isPrivate: boolean, postsCount: number, profilePicUrl: string,
        isBusinessAccount: boolean, isProfessionalAccount: boolean) {
        this.username = username
        this.id = id
        this.isPrivate = isPrivate
        this.postsCount = postsCount
        this.profilePicUrl = profilePicUrl
        this.isBusinessAccount = isBusinessAccount
        this.isProfessionalAccount = isProfessionalAccount
    }
}

export default InstagramProfileInfo