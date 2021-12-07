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
      :key="item.title"
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
