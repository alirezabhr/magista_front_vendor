import { GetterTree, MutationTree, ActionTree } from "vuex"
import { RootState } from '../index'
import Shop from '~/models/shop'
import InstagramProfileInfo from '~/models/instagram_profile_info'
import PostPreview from "~/models/post_preview"

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

    const url = process.env.baseURL + `shop/${userPk}/`

    return this.$client.get(url).then((response) => {
      vuexContext.commit('setShops', response.data)
      return response.data
    }).catch((e) => {
      throw e.response
    })
  },
  saveInstagramMediaQueryFile(vuexContext, instagramUsername) {
    const url = process.env.baseURL + 'shop/media-query/'

    const queryParams = {
      instagramUsername: instagramUsername
    }

    return this.$client.post(url, null, { params: queryParams }).then((response) => {
      vuexContext.commit('setInstagramUsername', instagramUsername)
      vuexContext.commit('setUserIgProfileInfo', response.data)
    }).catch((e) => {
      throw e.response
    })
  },
  async getInstagramMediaQueryFile(vuexContext) {
    const url = process.env.baseURL + 'shop/media-query/'

    let hasNext = true
    let pageNo = 1
    while (hasNext) {
      const queryParams = {
        instagramUsername: vuexContext.getters.getInstagramUsername,
        page: pageNo
      }
      pageNo = pageNo + 1

      await this.$client.get(url, { params: queryParams }).then((response) => {
        vuexContext.commit('concatToPostPreviewList', response.data.postsData)
        hasNext = response.data.hasNext
      }).catch((e) => {
        throw e.response
      })
    }
  },
  removeExtraMediaQuery(vuexContext, payload) {
    const userPk = vuexContext.rootGetters['auth/getUserId']
    const url = process.env.baseURL + 'shop/media-query/'

    const queryParams = {
      instagramUsername: vuexContext.getters.getInstagramUsername
    }

    payload.userId = userPk

    return this.$client.put(url, payload, { params: queryParams }).catch((e) => {
      throw e.response
    })
  },
  createShop(vuexContext, payload) {
    const userPk = vuexContext.rootGetters['auth/getUserId']

    const url = process.env.baseURL + `shop/${userPk}/`

    payload.vendor = userPk
    payload.instagramUsername = vuexContext.getters.getInstagramUsername
    payload.instagramId = vuexContext.getters.getUserIgProfileInfo.id

    return this.$client.post(url, payload).then((response) => {
      vuexContext.commit('appendShop', response.data)
      vuexContext.commit('setCurrentShop', response.data)
    }).catch((e) => {
      throw e.response
    })
  },
  createAllProducts(vuexContext) {
    const shopPk = vuexContext.getters.getCurrentShop.id
    const url = process.env.baseURL + `shop/${shopPk}/products/`

    const payload = {
      instagramUsername: vuexContext.getters.getInstagramUsername
    }

    return this.$client.post(url, payload).catch((e) => {
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
