<template>
  <v-card>
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <div class="text-h6 font-weight-bold">تغییر بیو پیچ</div>
        <v-spacer />
        <v-btn icon @click.prevent="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-col class="py-0 px-8">
        <v-textarea
          v-model="bio"
          label="بیو (اختیاری)"
          :rules="bioRules"
          placeholder="درباره فروشگاه خود توضیح بدهید."
          height="80px"
          outlined
          dense
        />
      </v-col>
      <v-card-actions class="px-8 pb-5 pt-4">
        <v-col cols="12">
          <v-row justify="center" no-gutters>
            <v-btn
              block
              class="primary font-weight-bold py-5"
              :loading="isSubmittingForm"
              type="submit"
            >
              ثبت
            </v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'InflationForm',
  props: {
    currentBio: {
      type: String,
      required: true
    },
    isSubmittingForm: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      bio: '',
      bioRules: [
        value => value.length < 350 || 'بیو طولانی است.'
      ]
    }
  },
  mounted () {
    this.bio = this.currentBio
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        this.$emit('submit', this.bio)
      }
    }
  }
}
</script>
