<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import EventMap from './components/EventMap.vue';
import EventDetails from './components/EventDetails.vue';
import EventList from './components/EventList.vue';
import { fetchNaturalEvents } from './api/eonet';

type Status = 'loading' | 'success' | 'empty' | 'error';

const events = ref<any | null>(null);
const status = ref<Status>('loading');
const errorMessage = ref<string | null>(null);
const currentEventId = ref<string | null>(null);

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

const currentNaturalEvent = computed(() => {
  const event = events.value?.features.find((event: any) => event.properties.id === currentEventId.value);
  return event
    ? {
        id: event.properties.id,
        title: event.properties.title,
        category: event.properties.categories?.[0]?.id ?? 'unknown',
        longitude: event.geometry.coordinates[0],
        latitude: event.geometry.coordinates[1],
      }
    : null;
});

onMounted(load);
</script>

<template>
  <h1>Event Map</h1>
  <div class="app-container">
    <section class="event-map-container">
      <EventMap
        class="event-map"
        :events="events"
        :selectedEventId="currentEventId"
        @eventSelected="currentEventId = $event"
      />
      <div class="event-list">
        <EventList
          v-if="status === 'success'"
          :events="events.features"
          :selectedEventId="currentEventId"
          @eventSelected="currentEventId = $event"
        />
        <div v-else-if="status === 'loading'">Loading events…</div>
        <div v-else-if="status === 'empty'">No open events</div>
        <div v-else-if="status === 'error'">
          {{ errorMessage }}
          <button @click="load">Retry</button>
        </div>
      </div>
    </section>
    <section>
      <h2>Event Details</h2>
      <div v-if="currentEventId">
        <EventDetails :event="currentNaturalEvent" @clearEvent="currentEventId = null" />
      </div>
      <div v-else>
        <p>No event selected</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.event-map-container {
  display: flex;
  height: 100%;
  width: 100%;
  flex: 1;
}

.event-map {
  flex: 1;
}

.event-list {
  flex: 1;
}
</style>
