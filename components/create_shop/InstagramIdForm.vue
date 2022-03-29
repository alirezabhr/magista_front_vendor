<template>
  <v-card class="pb-4 ma-6">
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <v-col>
          <div class="text-h6 font-weight-bold">ساخت فروشگاه</div>
          <div class="text-subtitle-2 font-weight-light pt-2">آیدی اینستاگرام خود را وارد کنید.</div>
        </v-col>
      </v-card-title>

      <v-col class="py-0 px-8">
        <v-text-field
          v-model="instagramId"
          label="آیدی اینستاگرام"
          :rules="igIdRules"
          prefix="@"
          outlined
          dense
          class="py-2"
          style="direction: ltr"
        />
      </v-col>

      <v-card-actions class="px-8">
        <v-col>
          <v-row v-if="isSubmittingIgId" justify="center" class="mb-1 primary--text text-caption" no-gutters>
            در حال بررسی صفحه اینستاگرام...
          </v-row>
          <v-btn
            block
            class="primary font-weight-bold py-5"
            :loading="isSubmittingIgId"
            :disabled="isSubmittingIgId"
            type="submit"
          >
            تایید
          </v-btn>
          <v-row justify="center" no-gutters>
            <v-btn
              text
              :disabled="isSubmittingIgId"
              color="primary"
              class="text-subtitle-2 my-4 px-2"
              @click.prevent="$router.push('/dashboard')"
            >
              بازگشت به پیشخوان
            </v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'InstagramIdForm',
  props: {
    isSubmittingIgId: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      instagramId: '',
      igIdRules: [
        value => !!value || '.آیدی اینستاگرام الزامی می‌باشد',
        value => !value.includes(' ') || '.آیدی اینستاگرام نامعتبر است',
        value => !value.includes('-') || '.آیدی اینستاگرام نامعتبر است'
      ]
    }
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        this.$emit('submitForm', this.instagramId)
      }
    }
  }
}
</script>

<style scoped>
.ltr {
    direction: ltr;
    text-align: left;
    display: inline-block;
}
</style>
