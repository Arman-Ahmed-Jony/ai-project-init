<template>
  <q-page class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="flying-plane" :class="{ animate: planeAnimated }">✈️</div>
        <div class="floating-nodes">
          <div class="node node-1" :class="{ animate: nodesAnimated }">📊</div>
          <div class="node node-2" :class="{ animate: nodesAnimated }">🌳</div>
          <div class="node node-3" :class="{ animate: nodesAnimated }">⚡</div>
          <div class="node node-4" :class="{ animate: nodesAnimated }">🎯</div>
        </div>
      </div>

      <div class="hero-content">
        <div class="container">
          <div class="hero-text" :class="{ 'fade-in': heroVisible }">
            <h1 class="hero-title">
              <span class="title-main">PlanPilot AI</span>
              <span class="title-emoji">✈️</span>
            </h1>
            <p class="hero-subtitle">Navigate your project planning with AI</p>
            <p class="hero-description">
              AI-powered Agile project management tool that generates epics, features, user stories,
              and tasks with just one click.
            </p>

            <div class="hero-actions">
              <q-btn
                color="primary"
                label="🚀 Try Live Demo"
                icon="rocket_launch"
                size="xl"
                class="cta-button"
                @click="goToDemo"
                :class="{ pulse: buttonPulse }"
              >
                <q-tooltip>Experience PlanPilot AI in action</q-tooltip>
              </q-btn>

              <q-btn
                outline
                color="primary"
                label="Watch Demo"
                icon="play_circle"
                size="lg"
                class="demo-button"
                @click="scrollToFeatures"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section" ref="featuresSection">
      <div class="container">
        <h2 class="section-title" :class="{ 'fade-in': featuresVisible }">
          Why Choose PlanPilot AI?
        </h2>

        <div class="features-grid">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-card"
            :class="{ 'fade-in': featuresVisible }"
            :style="{ 'animation-delay': `${index * 0.1}s` }"
            @mouseenter="onFeatureHover(index)"
            @mouseleave="onFeatureLeave(index)"
          >
            <div class="feature-icon" :class="{ glow: feature.hovered }">
              <span class="feature-emoji">{{ feature.emoji }}</span>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Section -->
    <section class="comparison-section">
      <div class="container">
        <h2 class="section-title" :class="{ 'fade-in': comparisonVisible }">
          PlanPilot AI vs Traditional Tools
        </h2>

        <div class="comparison-table" :class="{ 'fade-in': comparisonVisible }">
          <div class="comparison-header">
            <div class="feature-column">Feature</div>
            <div class="planpilot-column">PlanPilot AI</div>
            <div class="traditional-column">Traditional Tools</div>
          </div>

          <div
            v-for="(comparison, index) in comparisons"
            :key="index"
            class="comparison-row"
            :class="{ 'fade-in': comparisonVisible }"
            :style="{ 'animation-delay': `${index * 0.1}s` }"
          >
            <div class="feature-name">{{ comparison.feature }}</div>
            <div class="planpilot-value">
              <q-icon
                :name="comparison.planpilot ? 'check_circle' : 'cancel'"
                :color="comparison.planpilot ? 'positive' : 'negative'"
                size="sm"
              />
            </div>
            <div class="traditional-value">
              <q-icon
                :name="comparison.traditional ? 'check_circle' : 'cancel'"
                :color="comparison.traditional ? 'positive' : 'negative'"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="tech-stack-section">
      <div class="container">
        <h2 class="section-title" :class="{ 'fade-in': techVisible }">
          Built with Modern Technology
        </h2>

        <div class="tech-grid" :class="{ 'fade-in': techVisible }">
          <div
            v-for="(tech, index) in techStack"
            :key="index"
            class="tech-item"
            :class="{ 'fade-in': techVisible }"
            :style="{ 'animation-delay': `${index * 0.1}s` }"
          >
            <div class="tech-icon">{{ tech.icon }}</div>
            <div class="tech-name">{{ tech.name }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content" :class="{ 'fade-in': ctaVisible }">
          <h2 class="cta-title">Ready to fly through your projects?</h2>
          <p class="cta-description">
            Join thousands of developers who are already using PlanPilot AI to streamline their
            project management.
          </p>
          <q-btn
            color="primary"
            label="✨ Start Planning with AI"
            icon="flight_takeoff"
            size="xl"
            class="cta-button-large"
            @click="goToAI"
            :class="{ pulse: ctaPulse }"
          />
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>PlanPilot AI ✈️</h3>
            <p>Navigate your project planning with AI</p>
          </div>

          <div class="footer-links">
            <div class="link-group">
              <h4>Product</h4>
              <a href="https://arman-ahmed-jony.github.io/ai-project-init/" target="_blank"
                >Live Demo</a
              >
              <a href="#" @click="scrollToFeatures">Features</a>
              <a href="#" @click="scrollToTech">Tech Stack</a>
            </div>

            <div class="link-group">
              <h4>Resources</h4>
              <a href="https://github.com/Arman-Ahmed-Jony/ai-project-init" target="_blank"
                >GitHub</a
              >
              <a href="#" @click="goToAI">Documentation</a>
              <a href="#">License</a>
            </div>

            <div class="link-group">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact</a>
              <a href="#">Community</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2024 PlanPilot AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Router for navigation
const router = useRouter();

// Animation states
const heroVisible = ref(false);
const featuresVisible = ref(false);
const comparisonVisible = ref(false);
const techVisible = ref(false);
const ctaVisible = ref(false);
const planeAnimated = ref(false);
const nodesAnimated = ref(false);
const buttonPulse = ref(false);
const ctaPulse = ref(false);

// Section refs
const featuresSection = ref<HTMLElement>();

// Features data
const features = ref([
  {
    emoji: '🤖',
    title: 'AI-Powered Project Generation',
    description:
      "Generate complete project breakdowns using Google's Gemini AI with context-aware intelligence.",
    hovered: false,
  },
  {
    emoji: '📊',
    title: 'Visual Workflow Diagrams',
    description:
      'Create beautiful Mermaid diagrams that visualize task workflows and dependencies.',
    hovered: false,
  },
  {
    emoji: '🌳',
    title: 'Advanced Tree Management',
    description:
      'Intuitively organize your project with collapsible tree views and drag-and-drop reordering.',
    hovered: false,
  },
  {
    emoji: '💾',
    title: 'Data Persistence & Export',
    description:
      'Never lose your work with automatic saving and comprehensive JSON export capabilities.',
    hovered: false,
  },
  {
    emoji: '🎨',
    title: 'Modern User Experience',
    description: 'Built with Vue 3 and Vite for blazing-fast performance and smooth animations.',
    hovered: false,
  },
  {
    emoji: '⚡',
    title: 'Lightning Fast',
    description: 'Optimized for speed with modern web technologies and efficient rendering.',
    hovered: false,
  },
]);

// Comparison data
const comparisons = ref([
  { feature: 'AI-Powered Generation', planpilot: true, traditional: false },
  { feature: 'Visual Workflow Diagrams', planpilot: true, traditional: false },
  { feature: 'One-Click Project Setup', planpilot: true, traditional: false },
  { feature: 'Automatic Data Persistence', planpilot: true, traditional: false },
  { feature: 'Modern UI/UX', planpilot: true, traditional: false },
  { feature: 'Free to Use', planpilot: true, traditional: false },
  { feature: 'Manual Setup Required', planpilot: false, traditional: true },
  { feature: 'Complex Configuration', planpilot: false, traditional: true },
  { feature: 'Outdated Interface', planpilot: false, traditional: true },
]);

// Tech stack data
const techStack = ref([
  { icon: '⚛️', name: 'Vue 3' },
  { icon: '🔷', name: 'Quasar' },
  { icon: '🤖', name: 'Google Gemini' },
  { icon: '📊', name: 'Mermaid' },
  { icon: '📝', name: 'Markdown' },
  { icon: '⚡', name: 'Vite' },
  { icon: '🎨', name: 'TypeScript' },
  { icon: '📱', name: 'Responsive' },
]);

// Navigation functions
const goToDemo = () => {
  window.open('https://arman-ahmed-jony.github.io/ai-project-init/', '_blank');
};

const goToAI = () => {
  void router.push('/ai');
};

const scrollToFeatures = () => {
  if (featuresSection.value) {
    featuresSection.value.scrollIntoView({ behavior: 'smooth' });
  }
};

const scrollToTech = () => {
  const techSection = document.querySelector('.tech-stack-section');
  if (techSection) {
    techSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// Animation functions
const onFeatureHover = (index: number) => {
  if (features.value[index]) {
    features.value[index].hovered = true;
  }
};

const onFeatureLeave = (index: number) => {
  if (features.value[index]) {
    features.value[index].hovered = false;
  }
};

// Intersection Observer for scroll animations
const setupScrollAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target.className;
          if (section.includes('hero')) heroVisible.value = true;
          if (section.includes('features')) featuresVisible.value = true;
          if (section.includes('comparison')) comparisonVisible.value = true;
          if (section.includes('tech-stack')) techVisible.value = true;
          if (section.includes('cta')) ctaVisible.value = true;
        }
      });
    },
    { threshold: 0.1 },
  );

  // Observe all sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section) => observer.observe(section));
};

