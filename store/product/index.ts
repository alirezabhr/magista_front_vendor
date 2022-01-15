import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from '../index'
import Issue from '~/models/issue_tracker/issue'
import Post from '~/models/post'
import ProductImage from '~/models/product_image'

const namespace = 'product'

interface ProductState {
  post: Post | null
  postProductImages: ProductImage[]
  selectedProductId: number
}

const state = (): ProductState => ({
  post: null,
  postProductImages: [],
  selectedProductId: 0
})

function getIndexes (productimages: ProductImage[], productId: number) {
  let found = false
  let piIndex = -1
  let pIndex = -1
  for (const pi of productimages) {
    if (found) {
      break
    }
    piIndex += 1
    pIndex = -1
    for (const p of pi.products) {
      pIndex += 1
      if (p.id === productId) {
        found = true
        break
      }
    }
  }
  return [piIndex, pIndex]
}

const mutations = <MutationTree<ProductState>>{
  setSelectedProductId (state, id) {
    state.selectedProductId = id
  },
  setPost (state, p) {
    state.post = new Post(p.id, p.shop.id, p.previewImage, p.shortcode, p.description,
      p.hasProduct, p.createdAt, p.updatedAt)
  },
  clearPostProductImages (state) {
    state.postProductImages = []
  },
  setPostProductImages (state, productImages) {
    state.postProductImages = productImages
  },
  setPostProduct (state, prod) {
    if (state.post) {
      const indexList = getIndexes(state.postProductImages, prod.id)
      state.postProductImages[indexList[0]].products.splice(indexList[1], 1, prod)
    }
  },
  appendProductAttribute (state, attr) {
    if (state.post) {
      const indexList = getIndexes(state.postProductImages, state.selectedProductId)
      state.postProductImages[indexList[0]].products[indexList[1]].attributes.push(attr)
    }
  },
  removeProductAttribute (state, attrId) {
    if (state.post) {
      const indexList = getIndexes(state.postProductImages, state.selectedProductId)
      const i = state.postProductImages[indexList[0]].products[indexList[1]].attributes.findIndex(el => el.id === attrId)
      if (i) {
        state.postProductImages[indexList[0]].products[indexList[1]].attributes.splice(i, 1)
      } else if (i === 0) {
        state.postProductImages[indexList[0]].products[indexList[1]].attributes.splice(0, 1)
      }
    }
  },
  changedTagLocation (state, tagData) {
    if (state.post) {
      const indexList = getIndexes(state.postProductImages, tagData.product)
      state.postProductImages[indexList[0]].products[indexList[1]].tag = tagData
    }
  },
  addNewProduct (state, product) {
    if (state.post) {
      const piIndex = state.postProductImages.findIndex(pi => pi.id === product.image)
      product.tag = { x: 50, y: 50 }
      state.postProductImages[piIndex].products.push(product)
    }
  },
  removeDiscount (state, productId) {
    if (state.post) {
      const indexList = getIndexes(state.postProductImages, productId)
      state.postProductImages[indexList[0]].products[indexList[1]].discountPercent = 0
      state.postProductImages[indexList[0]].products[indexList[1]].discountAmount = 0
      state.postProductImages[indexList[0]].products[indexList[1]].discountDescription = ''
      const originalPrice = state.postProductImages[indexList[0]].products[indexList[1]].originalPrice
      state.postProductImages[indexList[0]].products[indexList[1]].finalPrice = originalPrice
    }
  },
  removeProductFromPost (state, product) {
    if (state.post) {
      const indexList = getIndexes(state.postProductImages, product.id)
      state.postProductImages[indexList[0]].products.splice(indexList[1], 1)
    }
  }
}

const actions = <ActionTree<ProductState, RootState>>{
  postDetail (vuexContext, shortcode) {
    const url = process.env.baseURL + `shop/post/${shortcode}/preview/`

    return this.$client.get(url).then((response) => {
      vuexContext.commit('setPost', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('postDetail', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
      throw e.response
    })
  },
  postProductImages (vuexContext, shortcode) {
    const url = process.env.baseURL + `shop/post/${shortcode}/product-images/`

    return this.$client.get(url).then((response) => {
      vuexContext.commit('setPostProductImages', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('postProductImages', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  editPost (vuexContext, post) {
    const url = process.env.baseURL + `shop/post/${post.shortcode}/`

    return this.$client.put(url, post).then((response) => {
      vuexContext.commit('setPost', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('editPost', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  editProduct (vuexContext, product) {
    const url = process.env.baseURL + `shop/product/${product.id}/`

    return this.$client.put(url, product).then((response) => {
      vuexContext.commit('setPostProduct', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('editProduct', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  createProductDiscount (vuexContext, payloadData) {
    const url = process.env.baseURL + `shop/product/${payloadData.product}/discount/`

    return this.$client.post(url, payloadData).then((response) => {
      vuexContext.commit('setPostProduct', response.data.product)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('createProductDiscount', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  createAttribute (vuexContext, payload) {
    const productId = vuexContext.getters.getSelectedProductId
    const url = process.env.baseURL + `shop/product/${productId}/attribute/`

    return this.$client.post(url, payload).then((response) => {
      vuexContext.commit('appendProductAttribute', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('createAttribute', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  removeAttribute (vuexContext, productAttributeId) {
    const productId = vuexContext.getters.getSelectedProductId
    const url = process.env.baseURL + `shop/product/${productId}/attribute/${productAttributeId}/`

    return this.$client.delete(url).then(() => {
      vuexContext.commit('removeProductAttribute', productAttributeId)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('removeAttribute', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  createProductTag (vuexContext, payload) {
    const url = process.env.baseURL + 'shop/product/tag/'

    return this.$client.post(url, payload).then((rsp) => {
      vuexContext.commit('changedTagLocation', rsp.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('createProductTag', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  changeTagLocation (vuexContext, payload) {
    const url = process.env.baseURL + 'shop/product/tag/'

    return this.$client.put(url, payload).then((rsp) => {
      vuexContext.commit('changedTagLocation', rsp.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('changeTagLocation', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  createNewProduct (vuexContext, payload) {
    const url = process.env.baseURL + 'shop/product/'

    return this.$client.post(url, payload).then((rsp) => {
      vuexContext.commit('addNewProduct', rsp.data)
      vuexContext.dispatch('createProductTag', { product: rsp.data.id })
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('createNewProduct', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  removeProductDiscount (vuexContext, productId) {
    const url = process.env.baseURL + `shop/product/${productId}/discount/`

    const payload = {
      product: productId
    }

    return this.$client.put(url, payload).then(() => {
      vuexContext.commit('removeDiscount', productId)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('removeProductDiscount', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  deleteProduct (vuexContext, product) {
    const url = process.env.baseURL + `shop/product/${product.id}/`

    return this.$client.delete(url, product).then(() => {
      vuexContext.commit('removeProductFromPost', product)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('deleteProduct', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  }
}

const getters = <GetterTree<ProductState, RootState>>{
  getSelectedProductId: (state) : number => {
    return state.selectedProductId
  },
  getPost: (state) : Post | null => {
    return state.post
  },
  getPostProductImages: (state) : ProductImage[] => {
    return state.postProductImages
  }
}

export default {
  namespace,
  state,
  mutations,
  getters,
  actions
}
