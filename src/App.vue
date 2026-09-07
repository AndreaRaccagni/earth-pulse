<script setup lang="ts">
import EventMap from './components/EventMap.vue';
import EventDetails from './components/EventDetails.vue';
import type { NaturalEvent } from './types/event';
import { ref } from 'vue';

const currentEvent = ref<NaturalEvent | null>(null);

const clearEvent = () => {
  currentEvent.value = null;
};

const setCurrentEvent = (event: NaturalEvent | null) => {
  currentEvent.value = event;
};
</script>

<template>
  <h1>Event Map</h1>
  <div class="app-container">
    <EventMap @eventSelected="setCurrentEvent" />
    <EventDetails v-if="currentEvent" :event="currentEvent" @clearEvent="clearEvent" />
  </div>
</template>

<style scoped></style>
