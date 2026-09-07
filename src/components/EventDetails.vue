<template>
  <div>{{ event }}</div>
  <button @click="emits('clearEvent')">Close</button>
</template>

<script setup lang="ts">
import type { NaturalEvent } from '../types/event';

const props = defineProps<{
  event: NaturalEvent;
}>();

const emits = defineEmits(['clearEvent']);
</script>

<style scoped></style>
