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

const timeUnits = [
  { threshold: 60, unit: "second", divisor: 1 }, // Up to 60 seconds
  { threshold: 3600, unit: "minute", divisor: 60 }, // Up to 1 hour
  { threshold: 86400, unit: "hour", divisor: 3600 }, // Up to 1 day
  { threshold: 2592000, unit: "day", divisor: 86400 }, // Up to 30 days
  { threshold: 31536000, unit: "month", divisor: 2592000 }, // Up to 1 year
  { threshold: Infinity, unit: "year", divisor: 31536000 }, // Over 1 year
];

const updateTimeAgo = () => {
  const now = new Date();
  const diffInSeconds = Math.floor((dateValue.value.getTime() - now.getTime()) / 1000);
  const absoluteDiff = Math.abs(diffInSeconds);

  const { unit, divisor } = timeUnits.find(({ threshold }) => absoluteDiff < threshold)!;
  const value = Math.floor(absoluteDiff / divisor);
  const suffix = diffInSeconds < 0 ? "ago" : "from now";

  timeAgo.value = `${value} ${unit}${value > 1 ? "s" : ""} ${suffix}`;
};

onMounted(updateTimeAgo);
watch(() => props.date, updateTimeAgo);
</script>
