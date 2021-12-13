import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from '../index'
import Product from '~/models/product'
import Issue from '~/models/issue_tracker/issue'

const namespace = 'product'

interface ProductState {
  product: Product | null
}

const state = (): ProductState => ({
  product: null
})

const mutations = <MutationTree<ProductState>>{
  setProduct (state, prod) {
    state.product = new Product(prod.id, prod.shop, prod.finalPrice, prod.shortcode,
      prod.title, prod.description, prod.displayImage, prod.originalPrice, prod.rate,
      prod.isExisting, prod.createdAt, prod.updatedAt, prod.discountPercent, prod.discountAmount,
      prod.attributes)
  },
  appendProductAttribute (state, attr) {
    state.product?.attributes.push(attr)
  },
  removeProductAttribute (state, attrId) {
    const i = state.product?.attributes.findIndex(el => el.id === attrId)
    if (i) {
      state.product?.attributes.splice(i, 1)
    } else if (i === 0) {
      state.product?.attributes.splice(0, 1)
    }
  }
}

const actions = <ActionTree<ProductState, RootState>>{
  productDetail (vuexContext, shortcode) {
    const url = process.env.baseURL + `shop/product/${shortcode}/`

    return this.$client.get(url).then((response) => {
      vuexContext.commit('setProduct', response.data)
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
    const url = process.env.baseURL + `shop/product/${product.shortcode}/`

    return this.$client.put(url, product).then((response) => {
      vuexContext.commit('setProduct', response.data)
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
    const product = vuexContext.getters.getProduct
    const url = process.env.baseURL + `shop/product/${product.shortcode}/discount/`
    payloadData.product = product.id

    return this.$client.post(url, payloadData).then((response) => {
      vuexContext.commit('setProduct', response.data.product)
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
    const product = vuexContext.getters.getProduct
    const url = process.env.baseURL + `shop/product/${product.shortcode}/attribute/`

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
    const product = vuexContext.getters.getProduct
    const url = process.env.baseURL + `shop/product/${product.shortcode}/attribute/${productAttributeId}/`

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
  }
}

const getters = <GetterTree<ProductState, RootState>>{
  getProduct: (state) : Product | null => {
    return state.product
  }
}

export default {
  namespace,
  state,
  mutations,
  getters,
  actions
}
