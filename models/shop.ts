import Shipping from '@/models/shipping/shipping'

class Shop {
    id: number
    instagramUsername: string
    email: string
    address: string
    province: string
    city: string
    bio: string
    commissionPercent: number
    profileImageUrl: string
    remainingAmount: number
    lastScrape: Date
    delivery: Shipping

    constructor (id:number, igUsername: string, email: string, address: string, province: string, city: string,
      bio: string, commissionPercent: number, profileUrl: string, remainingAmount: number, lastScrape: Date, delivery: Shipping) {
      this.id = id
      this.instagramUsername = igUsername
      this.email = email
      this.address = address
      this.province = province
      this.city = city
      this.bio = bio
      this.commissionPercent = commissionPercent
      this.profileImageUrl = profileUrl
      this.remainingAmount = remainingAmount
      this.lastScrape = lastScrape
      this.delivery = delivery
    }

    toJSON () {
      return { ...this }
    }
}

export default Shop
