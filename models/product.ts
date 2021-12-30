import ProductAttribute from './product_attribute'
import TagLocation from './tag_location'

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
  tag: TagLocation
  displayImageUrl: string
  createdAt: Date
  updatedAt: Date

  constructor (id: number, finalPrice: number, title: string, description: string, originalPrice: number,
    rate: number | null, discountPercent: number | null, discountAmount: number | null, discountDescription: string,
    attributes: ProductAttribute[], tag: TagLocation, displayImageUrl: string, isExisting: boolean, createdAt: Date,
    updatedAt: Date) {
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
    this.tag = tag
    this.displayImageUrl = displayImageUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

export default Product
