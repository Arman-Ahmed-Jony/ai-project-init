<template>
  <div class="tree-node">
    <div class="node-content" :class="{ 'is-editing': isEditing }">
      <!-- Node Header -->
      <div class="node-header">
        <div class="node-info">
          <!-- Drag Handle -->
          <q-icon
            v-if="!isRoot"
            name="drag_indicator"
            class="drag-handle q-mr-sm"
            size="sm"
            color="grey-6"
            style="cursor: grab; user-select: none"
          />
          <q-chip
            :color="getNodeTypeColor(node.type)"
            text-color="white"
            :icon="getNodeTypeIcon(node.type)"
            size="sm"
            class="q-mr-sm"
          >
            {{ getNodeTypeLabel(node.type) }}
          </q-chip>
          <span class="node-title">{{ node.title }}</span>
        </div>
        <div class="node-actions">
          <q-btn
            v-if="!isEditing"
            flat
            round
            icon="edit"
            size="sm"
            color="grey-6"
            @click="startEditing"
          >
            <q-tooltip>Edit {{ getNodeTypeLabel(node.type) }}</q-tooltip>
          </q-btn>
          <q-btn
            v-if="!isEditing"
            flat
            round
            icon="add"
            size="sm"
            color="primary"
            @click="addChild"
          >
            <q-tooltip>Add {{ getAddChildLabel() }}</q-tooltip>
          </q-btn>
          <q-btn
            v-if="!isEditing && canGenerate"
            flat
            round
            :icon="isCurrentlyGenerating ? 'hourglass_empty' : getGenerateIcon()"
            size="sm"
            :color="getNodeTypeColor(node.type)"
            :loading="isCurrentlyGenerating"
            :disable="isCurrentlyGenerating"
            @click="generateChildren"
          >
            <q-tooltip>
              {{
                isCurrentlyGenerating ? 'Generating...' : `Generate ${getChildrenLabel(node.type)}`
              }}
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="!isEditing && !isRoot"
            flat
            round
            icon="delete"
            size="sm"
            color="negative"
            @click="deleteNode"
          >
            <q-tooltip>Delete {{ getNodeTypeLabel(node.type) }}</q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- Node Content -->
      <div class="node-body">
        <!-- Display Mode -->
        <div v-if="!isEditing" class="node-display">
          <div
            v-if="node.description"
            ref="descriptionContainer"
            class="node-description"
            v-html="renderMarkdown(node.description)"
          ></div>
          <div v-if="nodeChildren && nodeChildren.length > 0" class="children-count">
            {{ nodeChildren.length }} {{ getChildrenLabel() }}
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="node-edit">
          <q-input v-model="editTitle" label="Title" filled class="q-mb-sm" />
          <q-input
            v-model="editDescription"
            label="Description"
            type="textarea"
            filled
            autogrow
            rows="2"
            class="q-mb-sm"
          />
          <div class="edit-actions">
            <q-btn color="positive" label="Save" icon="check" size="sm" @click="saveEdit">
              <q-tooltip>Save Changes</q-tooltip>
            </q-btn>
            <q-btn color="grey" label="Cancel" icon="close" size="sm" flat @click="cancelEdit">
              <q-tooltip>Cancel Edit</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Children -->
    <div v-if="nodeChildren && nodeChildren.length > 0" class="children-container">
      <div class="children-indent">
        <!-- Debug info -->
        <div v-if="!isRoot" style="font-size: 12px; color: #666; margin-bottom: 8px">
          Children: {{ nodeChildren.length }} | Draggable: {{ !isRoot }}
        </div>
        <draggable
          v-model="nodeChildren"
          @start="handleDragStart"
          @end="handleDragEnd"
          @change="handleDragChange"
          item-key="id"
        >
          <template #item="{ element: child }">
            <TreeNode
              :key="child.id"
              :node="child"
              :is-root="false"
              :is-generating="isGenerating"
              :generating-node-id="generatingNodeId"
              @update="handleChildUpdate"
              @delete="handleChildDelete"
              @generate="handleChildGenerate"
              @add-child="handleAddChild"
              @reorder="handleChildReorder"
            />
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import draggable from 'vuedraggable';
import MarkdownIt from 'markdown-it';
import { useQuasar } from 'quasar';
import type { ProjectNode, CellType } from './models';
import { mermaidService } from '../services/mermaidService';

interface Props {
  node: ProjectNode;
  isRoot?: boolean;
  isGenerating: boolean;
  generatingNodeId: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  isRoot: false,
  isGenerating: false,
  generatingNodeId: null,
});

const emit = defineEmits<{
  update: [node: ProjectNode];
  delete: [nodeId: string];
  generate: [node: ProjectNode];
  'add-child': [parentNode: ProjectNode, type: CellType];
  reorder: [node: ProjectNode];
}>();

const isEditing = ref(false);
const editTitle = ref('');
const editDescription = ref('');
const descriptionContainer = ref<HTMLElement | null>(null);

// Quasar instance for dialogs
const $q = useQuasar();

