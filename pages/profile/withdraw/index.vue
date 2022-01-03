<template>
  <v-container class="indigo lighten-5" style="height: 100%">
    <v-dialog
      v-model="showDialog"
      max-width="600px"
    >
      <BankCreditForm @close="showDialog = false" />
    </v-dialog>
    <v-card color="grey lighten-3">
      <v-card-title class="text-h6 font-weight-bold">
        انتخاب حساب
      </v-card-title>

      <v-card-actions class="px-8 pb-5">
        <v-col cols="12" class="pa-0">
          <div v-if="getCurrentShopBankCredits.length > 0">
            <v-card
              v-for="credit in getCurrentShopBankCredits"
              :key="credit.sheba"
              class="my-3"
              @click.prevent="selectBankCredit(credit)"
            >
              <v-card-subtitle class="text-h6 mt-3">
                <v-row justify="center" no-gutters>{{ credit.sheba }}</v-row>
              </v-card-subtitle>
              <v-card-text>
                {{ credit.fullName }}
              </v-card-text>
            </v-card>
          </div>
          <v-row justify="center" no-gutters>
            <v-btn outlined color="white" class="primary--text" @click.prevent="showDialog = true">
              افزودن حساب جدید
            </v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BankCreditForm from '@/components/BankCreditForm.vue'

export default {
  name: 'WithdrawPage',
  components: {
    BankCreditForm
  },
  data () {
    return {
      showDialog: false
    }
  },
  computed: {
    ...mapGetters('shop', ['getCurrentShop', 'getCurrentShopBankCredits'])
  },
  mounted () {
    this.currentShopBankCredits()
  },
  methods: {
    ...mapActions('shop', ['currentShopBankCredits']),

    selectBankCredit (credit) {
      this.showDialog = false
    }
  }
}
</script>
