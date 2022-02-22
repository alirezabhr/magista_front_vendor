import { GetterTree, MutationTree, ActionTree } from 'vuex'
import axios from 'axios'
import { RootState } from '../index'
import Issue from '~/models/issue_tracker/issue'

const namespace = 'auth'

interface AuthState {
  userPhone: string
  userToken: string | null
  userId: number
}

const state = () : AuthState => ({
  userPhone: '',
  userToken: null,
  userId: 0
})

const mutations = <MutationTree<AuthState>>{
  initialAuthStore (state) {
    if (!process.client) { // localStorage is only available on client side
      return
    }

    // initial user token
    state.userToken = localStorage.getItem('MagistaToken')

    // initial user id
    const userIdStr = localStorage.getItem('MagistaId')
    if (userIdStr) {
      state.userId = JSON.parse(userIdStr)
    }
  },
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
    localStorage.clear()
    localStorage.removeItem('MagistaToken')
    axios.defaults.headers.common.Authorization = ''
    state.userToken = null
  }
}

const actions = <ActionTree<AuthState, RootState>>{
  checkUserExistence (vuexContext, payload) {
    const url = process.env.baseURL + 'user/'

    return axios.post(
      url,
      payload
    ).then((response) => {
      vuexContext.commit('setUserPhone', payload.phone)
      return response
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('checkUserExistence', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
      throw e.response
    })
  },
  requestOtpCode (vuexContext, payload) {
    const url = process.env.baseURL + 'user/send-otp/'

    return axios.post(
      url,
      payload
    ).then(() => {
      vuexContext.commit('setUserPhone', payload.phone)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('requestOtpCode', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  checkOtpCode (vuexContext, payload) {
    const url = process.env.baseURL + 'user/check-otp/'

    return axios.post(
      url,
      payload
    ).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('checkOtpCode', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
      throw e.response
    })
  },
  userSignup (vuexContext, payload) {
    const url = process.env.baseURL + 'user/signup/'

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
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('userSignup', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
      throw e.response
    })
  },
  userLogin (vuexContext, payload) {
    const url = process.env.baseURL + 'user/login/'

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
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('userLogin', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
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
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('changeUserPassword', JSON.stringify(e.response.data))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
      throw e.response
    })
  },
  userLogout (vuexContext) {
    vuexContext.commit('removeUserToken')
    this.$router.push('/auth')
  }
}

const getters = <GetterTree<AuthState, RootState>>{
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
  namespace,
  state,
  mutations,
  getters,
  actions
}