// Computed property for node children with getter and setter
const nodeChildren = computed({
  get: () => props.node.children || [],
  set: (newChildren) => {
    const updatedNode = {
      ...props.node,
      children: newChildren,
    };
    emit('update', updatedNode);
  },
});

// Computed properties
const canGenerate = computed(() => {
  const type = props.node.type;
  return type === 'project' || type === 'epic' || type === 'feature' || type === 'story';
});

const isCurrentlyGenerating = computed(() => {
  return props.isGenerating && props.generatingNodeId === props.node.id;
});

// Helper functions
const getNodeTypeColor = (type: string): string => {
  const colors = {
    project: 'primary',
    epic: 'purple',
    feature: 'blue',
    story: 'green',
    task: 'orange',
  };
  return colors[type as keyof typeof colors] || 'grey';
};

const getNodeTypeIcon = (type: string): string => {
  const icons = {
    project: 'description',
    epic: 'star',
    feature: 'extension',
    story: 'book',
    task: 'assignment',
  };
  return icons[type as keyof typeof icons] || 'help';
};

const getNodeTypeLabel = (type: string): string => {
  const labels = {
    project: 'Project',
    epic: 'Epic',
    feature: 'Feature',
    story: 'Story',
    task: 'Task',
  };
  return labels[type as keyof typeof labels] || 'Unknown';
};

const getGenerateIcon = (): string => {
  const type = props.node.type;
  const icons = {
    project: 'auto_awesome',
    epic: 'extension',
    feature: 'book',
    story: 'assignment',
  };
  return icons[type as keyof typeof icons] || 'play_arrow';
};

const getChildrenLabel = (type?: string): string => {
  const nodeType = type || props.node.type;
  const labels = {
    project: 'epics',
    epic: 'features',
    feature: 'stories',
    story: 'tasks',
  };
  return labels[nodeType as keyof typeof labels] || 'items';
};

const getAddChildLabel = (): string => {
  const labels = {
    project: 'Epic',
    epic: 'Feature',
    feature: 'Story',
    story: 'Task',
  };
  return labels[props.node.type as keyof typeof labels] || 'Item';
};

// Custom Mermaid plugin for markdown-it
const mermaidPlugin = (md: MarkdownIt) => {
  const defaultRender =
    md.renderer.rules.fence ||
    function (tokens, idx, options, env, renderer) {
      return '';
    };

  md.renderer.rules.fence = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx];
    if (!token) return defaultRender(tokens, idx, options, env, renderer);

    const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
    const langName = info ? info.split(/\s+/g)[0] : '';

    if (langName === 'mermaid') {
      const code = token.content.trim();
      return `<div class="mermaid" data-mermaid="${encodeURIComponent(code)}">${code}</div>`;
    }

    return defaultRender(tokens, idx, options, env, renderer);
  };
};

// Initialize markdown-it with custom Mermaid plugin
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
}).use(mermaidPlugin);

// Markdown rendering function with Mermaid support
const renderMarkdown = (text: string): string => {
  if (!text) return '';
  try {
    const result = md.render(text);
    return result;
  } catch (error) {
    console.error('Markdown rendering error:', error);
    return text; // Fallback to plain text
  }
};

// Render Mermaid diagrams after markdown processing
const renderMermaidDiagrams = async (container: HTMLElement) => {
  const mermaidElements = container.querySelectorAll('.mermaid[data-mermaid]');

  for (const element of mermaidElements) {
    const definition = decodeURIComponent(element.getAttribute('data-mermaid') || '');
    if (definition) {
      try {
        const svg = await mermaidService.renderDiagram(definition);
        element.innerHTML = svg;
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
      }
    }
  }
};

// Render Mermaid diagrams when component mounts or description changes
onMounted(async () => {
  await nextTick();
  if (descriptionContainer.value) {
    await renderMermaidDiagrams(descriptionContainer.value);
  }
});

// Watch for changes in node description to re-render Mermaid diagrams
watch(
  () => props.node.description,
  async () => {
    await nextTick();
    if (descriptionContainer.value) {
      await renderMermaidDiagrams(descriptionContainer.value);
    }
  },
);

// Actions
const startEditing = () => {
  isEditing.value = true;
  editTitle.value = props.node.title;
  editDescription.value = props.node.description || '';
};

const saveEdit = () => {
  const updatedNode = {
    ...props.node,
    title: editTitle.value,
    description: editDescription.value,
  };
  emit('update', updatedNode);
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
  editTitle.value = props.node.title;
  editDescription.value = props.node.description || '';
};

const addChild = () => {
  const childType = getNextChildType(props.node.type);
  emit('add-child', props.node, childType);
};

const generateChildren = () => {
  emit('generate', props.node);
};

