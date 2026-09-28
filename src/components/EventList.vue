<script setup lang="ts">
const props = defineProps<{
  events: any;
  selectedEventId: string | null;
}>();

const emits = defineEmits(['eventSelected']);
</script>

<template>
  <ul>
    <li
      v-for="event in events"
      :key="event.id"
      :class="{ selected: event.id === selectedEventId }"
      :title="event.properties?.title"
      @click="emits('eventSelected', event.id)"
    >
      {{ event.properties?.title }}
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
  cursor: pointer;
  padding: 0.7rem 0.75rem;
  border-bottom: 1px solid var(--line);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

li:hover {
  background: var(--paper);
}

li.selected {
  background: var(--highlight);
  color: var(--ember);
  box-shadow: inset 3px 0 0 var(--ember);
}
</style>
