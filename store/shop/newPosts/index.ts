import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from '../../index'
import PostPreview from '~/models/post_preview'
import Issue from '~/models/issue_tracker/issue'

const namespace = 'shop_new_posts'

interface ShopState {
  postsPreviewList: PostPreview[]
}

const state = (): ShopState => ({
  postsPreviewList: []
})

const mutations = <MutationTree<ShopState>>{
  clearPostsPreviewList (state) {
    state.postsPreviewList = []
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
  }
}

const actions = <ActionTree<ShopState, RootState>>{
  saveNewMediaQueryFile (vuexContext) {
    const url = process.env.baseURL + 'shop/media-query/new-posts/'

    const igUsername = vuexContext.rootGetters['shop/getCurrentShopInstagramUsername']
    const queryParams = {
      instagramUsername: igUsername
    }

    return this.$client.post(url, null, { params: queryParams }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('saveNewMediaQueryFile', JSON.stringify(e.response))
      if (e.response.status === 500 || e.response.status === 503) {
        issue.setCritical()
      }
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
      throw e.response
    })
  },
  async getNewMediaQueryFile (vuexContext) {
    const url = process.env.baseURL + 'shop/media-query/new-posts/'

    let hasNext = true
    let pageNo = 1
    while (hasNext) {
      const queryParams = {
        instagramUsername: vuexContext.rootGetters['shop/getCurrentShopInstagramUsername'],
        page: pageNo
      }
      pageNo = pageNo + 1

      await this.$client.get(url, { params: queryParams }).then((response) => {
        vuexContext.commit('concatToPostPreviewList', response.data.postsData)
        hasNext = response.data.hasNext
      }).catch((e) => {
        vuexContext.commit('issue/createNewIssues', null, { root: true })
        const issue = new Issue('getNewMediaQueryFile', JSON.stringify(e.response))
        if (e.response.status === 500 || e.response.status === 503) {
          issue.setCritical()
        }
        vuexContext.commit('issue/addIssue', issue, { root: true })
        vuexContext.dispatch('issue/capture', null, { root: true })
        throw e.response
      })
    }
  },
  removeNewExtraMediaQuery (vuexContext, payload) {
    const userPk = vuexContext.rootGetters['auth/getUserId']
    const url = process.env.baseURL + 'shop/media-query/new-posts/'

    const queryParams = {
      instagramUsername: vuexContext.rootGetters['shop/getCurrentShopInstagramUsername']
    }

    payload.userId = userPk

    return this.$client.put(url, payload, { params: queryParams }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('removeNewExtraMediaQuery', JSON.stringify(e.response))
      if (e.response.status === 500 || e.response.status === 503) {
        issue.setCritical()
      }
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
      throw e.response
    })
  },
  createNewPosts (vuexContext) {
    const shopPk = vuexContext.rootGetters['shop/getCurrentShop'].id
    const url = process.env.baseURL + `shop/${shopPk}/post/new-posts/`

    const payload = {
      instagramUsername: vuexContext.rootGetters['shop/getCurrentShopInstagramUsername']
    }

    return this.$client.post(url, payload).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('createAllPosts', JSON.stringify(e.response))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
      throw e.response
    })
  }
}

const getters = <GetterTree<ShopState, RootState>>{
  getPostPreviewList: (state) => {
    return state.postsPreviewList
  }
}

export default {
  namespace,
  state,
  mutations,
  getters,
  actions
}
