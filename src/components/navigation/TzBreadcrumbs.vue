<script setup lang="ts">
import TzArrowLeftIcon from '../icons/TzArrowLeftIcon.vue'

type BreadcrumbItem = {
  label: string
  href?: string
}

withDefaults(
  defineProps<{
    items: BreadcrumbItem[]
    variant?: 'primary' | 'secondary'
  }>(),
  { variant: 'primary' },
)
</script>

<template>
  <nav
    class="tz-breadcrumbs"
    :class="[`tz-breadcrumbs--${variant}`, { 'tz-breadcrumbs--single': items.length === 1 }]"
    aria-label="Хлебные крошки"
  >
    <div class="tz-breadcrumbs__row">
      <TzArrowLeftIcon
        v-if="variant === 'primary' && items.length === 1"
        class="tz-breadcrumbs__back-icon"
      />
      <ol>
        <li v-for="(item, index) in items" :key="`${item.label}-${index}`">
          <a v-if="item.href && index < items.length - 1" :href="item.href">{{ item.label }}</a>
          <span v-else :aria-current="index === items.length - 1 ? 'page' : undefined">{{ item.label }}</span>
        </li>
      </ol>
    </div>
  </nav>
</template>

<style scoped>
.tz-breadcrumbs__row,
.tz-breadcrumbs ol {
  display: flex;
  align-items: center;
}

.tz-breadcrumbs__row {
  gap: 6px;
}

.tz-breadcrumbs ol {
  flex-wrap: wrap;
  gap: 4px;
  min-height: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tz-breadcrumbs li {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
}

.tz-breadcrumbs li:not(:last-child)::after {
  content: '/';
  color: var(--text-default);
  font: 400 10px/14px var(--tz-font-family);
  letter-spacing: 0.1px;
}

.tz-breadcrumbs a,
.tz-breadcrumbs span {
  color: inherit;
  font: 400 12px/16px var(--tz-font-family);
  text-decoration: none;
}

.tz-breadcrumbs a:hover {
  color: var(--brand-primary-hover);
  box-shadow: inset 0 -1px var(--brand-primary-hover);
}

.tz-breadcrumbs li:last-child {
  color: var(--text-default);
}

.tz-breadcrumbs--primary ol {
  min-height: 16px;
}

.tz-breadcrumbs--primary li:not(:last-child)::after {
  font: 400 12px/16px var(--tz-font-family);
  letter-spacing: normal;
}

.tz-breadcrumbs__back-icon {
  width: 12px;
  height: 12px;
}

.tz-breadcrumbs--secondary li {
  padding: 2px;
}
</style>

