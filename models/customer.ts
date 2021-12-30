class Customer {
    id: number
    name: string
    province: string
    city: string
    address: string
    postalCode: string

    constructor (id: number, name: string, province: string, city: string, address: string, postalCode: string) {
      this.id = id
      this.name = name
      this.province = province
      this.city = city
      this.address = address
      this.postalCode = postalCode
    }
}

export default Customer
