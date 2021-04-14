import { createHttpLink, InMemoryCache } from '@apollo/client/core'
import type { ApolloClientOptions } from '@apollo/client/core/ApolloClient'
import type { BootFileParams } from '@quasar/app'

// bootFileParams is { app, router, ...}
// eslint-disable-next-line @typescript-eslint/require-await
export async function getClientOptions (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bootFileParams?: BootFileParams<unknown>
): Promise<ApolloClientOptions<unknown>> {
  return Object.assign(
    // General options.
    {
      link: createHttpLink({
        uri: process.env.GRAPHQL_URI || 'https://library-api.learnersblock.org/graphql'
      }),

      cache: new InMemoryCache({})
    }
  ) as ApolloClientOptions<unknown>
}
