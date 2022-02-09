<template>
  <v-card class="hidden-sm-and-down" width="256">
    <v-navigation-drawer class="surface accent-4" permanent>
      <v-list-item class="primary" dark>
        <v-list-item-content>
          <v-list-item-title class="text-h5 my-3"> مگیستا </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.navigation"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="grey--text text--darken-8">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider class="mx-2" />

      <div class="pa-2">
        <v-btn
          block
          class="primaryVariant2"
          @click.prevent="$emit('logout')"
        >
          خروج از حساب
        </v-btn>
      </div>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  name: 'NavigationDrawer',
  data () {
    return {
      items: [
        {
          title: 'پیشخوان',
          icon: 'mdi-view-dashboard-outline',
          navigation: '/dashboard'
        },
        {
          title: 'سفارشات',
          icon: 'mdi-cart-variant mdi-flip-h',
          navigation: '/orders'
        },
        {
          title: 'آمار',
          icon: 'mdi-chart-bar',
          navigation: '/stats'
        },
        {
          title: 'پیام‌ها',
          icon: 'mdi-message-outline mdi-flip-h',
          navigation: '/chats'
        },
        {
          title: 'پروفایل',
          icon: 'mdi-store-cog-outline',
          navigation: '/profile'
        }
      ]
    }
  }
}
</script>
