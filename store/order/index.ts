import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from '../index'
import Order from '~/models/order'

const namespace = 'order'

interface OrderState {
  orderList: Order[]
}

const state = (): OrderState => ({
  orderList: []
})

const mutations = <MutationTree<OrderState>>{
  appendToOrderList (state, order: any) {
    const item = new Order(order.id, order.status, order.shop, order.customer, order.orderItems, order.totalPrice, order.updatedAt, order.createdAt)
    state.orderList.splice(0, 0, item) // insert order at index 0
  },
  clearOrderList (state) {
    state.orderList = []
  }
}

const actions = <ActionTree<OrderState, RootState>>{
  shopOrders (vuexContext) {
    const shopId = vuexContext.rootGetters['shop/getCurrentShop'].id
    const url = process.env.baseURL + `order/shop/${shopId}/`

    return this.$client.get(url).then((response) => {
      vuexContext.commit('clearOrderList')
      response.data.forEach((element: object) => {
        vuexContext.commit('appendToOrderList', element)
      })
    }).catch((e) => {
      throw e.response
    })
  }
}

const getters = <GetterTree<OrderState, RootState>>{
  getOrderList: (state) : Order[] => {
    return state.orderList
  }
}

export default {
  namespace,
  state,
  mutations,
  getters,
  actions
}
