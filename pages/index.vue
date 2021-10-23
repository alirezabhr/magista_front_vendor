<template>
  <div>home page</div>
</template>

<script>
export default {
  name: 'HomePage',
  mounted () {
    this.$router.push('dashboard')
  }
}
</script>
