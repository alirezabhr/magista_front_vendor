<template>
  <div>home page</div>
</template>

<script>
export default {
  name: 'HomePage',
  middleware ({ redirect }) {
    return redirect('/dashboard')
  }
}
</script>
