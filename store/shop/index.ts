import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from '../index'
import Shop from '~/models/shop'
import InstagramProfileInfo from '~/models/instagram_profile_info'
import PostPreview from '~/models/post_preview'
import Issue from '~/models/issue_tracker/issue'
import BankCredits from '~/models/bank_credit'
import Post from '~/models/post'
import Shipping from '~/models/shipping/shipping'

const namespace = 'shop'

interface ShopState {
  shops: Shop[]
  currentShop: Shop | null
  currentShopDelivery: Shipping | null
  currentShopPosts: Post[]
  currentShopBankCredits: BankCredits[]
  instagramUsername: string | null
  userIgProfileInfo: InstagramProfileInfo | null
  postsPreviewList: PostPreview[]
  isGettingMediaQuery: Boolean
}

const state = (): ShopState => ({
  shops: [],
  currentShop: null,
  currentShopDelivery: null,
  currentShopPosts: [],
  currentShopBankCredits: [],
  instagramUsername: null,
  userIgProfileInfo: null,
  postsPreviewList: [],
  isGettingMediaQuery: false
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
      if (state.currentShop && state.currentShop.delivery) {
        state.currentShopDelivery = state.currentShop.delivery
      }
    }
  },
  setShops (state, shops) {
    state.shops = shops
  },
  appendShop (state, shop) {
    state.shops.push(shop)
  },
  setCurrentShop (state, shop) {
    state.currentShop = new Shop(shop.id, shop.instagramUsername, shop.email, shop.address, shop.province,
      shop.city, shop.bio, shop.commissionPercent, shop.profilePic, shop.remainingAmount, shop.lastScrape,
      shop.delivery)
    const delivery = shop.delivery
    state.currentShopDelivery = new Shipping(delivery.shop, delivery.sendEverywhere, delivery.hasNationalPost,
      delivery.hasOnlineDelivery, delivery.cityCost, delivery.countryCost, delivery.nationalPost, delivery.onlineDelivery,
      delivery.cityFreeCostFrom, delivery.countryFreeCostFrom)
    localStorage.setItem('CurrentShop', JSON.stringify(state.currentShop))
  },
  setCurrentShopDelivery (state, delivery) {
    state.currentShopDelivery = new Shipping(delivery.shop, delivery.sendEverywhere, delivery.hasNationalPost,
      delivery.hasOnlineDelivery, delivery.cityCost, delivery.countryCost, delivery.nationalPost, delivery.onlineDelivery,
      delivery.cityFreeCostFrom, delivery.countryFreeCostFrom)
  },
  setCurrentShopPosts (state, posts) {
    state.currentShopPosts = posts
  },
  setCurrentShopBankCredits (state, bankCredits) {
    state.currentShopBankCredits = bankCredits
  },
  appendBankCredit (state, bankCredits) {
    state.currentShopBankCredits.push(bankCredits)
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
  removePreviewPost (state, post) {
    if (post.parent) {
      const parentIndex = state.postsPreviewList.findIndex(el => el.id === post.parent)
      const childIndex = state.postsPreviewList[parentIndex].children.findIndex(e => e.id === post.id)
      state.postsPreviewList[parentIndex].children.splice(childIndex, 1)
    } else {
      state.postsPreviewList = state.postsPreviewList.filter(item => item.id !== post.id)
    }
  },
  addPreviewPost (state, post) {
    if (post.parent) {
      const parentIndex = state.postsPreviewList.findIndex(el => el.id === post.parent)
      state.postsPreviewList[parentIndex].children.splice(post.index, 0, post)
      state.postsPreviewList[parentIndex].children.sort(
        function (first, second) { return first.index - second.index }
      )
    } else {
      state.postsPreviewList.splice(post.index, 0, post)
      state.postsPreviewList.sort(
        function (first, second) { return first.index - second.index }
      )
    }
  },
  clearCurrentShopRemainingAmount (state) {
    if (state.currentShop) {
      state.currentShop.remainingAmount = 0
    }
  },
  setIsGettingMediaQuery (state, val: boolean) {
    state.isGettingMediaQuery = val
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

    vuexContext.commit('setInstagramUsername', igUsername)
    return this.$client.post(url, null, { params: queryParams }).then((response) => {
      vuexContext.commit('setUserIgProfileInfo', response.data)
    }).catch((e) => {
      if (e.response.status !== 500) { // 500 means media is not ready
        vuexContext.commit('issue/createNewIssues', null, { root: true })
        const issue = new Issue('saveInstagramMediaQueryFile', JSON.stringify(e.response))
        if (e.response.status === 500 || e.response.status === 503) {
          issue.setCritical()
        }
        vuexContext.commit('issue/addIssue', issue, { root: true })
        vuexContext.dispatch('issue/capture', null, { root: true })
      }
      throw e.response
    })
  },
  async getInstagramMediaQueryFile (vuexContext) {
    const url = process.env.baseURL + 'shop/media-query/'

    vuexContext.commit('setIsGettingMediaQuery', true)

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
        vuexContext.commit('issue/createNewIssues', null, { root: true })
        const issue = new Issue('getInstagramMediaQueryFile', JSON.stringify(e.response))
        if (e.response.status === 500 || e.response.status === 503) {
          issue.setCritical()
        }
        vuexContext.commit('issue/addIssue', issue, { root: true })
        vuexContext.dispatch('issue/capture', null, { root: true })
        throw e.response
      })
    }
    vuexContext.commit('setIsGettingMediaQuery', false)
  },
  removeExtraMediaQuery (vuexContext, payload) {
    const userPk = vuexContext.rootGetters['auth/getUserId']
    const url = process.env.baseURL + 'shop/media-query/'

    const queryParams = {
      instagramUsername: vuexContext.getters.getInstagramUsername
    }

    payload.userId = userPk

    return this.$client.put(url, payload, { params: queryParams }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('removeExtraMediaQuery', JSON.stringify(e.response))
      if (e.response.status === 500 || e.response.status === 503) {
        issue.setCritical()
      }
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
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
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('createShop', JSON.stringify(e.response))
      if (e.response.status === 500 || e.response.status === 503) {
        issue.setCritical()
      }
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
      throw e.response
    })
  },
  createAllPosts (vuexContext) {
    const shopPk = vuexContext.getters.getCurrentShop.id
    const url = process.env.baseURL + `shop/${shopPk}/post/`

    const payload = {
      instagramUsername: vuexContext.getters.getInstagramUsername
    }

    return this.$client.post(url, payload).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('createAllPosts', JSON.stringify(e.response))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
      throw e.response
    })
  },
  currentShopPosts (vuexContext) {
    const shopPk = vuexContext.getters.getCurrentShop.id
    const url = process.env.baseURL + `shop/${shopPk}/post/`

    return this.$client.get(url).then((response) => {
      vuexContext.commit('setCurrentShopPosts', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('currentShopPosts', JSON.stringify(e.response))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
      throw e.response
    })
  },
  currentShopBankCredits (vuexContext) {
    if (!vuexContext.getters.getCurrentShop) {
      return
    }
    const shopPk = vuexContext.getters.getCurrentShop.id
    const url = process.env.baseURL + `shop/${shopPk}/bank-credit/`

    return this.$client.get(url).then((response) => {
      vuexContext.commit('setCurrentShopBankCredits', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('currentShopBankCredits', JSON.stringify(e.response))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  addBankCredit (vuexContext, payload) {
    const shopPk = vuexContext.getters.getCurrentShop.id
    const url = process.env.baseURL + `shop/${shopPk}/bank-credit/`
    payload.shop = shopPk

    return this.$client.post(url, payload).then((response) => {
      vuexContext.commit('appendBankCredit', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('addBankCredit', JSON.stringify(e.response))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  shopRequest (vuexContext, userEmail) {
    const url = process.env.baseURL + 'shop/request/'

    const payload = {
      email: userEmail,
      instagram_username: vuexContext.getters.getInstagramUsername
    }

    return this.$client.post(url, payload).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('shopRequest', JSON.stringify(e.response))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  shopProductsInflation (vuexContext, inflationPercent) {
    const shopPk = vuexContext.getters.getCurrentShop.id
    const url = process.env.baseURL + `shop/${shopPk}/inflation/`

    const payload = {
      percent: inflationPercent
    }

    return this.$client.post(url, payload).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('shopProductsInflation', JSON.stringify(e.response))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  changeShopBio (vuexContext, shopBio) {
    const shopPk = vuexContext.getters.getCurrentShop.id
    const url = process.env.baseURL + `shop/${shopPk}/bio/`

    const payload = {
      bio: shopBio
    }

    return this.$client.put(url, payload).then((response) => {
      vuexContext.commit('setCurrentShop', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('changeShopBio', JSON.stringify(e.response))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  },
  withdraw (vuexContext, shebaNumber) {
    if (!vuexContext.getters.getCurrentShop) {
      return
    }

    const url = process.env.baseURL + 'payment/withdraw/'

    const payload = {
      shop: vuexContext.getters.getCurrentShop.id,
      sheba: shebaNumber
    }

    return this.$client.post(url, payload).then(() => {
      vuexContext.commit('clearCurrentShopRemainingAmount')
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('withdraw', JSON.stringify(e.response))
      issue.setCritical()
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
      throw e.response
    })
  },
  updateShopShipping (vuexContext, payload) {
    if (!vuexContext.getters.getCurrentShop) {
      return
    }
    const shopPk = vuexContext.getters.getCurrentShop.id
    const url = process.env.baseURL + `shop/${shopPk}/shipment/`

    payload.shop = shopPk

    return this.$client.put(url, payload).then((response) => {
      vuexContext.commit('setCurrentShopDelivery', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('updateShopShipping', JSON.stringify(e.response))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
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
  getCurrentShopInstagramUsername: (state) => {
    return state.currentShop?.instagramUsername
  },
  getCurrentShopPosts: (state) : Post[] => {
    return state.currentShopPosts
  },
  getCurrentShopBankCredits: (state) : BankCredits[] => {
    return state.currentShopBankCredits
  },
  getCurrentShopDelivery: (state) : Shipping | null => {
    return state.currentShopDelivery
  },
  getPostsPreviewList: (state) => {
    return state.postsPreviewList
  },
  getPostsCount: (state) => {
    if (state.userIgProfileInfo) {
      return state.userIgProfileInfo.postsCount
    }
    return 0
  },
  getShopLink (state) {
    if (state.currentShop) {
      return `https://magista.ir/shop/${state.currentShop.instagramUsername}`
    }
  },
  getCurrentShopLastScrape (state) {
    if (state.currentShop) {
      return state.currentShop.lastScrape
    }
  },
  getIsGettingMediaQuery (state) {
    return state.isGettingMediaQuery
  }
}

export default {
  namespace,
  state,
  mutations,
  getters,
  actions
}
