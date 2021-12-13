<template>
  <v-card>
    <v-card-title>
      <div class="text-h6 font-weight-bold">ویژگی‌ها</div>
      <v-spacer />
      <v-btn icon @click.prevent="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-col>
      <v-card v-for="(attr, index) in getProduct.attributes" :key="index" outlined class="ma-2 px-1">
        <v-row no-gutters align="center">
          <div>
            <span class="px-2">{{ attr.name }}: </span>
            <span>{{ attr.value }}</span>
          </div>
          <v-spacer />
          <v-btn icon @click="removeAttribute(attr.id)">
            <v-icon color="red">mdi-minus</v-icon>
          </v-btn>
        </v-row>
      </v-card>
      <v-form
        ref="form"
        lazy-validation
        @submit.prevent="validateAndAddAttributes"
      >
        <v-row no-gutters class="pt-6">
          <v-col cols="4" class="py-0 pr-2 pl-1">
            <v-text-field
              v-model="attrName"
              label="نام"
              :rules="attrNameRules"
              outlined
              dense
            />
          </v-col>
          <v-col cols="6" class="py-0 pr-2 pl-1">
            <v-text-field
              v-model="attrValue"
              label="مقدار"
              :rules="attrValueRules"
              outlined
              dense
            />
          </v-col>
          <v-col cols="2" class="py-0">
            <v-btn icon type="submit">
              <v-icon color="green">mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProductAttributesForm',
  data () {
    return {
      attrName: '',
      attrValue: '',
      attrNameRules: [
        value => !!value || 'نام ویژگی را وارد کنید.',
        value => value.length < 20 || 'نام ویژگی طولانی است.'
      ],
      attrValueRules: [
        value => !!value || 'مقدار ویژگی را وارد کنید.',
        value => value.length < 30 || 'مقدار ویژگی طولانی است.'
      ]
    }
  },
  computed: {
    ...mapGetters('product', ['getProduct'])
  },
  methods: {
    ...mapActions('product', ['createAttribute', 'removeAttribute']),

    validateAndAddAttributes () {
      if (this.$refs.form.validate()) {
        const payload = {
          name: this.attrName,
          value: this.attrValue
        }
        this.createAttribute(payload).then(() => {
          this.attrName = ''
          this.attrValue = ''
          this.$refs.form.resetValidation()
        })
      }
    }
  }
}
</script>
