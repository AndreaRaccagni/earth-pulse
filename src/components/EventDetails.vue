<script setup lang="ts">
import type { NaturalEvent } from '../types/event';

const props = defineProps<{
  event: NaturalEvent | null;
}>();

const emits = defineEmits(['clearEvent']);
</script>

<template>
  <div class="event-details">
    <p class="label">Event Details</p>
    <template v-if="event">
      <p class="event-title">{{ event.title }}</p>
      <dl>
        <dt>Category</dt>
        <dd>{{ event.category }}</dd>
        <dt>Longitude</dt>
        <dd>{{ event.longitude }}</dd>
        <dt>Latitude</dt>
        <dd>{{ event.latitude }}</dd>
      </dl>
      <button @click="emits('clearEvent')">Clear</button>
    </template>
    <p v-else class="empty">No event selected</p>
  </div>
</template>

<style scoped>
.event-details {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  height: 6.5rem;
  padding: 0.85rem 1.1rem;
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

.label {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.event-title {
  margin: 0;
  min-width: 12rem;
  max-width: 18rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 560;
  letter-spacing: -0.02em;
}

dl {
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 1.25rem;
  row-gap: 0.15rem;
  margin: 0;
}

dt {
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

dd {
  margin: 0;
}

.empty {
  margin: 0;
  color: var(--muted);
}

button {
  margin-left: auto;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--ember);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--ember);
  font: inherit;
  cursor: pointer;
}

button:hover {
  background: var(--highlight);
}
</style>
