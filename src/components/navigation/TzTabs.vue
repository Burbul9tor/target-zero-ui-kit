<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

export type TabValue = string | number
export type TabBadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'error'

export interface TabItem {
  value: TabValue
  label: string
  disabled?: boolean
  count?: number
  badgeTone?: TabBadgeTone
  countLabel?: string
}

const props = withDefaults(defineProps<{
  modelValue?: TabValue
  items: TabItem[]
  ariaLabel?: string
  fluid?: boolean
  countMax?: number
}>(), {
  modelValue: undefined,
  ariaLabel: 'Вкладки',
  fluid: false,
  countMax: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: TabValue]
  change: [value: TabValue, item: TabItem]
}>()

defineSlots<{
  label(props: { item: TabItem; active: boolean }): unknown
  badge(props: { item: TabItem; active: boolean }): unknown
}>()

const tabRefs = ref<Array<HTMLButtonElement | null>>([])
const activeValue = computed(() => props.modelValue ?? props.items.find(item => !item.disabled)?.value)

function displayCount(count: number) {
  if (props.countMax !== undefined && count > props.countMax) return `${props.countMax}+`
  return count
}

function counterLabel(item: TabItem) {
  return item.countLabel ?? `Количество: ${item.count}`
}

function select(item: TabItem) {
  if (item.disabled || item.value === activeValue.value) return
  emit('update:modelValue', item.value)
  emit('change', item.value, item)
}

async function moveFocus(currentIndex: number, direction: 1 | -1 | 'first' | 'last') {
  const enabled = props.items.map((item, index) => ({ item, index })).filter(entry => !entry.item.disabled)
  if (!enabled.length) return

  const currentEnabledIndex = enabled.findIndex(entry => entry.index === currentIndex)
  let target = enabled[0]
  if (direction === 'last') target = enabled.at(-1)!
  else if (direction !== 'first') {
    const nextIndex = (currentEnabledIndex + direction + enabled.length) % enabled.length
    target = enabled[nextIndex]
  }

  select(target.item)
  await nextTick()
  tabRefs.value[target.index]?.focus()
}

function onKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    moveFocus(index, 1)
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    moveFocus(index, -1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    moveFocus(index, 'first')
  } else if (event.key === 'End') {
    event.preventDefault()
    moveFocus(index, 'last')
  }
}
</script>

<template>
  <div class="tz-tabs" :class="{ 'tz-tabs--fluid': fluid }" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="(item, index) in items"
      :key="item.value"
      :ref="element => { tabRefs[index] = element as HTMLButtonElement | null }"
      type="button"
      class="tz-tabs__tab"
      :class="{ 'is-active': item.value === activeValue }"
      role="tab"
      :aria-selected="item.value === activeValue"
      :aria-disabled="item.disabled || undefined"
      :tabindex="item.value === activeValue ? 0 : -1"
      :disabled="item.disabled"
      @click="select(item)"
      @keydown="onKeydown($event, index)"
    >
      <span class="tz-tabs__label">
        <slot name="label" :item="item" :active="item.value === activeValue">{{ item.label }}</slot>
      </span>
      <span
        v-if="item.count !== undefined"
        :key="`${item.value}-${item.count}`"
        class="tz-tabs__badge"
        :class="[`tz-tabs__badge--${item.badgeTone ?? 'info'}`, { 'tz-tabs__badge--empty': item.count === 0 }]"
        :aria-label="counterLabel(item)"
        :title="String(item.count)"
      >
        <slot name="badge" :item="item" :active="item.value === activeValue">{{ displayCount(item.count) }}</slot>
      </span>
    </button>
  </div>
</template>

<style scoped>
.tz-tabs {
  display: inline-flex;
  box-sizing: border-box;
  max-width: 100%;
  padding: var(--padding-spacing-4);
  align-items: center;
  border-radius: var(--radius-md);
  background: var(--bg-disabled);
}

.tz-tabs--fluid { display: flex; width: 100%; }

.tz-tabs__tab {
  display: inline-flex;
  min-width: 0;
  min-height: 28px;
  padding: var(--padding-spacing-4) var(--padding-spacing-16);
  align-items: center;
  justify-content: center;
  gap: var(--padding-spacing-4);
  color: var(--text-muted);
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  font: 400 14px/20px var(--tz-font-family);
  white-space: nowrap;
  cursor: pointer;
  transition: color 160ms ease, background-color 160ms ease, box-shadow 160ms ease;
}

.tz-tabs--fluid .tz-tabs__tab { flex: 1 1 0; }
.tz-tabs__tab:hover:not(:disabled):not(.is-active) { color: var(--text-default); background: var(--bg-row-hover); }
.tz-tabs__tab.is-active { color: var(--text-button-fill); background: var(--brand-primary); }
.tz-tabs__tab:focus-visible { z-index: 1; outline: 2px solid var(--brand-primary); outline-offset: 2px; }
.tz-tabs__tab:disabled { color: var(--text-disabled); cursor: not-allowed; }
.tz-tabs__label { overflow: hidden; text-overflow: ellipsis; }

.tz-tabs__badge {
  display: inline-flex;
  min-width: 17px;
  height: 17px;
  box-sizing: border-box;
  flex: 0 0 auto;
  padding: 1px var(--padding-spacing-4) 0;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font: 500 12px/16px var(--tz-font-family);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0;
  animation: tz-tab-counter-in 160ms ease-out;
}

.tz-tabs__badge--neutral { color: var(--text-muted); background: var(--bg-surface); }
.tz-tabs__badge--info { color: var(--status-info-fg); background: var(--status-info-bg); }
.tz-tabs__badge--success { color: var(--status-success-fg); background: var(--status-success-bg); }
.tz-tabs__badge--warning { color: var(--orange-fg); background: var(--orange-bg); }
.tz-tabs__badge--error { color: var(--status-error-fg); background: var(--status-error-bg); }
.tz-tabs__badge--empty { color: var(--text-muted); background: var(--text-disabled); }
.tz-tabs__tab.is-active .tz-tabs__badge { color: var(--brand-primary); background: var(--text-button-fill); }

@keyframes tz-tab-counter-in { from { opacity: .35; transform: scale(.86); } }

@media (prefers-reduced-motion: reduce) {
  .tz-tabs__tab, .tz-tabs__badge { transition: none; animation: none; }
}
</style>
