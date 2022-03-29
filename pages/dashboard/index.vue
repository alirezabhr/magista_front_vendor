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
          @click.prevent="$router.push('/create-shop/request')"
        >
          ساخت فروشگاه جدید
        </v-btn>
      </v-row>
    </v-col>
    <v-col v-else cols="12" class="ma-0 px-0 pt-0 pb-10">
      <v-snackbar
        v-model="showSnackbar"
        :color="snackbarColor"
      >
        {{ snackbarMessage }}
      </v-snackbar>
      <v-dialog
        v-model="showDialog"
        max-width="600px"
      >
        <BioForm
          v-if="dialog === 'bio'"
          :is-submitting-form="isSubmittingForm"
          :current-bio="getCurrentShop.bio"
          @submit="submitBioForm"
          @close="showDialog = false"
        />
        <InflationForm
          v-else-if="dialog === 'inflation'"
          :is-submitting-form="isSubmittingForm"
          @submit="submitInflationForm"
          @close="showDialog = false"
        />
      </v-dialog>
      <div class="pa-5">
        <v-row no-gutters>
          <v-col cols="9">
            <v-row no-gutters>
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
              <v-spacer />
              <v-menu offset-y>
                <template #activator="{ on, attrs }">
                  <v-btn
                    text
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ getCurrentShop.instagramUsername }}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="shop in getShops"
                    v-show="shop.instagramUsername !== getCurrentShop.instagramUsername"
                    :key="shop.instagramUsername"
                    @click.prevent="changeShop(shop)"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-row justify="center" no-gutters>
                          {{ shop.instagramUsername }}
                        </v-row>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-row>
          </v-col>
          <v-col cols="3">
            <v-avatar
              color="primary"
              size="75"
              style="border-style: solid; border-width: 1px;"
            >
              <v-img :src="profileImageFullUrl" />
            </v-avatar>
          </v-col>
        </v-row>
        <v-row class="px-4 text-body-2" no-gutters>
          {{ getCurrentShop.bio }}
        </v-row>
      </div>
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
import { mapGetters, mapMutations, mapActions } from 'vuex'

import PostPreview from '~/components/PostPreview.vue'
import InflationForm from '~/components/InflationForm.vue'
import BioForm from '~/components/BioForm.vue'

export default {
  name: 'DashboardPage',
  components: {
    PostPreview,
    InflationForm,
    BioForm
  },
  layout: 'panel',
  data () {
    return {
      drawer: false,
      shopOptions: [
        { title: 'لینک فروشگاه', icon: 'mdi-content-copy', onClick: this.copyShopLink },
        { title: 'پست جدید', icon: 'mdi-image-multiple-outline', onClick: this.routeToGetNewPosts },
        { title: 'تغییر بیو', icon: 'mdi-account-edit-outline', onClick: this.openBioForm },
        { title: 'افزایش قیمت سراسری', icon: 'mdi-trending-up', onClick: this.openInflationForm },
        { title: 'بُن تخفیف', icon: 'mdi-percent', onClick: this.routeToShopDiscountPage }
      ],
      isLoadingPage: false,
      showSnackbar: false,
      snackbarColor: 'grey darken-3',
      snackbarMessage: '',
      showDialog: false,
      dialog: '',
      isSubmittingForm: false
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
    ...mapMutations('shop', ['setCurrentShop']),
    ...mapActions('shop', ['vendorShops', 'currentShopPosts', 'shopProductsInflation', 'changeShopBio']),

    async getUserShops () {
      await this.vendorShops().catch((response) => {
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    },
    changeShop (shop) {
      this.setCurrentShop(shop)
      this.isLoadingPage = true
      this.currentShopPosts().then(() => {
        this.isLoadingPage = false
      }).catch(() => {
        this.isLoadingPage = false
      })
    },
    copyShopLink () {
      navigator.clipboard.writeText(this.getShopLink)

      this.snackbarColor = 'grey darken-3'
      this.snackbarMessage = 'لینک فروشگاه کپی شد.'
      this.showSnackbar = true
    },
    routeToGetNewPosts () {
      this.$router.push('/dashboard/new-posts/')
    },
    routeToShopDiscountPage () {
      this.$router.push('/dashboard/discount/')
    },
    openForm (formName) {
      this.dialog = formName
      this.showDialog = true
    },
    openBioForm () {
      this.openForm('bio')
    },
    openInflationForm () {
      this.openForm('inflation')
    },
    submitBioForm (bio) {
      this.isSubmittingForm = true
      this.changeShopBio(bio).then(() => {
        this.isSubmittingForm = false
        this.showDialog = false
      })
    },
    submitInflationForm (percent) {
      this.isSubmittingForm = true
      this.shopProductsInflation(percent).then(() => {
        this.isSubmittingForm = false
        this.snackbarMessage = 'قیمت تمامی اجناس افزایش یافت.'
        this.snackbarColor = 'green'
        this.showSnackbar = true
        this.showDialog = false
      }).catch(() => {
        this.isSubmittingForm = false
        this.snackbarColor = 'red'
        this.snackbarMessage = 'خطا در افزایش قیمت اجناس.'
        this.showSnackbar = true
        this.showDialog = false
      })
    },
    doNothing () {
    }
  }
}
</script>
