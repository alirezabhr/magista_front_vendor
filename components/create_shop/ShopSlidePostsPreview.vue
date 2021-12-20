<template>
  <v-card>
    <v-row no-gutters dir="ltr">
      <v-col v-for="image in images" :key="image.id" cols="4">
        <v-card>
          <v-img
            :aspect-ratio="1"
            :src="imageSource(image.displayImage)"
            style="border-style: solid; border-width: 0.5px; border-color: grey;"
          >
            <v-overlay absolute class="my-overlay" opacity="0.2">
              <v-row align="center" justify="end" class="pa-2" no-gutters>
                <v-btn
                  icon
                  class="red"
                  width="24px"
                  height="24px"
                  @click.prevent="$emit('remove', image)"
                >
                  <v-icon>mdi-close mdi-18px</v-icon>
                </v-btn>
              </v-row>
            </v-overlay>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'ShopSlidePostsPreview',
  props: {
    images: {
      type: Array,
      required: true
    }
  },
  methods: {
    imageSource (src) {
      return `${process.env.baseURL}${src}`
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
