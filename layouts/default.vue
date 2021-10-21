<template>
  <v-app>
    <v-main class="background">
      <v-container py-0 py-md-5>
        <v-row class="pt-3 pt-md-5">
          <v-card class="hidden-sm-and-down" width="256">
            <v-navigation-drawer class="surface accent-4" permanent>
              <v-list-item class="primary" dark>
                <v-list-item-content>
                  <v-list-item-title class="text-h5 my-3">
                    مغازه
                  </v-list-item-title>
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
                <v-btn block class="primaryVariant2"> خروج از حساب </v-btn>
              </div>
            </v-navigation-drawer>
          </v-card>

          <v-col sm="9" md="6" class="surface rounded-lg my-0 pa-0 mx-auto mx-md-10">
            <v-container>
              <Nuxt />
            </v-container>
            <v-bottom-navigation
              color="primary"
              grow
              fixed
              class="hidden-md-and-up"
              height="50px"
            >
              <v-btn v-for="item in items" :key="item" :to="item.navigation" height="50px">
                <span>{{ item.title }}</span>

                <v-icon>{{ item.icon }}</v-icon>
              </v-btn>
            </v-bottom-navigation>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      value: 1,
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
