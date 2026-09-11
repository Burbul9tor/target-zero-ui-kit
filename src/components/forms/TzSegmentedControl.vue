<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { Component } from 'vue'

export type SegmentedValue = string | number
export type SegmentedSize = 'compact' | 'small' | 'medium' | 'large'
export type SegmentedAppearance = 'filled' | 'surface'

export interface SegmentedItem {
  value: SegmentedValue
  label: string
  icon?: Component
  count?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  modelValue?: SegmentedValue
  items: SegmentedItem[]
  label?: string
  size?: SegmentedSize
  appearance?: SegmentedAppearance
  fluid?: boolean
  disabled?: boolean
  ariaLabel?: string
}>(), {
  modelValue: undefined,
  label: undefined,
  size: 'medium',
  appearance: 'filled',
  fluid: false,
  disabled: false,
  ariaLabel: 'Выберите вариант',
})

const emit = defineEmits<{
  'update:modelValue': [value: SegmentedValue]
  change: [value: SegmentedValue, item: SegmentedItem]
}>()

defineSlots<{
  label(props: { item: SegmentedItem; selected: boolean }): unknown
  icon(props: { item: SegmentedItem; selected: boolean }): unknown
}>()

const controls = ref<Array<HTMLButtonElement | null>>([])
const selectedValue = computed(() => props.modelValue ?? props.items.find(item => !item.disabled)?.value)

function isDisabled(item: SegmentedItem) { return props.disabled || item.disabled }
function select(item: SegmentedItem) {
  if (isDisabled(item) || item.value === selectedValue.value) return
  emit('update:modelValue', item.value)
  emit('change', item.value, item)
}

async function move(index: number, direction: 1 | -1 | 'first' | 'last') {
  const enabled = props.items.map((item, itemIndex) => ({ item, itemIndex })).filter(entry => !isDisabled(entry.item))
  if (!enabled.length) return
  const current = enabled.findIndex(entry => entry.itemIndex === index)
  let target = enabled[0]
  if (direction === 'last') target = enabled.at(-1)!
  else if (direction !== 'first') target = enabled[(current + direction + enabled.length) % enabled.length]
  select(target.item)
  await nextTick()
  controls.value[target.itemIndex]?.focus()
}

function onKeydown(event: KeyboardEvent, index: number) {
  const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1
    : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1
      : event.key === 'Home' ? 'first'
        : event.key === 'End' ? 'last' : null
  if (direction === null) return
  event.preventDefault()
  move(index, direction)
}
</script>

<template>
  <div class="tz-segmented-field">
    <span v-if="label" class="tz-segmented-field__label">{{ label }}</span>
    <div
      class="tz-segmented"
      :class="[`tz-segmented--${size}`, `tz-segmented--${appearance}`, { 'is-fluid': fluid, 'is-disabled': disabled }]"
      role="radiogroup"
      :aria-label="label || ariaLabel"
      :aria-disabled="disabled || undefined"
    >
      <button
        v-for="(item, index) in items"
        :key="item.value"
        :ref="element => { controls[index] = element as HTMLButtonElement | null }"
        type="button"
        class="tz-segmented__item"
        :class="{ 'is-selected': item.value === selectedValue }"
        role="radio"
        :aria-checked="item.value === selectedValue"
        :disabled="isDisabled(item)"
        :tabindex="item.value === selectedValue ? 0 : -1"
        @click="select(item)"
        @keydown="onKeydown($event, index)"
      >
        <span v-if="$slots.icon || item.icon" class="tz-segmented__icon" aria-hidden="true">
          <slot name="icon" :item="item" :selected="item.value === selectedValue"><component :is="item.icon" /></slot>
        </span>
        <span class="tz-segmented__label"><slot name="label" :item="item" :selected="item.value === selectedValue">{{ item.label }}</slot></span>
        <span v-if="item.count !== undefined" class="tz-segmented__count">{{ item.count }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tz-segmented-field{display:inline-flex;max-width:100%;flex-direction:column;align-items:flex-start;gap:var(--padding-spacing-8)}.tz-segmented-field:has(.is-fluid){display:flex;width:100%}.tz-segmented-field__label{color:var(--text-default);font:var(--tz-text-body-medium)}
.tz-segmented{display:inline-flex;box-sizing:border-box;max-width:100%;align-items:stretch;gap:var(--padding-spacing-8)}.tz-segmented.is-fluid{display:flex;width:100%}.tz-segmented__item{display:inline-flex;min-width:0;align-items:center;justify-content:center;gap:var(--padding-spacing-6);color:var(--text-default);border:0;border-radius:var(--radius-md);background:var(--bg-disabled);font-family:var(--tz-font-family);font-weight:400;white-space:nowrap;cursor:pointer;transition:color 140ms ease,background-color 140ms ease,box-shadow 140ms ease}.tz-segmented.is-fluid .tz-segmented__item{flex:1 1 0}
.tz-segmented--surface{padding:var(--padding-spacing-2);gap:var(--padding-spacing-2);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.tz-segmented--surface .tz-segmented__item{border-radius:var(--radius-sm);background:transparent}
.tz-segmented--compact .tz-segmented__item{min-height:24px;padding:var(--padding-spacing-2) var(--padding-spacing-16);border-radius:var(--radius-sm);font:var(--tz-text-body-medium)}.tz-segmented--small .tz-segmented__item{min-height:28px;padding:var(--padding-spacing-4) var(--padding-spacing-8);font-size:10px;line-height:14px}.tz-segmented--medium .tz-segmented__item{min-height:36px;padding:var(--padding-spacing-8) var(--padding-spacing-12);font-size:12px;line-height:16px}.tz-segmented--large .tz-segmented__item{min-height:44px;padding:var(--padding-spacing-12) var(--padding-spacing-20);font-size:16px;line-height:20px}
.tz-segmented__item:hover:not(:disabled):not(.is-selected){background:var(--brand-bg-active)}.tz-segmented__item.is-selected{color:var(--text-button-fill);background:var(--brand-primary);font-weight:500;box-shadow:none}.tz-segmented--surface .tz-segmented__item.is-selected{color:var(--text-button-fill);background:var(--brand-primary);box-shadow:none}.tz-segmented__item:focus-visible{z-index:1;outline:2px solid var(--brand-primary);outline-offset:2px}.tz-segmented__item:disabled{color:var(--text-disabled);background:var(--bg-disabled);cursor:not-allowed}.tz-segmented__item.is-selected:disabled{color:var(--text-disabled);background:var(--brand-bg-hover);box-shadow:none}
.tz-segmented__icon{display:grid;flex:0 0 auto;width:16px;height:16px;place-items:center}.tz-segmented__icon :deep(svg){width:16px;height:16px}.tz-segmented__label{min-width:0;overflow:hidden;text-overflow:ellipsis}.tz-segmented__count{display:grid;min-width:18px;height:18px;padding:0 var(--padding-spacing-4);place-items:center;color:var(--text-muted);border-radius:var(--radius-full);background:var(--bg-surface);font-size:11px;line-height:18px}.tz-segmented__item.is-selected .tz-segmented__count{color:var(--brand-primary);background:var(--text-button-fill)}
@media(prefers-reduced-motion:reduce){.tz-segmented__item{transition:none}}
</style>
