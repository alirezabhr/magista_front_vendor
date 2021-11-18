import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { Context, Plugin } from '@nuxt/types'
import applyCaseMiddleware from 'axios-case-converter';
import { AxiosInstance } from 'axios'


declare module 'vue/types/vue' {
    // this.$myInjectedFunction inside Vue components
    interface Vue {
        $client: AxiosInstance
    }
}

declare module '@nuxt/types' {
    // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
    interface NuxtAppOptions {
        $client: AxiosInstance
    }

    // nuxtContext.$myInjectedFunction
    interface Context {
        $client: AxiosInstance
    }
}

declare module 'vuex/types/index' {
    // this.$myInjectedFunction inside Vuex stores
    interface Store<S> {
        $client: AxiosInstance
    }
}

const setupAxiosClient = (context: Context) : AxiosInstance => {
    const axiosInstance = context.$axios.create()

    // set authentication header
    axiosInstance.onRequest(config => {
        const accessToken = context.store.getters['auth/getUserToken'];
        if(!!accessToken){
            config.headers.common['Authorization'] = accessToken
        }
    })

    axiosInstance.onError(async error => {
        if(!!error.response) {
            // if authentication error, try refreshing the token
            if(error.response.status == 401) {
                console.log("refreshing token");
                console.log("should refresh token");
                // try {
                //     const newAccessToken = await context.store.dispatch(StoreNamespaceEnum.AUTH + '/' + AuthActionType.REFRESH_TOKEN);
                //     return new Promise((resolve) => {
                //         error.config.headers
                //             .common['Authorization'] = `Bearer ${newAccessToken}`
                //         resolve(axiosInstance(error.config))
                //     })
                // } catch (err) {
                //     Promise.reject(err)
                // }
            }
        }
        return Promise.reject(error)
    })

    // our server is in python and accepting (and resposing) in snake case
    // so we need a middleware to converter cases
    const client = applyCaseMiddleware(axiosInstance);
    return client;
}

const dependencyInjector: Plugin = (context, inject) => {
    
    const client = setupAxiosClient(context);
    inject('client', client)
}

export default dependencyInjector
