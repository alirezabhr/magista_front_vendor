class Shop {
    id: number
    instagramUsername: string
    province: string
    city: string
    wallet: number
    profileImageUrl: string

    constructor (id:number, igUsername: string, province: string, city: string, wallet:number, profileUrl: string) {
      this.id = id
      this.instagramUsername = igUsername
      this.province = province
      this.city = city
      this.wallet = wallet
      this.profileImageUrl = profileUrl
    }

    toJSON () {
      return { ...this }
    }
}

export default Shop
