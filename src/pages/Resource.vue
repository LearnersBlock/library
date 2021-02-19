<template>
    <q-page  class="row items-center justify-evenly q-mb-lg">
        <!-- Loading Spinner -->
        <q-spinner
            color="primary"
            size="10%"
            v-if="fetchResourceLoading"
        />
        <!-- Resource container -->
        <div v-if="fetchedResource" class="resource_container q-mb-xl">
        <q-item class="back q-mt-xl q-mr-sm" >
            <router-link color="secondary" class="back text-h6 cursor-pointer" tag="div" to="/">
                <q-btn color="primary" class="text-subtitle1">{{$t('back')}}</q-btn>
            </router-link>
        </q-item>
            <div class="text-center">
                <div v-if="fetchedResource.resource.logo && fetchedResource.resource.logo.formats && fetchedResource.resource.logo.formats.thumbnail && fetchedResource.resource.logo.formats.thumbnail.url">
                <img class="resource_image q-mt-xl" :src="'https://library-api.learnersblock.org' + fetchedResource.resource.logo.formats.thumbnail.url">
                </div>
                <div v-else>
                <img class="resource_image q-mt-xl" :src="fetchedResource.resource.logo ? 'https://library-api.learnersblock.org' + fetchedResource.resource.logo.url : require('../assets/default.jpg')">
                </div>
            </div>
            <div dir="auto" class="text-h2 josefin sans resource_name">{{ fetchedResource.resource.name }}</div>
            <div dir="auto" class="text-h6 q-mt-md resource_description">{{ fetchedResource.resource.description }}</div>
            <q-separator class="q-mt-md" />
            <div class="resource_info q-mt-lg text-left">
                  <div class="text-h6 q-mr-md q-mt-sm resource_info-label">{{$t('author')}} </div>
                  <div class="text-h6 q-mt-sm">
                      <a :href="fetchedResource.resource.author_website" target="_blank">{{ fetchedResource.resource.author }}
                      </a>
                  </div> 
                  <div class="text-h6 q-mt-sm q-mr-md resource_info-label">{{$t('languages')}} </div>
                  <div class="q-mt-sm">
                    <q-badge class="q-pa-sm q-mr-sm q-mb-sm multi-line text-body2 text-weight-medium resource_language" color="primary" 
                     v-for="language in fetchedResource.resource.languages" :key="language.id">
                         {{ $t(language.language) }}
                    </q-badge>
                  </div>
                  <div class="text-h6 q-mt-sm q-mr-md resource_info-label">{{$t('formats')}}</div> 
                  <div class="q-mt-sm">
                     <q-badge class="q-pa-sm q-mr-sm q-mb-sm multi-line text-body2 text-weight-medium resource_language" color="primary"  v-for="format in fetchedResource.resource.formats" :key="format.id">
                        {{ format.type}}
                    </q-badge> 
                  </div>  
                  <div class="text-h6 q-mt-sm q-mr-md resource_info-label">{{$t('size')}}  </div>
                  <div class="text-h6 q-mt-sm">{{ fetchedResource.resource.size }} GB</div>
                  <div class="text-h6 q-mt-sm q-mr-md resource_info-label">{{$t('host')}} </div>
                  <div class="text-h6 q-mt-sm">{{ fetchedResource.resource.host }}</div>            
                  <div class="text-h6 q-mt-sm ">{{$t('url')}} </div>
                  <div class="text-h6 q-mt-sm q-mr-md">
                      <a :href="fetchedResource.resource.download_url" target="_blank">
                          {{ fetchedResource.resource.download_url }}
                      </a>
                      <span @click="copyToClipBoard" class="material-icons text-h5 q-ml-sm cursor-pointer clipboard-url">
                          content_copy  
                          <q-tooltip >
                              <span class="text-subtitle1">{{$t('copy_to_clipboard')}}</span> 
                          </q-tooltip>
                      </span>
                  </div> 
                  <div class="text-h6 q-mt-sm q-mr-md">{{ $t('sample_url')}} </div> 
                  <div class="text-h6 q-mt-sm">
                      <a :href="fetchedResource.resource.sample" target="_blank">{{ fetchedResource.resource.sample }}
                      </a>
                      <span @click="copyToClipBoard" class="material-icons text-h5 q-ml-sm cursor-pointer clipboard-sampleUrl">
                          content_copy  
                          <q-tooltip >
                              <span class="text-subtitle1">{{$t('copy_to_clipboard')}}</span> 
                          </q-tooltip>
                      </span>
                  </div> 
                  <div class="text-h6 q-mt-sm q-mr-md">{{$t('rsync_url')}} </div> 
                  <div class="text-h6 q-mt-sm">
                      {{ fetchedResource.resource.rsync }}
                      <span @click="copyToClipBoard" class="material-icons text-h5 q-ml-sm cursor-pointer clipboard-rsync">
                          content_copy  
                          <q-tooltip >
                              <span class="text-subtitle1">{{$t('copy_to_clipboard')}}</span> 
                          </q-tooltip>
                      </span>
                  </div> 
                   <div class="text-h6 q-mt-sm q-mr-md resource_info-label">{{$t('tags')}} </div>   
                  <div class="q-mt-sm">
                  <q-badge class="q-pa-md q-mr-sm q-mb-sm" color="primary"  v-for="tag in fetchedResource.resource.tags" :key="tag.id">
                          {{ tag.tag}}
                  </q-badge>
                  </div>         
                  <div class="text-h6 q-mt-sm q-mr-md resource_info-label">{{$t('licenses')}} </div>
                  <div v-if="fetchedResource.resource.licenses.length" class="q-mt-sm">
                  <q-badge class="q-pa-md q-mr-sm" color="primary"  v-for="license in fetchedResource.resource.licenses" :key="license.id">
                          {{ license.license}}
                  </q-badge>
                  </div> 
                  <div class="q-mt-sm" v-else>{{'--'}}</div>
                  <div class="text-h6 q-mt-sm q-mr-md">{{$t('uid')}} </div> 
                  <div class="text-h6 q-mt-sm">{{ fetchedResource.resource.uid }}</div>     
              </div>    
            </div>
    </q-page>
