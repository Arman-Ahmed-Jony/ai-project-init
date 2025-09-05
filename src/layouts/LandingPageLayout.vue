<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Simple header for landing page -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title> PlanPilot AI ✈️ </q-toolbar-title>

        <!-- Navigation -->
        <div class="q-ml-auto">
          <q-btn
            flat
            :color="$route.path === '/' ? 'white' : 'grey-3'"
            label="Home"
            icon="home"
            @click="$router.push('/')"
            class="q-mr-sm"
          />
          <q-btn
            flat
            :color="$route.path === '/ai' ? 'white' : 'grey-3'"
            label="AI Tools"
            icon="psychology"
            @click="$router.push('/ai')"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Main content area -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// Landing page layout - minimal and focused on the landing page
</script>

<style scoped>
/* Landing page specific styles */
.q-toolbar {
  padding: 0 1rem;
}

.q-toolbar-title {
  font-size: 1.5rem;
  font-weight: 600;
}
</style>
