import mermaid from 'mermaid';

class MermaidService {
  private initialized = false;

  initialize() {
    if (this.initialized) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Arial, sans-serif',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      },
    });

    this.initialized = true;
  }

  async renderDiagram(definition: string): Promise<string> {
    this.initialize();

    try {
      // Generate a unique ID for this diagram
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Render the diagram
      const { svg } = await mermaid.render(id, definition);
      return svg;
    } catch (error) {
      console.error('Mermaid rendering error:', error);
      return `
        <div class="mermaid-error" style="
          padding: 16px;
          border: 1px solid #ffcdd2;
          border-radius: 4px;
          background-color: #ffebee;
          color: #c62828;
          font-family: monospace;
          font-size: 12px;
        ">
          <strong>Mermaid Diagram Error:</strong><br>
          ${error instanceof Error ? error.message : 'Unknown error'}<br><br>
          <strong>Definition:</strong><br>
          <pre style="font-size: 10px; margin-top: 8px;">${definition}</pre>
        </div>
      `;
    }
  }
}

export const mermaidService = new MermaidService();
