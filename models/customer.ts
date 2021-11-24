class Customer {
    id: number
    name: string
    province: string
    city: string
    address: string

    constructor (id: number, name: string, province: string, city: string, address: string) {
      this.id = id
      this.name = name
      this.province = province
      this.city = city
      this.address = address
    }
}

export default Customer
