<template>
    <v-card>
        <v-form
            ref="form"
            lazy-validation
            @submit.prevent="validateAndSubmitForm"
        >
        <v-card-title>
            <v-col>
                <div class="text-h6 font-weight-bold">تغییر مشخصات محصول</div>
            </v-col>
        </v-card-title>

        <v-col class="py-0 px-8">
            <v-text-field
                v-model="title"
                label="عنوان"
                :rules="titleRules"
                outlined
                dense
            />
            <v-textarea
                v-model="description"
                label="توضیحات"
                :rules="descriptionRules"
                outlined
                dense
            />
        </v-col>

        <v-card-actions class="px-8">
            <v-col cols="12">
                <v-row justify="center">
                    <v-btn
                        block
                        class="primary font-weight-bold py-5"
                        :loading="isSubmittingForm"
                        type="submit"
                    >
                        ثبت مشخصات
                    </v-btn>
                </v-row>
                <v-row justify="center">
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="$emit('close')"
                    >
                        بستن
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
        value => value.length <= 60 || 'عنوان طولانی است.'
      ],
      descriptionRules: [
        value => !!value || 'توضیحات خالی است.',
        value => value.length <= 400 || 'توضیحات بسیار طولانی است.'
      ],
    }
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
