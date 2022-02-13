<template>
  <v-container class="indigo lighten-5" style="height: 100%">
    <v-card class="pb-2 my-2 mx-4">
      <v-card-title class="font-weight-bold text-h5 primary--text pb-3">
        <v-row justify="center" no-gutters>
          اطلاعات فروشگاه
        </v-row>
      </v-card-title>
      <v-card-text class="py-1">
        نام فروشگاه: <span v-if="getCurrentShop">{{ getCurrentShop.instagramUsername }}</span>
      </v-card-text>
      <v-card-text class="py-1">
        آدرس: <span v-if="getCurrentShop">{{ getCurrentShop.province }}-{{ getCurrentShop.city }}،{{ getCurrentShop.address }}</span>
      </v-card-text>
      <v-card-text class="py-1">
        ایمیل: <span v-if="getCurrentShop">{{ getCurrentShop.email }}</span>
      </v-card-text>
    </v-card>
    <v-card class="pb-2 my-4 mx-4">
      <v-card-title class="font-weight-bold text-h5 primary--text pb-3">
        <v-row justify="center" no-gutters>
          روش و هزینه ارسال
        </v-row>
      </v-card-title>
      <v-card-text class="py-1">
        ارسال به:
        <span v-if="getCurrentShopDeliveryDestination" class="font-weight-bold">
          {{ getCurrentShopDeliveryDestination }}
        </span>
      </v-card-text>
      <v-card-text class="py-1">
        روش‌های ارسال:
        <v-col v-if="getCurrentShopDelivery" class="font-weight-bold py-0">
          <div v-if="getCurrentShopDelivery.hasNationalPost">
            <v-icon>mdi-circle-medium</v-icon>
            پست پیشتاز
          </div>
          <div v-if="getCurrentShopDelivery.hasOnlineDelivery">
            <v-icon>mdi-circle-medium</v-icon>
            پیک آنلاین
          </div>
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-col cols="6" class="pa-0 mx-auto">
          <v-btn width="100%" outlined class="red--text font-weight-bold" @click.prevent="$router.push('/profile/shipping')">
            تغییر
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
    <v-card class="pb-2 my-4 mx-4">
      <v-card-title class="font-weight-bold text-h5 primary--text pb-3">
        <v-row justify="center" no-gutters>
          کیف پول
        </v-row>
      </v-card-title>
      <v-card-text class="py-1">
        موجودی قابل برداشت: <span v-if="getCurrentShop">{{ getCurrentShop.remainingAmount }} تومان</span>
      </v-card-text>
      <v-card-actions>
        <v-col cols="6" class="pa-0 mx-auto">
          <v-btn width="100%" dark class="yellow darken-1 font-weight-bold" @click.prevent="$router.push('/profile/withdraw')">
            تسویه
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
    <v-row no-gutters>
      <v-btn
        text
        outlined
        width="80%"
        color="red"
        class="mx-auto font-weight-bold text-body-1"
        @click.prevent="userLogout"
      >
        خروج
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProfilePage',
  layout: 'panel',
  computed: {
    ...mapGetters('shop', ['getCurrentShop', 'getCurrentShopDelivery']),

    getCurrentShopDeliveryDestination () {
      if (this.getCurrentShopDelivery) {
        if (this.getCurrentShopDelivery.sendEverywhere) {
          return 'سراسر ایران'
        } else {
          return this.getCurrentShop.city
        }
      }
      return null
    }
  },
  methods: {
    ...mapActions('auth', ['userLogout'])
  }
}
</script>
