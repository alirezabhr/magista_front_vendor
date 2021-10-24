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
