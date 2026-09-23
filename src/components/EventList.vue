<template>
  <div>
    <ul>
      <li
        v-for="event in events"
        :key="event.id"
        :class="{ selected: event.id === selectedEventId }"
        @click="emits('eventSelected', event.id)"
      >
        {{ event.properties?.title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  events: any;
  selectedEventId: string | null;
}>();

const emits = defineEmits(['eventSelected']);
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
li {
  cursor: pointer;
  padding: 0.45rem 0.75rem;
  line-height: 1.35;
}

li.selected {
  background: #f8ebe3;
  color: var(--ember);
  box-shadow: inset 3px 0 0 var(--ember);
}
</style>
