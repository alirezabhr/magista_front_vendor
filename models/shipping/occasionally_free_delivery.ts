enum AreaType {
  city = 0,
  country = 1
}

class OccasionallyFreeDelivery {
  shipment: number
  type: AreaType
  freeFrom: number

  constructor (shipment: number, type: number, freeFrom: number) {
    this.shipment = shipment
    this.type = type
    this.freeFrom = freeFrom
  }
}

export default OccasionallyFreeDelivery
