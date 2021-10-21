<template>
  <v-container>
    <v-row class="py-6" justify="center">
      <v-col col="10" sm="6" md="4">
        <PhoneForm v-if="auth_step === 'phone'" @submitForm="sendPhone" />
        <OtpForm v-else-if="auth_step === 'otp'" @submitForm="sendOtp" @changePhone="auth_step = 'phone'" />
        <SignupPasswordForm v-else-if="auth_step === 'signup password'" @submitForm="signup" />
        <LoginPasswordForm v-else-if="auth_step === 'login password'" @submitForm="login" @changePhone="auth_step = 'phone'" @forgetPassword="forgetPassword" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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
      auth_step: 'phone'
    }
  },
  methods: {
    sendPhone () {
      console.log('send phone func')
    },
    sendOtp () {
      console.log('send otp func')
    },
    signup () {
      console.log('signup func')
    },
    login () {
      console.log('login func')
    },
    forgetPassword () {
      console.log('forget password func')
    }
  }
}
</script>
