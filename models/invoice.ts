import OrderItem from './order_item'
import Shop from './shop'
import Customer from './customer'

class Invoice {
    id: number
    status: number
    shop: Shop
    customer: Customer
    orders: OrderItem[]
    updatedAt: Date
    createdAt: Date

    constructor (id: number, status: number, shop: Shop, customer: Customer, orders: OrderItem[], updatedAt: Date, createdAt: Date) {
      this.id = id
      this.status = status
      this.shop = shop
      this.customer = customer
      this.orders = orders
      this.updatedAt = updatedAt
      this.createdAt = createdAt
    }
}

export default Invoice
