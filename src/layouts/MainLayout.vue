<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          v-if="isInIndex"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-avatar>
          <span class="material-icons q-ml-md text-h5">
          view_in_ar
        </span>
        </q-avatar>

        <q-toolbar-title class="josefin text-h5 q-mt-xs" >
          <a class="text-white" style="text-decoration:none;" href="https://library.learnersblock.org" target="_self">
          Learner's Block
          </a>
        </q-toolbar-title>
        <q-select
            class="w-15 q-mx-auto q-pa-sm"
            filled
            square
            color="dark" 
            bg-color="grey-3"
            v-model="selectedLanguage"
            :label="$t('switch_language')"
            :options="languages"
            :option-value="(lang) => lang.name"
            emit-value
            map-options
            @input="switchLanguage"
        >
      </q-select>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      v-if="isInIndex"
      bordered
      content-class="bg-white"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8 text-h5 text-center q-mt-md"
        >
        {{$t('search_options')}}
        </q-item-label>
        <q-separator class="q-mt-md"/>
   
        <q-input 
          outlined 
          class="q-mt-lg q-mx-auto w-90"         
          v-model="keyword" 
          clearable
          @keyup="searchResources" 
          :label="$t('keywords')"/>
        <q-select
            class="w-90 q-mx-auto q-mt-md"
            outlined
            v-if="fetchedLanguages"
            v-model="selectedLanguages"
            :label="$t('languages')"
            :option-label="(lang) => lang.language"
            :option-value="(lang) => lang.id"
            :options="fetchedLanguages.languages"
            @input="searchResources"
            multiple
            map-options
            emit-value
        >
        <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
          <q-item
            v-bind="itemProps"
            v-on="itemEvents"
          >
            <q-item-section>
              <q-item-label v-html="opt.language" ></q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle :value="selected" @input="toggleOption(opt)" />
            </q-item-section>
          </q-item>
        </template>
      </q-select>

         <q-select
            class="w-90 q-mx-auto q-mt-md"
            outlined
            v-model="selectedTags"
            v-if="fetchedTags"
            :options="fetchedTags.tags"
            :option-label="(tag) => tag.tag"
            :option-value="(tag) => tag.id"
            :label="$t('tags')"
            @input="searchResources"
            multiple
            emit-value
            map-options
        >
        <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
          <q-item
            v-bind="itemProps"
            v-on="itemEvents"
          >
            <q-item-section>
              <q-item-label v-html="opt.tag" ></q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle :value="selected" @input="toggleOption(opt)" />
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
            class="w-90 q-mx-auto q-mt-md"
            outlined
            v-model="selectedFormats"
            v-if="fetchedFormats"
            :options="fetchedFormats.formats"
            :option-label="(format) => format.type"
            :option-value="(format) => format.id"
            :label="$t('formats')"
            @input="searchResources"
            multiple
            emit-value
            map-options
        >
        <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
          <q-item
            v-bind="itemProps"
            v-on="itemEvents"
          >
            <q-item-section>
              <q-item-label v-html="opt.type" ></q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle :value="selected" @input="toggleOption(opt)" />
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-btn color="primary" class="q-ml-md q-mt-md" @click="resetInputs">{{$t('reset')}}</q-btn>

      </q-list>      
    </q-drawer>

    <q-page-container>
      <router-view ref="view" :keyword="keyword" :formats="selectedFormats" :tags="selectedTags" :languages="selectedLanguages"></router-view>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { computed, defineComponent, onMounted, ref, watch } from '@vue/composition-api'
import { useQuery } from "@vue/apollo-composable"
import { GET_LANGUAGES } from '../gql/language/queries'
import { GET_FORMATS } from '../gql/format/queries'
import { GET_TAGS } from '../gql/tag/queries'
import Index from '../pages/Index.vue'
import Resource from '../pages/Resource.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    Index,
    Resource
  },
  setup (_,{root}) {
    // Drawer toggle
    const leftDrawerOpen = ref(false)
    // Keyword input
    const keyword = ref<string>("")
    // Router view refference in order call method from parent to child
    const view = ref<any>(null)
    // Selected languages for select dropdown - IDs
    const selectedLanguages = ref<string[]>([])
    // Selected formats - Audio, Video etc
    const selectedFormats = ref<[]>([])
    // Selected tags - EiE etc
    const selectedTags = ref<string[]>([])
    // Sample languages for i18n - Put as many as you like here
    const languages = ref<[]>([
      {
        name: 'en-us',
        label: 'English'
      }, {
        name: 'fr',
        label: 'French'
      }, {
        name: 'es',
        label: 'Spanish'
      },
      {
        name: 'ar',
        label: 'Arabic'
      }
    ] as any)
    // Selected language for i18n
    const selectedLanguage = ref<string>("en-us")
    // Fetch languages query
    const { result: fetchedLanguages,loading: fetchLanguagesLoading, refetch: fetchLanguages } = useQuery(GET_LANGUAGES)
    // Fetch formats query
    const { result: fetchedFormats,loading: fetchFormatsLoading, refetch: fetchFormats } = useQuery(GET_FORMATS)
    // Fetch tags query
    const { result: fetchedTags,loading: fetchTagsLoading, refetch: fetchTags } = useQuery(GET_TAGS)
   
   onMounted(async() => {
     await fetchLanguages()
     await fetchFormats()
     await fetchTags()
   })
   // If keyword input is cleared, then execute the query
   watch(() => keyword.value,(newValue) => {
     if(newValue === null) {
       searchResources()
     }
   }) 

    // Used to disable the drawer once the user goes to a specific resource
   const isInIndex = computed(() => {
     return root.$route.path === '/'
   })
   
   // Method to call fetchFilteredResources from parent to child
   const searchResources = () => {
     view.value.fetchFilteredResources(keyword.value,selectedFormats.value,selectedLanguages.value,selectedTags.value) 
   }

  // Switch i18n language according to selectedLanguage input
   const switchLanguage = () => {
     if(selectedLanguage.value === 'ar') {
         import(
        /* webpackInclude: /(de|en-us)\.js$/ */
        'quasar/lang/' + 'he'
        ).then(lang => {
        root.$q.lang.set(lang.default)
      })
     } else {
      import(
        /* webpackInclude: /(de|en-us)\.js$/ */
        'quasar/lang/' + 'en-us'
        ).then(lang => {
        root.$q.lang.set(lang.default)
     })
     }
   
     root.$i18n.locale = selectedLanguage.value
   }

   const resetInputs = () => {
     keyword.value = ""
     selectedLanguages.value = []
     selectedFormats.value = []
     selectedTags.value = []
     view.value.fetchFilteredResources(keyword.value,selectedFormats.value,selectedLanguages.value,selectedTags.value) 

   }

    return {
      leftDrawerOpen,
      keyword,
      selectedLanguages,
      fetchedLanguages,
      fetchLanguagesLoading,
      selectedFormats,
      selectedTags,
      fetchedTags,
      fetchTagsLoading,
      fetchedFormats,
      selectedLanguage,
      searchResources,
      switchLanguage,
      languages,
      resetInputs,
      fetchFormatsLoading,
      isInIndex,
      view
    }
  }
})
</script>
