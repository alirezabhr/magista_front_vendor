class Shop {
    id: number
    instagramUsername: string
    email: string
    address: string
    province: string
    city: string
    wallet: number
    profileImageUrl: string
    withdrawalAmount: number

    constructor (id:number, igUsername: string, email: string, address: string, province: string, city: string, wallet:number, profileUrl: string, withdrawalAmount: number) {
      this.id = id
      this.instagramUsername = igUsername
      this.email = email
      this.address = address
      this.province = province
      this.city = city
      this.wallet = wallet
      this.profileImageUrl = profileUrl
      this.withdrawalAmount = withdrawalAmount
    }

    toJSON () {
      return { ...this }
    }
}

export default Shop
