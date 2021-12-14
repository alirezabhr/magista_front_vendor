import Product from './product'

class ProductImage {
  id: number
  products: Product[]
  displayImage: string

  constructor (id: number, products: Product[], displayImage: string) {
    this.id = id
    this.products = products
    this.displayImage = displayImage
  }
}

export default ProductImage
