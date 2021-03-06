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

        <div class="q-ml-md q-mt-sm">
          <a href="/">
            <img
              alt=""
              src="../assets/lb-logo-white-full.svg"
            >
          </a>
        </div>

        <q-toolbar-title class="josefin text-h5 q-mt-xs">
          <a
            class="text-white"
            style="text-decoration:none;"
            href="https://library.learnersblock.org"
            target="_self"
          />
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
        />
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
          {{ $t('search_options') }}
        </q-item-label>
        <q-separator class="q-mt-md" />

        <q-input
          outlined
          class="q-mt-lg q-mx-auto w-90"
          v-model="keyword"
          clearable
          @keyup="searchResources"
          :label="$t('keywords')"
        />
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
          <template #option="{ itemProps, itemEvents, opt, selected, toggleOption }">
            <q-item
              v-bind="itemProps"
              v-on="itemEvents"
            >
              <q-item-section>
                <q-item-label v-html="opt.language" />
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  :value="selected"
                  @input="toggleOption(opt)"
                />
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
          <template #option="{ itemProps, itemEvents, opt, selected, toggleOption }">
            <q-item
              v-bind="itemProps"
              v-on="itemEvents"
            >
              <q-item-section>
                <q-item-label v-html="opt.tag" />
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  :value="selected"
                  @input="toggleOption(opt)"
                />
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
          <template #option="{ itemProps, itemEvents, opt, selected, toggleOption }">
            <q-item
              v-bind="itemProps"
              v-on="itemEvents"
            >
              <q-item-section>
                <q-item-label v-html="opt.type" />
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  :value="selected"
                  @input="toggleOption(opt)"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn
          color="primary"
          class="q-ml-md q-mt-md"
          @click="resetInputs"
        >
          {{ $t('reset') }}
        </q-btn>
        <div
          v-if="fetchedResourcesLength"
          class="q-ml-md q-mt-md text-grey"
        >
          {{ $t('total_entries') }}: {{ fetchedResourcesLength.resourcesConnection.aggregate.totalCount }}
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view
        ref="view"
        :keyword="keyword"
        :formats="selectedFormats"
        :tags="selectedTags"
        :languages="selectedLanguages"
      />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { computed, defineComponent, onMounted, ref, watch } from '@vue/composition-api'
import { useQuery } from '@vue/apollo-composable'
import { GET_LANGUAGES } from '../gql/language/queries'
import { GET_FORMATS } from '../gql/format/queries'
import { GET_TAGS } from '../gql/tag/queries'
import { GET_RESOURCES_LENGTH } from '../gql/resource/queries'
import qLang from '../i18n/index'

export default defineComponent({
  name: 'MainLayout',
  setup (_, { root }) {
    // Drawer toggle
    const leftDrawerOpen = ref(false)
    // Keyword input
    const keyword = ref<string>('')
    // Router view refference in order call method from parent to child
    const view = ref<any>(null)
    // Selected languages for select dropdown - IDs
    const selectedLanguages = ref<string[]>([])
    // Selected formats
    const selectedFormats = ref<[]>([])
    // Selected tags
    const selectedTags = ref<string[]>([])
    // Languages for i18n
    const languages = ref<[]>([
      {
        name: 'en-us',
        label: qLang.qEnUS.nativeName
      }, {
        name: 'ar',
        label: qLang.qAr.nativeName
      }, {
        name: 'es',
        label: qLang.qEs.nativeName
      }, {
        name: 'fr',
        label: qLang.qFr.nativeName
      }
    ] as any)
    // Selected language for i18n
    const selectedLanguage = ref<string>('en-us')
    // Fetch languages query
    const { result: fetchedLanguages, loading: fetchLanguagesLoading, refetch: fetchLanguages } = useQuery(GET_LANGUAGES)
    // Fetch formats query
    const { result: fetchedFormats, loading: fetchFormatsLoading, refetch: fetchFormats } = useQuery(GET_FORMATS)
    // Fetch tags query
    const { result: fetchedTags, loading: fetchTagsLoading, refetch: fetchTags } = useQuery(GET_TAGS)

    // Fetch resources query
    const {
      result: fetchedResourcesLength
    } = useQuery(GET_RESOURCES_LENGTH, {})

    onMounted(async () => {
      await fetchLanguages()
      await fetchFormats()
      await fetchTags()
    })
    // If keyword input is cleared, then execute the query
    watch(() => keyword.value, (newValue) => {
      if (newValue === null) {
        searchResources()
      }
    })

    // Used to disable the drawer once the user goes to a specific resource
    const isInIndex = computed(() => {
      return root.$route.path === '/'
    })

    // Method to call fetchFilteredResources from parent to child
    const searchResources = () => {
      view.value.fetchFilteredResources(keyword.value, selectedFormats.value, selectedLanguages.value, selectedTags.value)
    }

    // Switch i18n language according to selectedLanguage input
    const switchLanguage = () => {
      if (selectedLanguage.value === 'ar') {
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
      keyword.value = ''
      selectedLanguages.value = []
      selectedFormats.value = []
      selectedTags.value = []
      view.value.fetchFilteredResources(keyword.value, selectedFormats.value, selectedLanguages.value, selectedTags.value)
    }

    return {
      leftDrawerOpen,
      keyword,
      selectedLanguages,
      fetchedLanguages,
      fetchLanguagesLoading,
      fetchedResourcesLength,
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
