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
  },
  removeProductFromPost (state, product) {
    if (state.post) {
      const indexList = getIndexes(state.post.productImages, product.id)
      state.post.productImages[indexList[0]].products.splice(indexList[1], 1)
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
  }
}

export default {
  namespace,
  state,
  mutations,
  getters,
  actions
}
