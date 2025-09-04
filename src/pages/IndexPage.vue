<template>
  <q-page class="project-page">
    <div class="q-pa-lg">
      <!-- Welcome Message -->
      <div v-if="!projectNode" class="text-center q-py-xl">
        <q-icon name="assignment" size="4rem" color="primary" class="q-mb-md" />
        <div class="text-h5 text-grey-7 q-mb-sm">Project Task Generator</div>
        <div class="text-body1 text-grey-6 q-mb-lg">
          Start by creating a project to generate epics, features, stories, and tasks.
        </div>
        <q-btn
          color="primary"
          label="Create New Project"
          icon="add"
          size="lg"
          @click="createProject"
        >
          <q-tooltip>Start a new project and generate epics</q-tooltip>
        </q-btn>
      </div>

      <!-- Project Tree -->
      <div v-else class="project-container">
        <TreeNode
          :node="projectNode"
          :is-root="true"
          :is-generating="isGenerating || false"
          :generating-node-id="generatingNodeId || null"
          @update="handleNodeUpdate"
          @delete="handleNodeDelete"
          @generate="handleNodeGenerate"
          @add-child="handleAddChild"
          @reorder="handleNodeReorder"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, watch } from 'vue';
import { useQuasar } from 'quasar';
import TreeNode from '../components/TreeNode.vue';
import type { ProjectNode, CellType } from '../components/models';
import { geminiService } from '../services/geminiService';

// Quasar instance for notifications
const $q = useQuasar();

// Project tree state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const projectNode = ref<any>(null);
const isGenerating = ref(false);
const generatingNodeId = ref<string | null>(null);

// Load saved project from localStorage
const loadProject = () => {
  const savedProject = localStorage.getItem('ai-project-tree');
  if (savedProject) {
    try {
      projectNode.value = JSON.parse(savedProject);
    } catch (error) {
      console.error('Error loading saved project:', error);
      projectNode.value = null;
    }
  }
};

// Save project to localStorage
const saveProject = () => {
  if (projectNode.value) {
    localStorage.setItem('ai-project-tree', JSON.stringify(projectNode.value));
  } else {
    localStorage.removeItem('ai-project-tree');
  }
};

// Inject API configuration from parent
const apiKey = inject<{ value: string }>('apiKey');
const selectedModel = inject<{ value: string }>('selectedModel');

// Generate unique ID
const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create a new project
const createProject = () => {
  projectNode.value = {
    id: generateId(),
    type: 'project',
    title: 'New Project',
    description: 'Enter your project description here',
    children: [],
    timestamp: Date.now(),
  };
};

// Watch for changes in projectNode and save to localStorage
watch(
  projectNode,
  () => {
    saveProject();
  },
  { deep: true },
);

// Update a node
const handleNodeUpdate = (updatedNode: ProjectNode) => {
  if (updatedNode.type === 'project') {
    projectNode.value = updatedNode;
  } else if (projectNode.value) {
    updateNodeInTree(projectNode.value, updatedNode);
  }
};

// Delete a node
const handleNodeDelete = (nodeId: string) => {
  if (projectNode.value?.id === nodeId) {
    projectNode.value = null;
  } else if (projectNode.value) {
    deleteNodeFromTree(projectNode.value, nodeId);
  }
};

// Handle node reordering
const handleNodeReorder = (reorderedNode: ProjectNode) => {
  // The reorder is already handled by the v-model in draggable
  // This function can be used for additional logic if needed
  console.log('Node reordered:', reorderedNode.title);
};

