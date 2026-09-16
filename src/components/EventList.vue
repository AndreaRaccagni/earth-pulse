<template>
  <div>
    <ul>
      <li
        v-for="event in events"
        :key="event.properties.id"
        :class="{ selected: event.properties.id === selectedEventId }"
        @click="emits('eventSelected', event.properties.id)"
      >
        <a>{{ event.properties?.title }}</a>
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
li {
  cursor: pointer;
}

li.selected {
  color: red;
}
</style>
