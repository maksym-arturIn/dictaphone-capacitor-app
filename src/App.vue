<template>
  <Toaster position="top-right" />
  <RouterView />
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { RouterView } from 'vue-router'
</script>
