import { GetterTree, MutationTree, ActionTree } from 'vuex'
import moment from 'moment'
import { RootState } from '../index'
import Issue from '~/models/issue_tracker/issue'

const namespace = 'stats'

interface Statistic {
  date: string,
  price: number,
  count: number
}

interface StatState {
  days: number
  stats: Statistic[]
}

const state = (): StatState => ({
  days: 15,
  stats: []
})

const mutations = <MutationTree<StatState>>{
  setStats (state, statistics) {
    const nDaysAgo = moment().add(-state.days, 'days')

    for (let index = 0; index < state.days; index++) {
      nDaysAgo.add(1, 'days')
      state.stats[index] = {
        date: nDaysAgo.format('YYYY-MM-DD'),
        price: 0,
        count: 0
      }
    }

    statistics.forEach((s: any) => {
      const obj = state.stats.find(el => el.date === s.date)
      if (obj) {
        obj.count += s.count
        obj.price += (s.price * s.count)
      }
    })
  }
}

const actions = <ActionTree<StatState, RootState>>{
  shopStats (vuexContext) {
    const currentShop = vuexContext.rootGetters['shop/getCurrentShop']
    if (!currentShop) {
      return
    }
    const shopPk = currentShop.id
    const url = process.env.baseURL + `order/shop/${shopPk}/stats/`
    const queryParams = {
      days: 30
    }

    return this.$client.get(url, { params: queryParams }).then((response) => {
      vuexContext.commit('setStats', response.data)
    }).catch((e) => {
      vuexContext.commit('issue/createNewIssues', null, { root: true })
      const issue = new Issue('shopStats', JSON.stringify(e.response))
      vuexContext.commit('issue/addIssue', issue, { root: true })
      vuexContext.dispatch('issue/capture', null, { root: true })
    })
  }
}

const getters = <GetterTree<StatState, RootState>>{
  getStats: (state) => {
    return state.stats
  },
  getChartLabels: (state) => {
    return Array.from(state.stats, item => item.date)
  },
  getChartPriceData: (state) => {
    return Array.from(state.stats, item => item.price)
  }
}

export default {
  namespace,
  state,
  mutations,
  getters,
  actions
}
