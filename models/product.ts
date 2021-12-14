import ProductAttribute from './product_attribute'

class Product {
  id: number
  originalPrice: number
  finalPrice: number
  title: string
  description: string
  rate: number | null
  isExisting: boolean
  discountPercent: number | null
  discountAmount: number | null
  discountDescription: string
  attributes: ProductAttribute[]
  createdAt: Date
  updatedAt: Date

  constructor (id: number, finalPrice: number, title: string, description: string, originalPrice: number,
    rate: number | null, isExisting: boolean, createdAt: Date, updatedAt: Date, discountPercent: number | null,
    discountAmount: number | null, discountDescription: string, attributes: ProductAttribute[]) {
    this.id = id
    this.finalPrice = finalPrice
    this.originalPrice = originalPrice
    this.title = title
    this.description = description
    this.rate = rate
    this.isExisting = isExisting
    this.discountPercent = discountPercent
    this.discountAmount = discountAmount
    this.discountDescription = discountDescription
    this.attributes = attributes
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

export default Product
