class Issue {
    location: string
    key: string | null
    value: string | null
    message: string | null
    critical: boolean
    isCustomerProject: boolean

    constructor (loc: string, key: string | null, value: string | null, msg: string | null) {
      this.location = loc
      this.key = key
      this.value = value
      this.message = msg
      this.critical = false
      this.isCustomerProject = false
    }

    setCritical () {
      this.critical = true
    }

    toStr () {
      return `loc: ${this.location} | key: ${this.key} | value: ${this.value} | msg: ${this.message}`
    }
}

export default Issue
