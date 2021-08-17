import gql from 'graphql-tag'

export const GET_TAGS = gql`
  query tags{
      tags(where: { 
          resources: { name_contains: null }
        }, sort: "published_at:asc") {
          id
          tag
      }
  }
`
