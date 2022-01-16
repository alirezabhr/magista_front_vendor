<template>
  <v-card>
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <div class="text-h6 font-weight-bold">تغییر توضیحات پست</div>
        <v-spacer />
        <v-btn icon @click.prevent="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-col class="py-0 px-8">
        <v-textarea
          v-model="description"
          label="توضیحات"
          :rules="descriptionRules"
          outlined
          dense
        />
      </v-col>

      <v-card-actions class="px-8 pb-5">
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
  name: 'PostEditForm',
  props: {
    isSubmittingForm: {
      type: Boolean,
      required: true
    },
    postDescription: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      description: '',
      descriptionRules: [
        value => value.length <= 500 || 'توضیحات بسیار طولانی است.'
      ]
    }
  },
  mounted () {
    this.description = this.postDescription
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        this.$emit('submit', this.description)
      }
    }
  }
}
</script>
