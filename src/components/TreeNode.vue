<template>
  <div class="tree-node">
    <div class="node-content" :class="{ 'is-editing': isEditing }">
      <!-- Node Header -->
      <div class="node-header">
        <div class="node-info">
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
          <div v-if="node.description" class="node-description">
            {{ node.description }}
          </div>
          <div v-if="node.children && node.children.length > 0" class="children-count">
            {{ node.children.length }} {{ getChildrenLabel() }}
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
    <div v-if="node.children && node.children.length > 0" class="children-container">
      <div class="children-indent">
        <TreeNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :is-root="false"
          :is-generating="isGenerating"
          :generating-node-id="generatingNodeId"
          @update="handleChildUpdate"
          @delete="handleChildDelete"
          @generate="handleChildGenerate"
          @add-child="handleAddChild"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ProjectNode, CellType } from './models';

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
}>();

const isEditing = ref(false);
const editTitle = ref('');
const editDescription = ref('');

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
  emit('delete', props.node.id);
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
</style>
