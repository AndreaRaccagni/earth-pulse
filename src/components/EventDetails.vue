<template>
  <div v-if="event">
    <h2>{{ event.title }}</h2>
    <p>{{ event.category }}</p>
    <p>{{ event.longitude }}</p>
    <p>{{ event.latitude }}</p>
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

<style scoped></style>
