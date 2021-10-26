<template>
  <v-container class="pa-0">
    <v-snackbar
      v-model="showSnackbar"
      color="grey darken-3"
    >
      {{ snackbarMessage }}
    </v-snackbar>
    <v-row justify="center">
      <v-col col="10" sm="6" md="4">
        <InstagramIdForm
          v-if="creationStep === 'instagram username'"
          :is-submitting-ig-id="isSubmitting"
          @submitForm="saveMediaQuery"
        />
        <ShopDataForm
          v-else-if="creationStep === 'shop form'"
          @submit="submitShopForm"
        />
        <ShopPreview
          v-else-if="creationStep === 'shop preview'"
          :posts-list="postsPreviewList"
          @removeItem="removePost"
          @addItem="addPosts"
          @submit="submitPreviewPosts"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

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
      // creationStep: 'instagram username',
      creationStep: 'shop preview',
      isSubmitting: false,
      isGettingQueryMedia: false,
      postsPreviewList: []
    }
  },
  methods: {
    ...mapActions('shop', ['saveInstagramMediaQueryFile', 'getInstagramMediaQueryFile',
      'createShop', 'removeExtraMediaQuery']),

    removePost (post) {
      this.postsPreviewList = this.postsPreviewList.filter(item => item !== post)
    },
    addPosts (post) {
      this.postsPreviewList.splice(post.index, 0, post)
      this.postsPreviewList.sort(
        function (first, second) { return first.index - second.index }
      )
    },

    saveMediaQuery (igUsername) {
      console.log('in saveMediaQuery')
      this.isSubmitting = true

      this.saveInstagramMediaQueryFile(igUsername).then(() => {
        console.log('then in saveInstagramMediaQuery')
        this.isSubmitting = false
        this.creationStep = 'shop form'
        this.retrieveInstagramMedia()
      }).catch((response) => {
        console.log('catch in saveInstagramMediaQuery')
        this.isSubmitting = false
        if (response.status === 404 || response.status === 400) {
          this.snackbarMessage = response.data.error[0]
        } else {
          this.snackbarMessage = 'خطا در دریافت اطلاعات اینستاگرام'
          console.log(response)
        }
        this.showSnackbar = true
      })
    },

    retrieveInstagramMedia () {
      this.isGettingQueryMedia = true

      this.getInstagramMediaQueryFile().then((response) => {
        console.log('then in retrirveInstagramMedia')
        this.isGettingQueryMedia = false
        this.postsPreviewList = response
      }).catch((response) => {
        console.log('catch in retrirveInstagramMedia')
        console.log(response.data)
        this.isGettingQueryMedia = false
        this.snackbarMessage = 'خطا در دریافت محتوای اینستاگرام'
        this.showSnackbar = true
      })
    },

    submitShopData (shopData) {
      this.isSubmitting = true

      if (this.postsPreviewList.length === 0) {
        this.retrieveInstagramMedia()
        this.isSubmitting = false
        this.snackbarMessage = 'در حال دریافت محتوای ایسنتاگرام. لطفا کمی بعد تلاش کنید.'
        this.showSnackbar = true
        return
      }

      this.createShop(shopData).then(() => {
        console.log('then in submit shop data')
        this.isSubmitting = false
        this.creationStep = 'shop preview'
      }).catch((response) => {
        this.isSubmitting = false
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    },

    submitPreviewPosts (removedPostList) {
      console.log('')
    }
  }
}
</script>
