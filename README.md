# PlanPilot AI ✈️

**Navigate your project planning with AI**

A powerful project management tool that uses Google's Gemini AI to automatically generate comprehensive project breakdowns including epics, features, user stories, and tasks. Built with Quasar Framework and Vue 3, featuring Mermaid diagram generation, collapsible tree views, and persistent data management.

## 🚀 Live Demo

**Try it now**: [https://arman-ahmed-jony.github.io/ai-project-init/](https://arman-ahmed-jony.github.io/ai-project-init/)

Experience the full power of AI-driven project management with interactive Mermaid diagrams, collapsible tree views, and real-time project generation.

## ✨ Key Features

### 🤖 AI-Powered Project Generation

- **Smart Breakdown**: Automatically generates epics, features, user stories, and tasks
- **Multiple AI Models**: Support for Gemini 1.5 Flash, 1.5 Pro, 1.0 Pro, and 2.0 Flash
- **Context-Aware**: Each generation builds upon the parent node's context
- **Rich Descriptions**: Detailed markdown descriptions with technical specifications

### 📊 Visual Workflow Diagrams

- **Mermaid Integration**: Automatic generation of workflow diagrams for tasks
- **Interactive Diagrams**: Rendered as SVG with proper syntax validation
- **Workflow Visualization**: Clear visual representation of task processes and dependencies
- **Export-Ready**: Diagrams included in JSON exports

### 🌳 Advanced Tree Management

- **Collapsible Nodes**: Expand/collapse any section to focus on specific areas
- **Drag & Drop**: Reorder nodes with intuitive drag-and-drop functionality
- **Persistent State**: Collapse preferences saved across sessions
- **Hierarchical Navigation**: Clear visual hierarchy with color-coded node types

### 💾 Data Persistence & Export

- **Auto-Save**: All changes automatically saved to localStorage
- **JSON Export**: Export individual nodes or entire projects
- **Rich Metadata**: Exports include timestamps, versions, and node statistics
- **Import Ready**: JSON format compatible with other project management tools

### 🎨 Modern User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Editing**: Inline editing with markdown support
- **Smart Notifications**: Contextual feedback for all actions
- **Visual Indicators**: Clear status indicators and progress feedback

## Project Structure

The application generates a hierarchical project breakdown:

```
Project
├── Epics (High-level features)
│   ├── Features (Specific functionality)
│   │   ├── User Stories (User requirements)
│   │   │   └── Tasks (Implementation steps)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key (get one free at [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-project-init
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser** and navigate to `http://localhost:9000`

## ⚡ Quick Start

**🌐 Try PlanPilot AI First**: [https://arman-ahmed-jony.github.io/ai-project-init/](https://arman-ahmed-jony.github.io/ai-project-init/)

1. **Get API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to get your free Gemini API key
2. **Configure**: Enter your API key in the sidebar and select a model
3. **Create**: Click "Create New Project" and enter your project description
4. **Plan**: Click the ✨ button to plan epics, then continue generating features, stories, and tasks
5. **Manage**: Use collapse/expand, drag & drop, and inline editing to organize your project
6. **Export**: Download your project as JSON for sharing or backup

## 🚀 Usage Guide

### 1. Initial Setup

**Configure AI Settings**

- Enter your Google Gemini API key in the sidebar
- Select your preferred model (Gemini 2.0 Flash recommended)
- Settings are automatically saved and persist across sessions

**Create Your First Project**

- Click "Create New Project" on the main page
- Enter a detailed project description
- Click the generate button (✨) to create epics

### 2. AI-Powered Project Generation

**Generate Project Components**

- **Epics**: High-level features and capabilities with detailed descriptions
- **Features**: Specific functionality with technical requirements
- **User Stories**: User requirements with acceptance criteria
- **Tasks**: Implementation steps with Mermaid workflow diagrams

**Smart Generation Process**

1. Click the generate button on any node
2. AI analyzes the parent context
3. Generates appropriate child nodes
4. Includes rich markdown descriptions
5. Creates visual workflow diagrams for tasks

### 3. Advanced Project Management

**Tree Navigation**

- **Collapse/Expand**: Click arrow buttons to hide/show sections
- **Drag & Drop**: Reorder nodes by dragging them
- **Visual Hierarchy**: Color-coded node types for easy identification

**Node Operations**

- **Edit**: Click edit button to modify titles and descriptions
- **Add**: Manually add new nodes at any level
- **Delete**: Remove nodes with confirmation dialog
- **Export**: Download individual nodes or entire projects as JSON

**Content Management**

- **Markdown Support**: Rich text editing with markdown formatting
- **Mermaid Diagrams**: Automatic workflow visualization for tasks
- **Real-time Preview**: See changes as you type

### 4. Data Management

**Automatic Persistence**

- All changes saved automatically to browser storage
- Project state restored on page refresh
- Individual node collapse states remembered

**Export & Import**

- Export individual nodes for sharing specific components
- Export entire projects for backup or team collaboration
- JSON format compatible with other project management tools

## 🎯 Detailed Features

### AI Generation Capabilities

- **Context-Aware Generation**: Each node builds upon its parent's context
- **Rich Markdown Output**: Detailed descriptions with formatting, lists, and code blocks
- **Mermaid Diagram Generation**: Automatic workflow diagrams for task visualization
- **Multiple Generation Levels**: Generate from project → epics → features → stories → tasks
- **Error Handling**: Graceful fallbacks and user-friendly error messages

### User Interface Features

- **Collapsible Tree View**: Expand/collapse any section to manage large projects
- **Drag & Drop Reordering**: Intuitive node reordering with visual feedback
- **Inline Editing**: Edit titles and descriptions directly in the interface
- **Real-time Persistence**: All changes saved automatically
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Data Management

- **Local Storage**: Automatic saving to browser localStorage
- **JSON Export**: Export individual nodes or entire projects
- **Rich Metadata**: Exports include timestamps, versions, and statistics
- **State Persistence**: Collapse states and settings remembered across sessions
- **Data Validation**: Safe JSON parsing with error recovery

### Visual Features

- **Color-Coded Nodes**: Different colors for projects, epics, features, stories, and tasks
- **Icon System**: Intuitive icons for each node type
- **Mermaid Diagrams**: Interactive SVG workflow diagrams
- **Smooth Animations**: Professional transitions and hover effects
- **Visual Indicators**: Status indicators and progress feedback

## 🤖 Available AI Models

- **Gemini 2.0 Flash**: Latest model with enhanced capabilities (recommended)
- **Gemini 1.5 Flash**: Fast and efficient for quick generation
- **Gemini 1.5 Pro**: More capable for complex, detailed projects
- **Gemini 1.0 Pro**: Stable and reliable for consistent output

## 📋 Feature Comparison

| Feature                   | AI Project Task Generator      | Traditional Tools       |
| ------------------------- | ------------------------------ | ----------------------- |
| **AI Generation**         | ✅ Automatic project breakdown | ❌ Manual creation only |
| **Visual Diagrams**       | ✅ Mermaid workflow diagrams   | ❌ No built-in diagrams |
| **Collapsible Views**     | ✅ Expand/collapse any section | ⚠️ Limited or none      |
| **Drag & Drop**           | ✅ Intuitive reordering        | ⚠️ Varies by tool       |
| **Real-time Persistence** | ✅ Auto-save everything        | ⚠️ Manual save required |
| **JSON Export**           | ✅ Rich metadata included      | ⚠️ Basic export only    |
| **Markdown Support**      | ✅ Full markdown rendering     | ⚠️ Limited or none      |
| **Mobile Responsive**     | ✅ Optimized for all devices   | ⚠️ Desktop-focused      |
| **Free to Use**           | ✅ No subscription required    | ❌ Often paid           |

## Development

### Lint the files

```bash
npm run lint
```

### Build for production

```bash
npm run build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

## 🛠️ Technology Stack

### Frontend

- **Vue 3**: Composition API with TypeScript
- **Quasar Framework**: Material Design components and utilities
- **Vite**: Fast build tool and development server
- **SCSS**: Advanced styling with Quasar variables

### AI & Data Processing

- **Google Gemini AI**: Multi-model AI integration
- **Markdown-it**: Markdown parsing and rendering
- **Mermaid**: Diagram generation and rendering
- **JSON Processing**: Data serialization and validation

### UI/UX Features

- **Vue Draggable**: Drag and drop functionality
- **Local Storage**: Client-side data persistence
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: CSS transitions and Vue transitions

### Development Tools

- **TypeScript**: Type-safe development
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Vue DevTools**: Development debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
