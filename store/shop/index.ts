import { GetterTree, MutationTree, ActionTree } from "vuex"
import { RootState } from '../index'
import Shop from '~/models/shop'
import InstagramProfileInfo from '~/models/instagram_profile_info'
import PostPreview from "~/models/post_preview"
import axios from 'axios'

const namespace = 'shop'

interface ShopState {
  shops: Shop[],
  currentShop: Shop | null,
  instagramUsername: string | null,
  userIgProfileInfo: InstagramProfileInfo | null,
  postsPreviewList: PostPreview[]
}

const state = (): ShopState => ({
  shops: [],
  currentShop: null,
  instagramUsername: null,
  userIgProfileInfo: null,
  postsPreviewList: []
})

const mutations = <MutationTree<ShopState>>{
  setShops(state, shops) {
    state.shops = shops
  },
  appendShop(state, shop) {
    state.shops.push(shop)
  },
  setCurrentShop(state, shop) {
    state.currentShop = shop
  },
  setInstagramUsername(state, username) {
    state.instagramUsername = username
  },
  setUserIgProfileInfo(state, profileInfo) {
    state.userIgProfileInfo = profileInfo
  },
  concatToPostPreviewList(state, postsList) {
    state.postsPreviewList = state.postsPreviewList.concat(postsList)
  },
  removePost(state, post) {
    state.postsPreviewList = state.postsPreviewList.filter(item => item !== post)
  },
  addPosts(state, post) {
    state.postsPreviewList.splice(post.index, 0, post)
    state.postsPreviewList.sort(
      function (first, second) { return first.index - second.index }
    )
  }
}

const actions = <ActionTree<ShopState, RootState>>{
  getVendorShops(vuexContext) {
    const userPk = vuexContext.rootGetters['auth/getUserId']
    axios.defaults.headers.common.Authorization = vuexContext.rootGetters['auth/getUserToken']

    const url = process.env.baseURL + `shop/${userPk}/`

    return axios.get(url).then((response) => {
      vuexContext.commit('setShops', response.data)
      return response.data
    }).catch((e) => {
      throw e.response
    })
  },
  saveInstagramMediaQueryFile(vuexContext, instagramUsername) {
    const url = process.env.baseURL + 'shop/media-query/'
    axios.defaults.headers.common.Authorization = vuexContext.rootGetters['auth/getUserToken']

    const queryParams = {
      instagram_username: instagramUsername
    }

    return axios.post(url, null, { params: queryParams }).then((response) => {
      vuexContext.commit('setInstagramUsername', instagramUsername)
      vuexContext.commit('setUserIgProfileInfo', response.data)
    }).catch((e) => {
      throw e.response
    })
  },
  async getInstagramMediaQueryFile(vuexContext) {
    const url = process.env.baseURL + 'shop/media-query/'
    axios.defaults.headers.common.Authorization = vuexContext.rootGetters['auth/getUserToken']

    let hasNext = true
    let pageNo = 1
    while (hasNext) {
      const queryParams = {
        instagram_username: vuexContext.getters.getInstagramUsername,
        page: pageNo
      }
      pageNo = pageNo + 1

      await axios.get(url, { params: queryParams }).then((response) => {
        vuexContext.commit('concatToPostPreviewList', response.data.posts_data)
        hasNext = response.data.has_next
      }).catch((e) => {
        throw e.response
      })
    }
  },
  removeExtraMediaQuery(vuexContext, payload) {
    const userPk = vuexContext.rootGetters['auth/getUserId']
    const url = process.env.baseURL + 'shop/media-query/'
    axios.defaults.headers.common.Authorization = vuexContext.rootGetters['auth/getUserToken']

    const queryParams = {
      instagram_username: vuexContext.getters.getInstagramUsername
    }

    payload.user_id = userPk

    return axios.put(url, payload, { params: queryParams }).catch((e) => {
      throw e.response
    })
  },
  createShop(vuexContext, payload) {
    const userPk = vuexContext.rootGetters['auth/getUserId']
    axios.defaults.headers.common.Authorization = vuexContext.rootGetters['auth/getUserToken']

    const url = process.env.baseURL + `shop/${userPk}/`

    payload.vendor = userPk
    payload.instagram_username = vuexContext.getters.getInstagramUsername
    payload.instagram_id = vuexContext.getters.getUserIgProfileInfo.id

    return axios.post(url, payload).then((response) => {
      vuexContext.commit('appendShop', response.data)
      vuexContext.commit('setCurrentShop', response.data)
    }).catch((e) => {
      throw e.response
    })
  },
  createAllProducts(vuexContext) {
    const shopPk = vuexContext.getters.getCurrentShop.id
    const url = process.env.baseURL + `shop/${shopPk}/products/`
    axios.defaults.headers.common.Authorization = vuexContext.rootGetters['auth/getUserToken']

    const payload = {
      instagram_username: vuexContext.getters.getInstagramUsername
    }

    return axios.post(url, payload).catch((e) => {
      throw e.response
    })
  }
}

const getters = <GetterTree<ShopState, RootState>>{
  getInstagramUsername: (state) => {
    return state.instagramUsername
  },
  getUserIgProfileInfo: (state) => {
    return state.userIgProfileInfo
  },
  getCurrentShop: (state) => {
    return state.currentShop
  },
  getPostsPreviewList: (state) => {
    return state.postsPreviewList
  },
  getPostsCount: (state) => {
    if (state.userIgProfileInfo)
      return state.userIgProfileInfo.postsCount
    return 0
  }
}

export default {
  namespace,
  state,
  mutations,
  getters,
  actions
}
