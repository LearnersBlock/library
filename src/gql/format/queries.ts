import gql from 'graphql-tag'

export const GET_FORMATS = gql`
  query formats{
      formats {
          id
          type
      }
  }
`