<template>
  <v-container>
    <v-snackbar
      v-model="showSnackbar"
      color="grey darken-3"
    >
      {{ snackbarMessage }}
    </v-snackbar>
    <v-row class="py-6" justify="center">
      <v-col col="10" sm="6" md="4">
        <PhoneForm
          v-if="auth_step === 'phone'"
          :is-submitting-phone="is_loading"
          @submitForm="sendPhone"
        />
        <OtpForm
          v-else-if="auth_step === 'otp'"
          :is-submitting-otp="is_loading"
          @submitForm="checkOtp"
          @changePhone="auth_step = 'phone'"
        />
        <SignupPasswordForm
          v-else-if="auth_step === 'signup password'"
          :is-submitting-password="is_loading"
          @submitForm="signup"
        />
        <LoginPasswordForm
          v-else-if="auth_step === 'login password'"
          :is-submitting-password="is_loading"
          @submitForm="login"
          @changePhone="auth_step = 'phone'"
          @forgetPassword="forgetPassword"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

import PhoneForm from '@/components/auth/PhoneForm.vue'
import OtpForm from '@/components/auth/OtpForm.vue'
import SignupPasswordForm from '@/components/auth/SignupPasswordForm.vue'
import LoginPasswordForm from '@/components/auth/LoginPasswordForm.vue'

export default {
  name: 'AuthPage',
  components: {
    PhoneForm,
    OtpForm,
    SignupPasswordForm,
    LoginPasswordForm
  },
  data () {
    return {
      auth_step: 'phone',
      is_loading: false,
      showSnackbar: false,
      snackbarMessage: ''
    }
  },
  methods: {
    ...mapActions('auth', ['checkUserExistence', 'requestOtpCode', 'checkOtpCode', 'userSignup', 'userLogin']),
    sendPhone (phoneNo) {
      this.checkUserExistence({
        phone: phoneNo
      }).then((response) => {
        if (response.data.user === 'found') {
          this.auth_step = 'login password'
        } else if (response.data.user === 'not found') {
          this.requestOtp(phoneNo)
        } else {
          console.log('ERROR in checking user exitence')
        }
      }).catch((response) => {
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    },
    requestOtp (phoneNo) {
      this.requestOtpCode({
        phone: phoneNo
      }).then(() => {
        this.auth_step = 'otp'
      }).catch((response) => {
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    },
    checkOtp (otpCode) {
      this.checkOtpCode({
        otp_code: Number.parseInt(otpCode)
      }).then(() => {
        this.auth_step = 'signup password'
      }).catch((response) => {
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    },
    signup (password) {
      this.userSignup({
        password
      }).then(() => {
        console.log('in signup then')
      }).catch((response) => {
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    },
    login (password) {
      this.userLogin({
        password
      }).then(() => {
        console.log('in login then')
      }).catch((response) => {
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    },
    forgetPassword () {
      console.log('forget password func')
    }
  }
}
</script>
