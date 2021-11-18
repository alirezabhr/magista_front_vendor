import { Plugin } from '@nuxt/types'

const initialStores: Plugin = (context) => {
    context.store.commit('auth/initialAuthStore')
}

export default initialStores