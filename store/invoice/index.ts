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
  appendToInvoiceList (state, invoice) {
    state.invoiceList.push(invoice)
  }
}

const actions = <ActionTree<InvoiceState, RootState>>{
  shopInvoices (vuexContext) {
    const shopId = vuexContext.rootGetters['shop/getCurrentShop'].id
    const url = process.env.baseURL + `order/shop/${shopId}/`

    return this.$client.get(url).then((response) => {
      response.data.forEach((element: Invoice) => {
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
