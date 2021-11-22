import { Plugin } from '@nuxt/types'

const initialStores: Plugin = (context) => {
  context.store.commit('auth/initialAuthStore')
  context.store.commit('shop/initialShopStore')
}

export default initialStores
