import ProductAttribute from './product_attribute'

class Product {
  id: number
  shop: number
  originalPrice: number
  finalPrice: number
  shortcode: string
  title: string
  description: string
  displayImage: string
  rate: number | null
  isExisting: boolean
  discountPercent: number | null
  discountDescription: string
  attributes: ProductAttribute[]
  createdAt: Date
  updatedAt: Date

  constructor (id: number, shop: number, finalPrice: number, shortcode: string,
    title: string, description: string, displayImage: string, originalPrice: number,
    rate: number | null, isExisting: boolean, createdAt: Date, updatedAt: Date,
    discountPercent: number | null, discountDescription: string, attributes: ProductAttribute[]) {
    this.id = id
    this.shop = shop
    this.finalPrice = finalPrice
    this.originalPrice = originalPrice
    this.shortcode = shortcode
    this.title = title
    this.description = description
    this.displayImage = displayImage
    this.rate = rate
    this.isExisting = isExisting
    this.discountPercent = discountPercent
    this.discountDescription = discountDescription
    this.attributes = attributes
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

export default Product
