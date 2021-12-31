<template>
  <div v-if="isLoading" style="height: 100%;">
    <v-row class="fill-height" align="center" justify="center" no-gutters>
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-row>
  </div>
  <div v-else style="height: 100%;">
    <v-col class="fill-height">
      <div class="text-h6 px-3 pt-8">آمار 15 روز اخیر</div>
      <div class="bar-chart">
        <my-chart :data="chartData" :options="{ maintainAspectRatio: false }" />
      </div>
    </v-col>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'StatsPage',
  layout: 'panel',
  data () {
    return {
      isLoading: false,
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'فروش (تومان)',
            borderColor: '#4bcc96',
            borderWidth: 4,
            pointBackgroundColor: '#000000',
            pointRadius: 6,
            fill: false,
            data: []
          }
        ]
      },
      charOption: {
        maintainAspectRatio: false,
        responsive: true,
        tooltip: {
          backgroundColor: '#303030',
          titleFontColor: '#ffffff',
          bodyFontColor: '#ffffff',
          position: 'nearest'
        }
      }
    }
  },
  computed: {
    ...mapGetters('stats', ['getChartLabels', 'getChartPriceData'])
  },
  mounted () {
    this.isLoading = true
    this.shopStats().then(() => {
      this.chartData.labels = this.getChartLabels
      this.chartData.datasets[0].data = this.getChartPriceData
      this.isLoading = false
    })
  },
  methods: {
    ...mapActions('stats', ['shopStats'])
  }
}
</script>
