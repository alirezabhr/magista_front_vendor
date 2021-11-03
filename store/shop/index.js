import axios from 'axios'

const state = () => ({
  shops: [],
  currentShop: null,
  instagramUsername: null,
  userProfileInfo: null,
  postsPreviewList: []
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
  },
  concatToPostPreviewList (state, postsList) {
    state.postsPreviewList = state.postsPreviewList.concat(postsList)
  },
  removePost (state, post) {
    state.postsPreviewList = state.postsPreviewList.filter(item => item !== post)
  },
  addPosts (state, post) {
    state.postsPreviewList.splice(post.index, 0, post)
    state.postsPreviewList.sort(
      function (first, second) { return first.index - second.index }
    )
  }
}

const actions = {
  getVendorShops (vuexContext) {
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
  saveInstagramMediaQueryFile (vuexContext, instagramUsername) {
    const url = process.env.baseURL + 'shop/media-query/'
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
  async getInstagramMediaQueryFile (vuexContext) {
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
  removeExtraMediaQuery (vuexContext, payload) {
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
  createShop (vuexContext, payload) {
    const userPk = vuexContext.rootGetters['auth/getUserId']
    axios.defaults.headers.common.Authorization = vuexContext.rootGetters['auth/getUserToken']

    const url = process.env.baseURL + `shop/${userPk}/`

    payload.vendor = userPk
    payload.instagram_username = vuexContext.getters.getInstagramUsername
    payload.instagram_id = vuexContext.getters.getUserProfileInfo.id

    return axios.post(url, payload).then((response) => {
      vuexContext.commit('appendShop', response.data)
      vuexContext.commit('setCurrentShop', response.data)
    }).catch((e) => {
      throw e.response
    })
  },
  createAllProducts (vuexContext) {
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

const getters = {
  getInstagramUsername: (state) => {
    return state.instagramUsername
  },
  getUserProfileInfo: (state) => {
    return state.userProfileInfo
  },
  getCurrentShop: (state) => {
    return state.currentShop
  },
  getPostsPreviewList: (state) => {
    return state.postsPreviewList
  },
  getPostsCount: (state) => {
    return state.userProfileInfo.posts_count
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
