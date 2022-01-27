class ShopDiscount {
  shop: number
  percent: number
  description: string
  isActive: boolean
  code: string
  count: number
  startAt: Date
  finishAt: Date
  createdAt: Date

  constructor (shop: number, percent: number, description: string, isActive: boolean, code: string, count: number,
    startAt: Date, finishAt: Date, createdAt: Date) {
    this.shop = shop
    this.percent = percent
    this.description = description
    this.isActive = isActive
    this.code = code
    this.count = count
    this.startAt = startAt
    this.finishAt = finishAt
    this.createdAt = createdAt
  }
}

export default ShopDiscount
