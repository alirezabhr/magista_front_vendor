import DeliveryType from '@/models/shipping/delivery_type'

class OrderDeliveryPrice {
  order: number
  deliveryId: number
  type: DeliveryType
  base: number
  perKilo: number
  destinationProvince: string
  destinationCity: string
  destinationAddress: string

  constructor (order: number, deliveryId: number, type: DeliveryType, base: number, perKilo: number,
    destinationProvince: string, destinationCity: string, destinationAddress: string) {
    this.order = order
    this.deliveryId = deliveryId
    this.type = type
    this.base = base
    this.perKilo = perKilo
    this.destinationProvince = destinationProvince
    this.destinationCity = destinationCity
    this.destinationAddress = destinationAddress
  }
}

export default OrderDeliveryPrice