// Start animations
const startAnimations = () => {
  // Hero animations
  setTimeout(() => {
    heroVisible.value = true;
    planeAnimated.value = true;
    nodesAnimated.value = true;
  }, 500);

  // Button pulse animation
  setInterval(() => {
    buttonPulse.value = true;
    setTimeout(() => {
      buttonPulse.value = false;
    }, 1000);
  }, 3000);

  // CTA pulse animation
  setInterval(() => {
    ctaPulse.value = true;
    setTimeout(() => {
      ctaPulse.value = false;
    }, 1000);
  }, 4000);
};

onMounted(() => {
  setupScrollAnimations();
  startAnimations();
});
</script>

<style scoped>
/* Landing Page Styles */
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.flying-plane {
  position: absolute;
  top: 20%;
  right: -100px;
  font-size: 4rem;
  opacity: 0;
  transition: all 2s ease-in-out;
}

.flying-plane.animate {
  opacity: 1;
  transform: translateX(-200px);
}

.floating-nodes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.node {
  position: absolute;
  font-size: 2rem;
  opacity: 0;
  transition: all 1s ease-in-out;
}

.node-1 {
  top: 15%;
  left: 10%;
}
.node-2 {
  top: 30%;
  right: 15%;
}
.node-3 {
  top: 60%;
  left: 5%;
}
.node-4 {
  top: 70%;
  right: 10%;
}

