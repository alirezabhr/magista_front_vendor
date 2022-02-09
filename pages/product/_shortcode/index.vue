<template>
  <v-progress-circular v-if="!getPost" indeterminate size="64" />
  <v-col
    v-else
    class="pa-0 mx-auto"
    cols="12"
    sm="8"
    md="7"
    lg="6"
  >
    <v-dialog
      v-model="showDialog"
      max-width="600px"
    >
      <CreateProductForm
        v-if="postForm === 'addProduct'"
        :is-submitting-form="isSubmittingForm"
        :image-id="getPostProductImages[carouselIndex].id"
        @submit="submitCreateProductForm"
        @close="showDialog = false"
      />
      <PostEditForm
        v-else-if="postForm === 'editPost'"
        :is-submitting-form="isSubmittingForm"
        :post-description="getPost.description"
        @submit="submitPostEditForm"
        @close="showDialog = false"
      />
    </v-dialog>
    <v-card min-height="670">
      <v-row dir="ltr" no-gutters class="px-3 py-2 grey lighten-4" align="center">
        <NuxtLink to="/dashboard">
          <v-avatar size="45">
            <v-img :src="getProfilePhotoUrl" alt="profile" />
          </v-avatar>
        </NuxtLink>
        <NuxtLink to="/dashboard" class="text-decoration-none" active-class="text-decoration-none">
          <div class="pl-3 font-weight-bold text-body-2 grey--text text--darken-4">{{ getCurrentShop.instagramUsername }}</div>
        </NuxtLink>
        <v-spacer />
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" @click.prevent="" v-on="on">
              <v-icon color="grey darken-2">mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(option, index) in postOptions"
              :key="index"
              link
              @click.prevent="postOptionsOnClick(option.form)"
            >
              <v-icon class="pl-2" :color="option.icon.color">
                {{ option.icon.name }}
              </v-icon>
              <v-list-item-title :class="`${option.color}--text`">
                {{ option.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
      <ProductImageCarousel
        :product-images="getPostProductImages"
        :trigger-show-product-tags="triggerShowProductTags"
        @changeCarouselIndex="changeCarouselIndex"
      />
      <ProductsList
        :product-images="getPostProductImages"
        :carousel-index="carouselIndex"
      />
      <v-col class="px-3 py-0">
        <v-col v-if="getPost.description" class="font-weight-light">
          <div class="font-weight-bold text-body-2">توضیح پُست</div>
          <div class="description">
            {{ getPost.description }}
          </div>
        </v-col>
      </v-col>
    </v-card>
  </v-col>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import PostEditForm from '@/components/product/PostEditForm'
import CreateProductForm from '@/components/product/CreateProductForm'
import ProductImageCarousel from '@/components/post/ProductImageCarousel'
import ProductsList from '@/components/post/ProductsList'

export default {
  name: 'ProductShortcodePage',
  components: {
    PostEditForm,
    CreateProductForm,
    ProductImageCarousel,
    ProductsList
  },
  async asyncData ({ params, store, error }) {
    store.commit('product/clearPostProductImages')
    await store.dispatch('product/postDetail', params.shortcode)
      .catch((response) => {
        if (response.status === 404) {
          error({ statusCode: 404, message: 'محصول یافت نشد.' })
        } else {
          error({ statusCode: 500, message: 'خطایی رخ داده است!' })
        }
      })
    await store.dispatch('product/postProductImages', params.shortcode)
  },
  data () {
    return {
      postOptions: [
        {
          title: 'افزودن محصول',
          color: 'black',
          icon: { name: 'mdi-plus mdi-18px', color: 'green darken-1' },
          form: 'addProduct'
        },
        {
          title: 'توضیح پُست',
          color: 'black',
          icon: { name: 'mdi-pencil mdi-18px', color: 'grey darken-2' },
          form: 'editPost'
        }
      ],
      carouselIndex: 0,
      postForm: '',
      isSubmittingForm: false,
      triggerShowProductTags: false,
      showDialog: false
    }
  },
  computed: {
    ...mapGetters('shop', ['getCurrentShop']),
    ...mapGetters('product', ['getPost', 'getPostProductImages']),

    getProfilePhotoUrl () {
      return process.env.baseURL + this.getCurrentShop.profileImageUrl
    }
  },
  methods: {
    ...mapActions('product', ['createNewProduct', 'editPost']),

    productImageUrl (productImage) {
      return process.env.baseURL + productImage.displayImage
    },
    postOptionsOnClick (form) {
      this.postForm = form
      this.showDialog = true
    },
    changeCarouselIndex (newVal) {
      this.carouselIndex = newVal
    },
    submitCreateProductForm (payload) {
      this.isSubmittingForm = true
      this.createNewProduct(payload).then(() => {
        this.isSubmittingForm = false
        this.postForm = ''
        this.showDialog = false
        this.triggerShowProductTags = !this.triggerShowProductTags
      })
    },
    submitPostEditForm (description) {
      this.isSubmittingForm = true
      const post = { ...this.getPost }
      post.description = description

      this.editPost(post).then(() => {
        this.isSubmittingForm = false
        this.postForm = ''
        this.showDialog = false
      })
    }
  }
}
</script>

<style scoped>
.shop-icon {
  cursor: pointer;
  left: 2%;
  bottom: 2%;
  position: absolute;
}
.description {
  white-space: pre-line;
}
</style>
