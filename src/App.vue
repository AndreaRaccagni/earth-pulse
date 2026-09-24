<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import EventMap from './components/EventMap.vue';
import EventDetails from './components/EventDetails.vue';
import EventList from './components/EventList.vue';
import { fetchNaturalEvents } from './api/eonet';
import { camelCaseToName, getlonAndLatFromEvent } from './utils';

type Status = 'loading' | 'success' | 'empty' | 'error';

const events = ref<any | null>(null);
const status = ref<Status>('loading');
const errorMessage = ref<string | null>(null);
const currentEventId = ref<string | null>(null);
const selectedEventType = ref<string>('All');

async function load() {
  status.value = 'loading';
  errorMessage.value = null;
  try {
    const fetchedEvents = await fetchNaturalEvents();
    const data = fetchedEvents.features;
    const newEvents = data.map((item: any, index: number) => {
      return { ...item, id: item.properties.id + ':' + index };
    });
    events.value = { ...fetchedEvents, features: newEvents };
    status.value = fetchedEvents.features.length > 0 ? 'success' : 'empty';
  } catch (e) {
    events.value = null;
    errorMessage.value = e instanceof Error ? e.message : 'Failed to load';
    status.value = 'error';
  }
}

const eventTypes = computed(() => {
  const values = [
    ...new Set(events.value?.features.map((event: any) => event.properties.categories?.[0]?.id).filter(Boolean) ?? []),
  ] as string[];

  return values.map((value) => ({
    name: camelCaseToName(value),
    value,
  }));
});

const filteredEvents = computed(() => {
  if (!events.value) return null;
  if (selectedEventType.value === 'All') return events.value;

  return {
    ...events.value,
    features: events.value.features.filter(
      (event: any) => event.properties.categories?.[0]?.id === selectedEventType.value
    ),
  };
});

watch(selectedEventType, () => {
  if (!currentEventId.value || !filteredEvents.value) return;
  const stillVisible = filteredEvents.value.features.some((event: any) => event.id === currentEventId.value);
  if (!stillVisible) currentEventId.value = null;
});

const currentNaturalEvent = computed(() => {
  if (!events.value) return null;
  const event = events.value.features.find((event: any) => event.id === currentEventId.value);
  const lonAndLat = getlonAndLatFromEvent(event);

  if (!lonAndLat) return null;
  return event
    ? {
        id: event.id,
        title: event.properties.title,
        category: camelCaseToName(event.properties.categories?.[0]?.id ?? 'unknown'),
        longitude: lonAndLat[0],
        latitude: lonAndLat[1],
      }
    : null;
});

onMounted(load);
</script>

<template>
  <div class="app-container">
    <h1>Event Map</h1>
    <div class="content-container">
      <section class="events-container">
        <EventMap
          class="event-map"
          :events="filteredEvents"
          :selectedEventId="currentEventId"
          @eventSelected="currentEventId = $event"
        />
        <div class="event-list">
          <select v-model="selectedEventType">
            <option value="All">All</option>
            <option v-for="eventType in eventTypes" :key="eventType.value" :value="eventType.value">
              {{ eventType.name }}
            </option>
          </select>
          <EventList
            v-if="status === 'success' && filteredEvents?.features.length"
            :events="filteredEvents.features"
            :selectedEventId="currentEventId"
            @eventSelected="currentEventId = $event"
          />
          <div v-else-if="status === 'loading'">Loading events…</div>
          <div v-else-if="status === 'success'">No events</div>
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
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 10px;
  overflow: hidden;
}

.app-container > h1 {
  margin: 0;
  padding: 0.25rem 0 0.75rem;
  font-family: var(--font-display);
  font-weight: 560;
  font-size: 1.75rem;
  letter-spacing: -0.03em;
  text-align: center;
}

.content-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.events-container {
  display: flex;
  gap: 10px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.event-map {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.event-list {
  flex: 0 0 18rem;
  overflow-y: auto;
  min-height: 0;
  background: white;
}
</style>
