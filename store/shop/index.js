import axios from 'axios'

const state = () => ({
  shops: [],
  currentShop: null,
  instagramUsername: null,
  userProfileInfo: null
})

const mutations = {
  setShops (state, shops) {
    state.shops = shops
  },
  appendShop (state, shop) {
    state.shops.push(shop)
  },
  setCurrentShop (state, shop) {
    state.currentShop = shop
  },
  setInstagramUsername (state, username) {
    state.instagramUsername = username
  },
  setUserProfileInfo (state, profileInfo) {
    state.userProfileInfo = profileInfo
  }
}

const actions = {
  getVendorShops (vuexContext) {
    const userPk = vuexContext.rootGetters['auth/getUserId']
    axios.defaults.headers.common.Authorization = vuexContext.rootGetters['auth/getUserToken']

    const url = 'http://127.0.0.1:8000/' + `shop/${userPk}/`

    return axios.get(url).then((response) => {
      vuexContext.commit('setShopsName', response.data)
      return response.data
    }).catch((e) => {
      throw e.response
    })
  },
  saveInstagramMediaQueryFile (vuexContext, instagramUsername) {
    const url = 'http://127.0.0.1:8000/' + 'user-media/'
    axios.defaults.headers.common.Authorization = vuexContext.rootGetters['auth/getUserToken']

    const queryParams = {
      instagram_username: instagramUsername
    }

    return axios.post(url, null, { params: queryParams }).then((response) => {
      vuexContext.commit('setInstagramUsername', instagramUsername)
      vuexContext.commit('setUserProfileInfo', response.data)
    }).catch((e) => {
      throw e.response
    })
  },
  getInstagramMediaQueryFile (vuexContext) {
    const url = 'http://127.0.0.1:8000/' + 'user-media/'
    axios.defaults.headers.common.Authorization = vuexContext.rootGetters['auth/getUserToken']

    const queryParams = {
      instagram_username: vuexContext.getters.getInstagramUsername
    }

    return axios.get(url, { params: queryParams }).then((response) => {
      return response.data
    }).catch((e) => {
      throw e.response
    })
  },
  removeExtraMediaQuery (vuexContext, payload) {
    const userPk = vuexContext.rootGetters['auth/getUserId']
    const url = 'http://127.0.0.1:8000/' + 'user-media/'
    axios.defaults.headers.common.Authorization = vuexContext.rootGetters['auth/getUserToken']

    const queryParams = {
      instagram_username: vuexContext.getters.getInstagramUsername
    }

    payload.user_id = userPk

    return axios.put(url, payload, { params: queryParams }).catch((e) => {
      throw e.response
    })
  },
  createShop (vuexContext, payload) {
    const userPk = vuexContext.rootGetters['auth/getUserId']
    axios.defaults.headers.common.Authorization = vuexContext.rootGetters['auth/getUserToken']

    const url = 'http://127.0.0.1:8000/' + `shop/${userPk}/`

    payload.vendor = userPk
    payload.instagram_username = vuexContext.getters.getInstagramUsername
    payload.instagram_id = vuexContext.getters.getUserProfileInfo.id

    return axios.post(url, payload).then((response) => {
      vuexContext.commit('appendShop', response.data)
      vuexContext.commit('setCurrentShop', response.data)
    }).catch((e) => {
      console.log(e.response)
      throw e.response
    })
  },
  createAllProducts (vuexContext) {
    const url = 'http://127.0.0.1:8000/' + 'products'
    axios.defaults.headers.common.Authorization = vuexContext.rootGetters['auth/getUserToken']

    const payload = {
      instagram_username: vuexContext.getters.getInstagramUsername,
      shop: vuexContext.getters.getCurrentShop
    }

    return axios.post(url, payload).catch((e) => {
      throw e.response
    })
  }
}

const getters = {
  getInstagramUsername: (state) => {
    return state.instagramUsername
  },
  getUserProfileInfo: (state) => {
    return state.userProfileInfo
  },
  getCurrentShop: (state) => {
    return state.currentShop
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
