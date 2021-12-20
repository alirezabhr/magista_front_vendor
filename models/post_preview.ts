class PostChild {
  index: number
  id: string
  displayImage: string
  parent: string

  constructor (index: number, id: string, displayImage: string, parent: string) {
    this.index = index
    this.id = id
    this.displayImage = displayImage
    this.parent = parent
  }
}

class PostPreview {
  index: number
  id: string
  displayImage: string
  children: PostChild[]

  constructor (index: number, id: string, displayImage: string, children: PostChild[]) {
    this.index = index
    this.id = id
    this.displayImage = displayImage
    this.children = children
  }
}

export default PostPreview
