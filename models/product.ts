import Shop from "./shop"

class Product {
  id: number
  shop: number
  originalPrice: number
  shortcode: string
  title: string
  description: string
  displayImage: string
  rate: number | null
  isExisting: boolean
  discountPercent: number | null
  discountAmount: number | null
  discountDescription: string
  createdAt: Date
  updatedAt: Date

  constructor(id: number, shop: number, originalPrice: number, shortcode: string,
    title: string, description: string, displayImage: string, rate: number | null,
    isExisting: boolean, createdAt: Date, updatedAt: Date, discountPercent: number | null,
    discountAmount: number | null, discountDescription: string) {

    this.id = id
    this.shop = shop
    this.originalPrice = originalPrice
    this.shortcode = shortcode
    this.title = title
    this.description = description
    this.displayImage = displayImage
    this.rate = rate
    this.isExisting = isExisting
    this.discountPercent = discountPercent
    this.discountAmount = discountAmount
    this.discountDescription = discountDescription
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

export default Product
