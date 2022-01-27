<template>
  <div>
    <v-snackbar
      v-model="showSnackbar"
      color="grey darken-3"
    >
      {{ snackbarMessage }}
    </v-snackbar>
    <v-card
      elevation="6"
      class="my-4 pb-2"
      color="pink lighten-4"
    >
      <v-card-title class="font-weight-bold">
        بُن: {{ shopDiscount.code }}
        <v-icon class="mx-2" @click.prevent="copyShopLink">mdi-content-copy</v-icon>
      </v-card-title>

      <v-card-text class="font-weight-bold text-body-1 py-0">
        <span v-show="!shopDiscount.isActive">غیر</span>فعال
      </v-card-text>
      <v-card-text class="text-body-1 py-0">
        درصد: <strong>%{{ shopDiscount.percent }}</strong>
      </v-card-text>
      <v-card-text class="text-body-1 py-0">
        محدودیت تعداد:
        <span v-if="shopDiscount.count"><strong>{{ shopDiscount.count }} بُن</strong></span>
        <span v-else>ندارد</span>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ShopDiscountCard',
  props: {
    shopDiscount: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showSnackbar: false,
      snackbarMessage: ''
    }
  },
  methods: {
    copyShopLink () {
      navigator.clipboard.writeText(this.shopDiscount.code)

      this.snackbarMessage = 'بُن تخفیف کپی شد.'
      this.showSnackbar = true
    }
  }
}
</script>
