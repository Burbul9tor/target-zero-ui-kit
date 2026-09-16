<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import type { Component } from 'vue'

export type TzStatusTone =
  | 'neutral' | 'brand' | 'success' | 'info' | 'warning' | 'error'
  | 'blue' | 'violet' | 'amber' | 'orange' | 'rose' | 'cyan'
export type TzStatusSize = 'small' | 'medium'

withDefaults(defineProps<{
  label?: string
  tone?: TzStatusTone
  size?: TzStatusSize
  showIndicator?: boolean
  showIcon?: boolean
  icon?: Component
}>(), {
  label: 'Статус',
  tone: 'neutral',
  size: 'small',
  showIndicator: true,
  showIcon: false,
  icon: () => ChevronDown,
})
</script>

<template>
  <span class="tz-status" :class="[`tz-status--${tone}`, `tz-status--${size}`]">
    <i v-if="showIndicator" class="tz-status__indicator" aria-hidden="true" />
    <span class="tz-status__label">{{ label }}</span>
    <component v-if="showIcon" :is="icon" class="tz-status__icon" :size="20" aria-hidden="true" />
  </span>
</template>

<style scoped>
.tz-status{--status-bg:var(--slate-bg);--status-fg:var(--slate-fg);display:inline-flex;box-sizing:border-box;max-width:100%;align-items:center;justify-content:center;color:var(--status-fg);border-radius:var(--radius-sm);background:var(--status-bg);font-family:var(--tz-font-family);font-weight:500;vertical-align:middle}
.tz-status--small{min-height:22px;padding:var(--padding-spacing-4) var(--padding-spacing-8);gap:var(--padding-spacing-4);font-size:10px;line-height:14px}
.tz-status--medium{min-height:28px;padding:var(--padding-spacing-6) var(--padding-spacing-12);gap:var(--padding-spacing-6);border-radius:var(--radius-md);font-size:12px;line-height:16px}
.tz-status__indicator{display:block;flex:0 0 auto;width:6px;height:6px;border-radius:var(--radius-full);background:currentColor}.tz-status--medium .tz-status__indicator{width:8px;height:8px}
.tz-status__label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tz-status__icon{flex:0 0 auto;width:20px;height:20px}
.tz-status--neutral{--status-bg:var(--slate-bg);--status-fg:var(--slate-fg)}.tz-status--brand{--status-bg:var(--brand-bg-active);--status-fg:var(--brand-primary)}
.tz-status--success{--status-bg:var(--status-success-bg);--status-fg:var(--status-success-fg)}.tz-status--info{--status-bg:var(--status-info-bg);--status-fg:var(--status-info-fg)}.tz-status--warning{--status-bg:var(--status-warning-bg);--status-fg:var(--status-warning-fg)}.tz-status--error{--status-bg:var(--status-error-bg);--status-fg:var(--status-error-fg)}
.tz-status--blue{--status-bg:var(--blue-bg);--status-fg:var(--blue-fg)}.tz-status--violet{--status-bg:var(--violet-bg);--status-fg:var(--violet-fg)}.tz-status--amber{--status-bg:var(--amber-bg);--status-fg:var(--amber-fg)}.tz-status--orange{--status-bg:var(--orange-bg);--status-fg:var(--orange-fg)}.tz-status--rose{--status-bg:var(--rose-bg);--status-fg:var(--rose-fg)}.tz-status--cyan{--status-bg:var(--cyan-bg);--status-fg:var(--cyan-fg)}
</style>