</template>

<script lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { GET_RESOURCE } from 'src/gql/resource/queries'
import { copyToClipboard } from 'quasar'

export default defineComponent({
    setup (_,{root}) {
  
    // Fetch resources
    const { result: fetchedResource, loading: fetchResourceLoading } = useQuery(GET_RESOURCE,{id: root.$route.params.id})


    const copyToClipBoard = (e: any) => {
        if(e.target.classList.contains('clipboard-sampleUrl')) {
           copyToClipboard(fetchedResource.value.resource.sample)
        } else if (e.target.classList.contains('clipboard-url')) {
           copyToClipboard(fetchedResource.value.resource.download_url)
        } else if (e.target.classList.contains('clipboard-rsync')) {
           copyToClipboard(fetchedResource.value.resource.rsync)

        }
    }

    return {
        fetchedResource,
        fetchResourceLoading,
        copyToClipBoard
    }
    }
})
</script>

<style scoped lang="scss">
.resource {

    &_image {
        width: 15rem;
        margin-bottom: 1rem;
        @media only screen and (max-width: 1050px) {
            width: 15rem;
      }
    }

    &_info {
        display: grid;
        grid-template-columns: 1fr 1fr;

      &-label {
         @media only screen and (max-width: 470px) {
            font-size: 1.2rem;
        }
      }
    }

    &_name {
      @media only screen and (max-width: 1300px) {
        font-size: 3rem;
      }
       @media only screen and (max-width: 1050px) {
        font-size: 2.6rem;
      }
    }

    &_description {
      @media only screen and (max-width: 1300px) {
        font-size: 1.2rem;
      }
    }

    &_language {
         @media only screen and (max-width: 470px) {
            margin-top: .4rem;
        }
    }

    &_container {
        width: 80%;

        @media only screen and (max-width: 900px) {
            width: 70%;
        }
        @media only screen and (max-width: 650px) {
            width: 85%;
        }
        @media only screen and (max-width: 525px) {
            width: 95%;
        }
    }
}


.visit {
    position: absolute;
    top: 2rem;
    right: 2rem;
}

</style>