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
      <v-row class="pa-10 text-h5 font-weight-bold grey--text" justify="center" no-gutters>
        هیچ فروشگاهی ندارید!
      </v-row>
      <v-row justify="center" no-gutters>
        <v-img
          contain
          max-height="250"
          max-width="250"
          :src="getEmptyStateImage"
        />
      </v-row>
      <v-row class="pa-10 text-h5 font-weight-bold grey--text" justify="center" no-gutters>
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
            <v-menu>
              <template #activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="option in shopOptions"
                  :key="option.title"
                  ripple
                  @click.prevent="option.onClick"
                >
                  <v-list-item-icon>
                    <v-icon>{{ option.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ option.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-row class="pt-2" no-gutters>
              موجودی: {{ getCurrentShop.remainingAmount }} تومان
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
      <v-row class="ma-0 pa-0 mt-5" dir="ltr" no-gutters>
        <v-col
          v-for="p in getCurrentShopPosts"
          :key="p.id"
          cols="4"
          class="ma-0 pa-0"
          style="border-style: solid; border-width: 1px; border-color: white;"
        >
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
      drawer: false,
      shopOptions: [
        { title: 'لینک فروشگاه', icon: 'mdi-content-copy', onClick: this.copyShopLink },
        { title: 'پست جدید', icon: 'mdi-image-multiple-outline', onClick: this.routeToGetNewPosts },
        { title: 'تخفیف سراسری', icon: 'mdi-percent', onClick: this.doNothing },
        { title: 'افزایش قیمت کلی', icon: 'mdi-trending-up', onClick: this.doNothing }
      ],
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
    },
    routeToGetNewPosts () {
      this.$router.push('/dashboard/new-posts/')
    },
    doNothing () {
    }
  }
}
</script>
