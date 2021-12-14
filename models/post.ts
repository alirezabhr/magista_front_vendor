import ProductImage from './product_image'

class Post {
  id: number
  shop: number
  productImages: ProductImage[]
  shortcode: string
  description: string
  hasProduct: boolean
  createdAt: Date
  updatedAt: Date

  constructor (id: number, shop: number, productImages: ProductImage[], shortcode: string, description: string,
    hasProduct: boolean, createdAt: Date, updatedAt: Date) {
    this.id = id
    this.shop = shop
    this.productImages = productImages
    this.shortcode = shortcode
    this.description = description
    this.hasProduct = hasProduct
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

export default Post
