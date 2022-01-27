import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from '../../index'
import Issue from '~/models/issue_tracker/issue'
import ShopDiscount from '~/models/shop_discount'

const namespace = 'shop_discount'

interface ShopDiscountState {
  isGettingShopDiscount: boolean
  discounts: ShopDiscount[]
}

const state = (): ShopDiscountState => ({
  isGettingShopDiscount: false,
  discounts: []
})

const mutations = <MutationTree<ShopDiscountState>>{
  setIsGettingShopDiscount (state, value: boolean) {
    state.isGettingShopDiscount = value
  },
  setDiscounts (state, discountsList) {
    state.discounts = discountsList
  },
  addDiscount (state, discount) {
    state.discounts.splice(0, 0, discount)
  }
}

const actions = <ActionTree<ShopDiscountState, RootState>>{
  shopDiscounts (vuexContext) {
    const shopPk = vuexContext.rootGetters['shop/getCurrentShop'].id
    const url = process.env.baseURL + `shop/${shopPk}/discount/`

    vuexContext.commit('setIsGettingShopDiscount', true)

    return this.$client.get(url).then((response) => {
      vuexContext.commit('setIsGettingShopDiscount', false)
      vuexContext.commit('setDiscounts', response.data)
    }).catch((e) => {
      vuexContext.commit('setIsGettingShopDiscount', false)
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('shopDiscounts', JSON.stringify(e.response))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  createDiscounts (vuexContext, payload) {
    const shopPk = vuexContext.rootGetters['shop/getCurrentShop'].id
    const url = process.env.baseURL + `shop/${shopPk}/discount/`

    payload.shop = shopPk

    return this.$client.post(url, payload).then((response) => {
      vuexContext.commit('addDiscount', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('createDiscounts', JSON.stringify(e.response))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  }
}

const getters = <GetterTree<ShopDiscountState, RootState>>{
  isGettingShopDiscount: (state) => {
    return state.isGettingShopDiscount
  },
  getShopDiscounts: (state) => {
    return state.discounts
  }
}

export default {
  namespace,
  state,
  mutations,
  getters,
  actions
}
