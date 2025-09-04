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
          >
            <template v-slot:append>
              <q-icon v-if="apiKey" name="check_circle" color="positive" size="sm">
                <q-tooltip>API Key Saved</q-tooltip>
              </q-icon>
            </template>
          </q-input>

          <q-select
            v-model="selectedModel"
            :options="modelOptions"
            label="Model"
            filled
            class="q-mb-md"
            emit-value
            map-options
          >
            <template v-slot:append>
              <q-icon name="check_circle" color="positive" size="sm">
                <q-tooltip>Model Selection Saved</q-tooltip>
              </q-icon>
            </template>
          </q-select>

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
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

const leftDrawerOpen = ref(true);

// Load saved values from localStorage or use defaults
const apiKey = ref(localStorage.getItem('gemini-api-key') || '');
const selectedModel = ref(localStorage.getItem('gemini-selected-model') || 'gemini-2.0-flash');

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

// Watch for changes and save to localStorage
watch(apiKey, (newValue) => {
  if (newValue) {
    localStorage.setItem('gemini-api-key', newValue);
  } else {
    localStorage.removeItem('gemini-api-key');
  }
});

watch(selectedModel, (newValue) => {
  localStorage.setItem('gemini-selected-model', newValue);
});

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
    // Clear project data
    window.dispatchEvent(new CustomEvent('clearAllCells'));

    // Optionally clear API configuration
    $q.dialog({
      title: 'Clear API Configuration',
      message: 'Do you also want to clear your saved API key and model selection?',
      cancel: {
        label: 'Keep Settings',
        color: 'grey',
        flat: true,
      },
      ok: {
        label: 'Clear Settings',
        color: 'negative',
        flat: true,
      },
    }).onOk(() => {
      apiKey.value = '';
      selectedModel.value = 'gemini-2.0-flash';
      localStorage.removeItem('gemini-api-key');
      localStorage.removeItem('gemini-selected-model');
    });
  });
};

// Provide API configuration to child components
import { provide } from 'vue';
provide('apiKey', apiKey);
provide('selectedModel', selectedModel);
</script>
