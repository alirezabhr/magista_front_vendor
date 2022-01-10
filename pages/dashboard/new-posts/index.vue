<template>
  <v-card height="100%" class="pa-0 ma-0" flat rounded="0">
    <v-snackbar v-model="showSnackbar" color="grey darken-3">
      {{ snackbarMsg }}
      <v-icon>mdi-emoticon-sad</v-icon>
    </v-snackbar>
    <v-card-title>افزودن پست‌های جدید اینستاگرام</v-card-title>
    <v-card-text v-if="!canScrape">
      در هر 48ساعت فقط یکبار می‌توانید درخواست افزودن پست جدید بدهید.
    </v-card-text>
    <v-card-subtitle v-if="!canScrape" class="text-body-2 red--text">
      <v-col>
        <div>زمان باقی مانده تا مهلت درخواست پست جدید:</div>
        <div>
          {{ allowedScrapeRemainingDays }} روز و
          {{ allowedScrapeRemainingHours }} ساعت و
          {{ allowedScrapeRemainingMinutes }} دقیقه
        </div>
      </v-col>
    </v-card-subtitle>
    <v-card-text v-if="isLoading">
      <v-col class="pa-0">
        <div>در حال آماده‌سازی تصاویر...</div>
        <div>
          این فرآیند ممکن است کمی زمانبر باشد، لطفا صبور باشید
          <v-icon color="red">mdi-heart</v-icon>
        </div>
      </v-col>
    </v-card-text>
    <div v-if="canScrape">
      <PostsPreviewList
        :is-submitting="isSubmitting"
        :posts-list="getPostPreviewList"
        :posts-count="getPostPreviewList.length"
        :is-getting-posts="isLoading"
        @removePreviewPost="removePreviewPost"
        @addPreviewPost="addPreviewPost"
        @submit="submit"
      />
    </div>
  </v-card>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions, mapMutations } from 'vuex'

import PostsPreviewList from '@/components/create_shop/PostsPreviewList'

export default {
  name: 'NewPostsPage',
  components: {
    PostsPreviewList
  },
  layout: 'panel',
  data () {
    return {
      isLoading: false,
      showDialog: false,
      selectedParentPost: null,
      removedPostStack: [],
      isSubmitting: false,
      snackbarMsg: '',
      showSnackbar: false
    }
  },
  computed: {
    ...mapGetters('shop', ['getCurrentShopLastScrape']),
    ...mapGetters('shop/newPosts', ['getPostPreviewList']),

    canScrape () {
      return this.allowedScrapeRemainingDateTime < 0
    },
    allowedScrapeRemainingDateTime () {
      if (this.getCurrentShopLastScrape) {
        const now = moment()
        const lastScrapeDateTime = moment(this.getCurrentShopLastScrape)
        return lastScrapeDateTime.add(2, 'days').diff(now)
      }
      return 0
    },
    allowedScrapeRemainingDays () {
      if (!this.canScrape) {
        const now = moment()
        const lastScrapeDateTime = moment(this.getCurrentShopLastScrape)
        return lastScrapeDateTime.add(2, 'days').diff(now, 'days')
      }
      return 0
    },
    allowedScrapeRemainingHours () {
      if (!this.canScrape) {
        const now = moment()
        const lastScrapeDateTime = moment(this.getCurrentShopLastScrape)
        return (
          lastScrapeDateTime.add(2, 'days').diff(now, 'hours') -
          this.allowedScrapeRemainingDays * 24
        )
      }
      return 0
    },
    allowedScrapeRemainingMinutes () {
      if (!this.canScrape) {
        const now = moment()
        const lastScrapeDateTime = moment(this.getCurrentShopLastScrape)
        return (
          lastScrapeDateTime.add(2, 'days').diff(now, 'minutes') -
          this.allowedScrapeRemainingDays * 24 * 60 -
          this.allowedScrapeRemainingHours * 60
        )
      }
      return 0
    }
  },
  watch: {
    showDialog (val) {
      if (val === false) {
        this.selectedParentPost = null
      }
    }
  },
  async mounted () {
    let catched = false
    if (this.canScrape) {
      this.isLoading = true
      this.clearPostsPreviewList()
      await this.saveNewMediaQueryFile()
        .then(() => {
          this.getNewMediaQueryFile()
            .then(() => {
              this.isLoading = false
            })
            .catch(() => {
              this.isLoading = false
              catched = true
            })
        })
        .catch(() => {
          this.isLoading = false
          catched = true
        })
    }
    if (catched) {
      this.snackbarMsg = 'خطا در دریافت پست‌های اینستاگرام!'
      this.showSnackbar = true
    }
  },
  methods: {
    ...mapActions('shop/newPosts', ['saveNewMediaQueryFile', 'getNewMediaQueryFile', 'removeNewExtraMediaQuery', 'createNewPosts']),
    ...mapMutations('shop/newPosts', ['clearPostsPreviewList', 'removePreviewPost', 'addPreviewPost']),

    imageSource (src) {
      return `${process.env.baseURL}${src}`
    },
    imageOnClick (post) {
      if (post.children.length > 0) {
        this.selectedParentPost = post
        this.showDialog = true
      }
    },
    removeItem (post) {
      if (post.parent && this.selectedParentPost.children.length === 1) {
        this.showDialog = false
      }
      this.removedPostStack.push(post)
      this.removePreviewPost(post)
    },
    async submit (removedPosts) {
      let catched = false
      this.isSubmitting = true
      await this.removeNewExtraMediaQuery({ extra_posts: removedPosts }).then(() => {
        this.createNewPosts().then(() => {
          this.$router.push('/dashboard')
        }).catch(() => {
          catched = true
        })
      }).catch(() => {
        catched = true
      })
      if (catched) {
        this.snackbarMsg = 'خطا در ذخیره‌سازی پست‌های جدید!'
        this.showSnackbar = true
      }
      this.isSubmitting = false
    }
  }
}
</script>

<style scoped>
.my-overlay >>> .v-overlay__content {
  width: 100%;
  height: 100%;
}
</style>
