import DeliveryType from './delivery_type'

class DeliveryPrice {
  shipment: number
  type: DeliveryType
  base: number
  perKilo: number

  constructor (shipment: number, type: number, base: number, perKilo: number) {
    this.shipment = shipment
    this.type = type
    this.base = base
    this.perKilo = perKilo
  }
}

export default DeliveryPrice
