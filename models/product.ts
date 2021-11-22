import Shop from "./shop"

class Product {
  id: number
  shop: number
  finalPrice: number
  shortcode: string
  title: string
  description: string
  displayImage: string
  rate: number | null
  isExisting: boolean
  discountPercent: number | null
  discountDescription: string
  createdAt: Date
  updatedAt: Date

  constructor(id: number, shop: number, finalPrice: number, shortcode: string,
    title: string, description: string, displayImage: string, rate: number | null,
    isExisting: boolean, createdAt: Date, updatedAt: Date, discountPercent: number | null,
    discountDescription: string) {

    this.id = id
    this.shop = shop
    this.finalPrice = finalPrice
    this.shortcode = shortcode
    this.title = title
    this.description = description
    this.displayImage = displayImage
    this.rate = rate
    this.isExisting = isExisting
    this.discountPercent = discountPercent
    this.discountDescription = discountDescription
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

export default Product
