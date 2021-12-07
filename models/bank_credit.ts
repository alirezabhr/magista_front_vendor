class BankCredits {
  shop: number // shop pk
  sheba: string
  fullName: string

  constructor (shop:number, sheba: string, fullName: string) {
    this.shop = shop
    this.sheba = sheba
    this.fullName = fullName
  }
}

export default BankCredits
