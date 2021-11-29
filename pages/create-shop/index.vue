<template>
  <v-container class="pa-0">
    <v-snackbar
      v-model="showSnackbar"
      color="grey darken-3"
    >
      {{ snackbarMessage }}
    </v-snackbar>
    <v-row justify="center">
      <v-col col="10" sm="6" md="5" lg="4">
        <InstagramIdForm
          v-if="creationStep === 'instagram username'"
          :is-submitting-ig-id="isSubmitting"
          @submitForm="saveMediaQuery"
        />
        <ShopDataForm
          v-else-if="creationStep === 'shop form'"
          :is-submitting-form="isSubmitting"
          @submit="submitShopForm"
        />
        <ShopPreview
          v-else-if="creationStep === 'shop preview'"
          :posts-list="getPostsPreviewList"
          :is-submitting="isSubmitting"
          :posts-count="getPostsCount"
          @removeItem="removePost"
          @addItem="addPosts"
          @submit="removeExtraPostsAndCreateProducts"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import InstagramIdForm from '@/components/create_shop/InstagramIdForm.vue'
import ShopDataForm from '@/components/create_shop/ShopDataForm.vue'
import ShopPreview from '@/components/create_shop/ShopPreview.vue'

export default {
  name: 'CreateShopPage',
  components: {
    InstagramIdForm,
    ShopDataForm,
    ShopPreview
  },
  data () {
    return {
      showSnackbar: false,
      snackbarMessage: '',
      creationStep: 'instagram username',
      isSubmitting: false,
      isGettingQueryMedia: false
    }
  },
  computed: {
    ...mapGetters('shop', ['getPostsPreviewList', 'getPostsCount'])
  },
  methods: {
    ...mapActions('shop', ['saveInstagramMediaQueryFile', 'getInstagramMediaQueryFile',
      'createShop', 'removeExtraMediaQuery', 'createAllProducts']),
    ...mapMutations('shop', ['removePost', 'addPosts']),

    saveMediaQuery (igUsername) {
      this.isSubmitting = true

      this.saveInstagramMediaQueryFile(igUsername).then(() => {
        this.isSubmitting = false
        this.creationStep = 'shop form'
        this.retrieveInstagramMedia()
      }).catch((response) => {
        this.isSubmitting = false
        if (response.status === 404) {
          this.snackbarMessage = 'صفحه مورد نظر یافت نشد.'
          this.showSnackbar = true
        } else if (response.status === 451) {
          this.snackbarMessage = 'پیج مورد نظر پرایوت است.'
          this.showSnackbar = true
        }
      })
    },

    retrieveInstagramMedia () {
      this.isGettingQueryMedia = true

      this.getInstagramMediaQueryFile().then(() => {
        this.isGettingQueryMedia = false
      }).catch(() => {
        this.isGettingQueryMedia = false
        this.snackbarMessage = 'خطا در دریافت محتوای اینستاگرام'
        this.showSnackbar = true
      })
    },

    submitShopForm (shopData) {
      this.isSubmitting = true

      this.createShop(shopData).then(() => {
        this.isSubmitting = false
        this.creationStep = 'shop preview'
      }).catch(() => {
        this.isSubmitting = false
        this.snackbarMessage = 'خطا در فرآیند ساخت فروشگاه. در صورت امکان به پشتیبانی اصطلاع دهید.'
        this.showSnackbar = true
      })
    },

    async removeExtraPostsAndCreateProducts (removedPostList) {
      this.isSubmitting = true
      let didRemoveExtraPosts = false

      if (this.isGettingQueryMedia) {
        this.isSubmitting = false
        this.snackbarMessage = 'در حال دریافت محتوای ایسنتاگرام. لطفا کمی صبر کنید.'
        this.showSnackbar = true
        return
      }

      await this.removeExtraMediaQuery({
        extra_posts: removedPostList
      }).then(() => {
        didRemoveExtraPosts = true
      }).catch(() => {
        this.isSubmitting = false
        didRemoveExtraPosts = false
        this.snackbarMessage = 'در حال دریافت محتوای ایسنتاگرام. لطفا کمی صبر کنید.'
        this.showSnackbar = true
      })

      if (!didRemoveExtraPosts) {
        return
      }

      this.createAllProducts().then(() => {
        this.isSubmitting = false
        this.$router.push('dashboard')
      }).catch(() => {
        this.isSubmitting = false
        this.snackbarMessage = 'خطا در ذخیره اطلاعات. لطفا کمی بعد تلاش کنید.'
        this.showSnackbar = true
      })
    }
  }
}
</script>
