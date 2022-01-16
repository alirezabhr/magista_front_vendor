<template>
  <div>
    <v-dialog
      v-model="showDialog"
      max-width="600px"
    >
      <ShopSlidePostsPreview
        v-if="selectedParentPost"
        :images="selectedParentPost.children"
        @remove="removeItem"
        @imageSrc="imageSource"
      />
    </v-dialog>
    <v-row class="px-2 mb-2" justify="center" no-gutters>
      <v-btn
        icon
        color="grey darken-4"
        :disabled="removedPostStack.length == 0"
        @click.prevent="undo"
      >
        <v-icon>mdi-undo mdi-flip-h</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn
        text
        :loading="isSubmitting"
        @click.prevent="submit"
      >
        ثبت محصولات و ادامه
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </v-row>
    <div class="pa-4">
      <v-divider />
    </div>
    <v-row dir="ltr" no-gutters>
      <v-col
        v-for="post in postsList"
        :key="post.id"
        cols="4"
      >
        <v-card>
          <v-img
            :aspect-ratio="1"
            :src="imageSource(post.displayImage)"
            style="border-style: solid; border-width: 0.5px; border-color: grey;"
            @click.prevent="imageOnClick(post)"
          >
            <template #placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
                no-gutters
              >
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                />
              </v-row>
            </template>
            <v-overlay absolute class="my-overlay" opacity="0.2">
              <v-row align="center" justify="end" class="pa-2" no-gutters>
                <v-btn
                  v-if="post.children.length === 0"
                  icon
                  class="red"
                  width="24px"
                  height="24px"
                  @click.prevent="removeItem(post)"
                >
                  <v-icon>mdi-close mdi-18px</v-icon>
                </v-btn>
                <v-icon v-else>
                  mdi-image-multiple-outline
                </v-icon>
              </v-row>
            </v-overlay>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-show="isGettingPosts" justify="center" no-gutters>
      <v-progress-circular indeterminate />
    </v-row>
  </div>
</template>

<script>
import ShopSlidePostsPreview from '@/components/create_shop/ShopSlidePostsPreview'

export default {
  name: 'PostsPreviewList',
  components: {
    ShopSlidePostsPreview
  },
  props: {
    isSubmitting: {
      type: Boolean,
      required: true
    },
    postsList: {
      type: Array,
      required: true
    },
    postsCount: {
      type: Number,
      required: true
    },
    isGettingPosts: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      showDialog: false,
      selectedParentPost: null,
      removedPostStack: []
    }
  },
  watch: {
    showDialog (val) {
      if (val === false) {
        this.selectedParentPost = null
      }
    }
  },
  methods: {
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
      this.$emit('removePreviewPost', post)
    },
    undo () {
      const removedPost = this.removedPostStack.pop()
      this.$emit('addPreviewPost', removedPost)
    },
    submit () {
      this.$emit('submit', this.removedPostStack)
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
