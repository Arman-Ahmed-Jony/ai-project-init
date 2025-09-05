<template>
  <q-page class="landing-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <!-- Animated Logo -->
        <div class="logo-container">
          <q-icon
            name="build"
            size="6rem"
            color="primary"
            class="animated-logo"
            :class="{ bounce: logoBounce }"
          />
          <div class="sparkle sparkle-1">✨</div>
          <div class="sparkle sparkle-2">⚡</div>
          <div class="sparkle sparkle-3">🔥</div>
        </div>

        <!-- Main Title -->
        <h1 class="hero-title">
          <span class="title-main">TaskForge AI</span>
          <span class="title-emoji">🔨</span>
        </h1>

        <p class="hero-subtitle">
          <span class="subtitle-highlight">Forge your project tasks with AI</span>
        </p>

        <p class="hero-description">
          Transform your project ideas into structured, actionable tasks using the power of Google's
          Gemini AI. Generate epics, features, user stories, and detailed tasks with beautiful
          Mermaid workflow diagrams.
        </p>

        <!-- CTA Buttons -->
        <div class="hero-actions">
          <q-btn
            color="primary"
            label="Start Forging Tasks"
            icon="rocket_launch"
            size="xl"
            class="cta-button"
            @click="goToAI"
          >
            <q-tooltip>Begin your AI-powered project journey</q-tooltip>
          </q-btn>

          <q-btn
            outline
            color="primary"
            label="Watch Demo"
            icon="play_circle"
            size="lg"
            class="demo-button"
            @click="scrollToDemo"
          />
        </div>

        <!-- Stats -->
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">20+</div>
            <div class="stat-label">Features</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">AI</div>
            <div class="stat-label">Powered</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">Free</div>
          </div>
        </div>
      </div>

      <!-- Floating Elements -->
      <div class="floating-elements">
        <div class="floating-icon floating-1">📊</div>
        <div class="floating-icon floating-2">🌳</div>
        <div class="floating-icon floating-3">⚡</div>
        <div class="floating-icon floating-4">🎯</div>
        <div class="floating-icon floating-5">🚀</div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <div class="container">
        <h2 class="section-title">Why Choose TaskForge AI?</h2>

        <div class="features-grid">
          <div class="feature-card" v-for="(feature, index) in features" :key="index">
            <div class="feature-icon">
              <q-icon :name="feature.icon" size="3rem" :color="feature.color" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="how-it-works-section">
      <div class="container">
        <h2 class="section-title">How It Works</h2>

        <div class="steps-container">
          <div class="step-item" v-for="(step, index) in steps" :key="index">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
            </div>
            <div class="step-arrow" v-if="index < steps.length - 1">→</div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="cta-section">
      <div class="container">
        <h2 class="cta-title">Ready to Forge Your Project?</h2>
        <p class="cta-description">
          Join thousands of developers who are already using TaskForge AI to streamline their
          project management.
        </p>
        <q-btn
          color="primary"
          label="Get Started Now"
          icon="rocket_launch"
          size="xl"
          class="cta-button-large"
          @click="goToAI"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Router for navigation
const router = useRouter();

// Landing page animations
const logoBounce = ref(false);

// Features data
const features = ref([
  {
    icon: 'psychology',
    color: 'primary',
    title: 'AI-Powered Generation',
    description:
      "Generate complete project breakdowns using Google's Gemini AI with context-aware intelligence.",
  },
  {
    icon: 'account_tree',
    color: 'secondary',
    title: 'Visual Workflow Diagrams',
    description:
      'Create beautiful Mermaid diagrams that visualize task workflows and dependencies.',
  },
  {
    icon: 'drag_indicator',
    color: 'accent',
    title: 'Drag & Drop Management',
    description:
      'Intuitively organize your project with collapsible tree views and drag-and-drop reordering.',
  },
  {
    icon: 'save',
    color: 'positive',
    title: 'Auto-Save & Export',
    description:
      'Never lose your work with automatic saving and comprehensive JSON export capabilities.',
  },
  {
    icon: 'speed',
    color: 'warning',
    title: 'Lightning Fast',
    description: 'Built with Vue 3 and Vite for blazing-fast performance and smooth animations.',
  },
  {
    icon: 'devices',
    color: 'info',
    title: 'Responsive Design',
    description: 'Works perfectly on desktop, tablet, and mobile devices with adaptive layouts.',
  },
]);

