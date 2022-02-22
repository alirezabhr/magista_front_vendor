<template>
  <v-container class="indigo lighten-5" style="height: 100%">
    <v-dialog
      v-model="showDialog"
      max-width="600px"
    >
      <BankCreditForm @close="showDialog = false" />
    </v-dialog>
    <v-snackbar
      v-model="showSnackbar"
      :color="snakcbarColor"
      elevation="24"
    >
      {{ snackbarMessage }}
    </v-snackbar>
    <v-card color="lighten-3">
      <v-card-title class="text-h6 font-weight-bold">
        انتخاب حساب
      </v-card-title>
      <div v-if="getCurrentShopBankCredits.length > 0" class="pa-3">
        <v-row
          v-for="credit in getCurrentShopBankCredits"
          :key="credit.sheba"
          no-gutters
        >
          <v-col cols="10" md="8" lg="6" class="pa-0 mx-auto">
            <v-card
              class="my-2"
              :class="selectedCredit === credit ? 'primary lighten-1' : ''"
              @click.prevent="selectBankCredit(credit)"
            >
              <v-card-subtitle class="text-body-1 font-weight-bold">
                <v-row :class="selectedCredit === credit ? 'white--text' : ''" justify="end" no-gutters>
                  {{ credit.sheba }}
                </v-row>
              </v-card-subtitle>
              <v-card-text :class="selectedCredit === credit ? 'white--text' : ''">
                {{ credit.firstName }} {{ credit.lastName }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <v-row class="pt-2 pb-5" justify="center" no-gutters>
        <v-btn outlined color="white" class="primary--text" @click.prevent="showDialog = true">
          افزودن حساب جدید
        </v-btn>
      </v-row>
    </v-card>

    <v-card color="lighten-3 my-3">
      <v-card-title class="text-h6 font-weight-bold">
        درخواست تسویه
      </v-card-title>
      <v-card-text class="py-0">
        واریز به: {{ selectedCreditSheba }}
      </v-card-text>
      <v-card-text class="py-0">
        به نام: {{ selectedCreditFullName }}
      </v-card-text>
      <v-card-text class="text-body-1">
        واریزی: {{ settlementAmount }} تومان
      </v-card-text>
      <v-card-actions>
        <v-col cols="6" class="pa-0 mx-auto">
          <v-btn
            width="100%"
            class="yellow darken-1 white--text font-weight-bold"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            @click.prevent="requestWithdraw"
          >
            برداشت
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BankCreditForm from '@/components/BankCreditForm.vue'

const MINIMUM_WITHDRAWAL_AMOUNT = 80000

export default {
  name: 'WithdrawPage',
  components: {
    BankCreditForm
  },
  data () {
    return {
      isSubmitting: false,
      showDialog: false,
      showSnackbar: false,
      snakcbarColor: '',
      snackbarMessage: '',
      selectedCredit: null
    }
  },
  computed: {
    ...mapGetters('shop', ['getCurrentShop', 'getCurrentShopBankCredits']),

    selectedCreditSheba () {
      if (this.selectedCredit) {
        return this.selectedCredit.sheba
      }
      return '---'
    },
    selectedCreditFullName () {
      if (this.selectedCredit) {
        return this.selectedCredit.firstName + ' ' + this.selectedCredit.lastName
      }
      return '---'
    },
    settlementAmount () {
      const percentage = 100 - this.getCurrentShop.commissionPercent
      return parseInt((this.getCurrentShop.remainingAmount * percentage) / 100)
    }
  },
  mounted () {
    this.currentShopBankCredits()
  },
  methods: {
    ...mapActions('shop', ['currentShopBankCredits', 'withdraw']),

    selectBankCredit (credit) {
      this.selectedCredit = credit
    },
    requestWithdraw () {
      if (this.selectedCredit) {
        if (this.settlementAmount > MINIMUM_WITHDRAWAL_AMOUNT) {
          this.isSubmitting = true
          this.withdraw(this.selectedCreditSheba).then(() => {
            this.isSubmitting = false
            this.snakcbarColor = 'green'
            this.snackbarMessage = 'عملیات تسویه با موفقیت انجام شد.'
            this.showSnackbar = true
          }).catch(() => {
            this.isSubmitting = false
            this.snakcbarColor = 'red'
            this.snackbarMessage = 'در حال حاضر امکان برقراری ارتباط با بانک وجود ندارد!'
            this.showSnackbar = true
          })
        } else {
          this.snakcbarColor = 'red'
          this.snackbarMessage = 'حداقل مبلغ قابل برداشت 80،000 تومان است.'
          this.showSnackbar = true
        }
      } else {
        this.snakcbarColor = 'red'
        this.snackbarMessage = 'هیچ شماره حسابی انتخاب نشده است!'
        this.showSnackbar = true
      }
    }
  }
}
</script>
