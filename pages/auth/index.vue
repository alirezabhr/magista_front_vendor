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
          this.sendOtp(phoneNo)
        } else {
          console.log('ERROR in checking user exitence')
        }
      }).catch((response) => {
        this.showSnackbar = false
        console.log(response)
        // console.log(response.data.toString())
        if (response.status === 400) {
          this.snackbarMessage = response.data.phone[0]
        } else {
          this.snackbarMessage = response.data
        }
        this.showSnackbar = true
      })
    },
    forgetPassword () {
      console.log('forget password func')
    }
  }
}
</script>
