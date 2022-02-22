<template>
  <v-card>
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <div class="text-h6 font-weight-bold">تغییر مشخصات محصول</div>
        <v-spacer />
        <v-btn icon @click.prevent="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-col class="py-0 px-8">
        <v-text-field
          v-model="title"
          label="عنوان"
          :rules="titleRules"
          outlined
          dense
        />
        <v-text-field
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
              :disabled="isSubmittingForm"
              type="submit"
            >
              ثبت مشخصات
            </v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'ProductEditForm',
  props: {
    isSubmittingForm: {
      type: Boolean,
      required: true
    },
    productTitle: {
      type: String,
      required: true
    },
    productDescription: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      title: '',
      description: '',
      titleRules: [
        value => !!value || 'عنوان خالی است.',
        value => value.length <= 30 || 'عنوان طولانی است.'
      ],
      descriptionRules: [
        value => value.length <= 50 || 'توضیحات بسیار طولانی است.'
      ]
    }
  },
  mounted () {
    this.title = this.productTitle
    this.description = this.productDescription
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        this.$emit('submit', this.title, this.description)
      }
    }
  }
}
</script>
