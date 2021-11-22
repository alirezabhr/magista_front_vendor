import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from '../index'
import Shop from '~/models/shop'
import InstagramProfileInfo from '~/models/instagram_profile_info'
import PostPreview from '~/models/post_preview'
import Product from '~/models/product'

const namespace = 'shop'

interface ShopState {
  shops: Shop[]
  currentShop: Shop | null
  currentShopProducts: Product[]
  instagramUsername: string | null
  userIgProfileInfo: InstagramProfileInfo | null
  postsPreviewList: PostPreview[]
}

const state = (): ShopState => ({
  shops: [],
  currentShop: null,
  currentShopProducts: [],
  instagramUsername: null,
  userIgProfileInfo: null,
  postsPreviewList: []
})

const mutations = <MutationTree<ShopState>>{
  initialShopStore (state) {
    if (!process.client) { // localStorage is only available on client side
      return
    }

    // initial current shop
    const strCurrentShop = localStorage.getItem('CurrentShop')
    if (strCurrentShop) {
      state.currentShop = JSON.parse(strCurrentShop)
    }
  },
  setShops (state, shops) {
    shops.forEach((shop: any) => {
      const s = new Shop(shop.id, shop.instagramUsername, shop.province, shop.city, shop.profilePic)
      state.shops.push(s)
    })
  },
  appendShop (state, shop) {
    state.shops.push(shop)
  },
  setCurrentShop (state, shop) {
    state.currentShop = new Shop(shop.id, shop.instagramUsername, shop.province, shop.city, shop.profilePic)
    localStorage.setItem('CurrentShop', JSON.stringify(state.currentShop))
  },
  setCurrentShopProducts (state, products) {
    state.currentShopProducts = products
  },
  setInstagramUsername (state, username) {
    state.instagramUsername = username
  },
  setUserIgProfileInfo (state, profileInfo) {
    state.userIgProfileInfo = profileInfo
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

const actions = <ActionTree<ShopState, RootState>>{
  getVendorShops (vuexContext) {
    const userPk = vuexContext.rootGetters['auth/getUserId']

    const url = process.env.baseURL + `shop/${userPk}/`

    return this.$client.get(url).then((response) => {
      vuexContext.commit('setShops', response.data)
      if (response.data.length > 0) {
        vuexContext.commit('setCurrentShop', response.data[0])
      }
    }).catch((e) => {
      throw e.response
    })
  },
  saveInstagramMediaQueryFile (vuexContext, igUsername) {
    const url = process.env.baseURL + 'shop/media-query/'

    const queryParams = {
      instagramUsername: igUsername
    }

    return this.$client.post(url, null, { params: queryParams }).then((response) => {
      vuexContext.commit('setInstagramUsername', igUsername)
      vuexContext.commit('setUserIgProfileInfo', response.data)
    }).catch((e) => {
      throw e.response
    })
  },
  async getInstagramMediaQueryFile (vuexContext) {
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
  removeExtraMediaQuery (vuexContext, payload) {
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
  createShop (vuexContext, payload) {
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
  createAllProducts (vuexContext) {
    const shopPk = vuexContext.getters.getCurrentShop.id
    const url = process.env.baseURL + `shop/${shopPk}/products/`

    const payload = {
      instagramUsername: vuexContext.getters.getInstagramUsername
    }

    return this.$client.post(url, payload).catch((e) => {
      throw e.response
    })
  },
  currentShopProducts (vuexContext) {
    const shopPk = vuexContext.getters.getCurrentShop.id
    const url = process.env.baseURL + `shop/${shopPk}/products/`

    return this.$client.get(url).then((response) => {
      vuexContext.commit('setCurrentShopProducts', response.data)
    }).catch((e) => {
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
  getShops: (state) => {
    return state.shops
  },
  getCurrentShop: (state) => {
    return state.currentShop
  },
  getCurrentShopProducts: (state) : Product[] => {
    return state.currentShopProducts
  },
  getPostsPreviewList: (state) => {
    return state.postsPreviewList
  },
  getPostsCount: (state) => {
    if (state.userIgProfileInfo) {
      return state.userIgProfileInfo.postsCount
    }
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
