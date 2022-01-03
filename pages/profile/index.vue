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
          کیف پول
        </v-row>
      </v-card-title>
      <v-card-text class="py-1">
        موجودی قابل برداشت: <span v-if="getCurrentShop">{{ getCurrentShop.remainingAmount }} تومان</span>
      </v-card-text>
      <v-card-actions>
        <v-col cols="6" class="pa-0 mx-auto">
          <v-btn width="100%" class="yellow darken-1 white--text font-weight-bold" @click.prevent="$router.push('/profile/withdraw')">
            تسویه
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
    <v-row no-gutters>
      <v-btn class="mx-auto font-weight-bold text-body-1" outlined color="red" text @click.prevent="userLogout">خروج</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProfilePage',
  layout: 'panel',
  computed: {
    ...mapGetters('shop', ['getCurrentShop'])
  },
  methods: {
    ...mapActions('auth', ['userLogout'])
  }
}
</script>
