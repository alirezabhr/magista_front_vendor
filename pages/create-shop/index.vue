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
          :is-getting-posts="isGettingQueryMedia"
          @submit="removeExtraPostsAndCreateProducts"
        />
        <ShopRequestForm
          v-else-if="creationStep === 'shop request'"
          :is-submitting-form="isSubmitting"
          :request-sent="requestSent"
          @submit="requestForShop"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ShopRequestForm from '@/components/create_shop/ShopRequestForm.vue'
import InstagramIdForm from '@/components/create_shop/InstagramIdForm.vue'
import ShopDataForm from '@/components/create_shop/ShopDataForm.vue'
import ShopPreview from '@/components/create_shop/ShopPreview.vue'

export default {
  name: 'CreateShopPage',
  components: {
    ShopRequestForm,
    InstagramIdForm,
    ShopDataForm,
    ShopPreview
  },
  data () {
    return {
      requestSent: false,
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
      'createShop', 'removeExtraMediaQuery', 'createAllPosts', 'shopRequest']),

    saveMediaQuery (igUsername) {
      this.isSubmitting = true
      const instagramUsername = igUsername.toLowerCase() // make it lower to find correct media directory in backend

      this.saveInstagramMediaQueryFile(instagramUsername).then(() => {
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
        } else if (response.status === 400 && response.data.error) {
          this.snackbarMessage = response.data.error[0]
          this.showSnackbar = true
        } else if (response.status === 500) { // if media is not ready
          this.creationStep = 'shop request'
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
        this.snackbarMessage = 'خطا در فرآیند ساخت فروشگاه. در صورت امکان به پشتیبانی اطلاع دهید.'
        this.showSnackbar = true
      })
    },

    async removeExtraPostsAndCreateProducts (removedPostList) {
      this.isSubmitting = true

      if (this.isGettingQueryMedia) {
        this.isSubmitting = false
        this.snackbarMessage = 'در حال دریافت محتوای ایسنتاگرام. لطفا کمی صبر کنید.'
        this.showSnackbar = true
        return
      }

      await this.removeExtraMediaQuery({
        extra_posts: removedPostList
      }).then(() => {
        this.createShopPosts()
      }).catch(() => {
        this.isSubmitting = false
        this.snackbarMessage = 'ساخت فروشگاه با مشکل مواجه شده :('
        this.showSnackbar = true
      })
    },
    createShopPosts () {
      this.createAllPosts().then(() => {
        this.isSubmitting = false
        this.$router.push('/dashboard')
      }).catch(() => {
        this.isSubmitting = false
        this.snackbarMessage = 'خطا در ذخیره اطلاعات. لطفا کمی بعد تلاش کنید.'
        this.showSnackbar = true
      })
    },
    requestForShop () {
      this.isSubmitting = true
      this.shopRequest().then(() => {
        this.isSubmitting = false
        this.snackbarMessage = 'درخواست شما با موفقیت ثبت شد.'
        this.showSnackbar = true
        this.requestSent = true
      })
    }
  }
}
</script>
