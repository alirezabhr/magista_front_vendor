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
          v-if="authStep === 'phone'"
          :is-submitting-phone="isLoading"
          @submitForm="sendPhone"
        />
        <OtpForm
          v-else-if="authStep === 'otp'"
          :is-submitting-otp="isLoading"
          :phone-number="phoneNumber"
          @submitForm="checkOtp"
          @changePhone="authStep = 'phone'"
        />
        <SignupPasswordForm
          v-else-if="authStep === 'signup password'"
          :is-submitting-password="isLoading"
          @submitForm="signup"
        />
        <ForgetPasswordForm
          v-else-if="authStep === 'forget password'"
          :is-submitting-password="isLoading"
          @submitForm="changePassword"
        />
        <LoginPasswordForm
          v-else-if="authStep === 'login password'"
          :is-submitting-password="isLoading"
          @submitForm="login"
          @changePhone="authStep = 'phone'"
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
import ForgetPasswordForm from '@/components/auth/ForgetPasswordForm.vue'

export default {
  name: 'AuthPage',
  components: {
    PhoneForm,
    OtpForm,
    SignupPasswordForm,
    LoginPasswordForm,
    ForgetPasswordForm
  },
  data () {
    return {
      authStep: 'phone',
      phoneNumber: '',
      isLoading: false,
      hadForgottenPassword: false,
      showSnackbar: false,
      snackbarMessage: ''
    }
  },
  methods: {
    ...mapActions('auth', ['checkUserExistence', 'requestOtpCode',
      'checkOtpCode', 'userSignup', 'userLogin', 'changeUserPassword']),

    sendPhone (phoneNo) {
      this.isLoading = true
      this.hadForgottenPassword = false
      this.phoneNumber = phoneNo

      this.checkUserExistence({
        phone: this.phoneNumber
      }).then((response) => {
        this.isLoading = false
        if (response.data.user === 'found') {
          this.authStep = 'login password'
        } else if (response.data.user === 'not found') {
          this.requestOtp()
        }
      }).catch((response) => {
        this.isLoading = false
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    },
    requestOtp () {
      this.isLoading = true

      this.requestOtpCode({
        phone: this.phoneNumber
      }).then(() => {
        this.isLoading = false
        this.authStep = 'otp'
      }).catch((response) => {
        this.isLoading = false
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    },
    checkOtp (otpCode) {
      this.isLoading = true

      this.checkOtpCode({
        phone: this.phoneNumber,
        otp_code: Number.parseInt(otpCode)
      }).then(() => {
        this.isLoading = false
        if (this.hadForgottenPassword) {
          this.authStep = 'forget password'
        } else {
          this.authStep = 'signup password'
        }
      }).catch((response) => {
        this.isLoading = false
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    },
    signup (inputPassword) {
      this.isLoading = true
      this.userSignup({
        phone: this.phoneNumber,
        password: inputPassword
      }).then(() => {
        this.isLoading = false
        this.redirect()
      }).catch((response) => {
        this.isLoading = false
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    },
    login (inputPassword) {
      this.isLoading = true
      this.userLogin({
        phone: this.phoneNumber,
        password: inputPassword
      }).then(() => {
        this.isLoading = false
        this.redirect()
      }).catch((response) => {
        this.isLoading = false
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    },
    forgetPassword () {
      this.hadForgottenPassword = true
      this.requestOtp()
    },
    changePassword (inputPassowrd) {
      this.isLoading = true
      this.changeUserPassword({
        phone: this.phoneNumber,
        password: inputPassowrd
      }).then(() => {
        this.isLoading = false
        this.redirect()
      }).catch((response) => {
        this.isLoading = false
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    },
    redirect () {
      const routeFrom = this.$router.app.context.from
      if (routeFrom.path === '/auth') {
        this.$router.push('/')
      } else {
        this.$router.push(routeFrom.path)
      }
    }
  }
}
</script>
