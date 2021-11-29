import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from '../index'
import Issue from '~/models/issue_tracker/issue'

const namespace = 'issue tracker'

interface IssueState {
  issues: Issue[]
}

const state = (): IssueState => ({
  issues: []
})

const mutations = <MutationTree<IssueState>>{
  createNewIssues (state) {
    state.issues = []
  },
  addIssue (state, issue: Issue) {
    state.issues.push(issue)
  }
}

const actions = <ActionTree<IssueState, RootState>>{
  capture (vuexContext) {
    const url = process.env.baseURL + 'logger/'
    const payload = vuexContext.getters.getIssues

    return this.$client.post(url, payload).then(() => {}).catch(() => {})
  }
}

const getters = <GetterTree<IssueState, RootState>>{
  getIssues: (state) : Issue[] => {
    return state.issues
  }
}

export default {
  namespace,
  state,
  mutations,
  getters,
  actions
}
