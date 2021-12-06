import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from '../index'
import Order from '~/models/order'
import Issue from '~/models/issue_tracker/issue'

const namespace = 'order'

interface OrderState {
  orderList: Order[]
}

const state = (): OrderState => ({
  orderList: []
})

const mutations = <MutationTree<OrderState>>{
  appendToOrderList (state, order: any) {
    const item = new Order(order.id, order.status, order.statusText, order.shop, order.customer, order.orderItems, order.totalPrice, order.updatedAt, order.createdAt)
    state.orderList.splice(0, 0, item) // insert order at index 0
  },
  clearOrderList (state) {
    state.orderList = []
  },
  changeOrderStatusInList (state, order) {
    const orderIndex = state.orderList.findIndex(el => el.id === order.id)
    state.orderList[orderIndex].status = order.status
    state.orderList[orderIndex].statusText = order.statusText
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
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      for (const k in e.response.data) {
        const issue = new Issue('shopOrders', k, e.response.data[k][0], null)
        vuexContext.commit('issue/addIssue', issue, { root: true })
      }
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  editOrder (vuexContext, order) {
    const url = process.env.baseURL + `order/${order.id}/`

    order.shop = order.shop.id // add pk instead of Object
    order.customer = order.customer.id // add pk instead of Object

    return this.$client.put(url, order).then((response) => {
      vuexContext.commit('changeOrderStatusInList', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      for (const k in e.response.data) {
        const issue = new Issue('editOrder', k, e.response.data[k][0], null)
        vuexContext.commit('issue/addIssue', issue, { root: true })
      }
      vuexContext.dispatch('issue/capture', null, { root: true })
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
