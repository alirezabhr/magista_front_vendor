<template>
  <v-card color="grey lighten-5">
    <v-card-title>
      <div class="text-h6 font-weight-bold">انتخاب روش ارسال</div>
      <v-spacer />
      <v-btn icon @click.prevent="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-col>
      <v-card
        v-for="opt in options"
        :key="opt.option"
        outlined
        rounded="xl"
        :color="selectedOption.title === opt.title ? 'green' : ''"
        :class="selectedOption.title === opt.title ? 'white--text' : ''"
        class="my-2 py-3 px-4"
        @click.prevent="selectedOption = opt"
      >
        {{ opt.title }}
      </v-card>
    </v-col>

    <v-card-actions class="px-8 pb-5">
      <v-col cols="12">
        <v-row justify="center" no-gutters>
          <v-btn
            color="primary"
            class="font-weight-bold py-5"
            :loading="isSubmitting"
            :disabled="selectedOption === '' || isSubmitting"
            @click.prevent="submit"
          >
            تایید
          </v-btn>
        </v-row>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import OrderShippingOptions from '@/models/order_shipping_options'

export default {
  name: 'ChooseShippingOption',
  props: {
    isSubmitting: {
      type: Boolean,
      required: true
    },
    order: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selectedOption: '',
      options: [
        { title: 'شخصا ارسال کردم', option: OrderShippingOptions.PERSONAL_DELIVERY },
        { title: 'با پیک آنلاین ارسال کردم', option: OrderShippingOptions.ONLINE_DELIVERY },
        { title: 'با پیک معمولی ارسال کردم', option: OrderShippingOptions.OFFLINE_DELIVERY },
        { title: 'با پُست ارسال کردم', option: OrderShippingOptions.NATIONAL_POST }
      ]
    }
  },
  methods: {
    submit () {
      this.$emit('submit', this.order, this.selectedOption.option)
    }
  }
}
</script>
