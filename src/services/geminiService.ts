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

    return cleanResponse.trim();
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
- A detailed description of what the epic covers
- Priority level (high/medium/low)
- Estimated duration (e.g., "2-3 weeks", "1 month")

Format your response as a JSON array with this structure:
[
  {
    "title": "Epic Title",
    "description": "Detailed description of what this epic covers",
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
- A detailed description of what the feature does
- Priority level (high/medium/low)
- Estimated effort (small/medium/large)

Format your response as a JSON array with this structure:
[
  {
    "title": "Feature Title",
    "description": "Detailed description of what this feature does",
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
- A detailed description
- 3-5 acceptance criteria
- Priority level (high/medium/low)
- Estimated story points (1-8)

Format your response as a JSON array with this structure:
[
  {
    "title": "As a user, I want to...",
    "description": "Detailed description of the user story",
    "acceptanceCriteria": ["Criteria 1", "Criteria 2", "Criteria 3"],
    "priority": "high|medium|low",
    "estimatedStoryPoints": 5
  }
]

Return only the JSON array, no additional text.`;

    try {
      const response = await this.generateContent(prompt);
      const stories = JSON.parse(response);

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
- A detailed description of what needs to be done
- Priority level (high/medium/low)
- Estimated hours (1-16)
- Status (pending)

Format your response as a JSON array with this structure:
[
  {
    "title": "Task Title",
    "description": "Detailed description of what needs to be done",
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
