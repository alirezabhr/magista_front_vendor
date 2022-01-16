<template>
  <v-card>
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <div class="text-h6 font-weight-bold">افزودن حساب جدید</div>
        <v-spacer />
        <v-btn icon @click.prevent="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-col class="py-0 px-8">
        <v-text-field
          v-model="shebaData.sheba"
          label="شماره شبا"
          hint="مثال: IRxxxxxxxxxxxxxxxxxxxxxx"
          dir="ltr"
          :rules="shebaRules"
          outlined
          dense
        />
        <v-row no-gutters>
          <v-col class="pa-0 ml-1">
            <v-text-field
              v-model="shebaData.firstName"
              label="نام"
              :rules="firstNameRules"
              outlined
              dense
            />
          </v-col>
          <v-col class="pa-0 mr-1">
            <v-text-field
              v-model="shebaData.lastName"
              label="نام خانوادگی"
              :rules="lastNameRules"
              outlined
              dense
            />
          </v-col>
        </v-row>
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
import { mapActions } from 'vuex'

export default {
  name: 'BankCrediForm',
  data () {
    return {
      isSubmittingForm: false,
      shebaData: {
        sheba: '',
        firstName: '',
        lastName: ''
      },
      shebaRules: [
        value => !!value || 'شماره شبا الزامی می‌باشد.',
        value => value.length === 26 || 'شماره شبا دارای دو حرف IR و 24 رقم می‌باشد.',
        value => value.startsWith('IR') || 'شماره شبا باید با IR شروع شود.',
        value => !value.includes('.') || 'شماره شبا نامعتبر است.'
      ],
      firstNameRules: [
        value => !!value || 'نام دارنده حساب الزامی می‌باشد.',
        value => value.length < 40 || 'نام بسیار طولانی است.'
      ],
      lastNameRules: [
        value => !!value || 'نام خانوادگی دارنده حساب الزامی می‌باشد.',
        value => value.length < 40 || 'نام خانوادگی بسیار طولانی است.'
      ]
    }
  },
  methods: {
    ...mapActions('shop', ['addBankCredit']),

    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        this.isSubmittingForm = true
        this.addBankCredit(this.shebaData).then(() => {
          this.isSubmittingForm = false
          this.$emit('close')
        })
      }
    }
  }
}
</script>
