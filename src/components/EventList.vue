<script setup lang="ts">
import { formatDate } from '../utils';
const props = defineProps<{
  events: any;
  selectedEventId: string | null;
}>();

const emits = defineEmits(['eventSelected']);
</script>

<template>
  <ul>
    <li v-for="event in events" :key="event.id" :class="{ selected: event.id === selectedEventId }">
      <button
        @click="emits('eventSelected', event.id)"
        :title="event.properties?.title"
        :aria-pressed="event.id === selectedEventId"
      >
        <span class="title">{{ event.properties?.title }}</span>
        <small class="date">{{ formatDate(event.properties?.date) }}</small>
      </button>
    </li>
  </ul>
</template>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

li {
  border-bottom: 1px solid var(--line);
}

li:hover {
  background: var(--paper);
}

li.selected {
  background: var(--highlight);
  color: var(--ember);
  box-shadow: inset 3px 0 0 var(--ember);
}

.title {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.date {
  font-size: 0.75rem;
  color: var(--muted);
}

button {
  all: unset;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 0.7rem 0.75rem;
  cursor: pointer;
}

button:focus-visible {
  outline: 2px solid var(--ember);
  outline-offset: -2px;
}
</style>
