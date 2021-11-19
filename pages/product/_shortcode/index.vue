<template>
  <v-progress-circular indeterminate size="64" v-if="!getProduct" />
  <v-col v-else class="pa-0 mx-auto" cols="12" sm="8" md="7" lg="6">
    <v-card>
        <v-row dir="ltr" no-gutters class="px-2 py-1 white" align="center">
            <v-avatar color="primary" style="border-style: solid;">
                <img
                    :src="getProfilePhotoUrl"
                    :alt="`${getCurrentShop.instagramUsername} profile`"
                >
            </v-avatar>
            <div class="pl-3">{{ getCurrentShop.instagramUsername }}</div>
            <v-spacer />
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon @click.prevent="" v-bind="attrs" v-on="on">
                        <v-icon color="grey darken-2">mdi-menu</v-icon>            
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                    >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-row>
        <v-img :src="productImageUrl" :aspect-ratio="1"/>
        <v-col class="pa-3" no-gutters>
            <v-row no-gutters align="center">
                <v-rating
                    v-model="getProduct.rate"
                    background-color="yellow accent-4"
                    color="yellow accent-4"
                    readonly
                    half-increments
                    dense
                    size="24"
                ></v-rating>
                <div class="grey-text text-darken-1 font-weight-light px-2">
                    <div v-if="getProduct.rate">
                        ({{ getProduct.rate }})
                    </div>
                    <div v-else>
                        بدون نظر
                    </div>
                </div>
            </v-row>
            <v-row no-gutters class="pb-2">
                <div v-if="getProduct.originalPrice">
                    قیمت: {{ getProduct.originalPrice }}تومان
                </div>
                <div v-else>
                    بدون قیمت
                </div>
            </v-row>
            <v-divider class="pa-1" />
            <v-row class="font-weight-bold" no-gutters>
                {{ getProduct.title }}
            </v-row>
            <v-row class="font-weight-light" no-gutters>
                {{ getProduct.description }}
            </v-row>
        </v-col>
    </v-card>
  </v-col>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ProductShortcodePage',
  async asyncData ({ params, store, error }) {
    await store.dispatch('product/productDetail', params.shortcode)
      .catch((response) => {
        if (response.status === 404) {
          error({ statusCode: 404, message: 'product not found' })
        } else {
          error({ statusCode: 500, message: 'Oops! An error occured.' })
        }
      })
  },
  data () {
    return {
        items: [
            { title: 'Click Me' },
            { title: 'Click Me' },
            { title: 'Click Me' },
            { title: 'Click Me 2' },
        ],
    }
  },
  methods: {
    ...mapActions('product', ['editProduct'])
  },
  computed: {
    ...mapGetters('shop', ['getCurrentShop']),
    ...mapGetters('product', ['getProduct']),

    getProfilePhotoUrl() {
      return process.env.baseURL + this.getCurrentShop.profileImageUrl
    },
    productImageUrl () {
      return process.env.baseURL + this.getProduct.displayImage
    }
  }
}
</script>
