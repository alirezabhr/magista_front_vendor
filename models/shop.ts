class Shop {
    id: number
    instagramUsername: string
    province: string
    city: string
    profileImageUrl: string

    constructor(id:number, igUsername: string, province: string, city: string, profileUrl: string) {
        this.id = id
        this.instagramUsername = igUsername
        this.province = province
        this.city = city
        this.profileImageUrl = profileUrl
    }

    toJSON() {
        return { ...this }
    }
}

export default Shop