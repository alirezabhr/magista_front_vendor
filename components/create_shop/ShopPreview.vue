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
    <v-divider class="mx-5 pb-10" />
    <v-row no-gutters>
      <v-col
        v-for="post in postsList"
        :key="post.id"
        cols="4"
        class=""
      >
        <v-row justify="center" class="ma-0">
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
        </v-row>
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
  }

}
</script>
