<template>
  <router-view
    v-if="apiIsUp"
  />
  <div
    v-else
    class="text-h2 q-mt-xl q-ml-xl"
  >
    {{ $t('under_maintenance') }}
  </div>
</template>
<script lang="ts">
import { DefaultApolloClient } from '@vue/apollo-composable'
import { defineComponent, ref, provide } from 'vue'
import { apolloClient } from 'src/boot/apollo'

export default defineComponent({
  name: 'App',
  setup () {
    provide(DefaultApolloClient, apolloClient)
    const apiIsUp = ref<boolean>(true)

    apiIsUp.value = true

    return {
      apiIsUp
    }
  }
})
</script>
