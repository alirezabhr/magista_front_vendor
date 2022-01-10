class Shop {
    id: number
    instagramUsername: string
    email: string
    address: string
    province: string
    city: string
    commissionPercent: number
    wallet: number
    profileImageUrl: string
    remainingAmount: number
    lastScrape: Date

    constructor (id:number, igUsername: string, email: string, address: string, province: string, city: string,
      commissionPercent: number, wallet:number, profileUrl: string, remainingAmount: number, lastScrape: Date) {
      this.id = id
      this.instagramUsername = igUsername
      this.email = email
      this.address = address
      this.province = province
      this.city = city
      this.commissionPercent = commissionPercent
      this.wallet = wallet
      this.profileImageUrl = profileUrl
      this.remainingAmount = remainingAmount
      this.lastScrape = lastScrape
    }

    toJSON () {
      return { ...this }
    }
}

export default Shop
