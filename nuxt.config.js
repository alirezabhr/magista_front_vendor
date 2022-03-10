import colors from 'vuetify/es5/util/colors'

const _IS_DEV_MODE = false

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - magista_vendor',
    title: 'مگیستا پنل فروشنده',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/styles/words.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/initial_stores.client',
    '@/plugins/dependencyInjection',
    '@/plugins/chart.client'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/moment',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    // https://typescript.nuxtjs.org
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://sentry.nuxtjs.org
    '@nuxtjs/sentry',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa'
  ],

  sentry: {
    dsn: _IS_DEV_MODE ? 'https://e75f3e0403da4947bac45e09b20c7c0e@sentry.hamravesh.com/286' : 'https://2b0bd5123e944295880ee6b9e09bdb72@sentry.hamravesh.com/255',
    // Additional Module Options go here
    // https://sentry.nuxtjs.org/sentry/options
    config: {
      // Add native Sentry config here
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    rtl: true,
    treeShake: true,
    defaultAssets: {
      font: {
        family: 'Vazir'
      }
    },
    customVariables: ['~/assets/styles/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.deepPurple.accent4, // #6200EA
          primaryVariant1: colors.deepPurple.darken4, // #311B92
          primaryVariant2: colors.purple.lighten4, // #CE93D8
          secondary: colors.yellow.darken1,
          accent: colors.indigo.base, // #3F51B5
          background: colors.grey.lighten3,
          surface: colors.shades.white
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // server: {
  //   port: 3001
  // },

  env: {
    baseURL: _IS_DEV_MODE ? 'http://127.0.0.1:8000/' : 'https://api.magista.ir/'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true
  }
}
