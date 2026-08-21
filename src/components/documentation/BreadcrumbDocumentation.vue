<script setup lang="ts">
import BreadcrumbDocumentationCore from './BreadcrumbDocumentationCore.vue'
import ArrowLeftDocumentation from './ArrowLeftDocumentation.vue'
</script>

<template>
  <div class="breadcrumb-documentation-page">
    <BreadcrumbDocumentationCore />
    <ArrowLeftDocumentation />
  </div>
</template>

<style scoped>
.breadcrumb-documentation-page {
  display: grid;
  gap: 24px;
}
</style>
