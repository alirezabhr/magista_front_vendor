<template>
  <div v-if="loading" class="loading-page">
    <div class="v-spinner">
      <div class="v-beat v-beat-odd" :style="spinnerStyle"/>
      <div class="v-beat v-beat-even" :style="spinnerStyle"/>
      <div class="v-beat v-beat-odd" :style="spinnerStyle"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loader',
  data () {
    return {
      loading: false,
      spinnerStyle: {
      	backgroundColor: '#6101ea',
      	height: '20px',
     		width: '20px',
      	margin: '2px',
      	borderRadius: '100%'
      }
    }
  },
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style>
.loading-page {
  position: fixed;
  padding-top: 280px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background: rgba(255, 255, 255, 0.6);
  z-index: 1;
}
.v-spinner .v-beat
{
    -webkit-animation: v-beatStretchDelay 0.7s infinite linear;
            animation: v-beatStretchDelay 0.7s infinite linear;
    -webkit-animation-fill-mode: both;
	          animation-fill-mode: both;
    display: inline-block;         
}

.v-spinner .v-beat-odd
{
  animation-delay: 0s;
}
.v-spinner .v-beat-even
{
  animation-delay: 0.35s;
}
@-webkit-keyframes v-beatStretchDelay
{
    50%
    {
      -webkit-transform: scale(0.75);
              transform: scale(0.75);
      -webkit-opacity: 0.2;             
              opacity: 0.2;
    }
    100%
    {
      -webkit-transform: scale(1);
              transform: scale(1);
      -webkit-opacity: 1;             
              opacity: 1;
    }
}

@keyframes v-beatStretchDelay
{
  50%
  {
    -webkit-transform: scale(0.75);
            transform: scale(0.75);
    -webkit-opacity: 0.2;             
            opacity: 0.2;
  }
  100%
  {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-opacity: 1;             
            opacity: 1;
  }
}
</style>