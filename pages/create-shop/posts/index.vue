<template>
  <div>
    <v-snackbar
      v-model="showSnackbar"
      color="grey darken-3"
    >
      {{ snackbarMessage }}
    </v-snackbar>
    <v-row justify="center" no-gutters>
      <v-col col="10" sm="6" md="5" lg="4">
        <v-card min-height="670">
          <v-card-title>
            <v-alert
              dense
              outlined
              type="error"
            >
              محصولاتی که مایل به نمایش آنها <strong>نیستید</strong> را حذف کنید.
            </v-alert>
          </v-card-title>
          <v-row v-if="isGettingPosts" class="px-4" no-gutters>
            <v-progress-linear
              indeterminate
              color="cyan"
              rounded
            />
          </v-row>
          <PostsPreviewList
            :is-submitting="isSubmitting"
            :posts-list="getPostsPreviewList"
            :posts-count="getPostsCount"
            :is-getting-posts="getIsGettingMediaQuery"
            @removePreviewPost="removePreviewPost"
            @addPreviewPost="addPreviewPost"
            @submit="removeExtraPostsAndCreateProducts"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

import PostsPreviewList from '@/components/create_shop/PostsPreviewList'

export default {
  name: 'CreateShopPostsPage',
  components: {
    PostsPreviewList
  },
  data () {
    return {
      isGettingPosts: false,
      isSubmitting: false,
      showSnackbar: false,
      snackbarMessage: ''
    }
  },
  computed: {
    ...mapGetters('shop', ['getPostsPreviewList', 'getPostsCount', 'getIsGettingMediaQuery'])
  },
  methods: {
    ...mapMutations('shop', ['removePreviewPost', 'addPreviewPost']),
    ...mapActions('shop', ['removeExtraMediaQuery', 'createAllPosts']),

    async removeExtraPostsAndCreateProducts (removedPostList) {
      this.isSubmitting = true

      if (this.getIsGettingMediaQuery) {
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
        this.$router.push('/dashboard')
        this.isSubmitting = false
      }).catch(() => {
        this.isSubmitting = false
        this.snackbarMessage = 'خطا در ذخیره اطلاعات. لطفا کمی بعد تلاش کنید.'
        this.showSnackbar = true
      })
    }
  }
}
</script>
