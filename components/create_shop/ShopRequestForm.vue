<template>
  <v-card class="pb-4 ma-6">
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <v-col>
          <div class="text-h6 font-weight-bold">درخواست تایید فروشگاه</div>
        </v-col>
      </v-card-title>

      <v-card-text v-if="!requestSent">
        اطلاعات خود را وارد کنید تا ما پس از بررسی با شما در ارتباط باشیم.
        <div class="font-weight-bold">این فرایند ممکن است تا 24ساعت زمان ببرد.</div>
        <div class="primary--text">
          پیشاپیش از صبر شما متشکریم.
          <v-icon color="red">mdi-heart</v-icon>
        </div>
      </v-card-text>
      <v-card-text v-else>
        <div class="blue--text">
          درخواست شما با موفقیت ثبت شد.
        </div>
        با شما در ارتباط خواهیم بود
      </v-card-text>

      <v-col v-if="!requestSent" class="py-0 px-8">
        <v-text-field
          v-model="email"
          label="ایمیل"
          :rules="emailRules"
          outlined
          dense
          style="direction: ltr"
        />
      </v-col>

      <v-card-actions v-if="!requestSent" class="px-8">
        <v-col>
          <v-btn
            block
            class="primary font-weight-bold py-5"
            :loading="isSubmittingForm"
            type="submit"
          >
            ثبت و ادامه
          </v-btn>
        </v-col>
      </v-card-actions>

      <v-card-actions v-else class="px-8">
        <v-btn
          text
          class="font-weight-bold primary--text mx-auto"
          @click.prevent="$router.push('/dashboard')"
        >
          بازگشت
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'ShopRequestForm',
  props: {
    isSubmittingForm: {
      type: Boolean,
      required: true
    },
    requestSent: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      email: '',
      emailRules: [
        value => !!value || '.ایمیل الزامی می‌باشد',
        value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || '.ایمیل نامعتبر است'
      ]
    }
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        this.$emit('submit', this.email)
      }
    }
  }
}
</script>
