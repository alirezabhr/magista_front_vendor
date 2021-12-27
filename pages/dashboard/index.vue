<template>
  <div v-if="isLoadingPage" style="height: 100%;">
    <v-row class="fill-height" align="center" justify="center" no-gutters>
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-row>
  </div>
  <div v-else>
    <v-col v-if="getShops.length === 0" cols="12">
      <v-row class="pa-10 text-h5 font-weight-bold grey--text" justify="center">
        هیچ فروشگاهی ندارید!
      </v-row>
      <v-row justify="center">
        <v-img
          contain
          max-height="250"
          max-width="250"
          :src="getEmptyStateImage"
        />
      </v-row>
      <v-row class="pa-10 text-h5 font-weight-bold grey--text" justify="center">
        <v-btn
          class="primary font-weight-bold py-5"
          @click.prevent="$router.push('/create-shop')"
        >
          ساخت فروشگاه جدید
        </v-btn>
      </v-row>
    </v-col>
    <v-col v-else cols="12" class="ma-0 px-0 pt-0 pb-10">
      <v-snackbar
        v-model="showSnackbar"
        color="grey darken-3"
      >
        {{ snackbarMessage }}
      </v-snackbar>
      <v-row class="pa-5" no-gutters>
        <v-row no-gutters>
          <v-col>
            <v-btn @click.prevent="copyShopLink">
              <v-icon class="pl-1">mdi-content-copy</v-icon>
              لینک فروشگاه
            </v-btn>
            <v-row no-gutters class="pt-2">
              موجودی: {{ getCurrentShop.wallet }} تومان
            </v-row>
          </v-col>
          <v-spacer />
          <v-avatar
            color="primary"
            size="75"
            style="border-style: solid; border-width: 1px;"
          >
            <v-img :src="profileImageFullUrl" />
          </v-avatar>
        </v-row>
      </v-row>
      <v-row no-gutters class="ma-0 pa-0 mt-5" dir="ltr">
        <v-col v-for="p in getCurrentShopPosts" :key="p.id" cols="4" class="ma-0 pa-0">
          <PostPreview :post="p" />
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PostPreview from '~/components/PostPreview.vue'

export default {
  name: 'DashboardPage',
  components: {
    PostPreview
  },
  layout: 'panel',
  data () {
    return {
      isLoadingPage: false,
      showSnackbar: false,
      snackbarMessage: ''
    }
  },
  computed: {
    ...mapGetters('shop', ['getShops', 'getCurrentShopPosts', 'getCurrentShop', 'getShopLink']),

    getEmptyStateImage () {
      return require('~/assets/images/empty_state.png')
    },
    profileImageFullUrl () {
      return process.env.baseURL + this.getCurrentShop.profileImageUrl
    }
  },
  async mounted () {
    this.isLoadingPage = true
    await this.getUserShops()
    if (this.getShops.length > 0) {
      await this.currentShopPosts()
    }
    this.isLoadingPage = false
  },
  methods: {
    ...mapActions('shop', ['getVendorShops', 'currentShopPosts']),

    async getUserShops () {
      await this.getVendorShops().catch((response) => {
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    },
    copyShopLink () {
      navigator.clipboard.writeText(this.getShopLink)

      this.snackbarMessage = 'لینک فروشگاه کپی شد.'
      this.showSnackbar = true
    }
  }
}
</script>
