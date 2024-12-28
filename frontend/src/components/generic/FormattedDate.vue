<template>
  <span>{{ formattedDate }} ({{ timeAgo }})</span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

interface Props {
  date: string | Date;
}
const props = defineProps<Props>();

const dateValue = computed(() => new Date(props.date));

const formattedDate = computed(() => {
  return dateValue.value.toISOString().slice(0, 19).replace("T", " ");
});

const timeAgo = ref("");

const updateTimeAgo = () => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateValue.value.getTime()) / 1000);

  if (diffInSeconds < 60) {
    timeAgo.value = `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    timeAgo.value = `${Math.floor(diffInSeconds / 60)} minutes ago`;
  } else if (diffInSeconds < 86400) {
    timeAgo.value = `${Math.floor(diffInSeconds / 3600)} hours ago`;
  } else if (diffInSeconds < 2592000) {
    timeAgo.value = `${Math.floor(diffInSeconds / 86400)} days ago`;
  } else if (diffInSeconds < 31536000) {
    timeAgo.value = `${Math.floor(diffInSeconds / 2592000)} months ago`;
  } else {
    timeAgo.value = `${Math.floor(diffInSeconds / 31536000)} years ago`;
  }
};

// Update the time ago on mount and when the date prop changes
onMounted(updateTimeAgo);
watch(() => props.date, updateTimeAgo);
</script>
