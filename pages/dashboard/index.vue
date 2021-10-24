<template>
  <v-col v-if="!hasShops" cols="12" class="">
    <v-row class="pa-10 text-h5 font-weight-bold grey--text" justify="center">
      هیچ فروشگاهی ندارید!
    </v-row>
    <v-row justify="center">
      <v-img
        contain
        max-height="250"
        max-width="250"
        src="https://picsum.photos/id/11/500/300"
      />
    </v-row>
    <v-row class="pa-10 text-h5 font-weight-bold grey--text" justify="center">
      <v-btn class="primary font-weight-bold py-5" @click.prevent="$router.push('/create-shop')">
        ساخت فروشگاه جدید
      </v-btn>
    </v-row>
  </v-col>
  <v-col v-else cols="12" class="red lighten-4">
    <v-row>
      hello
    </v-row>
    <v-row>
      bye bye
    </v-row>
  </v-col>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'DashboardPage',
  layout: 'panel',
  data () {
    return {
      hasShops: false
    }
  },
  mounted () {
    this.getUserShops()
  },
  methods: {
    ...mapActions('shop', ['getVendorShops', 'createShop']),

    getUserShops () {
      this.getVendorShops().then((shopsList) => {
        if (shopsList.length === 0) {
          console.log('empty list')
          this.hasShops = false
        } else {
          console.log('you have shops')
          this.hasShops = true
          console.log(shopsList)
        }
      }).catch((response) => {
        console.log('catch in getUserShops')
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    }
  }
}
</script>
