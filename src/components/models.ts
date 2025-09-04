// Project Task Generator Data Models

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedHours: number;
  status: 'pending' | 'in-progress' | 'completed';
  dependencies: string[];
  timestamp: number;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: 'low' | 'medium' | 'high';
  estimatedStoryPoints: number;
  tasks: Task[];
  timestamp: number;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedEffort: 'small' | 'medium' | 'large';
  stories: Story[];
  timestamp: number;
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: string;
  features: Feature[];
  timestamp: number;
}

export interface Project {
  id: string;
  description: string;
  epics: Epic[];
  createdAt: number;
  updatedAt: number;
}

export type CellType = 'project' | 'epic' | 'feature' | 'story' | 'task';

export interface ProjectNode {
  id: string;
  type: CellType;
  title: string;
  description?: string;
  children?: ProjectNode[];
  parentId?: string;
  timestamp: number;
  // Additional properties based on type
  priority?: 'low' | 'medium' | 'high';
  estimatedHours?: number;
  estimatedStoryPoints?: number;
  estimatedEffort?: 'small' | 'medium' | 'large';
  estimatedDuration?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  dependencies?: string[];
  acceptanceCriteria?: string[];
}

export interface NotebookCellData {
  id: string;
  type: CellType;
  content: string;
  generatedContent?: string;
  parentId?: string; // For hierarchical relationships
  timestamp: number;
}
