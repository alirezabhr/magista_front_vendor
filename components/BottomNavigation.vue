<template>
  <v-bottom-navigation
    color="primary"
    grow
    fixed
    class="hidden-md-and-up"
    height="50px"
  >
    <v-btn
      v-for="item in items"
      :key="item"
      :to="item.navigation"
      height="50px"
    >
      <span>{{ item.title }}</span>

      <v-icon>{{ item.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: 'BottomNavigation',
  data () {
    return {
      items: [
        {
          title: 'پیشخوان',
          icon: 'mdi-view-dashboard-outline',
          navigation: '/'
        },
        { title: 'سفارشات', icon: 'mdi-cart-variant', navigation: '/orders' },
        { title: 'آمار', icon: 'mdi-chart-bar', navigation: '/stats' },
        {
          title: 'پیام‌ها',
          icon: 'mdi-message-outline',
          navigation: '/chats'
        },
        {
          title: 'تنظیمات',
          icon: 'mdi-store-cog-outline',
          navigation: '/settings'
        }
      ]
    }
  }
}
</script>
