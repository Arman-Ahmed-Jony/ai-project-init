import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GenerativeModel } from '@google/generative-ai';
import type { ProjectNode, CellType } from '../components/models';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  initialize(apiKey: string, modelName: string = 'gemini-1.5-flash') {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    console.log('Initializing Gemini service with API key:', apiKey.substring(0, 10) + '...');
    console.log('Using model:', modelName);

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  private async generateContent(prompt: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini service not initialized. Please provide an API key.');
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(
        `Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private cleanJsonResponse(response: string): string {
    let cleanResponse = response.trim();

    // Remove markdown code blocks
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
    }
    if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    // Remove any leading/trailing text that's not JSON
    const jsonStart = cleanResponse.indexOf('[');
    const jsonEnd = cleanResponse.lastIndexOf(']') + 1;

    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      cleanResponse = cleanResponse.substring(jsonStart, jsonEnd);
    }

    // Clean the response more carefully
    try {
      // First, try to parse as-is to see if it's already valid
      JSON.parse(cleanResponse);
      return cleanResponse.trim();
    } catch (error) {
      console.log('JSON parsing failed, attempting to clean...', error);

      // If parsing fails, clean the response
      cleanResponse = cleanResponse
        // Fix escaped newlines and other escape sequences
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\\\/g, '\\')
        .replace(/\\"/g, '"')
        // Remove any remaining problematic characters
        .split('')
        .filter((char) => {
          const code = char.charCodeAt(0);
          // Keep printable characters and common whitespace
          return code >= 32 || code === 9 || code === 10 || code === 13;
        })
        .join('');

      return cleanResponse.trim();
    }
  }

  // Test method to verify API is working
  async testConnection(): Promise<boolean> {
    try {
      const testPrompt = 'Say "API connection successful" and nothing else.';
      const response = await this.generateContent(testPrompt);
      console.log('API test response:', response);
      return response.toLowerCase().includes('successful');
    } catch (error) {
      console.error('API test failed:', error);
      return false;
    }
  }

  async generateEpics(project: ProjectNode): Promise<ProjectNode[]> {
    const prompt = `You are a project management expert. Based on this project description, generate as many high-level epics as possible that would be needed to complete this project.

Project: ${project.title}
Description: ${project.description}

For each epic, provide:
- A clear, actionable title
- A detailed description in **markdown format** that covers what the epic includes, key deliverables, and success criteria
- Priority level (high/medium/low)
- Estimated duration (e.g., "2-3 weeks", "1 month")

**Important**: Write the description in markdown format with proper formatting:
- Use **bold** for important terms
- Use bullet points with - for key features
- Use ## for subsections
- Use \`code\` for technical terms
- Use > for important notes or requirements

Format your response as a JSON array with this structure:
[
  {
    "title": "Epic Title",
    "description": "## Overview\n\n**Detailed description** in markdown format with:\n- Key features\n- Deliverables\n- Success criteria\n\n> Important notes or requirements",
    "priority": "high|medium|low",
    "estimatedDuration": "X weeks/months"
  }
]

Return only the JSON array, no additional text.`;

    try {
      console.log('Generating epics with prompt:', prompt);
      const response = await this.generateContent(prompt);
      console.log('Raw API response:', response);

      const cleanResponse = this.cleanJsonResponse(response);
      console.log('Cleaned response:', cleanResponse);
      const epics = JSON.parse(cleanResponse);
      console.log('Parsed epics:', epics);

      return epics.map((epic: Record<string, unknown>, index: number) => ({
        id: `epic_${Date.now()}_${index}`,
        type: 'epic' as CellType,
        title: epic.title,
        description: epic.description,
        priority: epic.priority,
        estimatedDuration: epic.estimatedDuration,
        parentId: project.id,
        children: [],
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error generating epics:', error);
      console.error('Error details:', error);

      // Show a more specific error message
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('Invalid API key. Please check your Gemini API key in the sidebar.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        } else if (error.message.includes('JSON')) {
          throw new Error('Invalid response format from AI. Please try again.');
        }
      }

      throw error; // Re-throw to be handled by the calling component
    }
  }

  async generateFeatures(epic: ProjectNode): Promise<ProjectNode[]> {
    const prompt = `You are a software architect. Based on this epic, generate 2-4 specific features that would be needed to complete it.

Epic: ${epic.title}
Description: ${epic.description}

For each feature, provide:
- A clear, specific title
- A detailed description in **markdown format** explaining what the feature does, its functionality, and technical requirements
- Priority level (high/medium/low)
- Estimated effort (small/medium/large)

**Important**: Write the description in markdown format with proper formatting:
- Use **bold** for key functionality
- Use bullet points with - for feature details
- Use ## for subsections (e.g., ## Technical Requirements)
- Use \`code\` for technical terms and APIs
- Use > for important implementation notes

Format your response as a JSON array with this structure:
[
  {
    "title": "Feature Title",
    "description": "## Feature Overview\n\n**What it does**: Brief description\n\n**Key functionality**:\n- Feature detail 1\n- Feature detail 2\n\n## Technical Requirements\n- Requirement 1\n- Requirement 2\n\n> Implementation notes",
    "priority": "high|medium|low",
    "estimatedEffort": "small|medium|large"
  }
]

Return only the JSON array, no additional text.`;

    try {
      const response = await this.generateContent(prompt);
      const cleanResponse = this.cleanJsonResponse(response);
      const features = JSON.parse(cleanResponse);

      return features.map((feature: Record<string, unknown>, index: number) => ({
        id: `feature_${Date.now()}_${index}`,
        type: 'feature' as CellType,
        title: feature.title,
        description: feature.description,
        priority: feature.priority,
        estimatedEffort: feature.estimatedEffort,
        parentId: epic.id,
        children: [],
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error generating features:', error);
      throw error; // Re-throw to be handled by the calling component
    }
  }

  async generateStories(feature: ProjectNode): Promise<ProjectNode[]> {
    const prompt = `You are a product manager. Based on this feature, generate 2-3 user stories that would be needed to implement it.

Feature: ${feature.title}
Description: ${feature.description}

For each user story, provide:
- A user story in the format "As a [user type], I want [functionality] so that [benefit]"
- A detailed description in **markdown format** explaining the user story, context, and business value
- 3-5 acceptance criteria in markdown format
- Priority level (high/medium/low)
- Estimated story points (1-8)

**Important**: Write the description and acceptance criteria in markdown format:
- Use **bold** for key user actions and benefits
- Use bullet points with - for acceptance criteria
- Use ## for subsections (e.g., ## Context, ## Business Value)
- Use \`code\` for specific functionality or technical terms
- Use > for important notes or edge cases

Format your response as a JSON array with this structure:
[
  {
    "title": "As a user, I want to...",
    "description": "## Context\n\n**User need**: Brief explanation\n\n**Business value**: Why this matters\n\n## User Story Details\n\nDetailed explanation of what the user wants to accomplish and why.\n\n> Important notes or edge cases to consider",
    "acceptanceCriteria": [
      "**Given** a specific context, **when** the user performs an action, **then** a specific outcome occurs",
      "**Given** another context, **when** the user does something, **then** another outcome happens"
    ],
    "priority": "high|medium|low",
    "estimatedStoryPoints": 5
  }
]

Return only the JSON array, no additional text.`;

    try {
      const response = await this.generateContent(prompt);
      const cleanResponse = this.cleanJsonResponse(response);
      const stories = JSON.parse(cleanResponse);

      return stories.map((story: Record<string, unknown>, index: number) => ({
        id: `story_${Date.now()}_${index}`,
        type: 'story' as CellType,
        title: story.title,
        description: story.description,
        acceptanceCriteria: story.acceptanceCriteria,
        priority: story.priority,
        estimatedStoryPoints: story.estimatedStoryPoints,
        parentId: feature.id,
        children: [],
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error generating stories:', error);
      throw error; // Re-throw to be handled by the calling component
    }
  }

  async generateTasks(story: ProjectNode): Promise<ProjectNode[]> {
    const prompt = `You are a technical lead. Based on this user story, generate 3-5 specific development tasks that would be needed to implement it.

User Story: ${story.title}
Description: ${story.description}
Acceptance Criteria: ${story.acceptanceCriteria?.join(', ') || 'N/A'}

For each task, provide:
- A clear, actionable title
- A detailed description in **markdown format** explaining what needs to be done, technical approach, and implementation details
- Priority level (high/medium/low)
- Estimated hours (1-16)
- Status (pending)
- **A Mermaid flowchart** showing the task workflow, dependencies, and decision points

**Important**: Write the description in markdown format with proper formatting:
- Use **bold** for key technical concepts and deliverables
- Use bullet points with - for implementation steps
- Use ## for subsections (e.g., ## Technical Approach, ## Implementation Steps)
- Use \`code\` for specific code, APIs, or technical terms
- Use > for important technical notes or considerations
- Use numbered lists for step-by-step instructions

**For the Mermaid flowchart**:
- Include the flowchart in a markdown code block with \`\`\`mermaid
- Show the main workflow steps as nodes
- Use decision points with diamond shapes
- Show dependencies between steps
- Include start and end points
- Use clear, descriptive node labels
- **IMPORTANT**: Wrap all node labels in double quotes if they contain special characters like parentheses, spaces, or symbols
- Use simple node IDs (A, B, C, etc.) and put descriptions in quoted labels
- Keep it focused on the specific task workflow
- Example: A["Start Process"] --> B{"Check Condition"} instead of A[Start Process] --> B{Check Condition}

Format your response as a JSON array with this structure:
[
  {
    "title": "Task Title",
    "description": "## Task Overview\n\n**Objective**: What needs to be accomplished\n\n## Technical Approach\n\nBrief explanation of the technical approach.\n\n## Implementation Steps\n\n1. **Step 1**: Detailed description\n2. **Step 2**: Detailed description\n3. **Step 3**: Detailed description\n\n## Deliverables\n\n- Deliverable 1\n- Deliverable 2\n\n> Technical considerations or notes\n\n## Workflow Diagram\n\n\`\`\`mermaid\nflowchart TD\n    A[Start] --> B[Step 1]\n    B --> C{Decision Point}\n    C -->|Yes| D[Step 2A]\n    C -->|No| E[Step 2B]\n    D --> F[End]\n    E --> F\n\`\`\`",
    "priority": "high|medium|low",
    "estimatedHours": 8,
    "status": "pending"
  }
]

Return only the JSON array, no additional text.`;

    try {
      const response = await this.generateContent(prompt);
      const cleanResponse = this.cleanJsonResponse(response);
      const tasks = JSON.parse(cleanResponse);

      return tasks.map((task: Record<string, unknown>, index: number) => ({
        id: `task_${Date.now()}_${index}`,
        type: 'task' as CellType,
        title: task.title,
        description: task.description,
        priority: task.priority,
        estimatedHours: task.estimatedHours,
        status: task.status,
        dependencies: [],
        parentId: story.id,
        children: [],
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error generating tasks:', error);
      throw error; // Re-throw to be handled by the calling component
    }
  }
}

export const geminiService = new GeminiService();
