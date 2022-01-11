<template>
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
      :posts-list="postsList"
      :posts-count="postsCount"
      :is-getting-posts="isGettingPosts"
      @removePreviewPost="removePreviewPost"
      @addPreviewPost="addPreviewPost"
      @submit="$emit('submit')"
    />
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex'

import PostsPreviewList from '@/components/create_shop/PostsPreviewList'

export default {
  name: 'ShopPreview',
  components: {
    PostsPreviewList
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
  methods: {
    ...mapMutations('shop', ['removePreviewPost', 'addPreviewPost'])
  }
}
</script>
