class Post {
  id: number
  shop: number
  previewImage: string
  shortcode: string
  description: string
  hasProduct: boolean
  createdAt: Date
  updatedAt: Date

  constructor (id: number, shop: number, previewImage: string, shortcode: string, description: string,
    hasProduct: boolean, createdAt: Date, updatedAt: Date) {
    this.id = id
    this.shop = shop
    this.previewImage = previewImage
    this.shortcode = shortcode
    this.description = description
    this.hasProduct = hasProduct
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

export default Post
