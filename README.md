# AI Project Task Generator

A powerful project management tool that uses Google's Gemini AI to automatically generate project breakdowns including epics, features, user stories, and tasks. Built with Quasar Framework and Vue 3.

## Features

- 🤖 **AI-Powered Generation**: Uses Google Gemini AI to generate project components
- 🌳 **Hierarchical Structure**: Tree-based UI for managing project breakdowns
- ✏️ **Inline Editing**: Edit any node directly in the interface
- 🔄 **Real-time Generation**: Generate epics, features, stories, and tasks on demand
- 🎯 **Smart Tooltips**: Helpful tooltips guide users through the interface
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface built with Quasar components

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

## Usage

### 1. Configure API Key

- Enter your Google Gemini API key in the sidebar
- Select your preferred model (Gemini 1.5 Flash, 1.5 Pro, etc.)

### 2. Create a Project

- Click "Create New Project" on the main page
- Enter your project description
- Click the generate button to create epics

### 3. Generate Project Breakdown

- **Epics**: High-level features and capabilities
- **Features**: Specific functionality within each epic
- **User Stories**: User requirements and acceptance criteria
- **Tasks**: Implementation steps and technical details

### 4. Manage Your Project

- **Edit**: Click the edit button to modify any node
- **Add**: Add new nodes at any level
- **Delete**: Remove nodes you don't need
- **Generate**: Use AI to create child nodes

## Available Models

- **Gemini 1.5 Flash**: Fast and efficient (recommended)
- **Gemini 1.5 Pro**: More capable for complex projects
- **Gemini 1.0 Pro**: Stable and reliable
- **Gemini 2.0 Flash**: Latest model with enhanced capabilities

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

## Technology Stack

- **Frontend**: Vue 3 + TypeScript
- **UI Framework**: Quasar Framework
- **AI Integration**: Google Gemini AI
- **Build Tool**: Vite
- **Styling**: SCSS + Quasar components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
