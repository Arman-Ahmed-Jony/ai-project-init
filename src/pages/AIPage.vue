<template>
  <q-page class="ai-page">
    <div class="ai-header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">
              <q-icon name="psychology" size="2rem" color="primary" class="q-mr-sm" />
              AI Project Management
            </h1>
            <p class="page-subtitle">Navigate your project planning with AI-powered intelligence</p>
          </div>
          <div class="header-right">
            <q-btn flat color="primary" label="Back to Home" icon="home" @click="goHome" />
          </div>
        </div>
      </div>
    </div>

    <div class="ai-content">
      <div class="container">
        <!-- Welcome Message -->
        <div v-if="!projectNode" class="welcome-section">
          <div class="welcome-content">
            <q-icon name="assignment" size="4rem" color="primary" class="q-mb-md" />
            <div class="text-h5 text-grey-7 q-mb-sm">Start Your AI Project</div>
            <div class="text-body1 text-grey-6 q-mb-lg">
              Create a new project to begin generating epics, features, stories, and tasks with AI.
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
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import TreeNode from '../components/TreeNode.vue';
import type { ProjectNode, CellType } from '../components/models';
import { geminiService } from '../services/geminiService';

// Quasar instance for notifications
const $q = useQuasar();
const router = useRouter();

// Project tree state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const projectNode = ref<any>(null);
const isGenerating = ref(false);
const generatingNodeId = ref<string | null>(null);

// Inject API configuration from MainLayout
const apiKey = inject<{ value: string }>('apiKey');
const selectedModel = inject<{ value: string }>('selectedModel');

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

// Watch for changes in projectNode and save to localStorage
watch(
  projectNode,
  () => {
    saveProject();
  },
  { deep: true },
);

// Create a new project
const createProject = () => {
  $q.dialog({
    title: 'Create New Project',
    message: 'Enter your project description:',
    prompt: {
      model: 'textarea',
      isValid: (val: string) => Boolean(val && val.length > 10),
      placeholder: 'Describe your project idea...',
    },
    cancel: true,
    persistent: true,
  }).onOk((data: string) => {
    const newProject: ProjectNode = {
      id: `project-${Date.now()}`,
      type: 'project',
      title: 'New Project',
      description: data,
      children: [],
      timestamp: Date.now(),
    };

    projectNode.value = newProject;
    $q.notify({
      type: 'positive',
      message: 'Project created successfully!',
      icon: 'check_circle',
    });
  });
};

// Navigate to home
const goHome = () => {
  void router.push('/');
};

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
    const children = await generateChildrenForNode(node);

    if (children.length > 0) {
      if (node.type === 'project') {
        projectNode.value = { ...projectNode.value, children };
      } else {
        updateNodeInTree(projectNode.value, { ...node, children });
      }

      $q.notify({
        type: 'positive',
        message: `Generated ${children.length} ${getChildrenLabel(node.type)}`,
        icon: 'auto_awesome',
      });
    } else {
      $q.notify({
        type: 'warning',
        message: 'No content generated',
        caption: 'Please try again with a different description',
        icon: 'warning',
      });
    }
  } catch (error) {
    console.error('Error generating content:', error);

    let errorMessage = 'Generation failed';
    let errorCaption = 'Unknown error occurred';

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'API Key Required';
        errorCaption = 'Please enter your Gemini API key in the sidebar to generate content';
      } else if (error.message.includes('Invalid API key')) {
        errorMessage = 'Invalid API Key';
        errorCaption = 'Please check your Gemini API key in the sidebar';
      } else {
        errorMessage = 'Generation Failed';
        errorCaption = error.message;
      }
    }

    if (errorMessage.includes('API key')) {
      $q.notify({
        type: 'negative',
        message: errorMessage,
        caption: errorCaption,
        icon: 'error',
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
    } else {
      $q.notify({
        type: 'negative',
        message: errorMessage,
        caption: errorCaption,
        icon: 'error',
        timeout: 5000,
      });
    }
  } finally {
    isGenerating.value = false;
    generatingNodeId.value = null;
  }
};

// Add a child node
const handleAddChild = (parentNode: ProjectNode) => {
  const childType = getChildType(parentNode.type);
  if (!childType) return;

  $q.dialog({
    title: `Add New ${childType.charAt(0).toUpperCase() + childType.slice(1)}`,
    message: `Enter the ${childType} description:`,
    prompt: {
      model: 'textarea',
      isValid: (val: string) => Boolean(val && val.length > 5),
      placeholder: `Describe the ${childType}...`,
    },
    cancel: true,
    persistent: true,
  }).onOk((data: string) => {
    const newChild: ProjectNode = {
      id: `${childType}-${Date.now()}`,
      type: childType as CellType,
      title: `New ${childType.charAt(0).toUpperCase() + childType.slice(1)}`,
      description: data,
      children: [],
      timestamp: Date.now(),
    };

    if (parentNode.type === 'project') {
      projectNode.value = {
        ...projectNode.value,
        children: [...(projectNode.value.children || []), newChild],
      };
    } else {
      updateNodeInTree(projectNode.value, {
        ...parentNode,
        children: [...(parentNode.children || []), newChild],
      });
    }

    $q.notify({
      type: 'positive',
      message: `${childType.charAt(0).toUpperCase() + childType.slice(1)} added successfully!`,
      icon: 'add_circle',
    });
  });
};

// Helper functions
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

const generateChildrenForNode = async (node: ProjectNode): Promise<ProjectNode[]> => {
  // Initialize Gemini service with API key and model
  if (!apiKey?.value) {
    throw new Error('API key is required. Please enter your Gemini API key in the sidebar.');
  }

  try {
    geminiService.initialize(apiKey.value, selectedModel?.value || 'gemini-1.5-flash');
  } catch (error) {
    throw new Error(
      `Failed to initialize Gemini service: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }

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

const getChildType = (parentType: string): string | null => {
  switch (parentType) {
    case 'project':
      return 'epic';
    case 'epic':
      return 'feature';
    case 'feature':
      return 'story';
    case 'story':
      return 'task';
    default:
      return null;
  }
};

const getChildrenLabel = (parentType: string): string => {
  switch (parentType) {
    case 'project':
      return 'epics';
    case 'epic':
      return 'features';
    case 'feature':
      return 'stories';
    case 'story':
      return 'tasks';
    default:
      return 'items';
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
.ai-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.ai-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
}

.page-subtitle {
  color: #7f8c8d;
  margin: 0;
  font-size: 1.1rem;
}

.header-right {
  margin-left: 2rem;
}

.ai-content {
  padding: 2rem 0;
}

.welcome-section {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
}

.welcome-content {
  max-width: 500px;
  margin: 0 auto;
}

.project-container {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin: 2rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-right {
    margin-left: 0;
    align-self: flex-end;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .container {
    padding: 0 1rem;
  }
}
</style>
