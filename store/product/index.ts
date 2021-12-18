import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from '../index'
import Issue from '~/models/issue_tracker/issue'
import Post from '~/models/post'
import ProductImage from '~/models/product_image'

const namespace = 'product'

interface ProductState {
  post: Post | null,
  selectedProductId: number
}

const state = (): ProductState => ({
  post: null,
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
    state.post = new Post(p.id, p.shop.id, p.productImages, p.shortcode, p.description,
      p.hasProduct, p.createdAt, p.updatedAt)
  },
  setPostProduct (state, prod) {
    if (state.post) {
      const indexList = getIndexes(state.post.productImages, prod.id)
      state.post.productImages[indexList[0]].products.splice(indexList[1], 1, prod)
    }
  },
  appendProductAttribute (state, attr) {
    if (state.post) {
      const indexList = getIndexes(state.post.productImages, state.selectedProductId)
      state.post.productImages[indexList[0]].products[indexList[1]].attributes.push(attr)
    }
  },
  removeProductAttribute (state, attrId) {
    if (state.post) {
      const indexList = getIndexes(state.post.productImages, state.selectedProductId)
      const i = state.post.productImages[indexList[0]].products[indexList[1]].attributes.findIndex(el => el.id === attrId)
      if (i) {
        state.post.productImages[indexList[0]].products[indexList[1]].attributes.splice(i, 1)
      } else if (i === 0) {
        state.post.productImages[indexList[0]].products[indexList[1]].attributes.splice(0, 1)
      }
    }
  },
  changedTagLocation (state, tagData) {
    if (state.post) {
      const indexList = getIndexes(state.post.productImages, tagData.product)
      state.post.productImages[indexList[0]].products[indexList[1]].tag = tagData
    }
  },
  addNewProduct (state, product) {
    if (state.post) {
      const piIndex = state.post.productImages.findIndex(pi => pi.id === product.image)
      product.tag = { x: 50, y: 50 }
      state.post.productImages[piIndex].products.push(product)
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
      for (const k in e.response.data) {
        const issue = new Issue('postDetail', k, e.response.data[k][0], null)
        vuexContext.commit('issue/addIssue', issue, { root: true })
      }
      vuexContext.dispatch('issue/capture', null, { root: true })
      throw e.response
    })
  },
  productDetail (vuexContext, shortcode) {
    const url = process.env.baseURL + `shop/product/${shortcode}/`

    return this.$client.get(url).then((response) => {
      vuexContext.commit('', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      for (const k in e.response.data) {
        const issue = new Issue('productDetail', k, e.response.data[k][0], null)
        vuexContext.commit('issue/addIssue', issue, { root: true })
      }
      vuexContext.dispatch('issue/capture', null, { root: true })
      throw e.response
    })
  },
  editProduct (vuexContext, product) {
    const url = process.env.baseURL + `shop/product/${product.id}/`

    return this.$client.put(url, product).then((response) => {
      vuexContext.commit('setPostProduct', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      for (const k in e.response.data) {
        const issue = new Issue('editProduct', k, e.response.data[k][0], null)
        vuexContext.commit('issue/addIssue', issue, { root: true })
      }
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  createProductDiscount (vuexContext, payloadData) {
    const url = process.env.baseURL + `shop/product/${payloadData.product}/discount/`

    return this.$client.post(url, payloadData).then((response) => {
      vuexContext.commit('setPostProduct', response.data.product)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      for (const k in e.response.data) {
        const issue = new Issue('createProductDiscount', k, e.response.data[k][0], null)
        vuexContext.commit('issue/addIssue', issue, { root: true })
      }
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
      for (const k in e.response.data) {
        const issue = new Issue('createAttribute', k, e.response.data[k][0], null)
        vuexContext.commit('issue/addIssue', issue, { root: true })
      }
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
      for (const k in e.response.data) {
        const issue = new Issue('removeAttribute', k, e.response.data[k][0], null)
        vuexContext.commit('issue/addIssue', issue, { root: true })
      }
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  createProductTag (vuexContext, payload) {
    const url = process.env.baseURL + 'shop/product/tag/'

    return this.$client.post(url, payload).then((rsp) => {
      vuexContext.commit('changedTagLocation', rsp.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      for (const k in e.response.data) {
        const issue = new Issue('createProductTag', k, e.response.data[k][0], null)
        vuexContext.commit('issue/addIssue', issue, { root: true })
      }
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  changeTagLocation (vuexContext, payload) {
    const url = process.env.baseURL + 'shop/product/tag/'

    return this.$client.put(url, payload).then((rsp) => {
      vuexContext.commit('changedTagLocation', rsp.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      for (const k in e.response.data) {
        const issue = new Issue('changeTagLocation', k, e.response.data[k][0], null)
        vuexContext.commit('issue/addIssue', issue, { root: true })
      }
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
      for (const k in e.response.data) {
        const issue = new Issue('createNewProduct', k, e.response.data[k][0], null)
        vuexContext.commit('issue/addIssue', issue, { root: true })
      }
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
  }
}

export default {
  namespace,
  state,
  mutations,
  getters,
  actions
}
