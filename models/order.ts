import OrderItem from './order_item'
import Shop from './shop'
import Customer from './customer'

class Order {
    id: number
    status: number
    statusText: string
    shop: Shop
    customer: Customer
    orderItems: OrderItem[]
    totalPrice: number
    updatedAt: Date
    createdAt: Date

    constructor (id: number, status: number, statusText: string, shop: Shop, customer: Customer, orderItems: OrderItem[], totalPrice: number, updatedAt: Date, createdAt: Date) {
      this.id = id
      this.status = status
      this.statusText = statusText
      this.shop = shop
      this.customer = customer
      this.orderItems = orderItems
      this.totalPrice = totalPrice
      this.updatedAt = updatedAt
      this.createdAt = createdAt
    }
}

export default Order
