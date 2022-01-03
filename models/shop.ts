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

    constructor (id:number, igUsername: string, email: string, address: string, province: string, city: string, commissionPercent: number, wallet:number, profileUrl: string, remainingAmount: number) {
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
    }

    toJSON () {
      return { ...this }
    }
}

export default Shop
