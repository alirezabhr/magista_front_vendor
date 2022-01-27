<template>
  <v-row class="fill-height" no-gutters>
    <v-dialog
      v-model="showDialog"
      max-width="600px"
    >
      <ShopDiscountForm
        @close="showDialog = false"
      />
    </v-dialog>
    <v-row v-if="isGettingShopDiscount" align="center" justify="center" no-gutters>
      <v-progress-circular indeterminate size="38" />
    </v-row>
    <v-col v-else class="mx-auto">
      <v-row class="py-3" justify="center" no-gutters>
        <v-btn color="primary" @click.prevent="showDialog = true">
          <div class="yellow--text font-weight-bold">ساخت بُن تخفیف جدید</div>
          <v-icon color="yellow">mdi-plus</v-icon>
        </v-btn>
      </v-row>
      <v-row v-if="getShopDiscounts.length === 0" align="center" justify="center" style="height: 70%" no-gutters>
        <div>تا به حال هیچ بُن تخفیفی صادر نکرده‌اید</div>
      </v-row>
      <div v-else>
        <v-col cols="10" sm="8" md="7" lg="6" class="mx-auto pb-10">
          <div v-for="discount in getShopDiscounts" :key="discount.id">
            <ShopDiscountCard :shop-discount="discount" />
          </div>
        </v-col>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import ShopDiscountForm from '@/components/ShopDiscountForm.vue'
import ShopDiscountCard from '@/components/ShopDiscountCard.vue'

export default {
  name: 'DiscountPage',
  components: {
    ShopDiscountForm,
    ShopDiscountCard
  },
  layout: 'panel',
  data () {
    return {
      showDialog: false
    }
  },
  computed: {
    ...mapGetters('shop/discount', ['isGettingShopDiscount', 'getShopDiscounts'])
  },
  mounted () {
    this.shopDiscounts()
  },
  methods: {
    ...mapActions('shop/discount', ['shopDiscounts'])
  }
}
</script>
