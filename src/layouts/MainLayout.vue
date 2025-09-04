<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" class="q-mr-sm" @click="toggleLeftDrawer">
          <q-tooltip>Toggle Sidebar</q-tooltip>
        </q-btn>
        <q-toolbar-title> AI Notebook </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-scroll-area class="fit">
        <div class="q-pa-md">
          <div class="text-h6 q-mb-md">Configuration</div>

          <q-input
            v-model="apiKey"
            label="Gemini API Key"
            type="password"
            filled
            class="q-mb-md"
            hint="Enter your Google AI Studio API key"
          />

          <q-select
            v-model="selectedModel"
            :options="modelOptions"
            label="Model"
            filled
            class="q-mb-md"
            emit-value
            map-options
          />

          <q-separator class="q-my-md" />

          <div class="text-subtitle2 q-mb-sm">Notebook Actions</div>
          <q-btn
            color="secondary"
            label="Clear All"
            icon="clear_all"
            class="full-width"
            @click="clearAllCells"
          >
            <q-tooltip>Clear All Project Data</q-tooltip>
          </q-btn>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const leftDrawerOpen = ref(true);

const apiKey = ref('');
const selectedModel = ref('gemini-2.0-flash');

// Quasar instance for dialogs
const $q = useQuasar();

const modelOptions = [
  { label: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
  { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
  { label: 'Gemini 1.0 Pro', value: 'gemini-1.0-pro' },
  { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
];

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const clearAllCells = () => {
  // Show Quasar confirmation dialog before clearing all data
  $q.dialog({
    title: 'Clear All Data',
    message:
      'Are you sure you want to clear all project data?\n\nThis will delete the entire project tree and cannot be undone.',
    cancel: {
      label: 'Cancel',
      color: 'grey',
      flat: true,
    },
    ok: {
      label: 'Clear All',
      color: 'negative',
      flat: true,
    },
    persistent: true,
  }).onOk(() => {
    window.dispatchEvent(new CustomEvent('clearAllCells'));
  });
};

// Provide API configuration to child components
import { provide } from 'vue';
provide('apiKey', apiKey);
provide('selectedModel', selectedModel);
</script>