// Generate children for a node
const handleNodeGenerate = async (node: ProjectNode) => {
  if (!apiKey?.value) {
    $q.notify({
      type: 'warning',
      message: 'API Key Required',
      caption: 'Please enter your Gemini API key in the sidebar to generate content',
      icon: 'key',
      position: 'top',
      timeout: 5000,
      actions: [
        {
          label: 'Get API Key',
          color: 'white',
          handler: () => {
            window.open('https://makersuite.google.com/app/apikey', '_blank');
          },
        },
      ],
    });
    return;
  }

  isGenerating.value = true;
  generatingNodeId.value = node.id;

  try {
    // Initialize Gemini service
    geminiService.initialize(apiKey.value, selectedModel?.value || 'gemini-1.5-flash');

    // Test API connection first
    console.log('Testing API connection...');
    try {
      const isConnected = await geminiService.testConnection();
      if (!isConnected) {
        throw new Error('API connection test failed - please check your API key');
      }
      console.log('API connection successful, proceeding with generation...');
    } catch (connectionError) {
      throw new Error(
        `API connection failed: ${connectionError instanceof Error ? connectionError.message : 'Unknown connection error'}`,
      );
    }

    const children = await generateChildrenForNode(node);
    const updatedNode = {
      ...node,
      children: [...(node.children || []), ...children],
    };
    handleNodeUpdate(updatedNode);

    $q.notify({
      type: 'positive',
      message: `Successfully generated ${children.length} ${getChildrenLabel(node.type)}`,
      position: 'top',
      timeout: 3000,
    });
  } catch (error) {
    console.error('Generation error:', error);

    // Show error notification
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    $q.notify({
      type: 'negative',
      message: `Failed to generate ${getChildrenLabel(node.type)}`,
      caption: errorMessage,
      icon: 'error',
      position: 'top',
      timeout: 8000,
      actions: [
        {
          label: 'Dismiss',
          color: 'white',
          handler: () => {},
        },
      ],
    });
  } finally {
    isGenerating.value = false;
    generatingNodeId.value = null;
  }
};

// Add a child node
const handleAddChild = (parentNode: ProjectNode, childType: CellType) => {
  const newChild: ProjectNode = {
    id: generateId(),
    type: childType,
    title: `New ${getNodeTypeLabel(childType)}`,
    description: `Enter ${childType} description`,
    parentId: parentNode.id,
    timestamp: Date.now(),
  };

  const updatedParent = {
    ...parentNode,
    children: [...(parentNode.children || []), newChild],
  };
  handleNodeUpdate(updatedParent);
};

// Helper functions
const getNodeTypeLabel = (type: CellType): string => {
  const labels = {
    project: 'Project',
    epic: 'Epic',
    feature: 'Feature',
    story: 'Story',
    task: 'Task',
  };
  return labels[type] || 'Unknown';
};

const getChildrenLabel = (type: CellType): string => {
  const labels = {
    project: 'epics',
    epic: 'features',
    feature: 'stories',
    story: 'tasks',
    task: 'items',
  };
  return labels[type] || 'items';
};

// Update node in tree recursively
const updateNodeInTree = (root: ProjectNode, updatedNode: ProjectNode): boolean => {
  if (root.id === updatedNode.id) {
    Object.assign(root, updatedNode);
    return true;
  }

  if (root.children) {
    for (const child of root.children) {
      if (updateNodeInTree(child, updatedNode)) {
        return true;
      }
    }
  }

  return false;
};

// Delete node from tree recursively
const deleteNodeFromTree = (root: ProjectNode, nodeId: string): boolean => {
  if (root.children) {
    const index = root.children.findIndex((child) => child.id === nodeId);
    if (index !== -1) {
      root.children.splice(index, 1);
      return true;
    }

    for (const child of root.children) {
      if (deleteNodeFromTree(child, nodeId)) {
        return true;
      }
    }
  }

  return false;
};

// Generate children for a node based on its type
const generateChildrenForNode = async (node: ProjectNode): Promise<ProjectNode[]> => {
  switch (node.type) {
    case 'project':
      return await geminiService.generateEpics(node);
    case 'epic':
      return await geminiService.generateFeatures(node);
    case 'feature':
      return await geminiService.generateStories(node);
    case 'story':
      return await geminiService.generateTasks(node);
    default:
      return [];
  }
};

// Event listeners for sidebar actions
const handleAddNewCell = () => {
  if (!projectNode.value) {
    createProject();
  }
};

const handleClearAllCells = () => {
  projectNode.value = null;
};

onMounted(() => {
  // Load saved project
  loadProject();

  // Listen for events from the sidebar
  window.addEventListener('addNewCell', handleAddNewCell);
  window.addEventListener('clearAllCells', handleClearAllCells);
});

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('addNewCell', handleAddNewCell);
  window.removeEventListener('clearAllCells', handleClearAllCells);
});
</script>

<style scoped>
.project-page {
  background-color: #fafafa;
  min-height: 100vh;
}

.project-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .project-page .q-pa-lg {
    padding: 1rem;
  }
}
</style>
