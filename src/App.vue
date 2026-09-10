<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EventMap from './components/EventMap.vue';
import EventDetails from './components/EventDetails.vue';
import { fetchNaturalEvents } from './api/eonet';
import type { NaturalEvent } from './types/event';

type Status = 'loading' | 'success' | 'empty' | 'error';

const events = ref<any | null>(null);
const status = ref<Status>('loading');
const errorMessage = ref<string | null>(null);
const currentEvent = ref<NaturalEvent | null>(null);

async function load() {
  status.value = 'loading';
  errorMessage.value = null;
  try {
    const data = await fetchNaturalEvents();
    events.value = data;
    status.value = data.features?.length ? 'success' : 'empty';
  } catch (e) {
    events.value = null;
    errorMessage.value = e instanceof Error ? e.message : 'Failed to load';
    status.value = 'error';
  }
}

onMounted(load);
</script>

<template>
  <h1>Event Map</h1>
  <div v-if="status === 'loading'">Loading events…</div>
  <div v-else-if="status === 'empty'">No open events</div>
  <div v-else-if="status === 'error'">
    {{ errorMessage }}
    <button @click="load">Retry</button>
  </div>
  <div class="app-container">
    <EventMap :events="events" @eventSelected="currentEvent = $event" />
    <EventDetails v-if="currentEvent" :event="currentEvent" @clearEvent="currentEvent = null" />
  </div>
</template>
