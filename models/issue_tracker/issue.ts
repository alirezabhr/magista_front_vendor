class Issue {
  location: string
  message: string
  critical: boolean
  isCustomerProject: boolean

  constructor (loc: string, msg: string) {
    this.location = loc
    this.message = msg
    this.critical = false
    this.isCustomerProject = false
  }

  setCritical () {
    this.critical = true
  }

  toStr () {
    return `loc: ${this.location} | msg: ${this.message}`
  }
}

export default Issue
