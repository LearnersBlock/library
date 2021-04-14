import { boot } from 'quasar/wrappers'
import { ApolloClient } from '@apollo/client/core'
import { getClientOptions } from 'src/apollo/options'
import type { BootFileParams } from '@quasar/app'

let apolloClient: ApolloClient<unknown>

// bootFileParams is { app, router, ...}
export default boot(async (bootFileParams: BootFileParams<unknown>) => {
  const options = await getClientOptions(bootFileParams)
  apolloClient = new ApolloClient(options)
})

export { apolloClient }
