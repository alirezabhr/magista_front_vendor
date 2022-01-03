class BankCredits {
  shop: number // shop pk
  sheba: string
  firstName: string
  lastName: string

  constructor (shop:number, sheba: string, firstName: string, lastName: string) {
    this.shop = shop
    this.sheba = sheba
    this.firstName = firstName
    this.lastName = lastName
  }
}

export default BankCredits
