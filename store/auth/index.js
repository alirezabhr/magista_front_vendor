import axios from 'axios'

const state = () => ({
  userPhone: '',
  userToken: localStorage.getItem('MagistaToken') || '',
  userId: localStorage.getItem('MagistaId') || 0
})

const mutations = {
  setUserPhone (state, phone) {
    state.userPhone = phone
  },
  setUserToken (state, token) {
    localStorage.setItem('MagistaToken', 'JWT ' + token)
    axios.defaults.headers.common.Authorization = 'JWT ' + token
    state.userToken = 'JWT ' + token
  },
  setUserId (state, id) {
    state.userId = id
    localStorage.setItem('MagistaId', id)
  },
  removeUserToken (state) {
    localStorage.removeItem('MagistaToken')
    axios.defaults.headers.common.Authorization = ''
    state.userToken = null
  }
}

const actions = {
  checkUserExistence (vuexContext, payload) {
    const url = process.env.baseURL + 'user/'

    return axios.post(
      url,
      payload
    ).then((response) => {
      vuexContext.commit('setUserPhone', payload.phone)
      return response
    }).catch((e) => {
      throw e.response
    })
  },
  requestOtpCode (vuexContext, payload) {
    const url = process.env.baseURL + 'send-otp/'

    return axios.post(
      url,
      payload
    ).then(() => {
      vuexContext.commit('setUserPhone', payload.phone)
    }).catch((e) => {
      throw e.response
    })
  },
  checkOtpCode (vuexContext, payload) {
    const url = process.env.baseURL + 'check-otp/'

    return axios.post(
      url,
      payload
    ).catch((e) => {
      throw e.response
    })
  },
  userSignup (vuexContext, payload) {
    const url = process.env.baseURL + 'signup/'

    return axios.post(
      url,
      payload
    ).then((response) => {
      const data = response.data

      const token = data.token
      const id = data.id

      vuexContext.commit('setUserToken', token)
      vuexContext.commit('setUserId', id)
    }).catch((e) => {
      throw e.response
    })
  },
  userLogin (vuexContext, payload) {
    const url = process.env.baseURL + 'login/'

    return axios.post(
      url,
      payload
    ).then((response) => {
      const data = response.data

      const token = data.token
      const id = data.id

      vuexContext.commit('setUserToken', token)
      vuexContext.commit('setUserId', id)
    }).catch((e) => {
      throw e.response
    })
  },
  changeUserPassword (vuexContext, payload) {
    const url = process.env.baseURL + 'user/'

    return axios.put(
      url,
      payload
    ).then((response) => {
      const data = response.data

      const token = data.token
      const id = data.id

      vuexContext.commit('setUserToken', token)
      vuexContext.commit('setUserId', id)
    }).catch((e) => {
      throw e.response
    })
  },
  userLogout (vuexContext) {
    vuexContext.commit('removeUserToken')
    this.$router.push('/auth')
  }
}

const getters = {
  getUserPhone: (state) => {
    return state.userPhone
  },
  getUserId: (state) => {
    return state.userId
  },
  getUserToken: (state) => {
    return state.userToken
  },
  isAuthenticated: (state) => {
    return !!state.userToken
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
