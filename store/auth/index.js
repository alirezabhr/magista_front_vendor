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
    if (token == null) {
      localStorage.removeItem('MagistaToken')
      axios.defaults.headers.common.Authorization = ''
    } else {
      localStorage.setItem('MagistaToken', 'JWT ' + token)
      axios.defaults.headers.common.Authorization = 'JWT ' + token
    }
    state.userToken = token
  },
  setUserId (state, id) {
    state.userId = id
    localStorage.setItem('MagistaId', id)
  }
}

const actions = {
  checkUserExistence (vuexContext, payload) {
    const url = 'http://127.0.0.1:8000/' + 'user/'

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
    const url = 'http://127.0.0.1:8000/' + 'send-otp/'

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
    const url = 'http://127.0.0.1:8000/' + 'check-otp/'
    payload.phone = vuexContext.getters.getUserPhone

    return axios.post(
      url,
      payload
    ).catch((e) => {
      throw e.response
    })
  },
  userSignup (vuexContext, payload) {
    const url = 'http://127.0.0.1:8000/' + 'signup/'
    payload.phone = vuexContext.getters.getUserPhone

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
    const url = 'http://127.0.0.1:8000/' + 'login/'
    payload.phone = vuexContext.getters.getUserPhone
    console.log('payload in login: ')
    console.log(payload)

    return axios.post(
      url,
      payload
    ).then((response) => {
      const data = response.data

      const token = data.token
      const id = response.data.id

      vuexContext.commit('setUserToken', token)
      vuexContext.commit('setUserId', id)
    }).catch((e) => {
      throw e.response
    })
  },
  userLogout (context) {
    context.commit('setUserToken', null)
    context.commit('profile/setUserData', {}, { root: true })
  }
}

const getters = {
  getUserPhone: (state) => {
    return state.userPhone
  },
  getUserId: (state) => {
    return state.userId
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