.node.animate {
  opacity: 0.7;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  width: 100%;
}

.hero-text {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease-out;
}

.hero-text.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.title-main {
  display: inline-block;
  background: linear-gradient(45deg, #ffd700, #ffed4e, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease-in-out infinite;
}

.title-emoji {
  font-size: 4rem;
  margin-left: 0.5rem;
  animation: rotate 4s linear infinite;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.hero-subtitle {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-weight: 600;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.3rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 1.2rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.cta-button.pulse {
  animation: pulse 1s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.demo-button {
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.demo-button:hover {
  transform: translateY(-2px);
  background-color: rgba(255, 255, 255, 0.1);
}

/* Features Section */
.features-section {
  padding: 6rem 0;
  background: white;
}

.section-title {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 4rem;
  color: #2d3748;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.section-title.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.feature-card.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.feature-icon.glow {
  transform: scale(1.1);
  filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.5));
}

.feature-emoji {
  font-size: 3.5rem;
  display: block;
}

.feature-title {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d3748;
}

.feature-description {
  color: #718096;
  line-height: 1.6;
  font-size: 1.1rem;
}

/* Comparison Section */
.comparison-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
}

.comparison-table {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.comparison-table.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.comparison-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  padding: 1.5rem;
}

.comparison-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.6s ease-out;
}

.comparison-row.fade-in {
  opacity: 1;
  transform: translateX(0);
}

.comparison-row:hover {
  background-color: #f7fafc;
}

.comparison-row:last-child {
  border-bottom: none;
}

.feature-name {
  font-weight: 500;
  color: #2d3748;
}

.planpilot-column,
.traditional-column {
  text-align: center;
  font-weight: 600;
}

.planpilot-value,
.traditional-value {
  text-align: center;
}

/* Tech Stack Section */
.tech-stack-section {
  padding: 6rem 0;
  background: white;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.tech-grid.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.tech-item {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.tech-item.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.tech-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.tech-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.tech-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1rem;
}

/* CTA Section */
.cta-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
  color: white;
}

.cta-content {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.cta-content.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.cta-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.cta-description {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button-large {
  padding: 1.5rem 3rem;
  font-size: 1.3rem;
  font-weight: 600;
  border-radius: 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.cta-button-large:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.cta-button-large.pulse {
  animation: pulse 1s ease-in-out;
}

/* Footer */
.footer {
  background: #2d3748;
  color: white;
  padding: 3rem 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-brand h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.footer-brand p {
  opacity: 0.8;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.link-group h4 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #e2e8f0;
}

.link-group a {
  display: block;
  color: #a0aec0;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.link-group a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #4a5568;
  color: #a0aec0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }

  .title-emoji {
    font-size: 2.5rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .comparison-header,
  .comparison-row {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-links {
    grid-template-columns: 1fr;
  }

  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}
</style>
