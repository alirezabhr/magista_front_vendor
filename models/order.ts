import OrderItem from './order_item'
import Shop from './shop'
import Customer from './customer'

const OrderStatus = ['در انتظار پرداخت', 'پرداخت شده', 'ارسال شده', 'دریافت شده', 'لغو شده']

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

    constructor (id: number, status: number, shop: Shop, customer: Customer, orderItems: OrderItem[], totalPrice: number, updatedAt: Date, createdAt: Date) {
      this.id = id
      this.status = status
      this.statusText = OrderStatus[status - 1]
      this.shop = shop
      this.customer = customer
      this.orderItems = orderItems
      this.totalPrice = totalPrice
      this.updatedAt = updatedAt
      this.createdAt = createdAt
    }
}

export default Order
