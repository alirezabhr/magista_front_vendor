import Product from './product'

class OrderItem {
  product: Product
  productTitle: string
  productOriginalPrice: number
  productFinalPrice: number
  productDiscountPercent: number
  count: number

  constructor (product: Product, productTitle: string, productOriginalPrice: number, productFinalPrice: number,
    productDiscountPercent: number, count = 1) {
    this.product = product
    this.productTitle = productTitle
    this.productOriginalPrice = productOriginalPrice
    this.productFinalPrice = productFinalPrice
    this.productDiscountPercent = productDiscountPercent
    this.count = count
  }

  increaseCount () {
    this.count += 1
  }

  decreaseCount () {
    this.count = this.count - 1
  }
}

export default OrderItem
