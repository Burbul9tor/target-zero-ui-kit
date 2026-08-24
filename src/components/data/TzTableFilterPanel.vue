<script setup lang="ts">
import { ChevronDown, SlidersHorizontal, X } from '@lucide/vue'
import TzButton from '../actions/TzButton.vue'

withDefaults(defineProps<{
  open?: boolean
  title?: string
  activeCount?: number
  dirty?: boolean
  resetDisabled?: boolean
  applyDisabled?: boolean
}>(), {
  open: false,
  title: 'Фильтры',
  activeCount: 0,
  dirty: false,
  resetDisabled: false,
  applyDisabled: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  apply: []
  reset: []
}>()
</script>

<template>
  <section class="tz-filter-panel" :class="{ 'is-open': open }">
    <div class="tz-filter-panel__toolbar">
      <button
        type="button"
        class="tz-filter-panel__toggle"
        :aria-expanded="open"
        aria-controls="tz-table-filter-panel-content"
        @click="emit('update:open', !open)"
      >
        <SlidersHorizontal :size="16" />
        <span>{{ title }}</span>
        <b v-if="activeCount">{{ activeCount > 99 ? '99+' : activeCount }}</b>
        <ChevronDown :size="16" class="tz-filter-panel__chevron" />
      </button>
      <div class="tz-filter-panel__summary"><slot name="summary" /></div>
      <button v-if="activeCount" type="button" class="tz-filter-panel__clear" @click="emit('reset')">
        <X :size="14" /><span>Сбросить фильтры</span>
      </button>
    </div>

    <div v-show="open" id="tz-table-filter-panel-content" class="tz-filter-panel__content">
      <div class="tz-filter-panel__body"><slot /></div>
      <footer>
        <slot name="footer-start" />
        <span class="tz-filter-panel__hint"><slot name="hint">Изменения применятся после нажатия кнопки</slot></span>
        <TzButton color="secondary" size="medium" label="Сбросить" :disabled="resetDisabled" @click="emit('reset')" />
        <TzButton size="medium" label="Применить" :disabled="applyDisabled || !dirty" @click="emit('apply')" />
      </footer>
    </div>
  </section>
</template>

<style scoped>
.tz-filter-panel{overflow:hidden;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface)}
.tz-filter-panel__toolbar{display:flex;min-height:48px;padding:var(--padding-spacing-8) var(--padding-spacing-12);align-items:center;gap:var(--padding-spacing-8)}
.tz-filter-panel__toggle,.tz-filter-panel__clear{display:inline-flex;min-height:32px;padding:0 var(--padding-spacing-8);align-items:center;gap:var(--padding-spacing-6);color:var(--brand-primary);border:0;border-radius:var(--radius-sm);background:transparent;font:500 12px/16px var(--tz-font-family);cursor:pointer}
.tz-filter-panel__toggle:hover,.tz-filter-panel__clear:hover{background:var(--brand-bg-hover)}
.tz-filter-panel__toggle b{display:grid;min-width:20px;height:20px;padding:0 var(--padding-spacing-4);place-items:center;color:var(--brand-primary);border-radius:var(--radius-full);background:var(--brand-bg-active);font:500 11px/16px var(--tz-font-family)}
.tz-filter-panel__chevron{transition:transform 180ms ease}.is-open .tz-filter-panel__chevron{transform:rotate(180deg)}
.tz-filter-panel__summary{display:flex;min-width:0;flex:1;flex-wrap:wrap;align-items:center;gap:var(--padding-spacing-6)}
.tz-filter-panel__clear{margin-left:auto}.tz-filter-panel__clear span{white-space:nowrap}
.tz-filter-panel__content{border-top:1px solid var(--border-default);background:var(--bg-page);animation:filter-panel-in 180ms ease}
.tz-filter-panel__body{padding:var(--padding-spacing-16)}
.tz-filter-panel footer{display:flex;min-height:56px;padding:var(--padding-spacing-12) var(--padding-spacing-16);align-items:center;gap:var(--padding-spacing-8);border-top:1px solid var(--border-default);background:var(--bg-surface)}
.tz-filter-panel__hint{margin-right:auto;color:var(--text-muted);font:400 12px/16px var(--tz-font-family)}
@keyframes filter-panel-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
@media(max-width:700px){.tz-filter-panel__toolbar{align-items:flex-start;flex-wrap:wrap}.tz-filter-panel__summary{order:3;flex-basis:100%}.tz-filter-panel__clear span,.tz-filter-panel__hint{display:none}.tz-filter-panel footer{justify-content:flex-end}}
</style>
