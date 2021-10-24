import axios from 'axios'

const state = () => ({
  shopsName: []
})

const mutations = {
  setShopsName (state, shops) {
    state.shopsName = shops
  }
}

const actions = {
  getVendorShops (vuexContext) {
    const userPk = vuexContext.rootGetters['auth/getUserId']
    axios.defaults.headers.common.Authorization = vuexContext.rootGetters['auth/getUserToken']

    const url = 'http://127.0.0.1:8000/' + 'shop/' + `${userPk}`

    return axios.get(url).then((response) => {
      vuexContext.commit('setShopsName', response.data)
      return response.data
    }).catch((e) => {
      throw e.response
    })
  }
}

const getters = {

}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
