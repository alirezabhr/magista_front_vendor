import { GetterTree, MutationTree, ActionTree } from "vuex"
import { RootState } from '../index'
import Product from "~/models/product"

const namespace = 'product'

interface ProductState {
  product: Product | null
}

const state = (): ProductState => ({
  product: null
})

const mutations = <MutationTree<ProductState>>{
  setProduct(state, prod) {
    state.product = new Product(prod.id, prod.shop, prod.originalPrice, prod.shortcode,
                                prod.title, prod.description, prod.displayImage, prod.rate,
                                prod.isExisting, prod.createdAt, prod.updatedAt,
                                prod.discountPercent, prod.discountAmount)
  }
}

const actions = <ActionTree<ProductState, RootState>>{
  productDetail(vuexContext, shortcode) {
    const url = process.env.baseURL + `shop/product/${shortcode}/`

    return this.$client.get(url).then((response) => {
      vuexContext.commit('setProduct', response.data)
    }).catch((e) => {
      throw e.response
    })
  }
}

const getters = <GetterTree<ProductState, RootState>>{
  getProduct: (state) : Product | null => {
    return state.product
  },
}

export default {
  namespace,
  state,
  mutations,
  getters,
  actions
}
