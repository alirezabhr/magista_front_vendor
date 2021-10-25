<template>
  <v-card>
    <v-card-title>
      <v-alert
        dense
        outlined
        type="error"
      >
        محصولاتی که مایل به نمایش آنها <strong>نیستید</strong> را حذف کنید.
      </v-alert>
    </v-card-title>
    <v-divider class="mx-5 pb-5" />

    <v-row no-gutters dir="ltr">
      <v-col
        v-for="post in postsList"
        :key="post.id"
        cols="4"
      >
        <v-card>
          <v-img
            contain
            aspect-ratio="1"
            :src="post.thumbnail_src"
            style="border-style: solid; border-width: 0.5px; border-color: grey;"
          >
            <template #placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="grey lighten-2"
                />
              </v-row>
            </template>
          </v-img>
          <v-card-title class="pa-0">
            <v-btn
              dark
              small
              fab
              top
              right
              absolute
              color="red"
              style="right: 4px; top: 4px;"
              @click.prevent="removeItem(post)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'ShopPreview',
  props: {
    postsList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      removedPostList: []
    }
  }
}
</script>
