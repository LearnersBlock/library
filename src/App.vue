<template>
  <router-view />
</template>
<script lang="ts">
import { DefaultApolloClient } from '@vue/apollo-composable'
import { defineComponent, provide } from 'vue'
import { apolloClient } from 'src/boot/apollo'

export default defineComponent({
  name: 'App',
  setup () {
    provide(DefaultApolloClient, apolloClient)
  }
})
</script>
