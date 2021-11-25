import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from '../index'
import Invoice from '~/models/invoice'

const namespace = 'invoice'

interface InvoiceState {
  invoiceList: Invoice[]
}

const state = (): InvoiceState => ({
  invoiceList: []
})

const mutations = <MutationTree<InvoiceState>>{
  appendToInvoiceList (state, invoice: any) {
    const item = new Invoice(invoice.id, invoice.status, invoice.shop, invoice.customer, invoice.orders, invoice.updatedAt, invoice.createdAt)
    state.invoiceList.splice(0, 0, item) // insert invoice at index 0
  },
  clearInvoiceList (state) {
    state.invoiceList = []
  }
}

const actions = <ActionTree<InvoiceState, RootState>>{
  shopInvoices (vuexContext) {
    const shopId = vuexContext.rootGetters['shop/getCurrentShop'].id
    const url = process.env.baseURL + `order/shop/${shopId}/`

    return this.$client.get(url).then((response) => {
      vuexContext.commit('clearInvoiceList')
      response.data.forEach((element: object) => {
        vuexContext.commit('appendToInvoiceList', element)
      })
    }).catch((e) => {
      throw e.response
    })
  }
}

const getters = <GetterTree<InvoiceState, RootState>>{
  getInvoiceList: (state) : Invoice[] => {
    return state.invoiceList
  }
}

export default {
  namespace,
  state,
  mutations,
  getters,
  actions
}
