import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from '../index'
import ShopOrder from '~/models/shop_order'

const namespace = 'shop order'

interface ShopOrderState {
  shopOrderList: ShopOrder[]
}

const state = (): ShopOrderState => ({
  shopOrderList: []
})

const mutations = <MutationTree<ShopOrderState>>{
  appendToShopOrderList (state, shopOrder: any) {
    const item = new ShopOrder(shopOrder.id, shopOrder.status, shopOrder.shop, shopOrder.customer, shopOrder.orderItems, shopOrder.totalPrice, shopOrder.updatedAt, shopOrder.createdAt)
    state.shopOrderList.splice(0, 0, item) // insert shopOrder at index 0
  },
  clearShopOrderList (state) {
    state.shopOrderList = []
  }
}

const actions = <ActionTree<ShopOrderState, RootState>>{
  shopShopOrders (vuexContext) {
    const shopId = vuexContext.rootGetters['shop/getCurrentShop'].id
    const url = process.env.baseURL + `order/shop/${shopId}/`

    return this.$client.get(url).then((response) => {
      vuexContext.commit('clearShopOrderList')
      response.data.forEach((element: object) => {
        vuexContext.commit('appendToShopOrderList', element)
      })
    }).catch((e) => {
      throw e.response
    })
  }
}

const getters = <GetterTree<ShopOrderState, RootState>>{
  getShopOrderList: (state) : ShopOrder[] => {
    return state.shopOrderList
  }
}

export default {
  namespace,
  state,
  mutations,
  getters,
  actions
}