const deleteNode = () => {
  // Show Quasar confirmation dialog before deleting
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete "${props.node.title}"?\n\nThis action cannot be undone.`,
    cancel: {
      label: 'Cancel',
      color: 'grey',
      flat: true,
    },
    ok: {
      label: 'Delete',
      color: 'negative',
      flat: true,
    },
    persistent: true,
  }).onOk(() => {
    emit('delete', props.node.id);

    // Show success notification
    $q.notify({
      type: 'positive',
      message: `"${props.node.title}" deleted successfully`,
      icon: 'delete',
      position: 'top',
      timeout: 3000,
    });
  });
};

// Event handlers
const handleChildUpdate = (updatedChild: ProjectNode) => {
  const updatedNode = {
    ...props.node,
    children:
      props.node.children?.map((child) => (child.id === updatedChild.id ? updatedChild : child)) ||
      [],
  };
  emit('update', updatedNode);
};

const handleChildDelete = (childId: string) => {
  const updatedNode = {
    ...props.node,
    children: props.node.children?.filter((child) => child.id !== childId) || [],
  };
  emit('update', updatedNode);
};

const handleChildGenerate = (childNode: ProjectNode) => {
  emit('generate', childNode);
};

const handleAddChild = (parentNode: ProjectNode, type: CellType) => {
  emit('add-child', parentNode, type);
};

const handleDragStart = (event: any) => {
  console.log('🎯 Drag started', event);
  console.log('Node children:', nodeChildren.value);
};

const handleDragEnd = (event: any) => {
  // The reordering is already handled by the computed property setter
  // This function can be used for additional logic if needed
  console.log('✅ Drag operation completed', event);
  console.log('Updated node children:', nodeChildren.value);
};

const handleDragChange = (event: any) => {
  console.log('🔄 Drag change', event);
};

const handleChildReorder = (childNode: ProjectNode) => {
  // Propagate reorder event up the tree
  emit('reorder', childNode);
};

// Helper function to determine next child type
const getNextChildType = (parentType: string): CellType => {
  const typeMap: Record<string, CellType> = {
    project: 'epic',
    epic: 'feature',
    feature: 'story',
    story: 'task',
  };
  return typeMap[parentType] || 'task';
};
</script>

<style scoped>
.tree-node {
  margin-bottom: 8px;
}

.node-content {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  background: white;
  transition: all 0.2s ease;
}

.node-content:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.node-content.is-editing {
  border-color: var(--q-primary);
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.node-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.node-title {
  font-weight: 500;
  margin-left: 8px;
}

.node-actions {
  display: flex;
  gap: 4px;
}

.node-body {
  margin-left: 8px;
}

.node-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
  line-height: 1.5;
}

.node-description h1,
.node-description h2,
.node-description h3,
.node-description h4,
.node-description h5,
.node-description h6 {
  margin: 8px 0 4px 0;
  font-weight: 600;
  color: #333;
}

.node-description h1 {
  font-size: 18px;
}
.node-description h2 {
  font-size: 16px;
}
.node-description h3 {
  font-size: 15px;
}
.node-description h4 {
  font-size: 14px;
}
.node-description h5 {
  font-size: 13px;
}
.node-description h6 {
  font-size: 12px;
}

.node-description p {
  margin: 4px 0;
}

.node-description ul,
.node-description ol {
  margin: 4px 0;
  padding-left: 20px;
}

.node-description li {
  margin: 2px 0;
}

.node-description code {
  background: #f5f5f5;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.node-description pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 4px 0;
}

.node-description pre code {
  background: none;
  padding: 0;
}

.node-description blockquote {
  border-left: 3px solid #ddd;
  margin: 4px 0;
  padding-left: 12px;
  color: #777;
  font-style: italic;
}

.node-description strong {
  font-weight: 600;
  color: #333;
}

.node-description em {
  font-style: italic;
}

.node-description a {
  color: #1976d2;
  text-decoration: none;
}

.node-description a:hover {
  text-decoration: underline;
}

.children-count {
  color: #999;
  font-size: 12px;
  font-style: italic;
}

.node-edit {
  margin-top: 8px;
}

.edit-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.children-container {
  margin-top: 8px;
}

.children-indent {
  margin-left: 24px;
  border-left: 2px solid #e0e0e0;
  padding-left: 16px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .node-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .node-actions {
    align-self: flex-end;
  }

  .children-indent {
    margin-left: 16px;
    padding-left: 12px;
  }
}

/* Drag and Drop Styles */
.drag-handle {
  cursor: grab !important;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.drag-handle:hover {
  opacity: 1;
  color: #1976d2 !important;
}

.drag-handle:active {
  cursor: grabbing !important;
}

.tree-node {
  transition: transform 0.2s;
}

.tree-node:hover {
  transform: translateY(-1px);
}

.ghost {
  opacity: 0.5;
  background: #f5f5f5;
  border: 2px dashed #ccc;
}

.chosen {
  background: #e3f2fd;
  border: 2px solid #2196f3;
}

.drag {
  transform: rotate(5deg);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* Mermaid Diagram Styles */
.mermaid {
  margin: 16px 0;
  text-align: center;
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.mermaid svg {
  max-width: 100%;
  height: auto;
}
</style>
