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
  totalOriginalPrice: number
  totalDiscountAmount: number
  finalPrice: number
  hasDiscountCode: boolean
  shippedBy: number
  paidAt: Date
  verifiedAt: Date
  shippedAt: Date
  canceledAt: Date
  createdAt: Date

  constructor (id: number, status: number, statusText: string, shop: Shop, customer: Customer, orderItems: OrderItem[],
    totalOriginalPrice: number, totalDiscountAmount: number, finalPrice: number, hasDiscountCode: boolean, shippedBy: number,
    paidAt: Date, verifiedAt: Date, shippedAt: Date, canceledAt: Date, createdAt: Date) {
    this.id = id
    this.status = status
    this.statusText = statusText
    this.shop = shop
    this.customer = customer
    this.orderItems = orderItems
    this.totalOriginalPrice = totalOriginalPrice
    this.totalDiscountAmount = totalDiscountAmount
    this.finalPrice = finalPrice
    this.hasDiscountCode = hasDiscountCode
    this.shippedBy = shippedBy
    this.paidAt = paidAt
    this.verifiedAt = verifiedAt
    this.shippedAt = shippedAt
    this.canceledAt = canceledAt
    this.createdAt = createdAt
  }
}

export default Order
