import AreaType from './area_type'

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
