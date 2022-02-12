import DeliveryPrice from './delivery_price'
import OccasionallyFreeDelivery from './occasionally_free_delivery'

enum FreeDelivery {
  NOT_FREE = 0,
  OCCASIONALLY_FREE,
  TOTALLY_FREE
}

class Shipping {
  shop: number
  sendEverywhere: Boolean
  cityFreeCost: FreeDelivery
  countryFreeCost: FreeDelivery
  nationalPost: DeliveryPrice
  onlinePost: DeliveryPrice
  cityFreeCostFrom: OccasionallyFreeDelivery
  countryFreeCostFrom: OccasionallyFreeDelivery

  constructor (shop:number, sendEverywhere: Boolean, cityFreeCost: number, countryFreeCost: number,
    nationalPost: DeliveryPrice, onlinePost: DeliveryPrice, cityFreeCostFrom: OccasionallyFreeDelivery,
    countryFreeCostFrom: OccasionallyFreeDelivery) {
    this.shop = shop
    this.sendEverywhere = sendEverywhere
    this.cityFreeCost = cityFreeCost
    this.countryFreeCost = countryFreeCost
    this.nationalPost = nationalPost
    this.onlinePost = onlinePost
    this.cityFreeCostFrom = cityFreeCostFrom
    this.countryFreeCostFrom = countryFreeCostFrom
  }
}

export default Shipping
