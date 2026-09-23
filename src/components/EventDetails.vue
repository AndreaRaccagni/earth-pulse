<template>
  <div v-if="event">
    <p class="event-title">{{ event.title }}</p>
    <dl>
      <dt>Category</dt>
      <dd>{{ event.category }}</dd>
      <dt>Longitude</dt>
      <dd>{{ event.longitude }}</dd>
      <dt>Latitude</dt>
      <dd>{{ event.latitude }}</dd>
    </dl>
  </div>
  <div v-else>No event selected</div>
  <button @click="emits('clearEvent')">Clear</button>
</template>

<script setup lang="ts">
import type { NaturalEvent } from '../types/event';

const props = defineProps<{
  event: NaturalEvent | null;
}>();

const emits = defineEmits(['clearEvent']);
</script>

<style scoped>
.event-title {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 560;
  letter-spacing: -0.02em;
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

button {
  margin-top: 0.75rem;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--ember);
  background: transparent;
  color: var(--ember);
  font: inherit;
  cursor: pointer;
}
</style>
