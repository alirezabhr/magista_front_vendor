<template>
  <v-card>
    <v-card-title class="font-weight-bold">
      آیا از حذف محصول اطمینان دارید؟
    </v-card-title>

    <v-card-text>
      با حذف محصول این کالا برای شما و مشتری به طور کامل حذف می‌شود.
    </v-card-text>

    <v-card-actions class="px-8 pb-5">
      <v-col offset="6" cols="6">
        <v-row justify="space-around" no-gutters>
          <v-btn
            text
            class="py-5"
            @click.prevent="$emit('close')"
          >
            لغو
          </v-btn>
          <v-btn
            text
            class="red--text font-weight-bold py-5"
            :loading="isSubmittingForm"
            @click.prevent="$emit('submit')"
          >
            حذف
          </v-btn>
        </v-row>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ProductDeleteForm',
  props: {
    isSubmittingForm: {
      type: Boolean,
      required: true
    }
  }
}
</script>
