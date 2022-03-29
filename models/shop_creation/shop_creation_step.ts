import Step from './creation_step'


class ShopCreationStep {
  vendor: number
  instagramUsername: string
  email: string
  step: Step

  constructor (vendor: number, instagramUsername: string, email: string, step: Step) {
    this.vendor = vendor
    this.email = email
    this.instagramUsername = instagramUsername,
    this.step = step
  }
}

export default ShopCreationStep
