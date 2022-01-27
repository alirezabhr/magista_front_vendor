<template>
  <v-col>
    <v-row align="center" justify="center" no-gutters>
      <v-img
        contain
        max-height="250"
        max-width="250"
        :src="require('~/assets/images/under_constructor.png')"
      />
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: 'ChatsPage',
  layout: 'panel'
}
</script>
