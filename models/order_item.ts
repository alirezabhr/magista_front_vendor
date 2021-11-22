import Product from './product'

class OrderItem {
  product: Product
  price: number
  count: number

  constructor (product: Product, price: number, count = 1) {
    this.product = product
    this.price = price
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
