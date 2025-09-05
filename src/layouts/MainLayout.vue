<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" class="q-mr-sm" @click="toggleLeftDrawer">
          <q-tooltip>Toggle Sidebar</q-tooltip>
        </q-btn>
        <q-toolbar-title> TaskForge AI </q-toolbar-title>
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
            color="primary"
            label="Export Project"
            icon="download"
            class="full-width q-mb-sm"
            @click="exportProject"
          >
            <q-tooltip>Export Entire Project as JSON</q-tooltip>
          </q-btn>
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

const exportProject = () => {
  try {
    // Get the current project from localStorage
    const savedProject = localStorage.getItem('ai-project-tree');

    if (!savedProject) {
      $q.notify({
        type: 'warning',
        message: 'No project to export',
        caption: 'Create a project first before exporting',
        icon: 'warning',
        position: 'top',
        timeout: 3000,
      });
      return;
    }

    const project = JSON.parse(savedProject);

    // Create a clean copy for export with metadata
    const projectToExport = {
      ...project,
      exportedAt: new Date().toISOString(),
      exportedBy: 'AI Project Task Generator',
      version: '1.0.0',
      metadata: {
        totalNodes: countNodes(project),
        nodeTypes: getNodeTypes(project),
        exportType: 'full_project',
      },
    };

    // Convert to JSON with pretty formatting
    const jsonString = JSON.stringify(projectToExport, null, 2);

    // Create a blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai_project_${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL
    URL.revokeObjectURL(url);

    // Show success notification
    $q.notify({
      type: 'positive',
      message: 'Project exported successfully',
      caption: `Exported ${projectToExport.metadata.totalNodes} nodes`,
      icon: 'download',
      position: 'top',
      timeout: 3000,
    });
  } catch (error) {
    console.error('Export error:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to export project',
      caption: error instanceof Error ? error.message : 'Unknown error',
      icon: 'error',
      position: 'top',
      timeout: 5000,
    });
  }
};

// Helper function to count total nodes in the project
const countNodes = (node: { children?: unknown[] }): number => {
  let count = 1; // Count the current node
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countNodes(child as { children?: unknown[] });
    }
  }
  return count;
};

// Helper function to get unique node types in the project
const getNodeTypes = (node: { type: string; children?: unknown[] }): string[] => {
  const types = new Set([node.type]);
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      getNodeTypes(child as { type: string; children?: unknown[] }).forEach((type) =>
        types.add(type),
      );
    }
  }
  return Array.from(types);
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
