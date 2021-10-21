import axios from 'axios'

const state = {
  userPhone: '',
  userPassword: '',
  userToken: localStorage.getItem('MagistaToken') || '',
  userId: localStorage.getItem('MagistaId') || 0
}

const mutations = {
  setUserPhone (state, phone) {
    state.userPhone = phone
  },
  setUserPassword (state, password) {
    state.userPassword = password
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
  checkUserExistence (context, payload) {
    return axios.get(
      'http://magista.ir/user/',
      payload
    ).then(() => {

    }).catch((e) => {
      print(e.response)
    })
  },
  sendOtp ({ context, rootGetters }, payload) {
    const url = rootGetters['general/getBaseUrl'] + 'send-otp/'

    return axios.post(
      url,
      payload
    ).then(() => {
      context.commit('setUserPhone', payload.phone)
    }).catch((e) => {
      throw e.response
    })
  },
  checkOtp (context, payload) {
    return axios.post(
      'http://magista.ir/check-otp/',
      payload
    ).catch((e) => {
      throw e.response
    })
  },
  signup (context, payload) {
    return axios.post(
      'http://magista.ir/signup/',
      payload
    ).then((response) => {
      const data = response.data

      const token = data.token
      const id = data.id

      context.commit('setUserToken', token)
      context.commit('setUserId', id)
    }).catch((e) => {
      throw e.response
    })
  },
  login (context, payload) {
    return axios.post(
      'http://magista.ir/login/',
      payload
    ).then((response) => {
      const data = response.data

      const token = data.token
      const id = response.data.id

      context.commit('setUserToken', token)
      context.commit('setUserId', id)
    }).catch((e) => {
      throw e.response
    })
  },
  logout (context) {
    context.commit('setUserToken', null)
    context.commit('profile/setUserData', {}, { root: true })
  }
}

const getters = {
  getUserPhone: (state) => {
    return state.userPhone
  },
  getUserPassword: (state) => {
    return state.userPassword
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