// Steps data
const steps = ref([
  {
    title: 'Enter Your Project',
    description: 'Describe your project idea and let our AI understand your vision.',
  },
  {
    title: 'AI Generates Epics',
    description:
      'Watch as AI creates high-level epics that break down your project into major components.',
  },
  {
    title: 'Forge Features & Stories',
    description:
      'Generate detailed features and user stories with acceptance criteria for each epic.',
  },
  {
    title: 'Create Task Workflows',
    description:
      'Get actionable tasks with beautiful Mermaid diagrams showing implementation workflows.',
  },
  {
    title: 'Export & Share',
    description: 'Download your complete project structure as JSON or share with your team.',
  },
]);

// Landing page functions
const scrollToDemo = () => {
  const demoSection = document.querySelector('.features-section');
  if (demoSection) {
    demoSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const goToAI = async () => {
  await router.push('/ai');
};

// Animation functions
const startLogoAnimation = () => {
  setInterval(() => {
    logoBounce.value = true;
    setTimeout(() => {
      logoBounce.value = false;
    }, 1000);
  }, 3000);
};

onMounted(() => {
  // Start landing page animations
  startLogoAnimation();
});
</script>

<style scoped>
/* Landing Page Styles */
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  z-index: 2;
  position: relative;
}

/* Animated Logo */
.logo-container {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.animated-logo {
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
}

.animated-logo.bounce {
  animation: bounce 1s ease-in-out;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

.sparkle {
  position: absolute;
  font-size: 1.5rem;
  animation: sparkle 2s infinite;
}

.sparkle-1 {
  top: -10px;
  left: -20px;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 20px;
  right: -15px;
  animation-delay: 0.5s;
}

.sparkle-3 {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1s;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Hero Title */
.hero-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease-out;
}

.title-main {
  display: inline-block;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease-in-out infinite;
}

.title-emoji {
  font-size: 3.5rem;
  margin-left: 0.5rem;
  animation: rotate 2s linear infinite;
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
  font-size: 1.5rem;
  margin-bottom: 1rem;
  animation: fadeInUp 1s ease-out 0.2s both;
}

.subtitle-highlight {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  opacity: 0.9;
  animation: fadeInUp 1s ease-out 0.4s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hero Actions */
.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.cta-button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
}

.demo-button {
  padding: 1rem 2rem;
  font-size: 1rem;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.demo-button:hover {
  transform: translateY(-2px);
  background-color: rgba(255, 255, 255, 0.1);
}

/* Hero Stats */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  animation: fadeInUp 1s ease-out 0.8s both;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}

/* Floating Elements */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-icon {
  position: absolute;
  font-size: 2rem;
  animation: float 6s ease-in-out infinite;
}

.floating-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.floating-2 {
  top: 30%;
  right: 15%;
  animation-delay: 1s;
}

.floating-3 {
  top: 60%;
  left: 5%;
  animation-delay: 2s;
}

.floating-4 {
  top: 70%;
  right: 10%;
  animation-delay: 3s;
}

.floating-5 {
  top: 40%;
  left: 50%;
  animation-delay: 4s;
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

/* Features Section */
.features-section {
  padding: 5rem 2rem;
  background: white;
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #2c3e50;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.feature-description {
  color: #7f8c8d;
  line-height: 1.6;
}

/* How It Works Section */
.how-it-works-section {
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.steps-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
}

.step-item {
  display: flex;
  align-items: center;
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 250px;
  max-width: 400px;
  transition: all 0.3s ease;
}

.step-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.step-description {
  color: #7f8c8d;
  line-height: 1.5;
}

.step-arrow {
  font-size: 2rem;
  color: #667eea;
  margin: 0 1rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* CTA Section */
.cta-section {
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
  color: white;
}

.cta-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.cta-button-large {
  padding: 1.5rem 3rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.cta-button-large:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .title-emoji {
    font-size: 2rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .steps-container {
    flex-direction: column;
  }

  .step-item {
    flex-direction: column;
    text-align: center;
  }

  .step-number {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .step-arrow {
    transform: rotate(90deg);
    margin: 1rem 0;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
