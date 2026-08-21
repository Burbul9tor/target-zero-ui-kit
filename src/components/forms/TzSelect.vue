<script setup lang="ts">
import { ChevronDown, CircleX, Settings } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'

export type SelectSize = 'large' | 'medium'
export type SelectMode = 'item' | 'radio' | 'checkbox' | 'chips'
export type SelectState = 'default' | 'hover' | 'active' | 'focus' | 'filled' | 'disabled' | 'error'
export type SelectValue = string | string[] | null

export type SelectOption = {
  label: string
  value: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: SelectValue
    options: SelectOption[]
    label?: string
    placeholder?: string
    required?: boolean
    showLabel?: boolean
    showLeadingIcon?: boolean
    size?: SelectSize
    mode?: SelectMode
    disabled?: boolean
    error?: string
    state?: SelectState
  }>(),
  {
    modelValue: null,
    label: 'Name',
    placeholder: 'Введите значение',
    required: true,
    showLabel: true,
    showLeadingIcon: true,
    size: 'large',
    mode: 'item',
    disabled: false,
    error: '',
    state: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: SelectValue]
  change: [value: SelectValue]
  open: []
  close: []
}>()

const root = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const isFocused = ref(false)
const activeIndex = ref(-1)
const listboxId = `tz-select-${useId()}`

const isMultiple = computed(() => props.mode === 'checkbox' || props.mode === 'chips')
const selectedValues = computed(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue
  return props.modelValue ? [props.modelValue] : []
})
const selectedOptions = computed(() => props.options.filter((option) => selectedValues.value.includes(option.value)))
const hasValue = computed(() => selectedOptions.value.length > 0)
const displayValue = computed(() => selectedOptions.value.map((option) => option.label).join(', '))

const resolvedState = computed<SelectState>(() => {
  if (props.disabled || props.state === 'disabled') return 'disabled'
  if (props.error || props.state === 'error') return 'error'
  if (props.state) return props.state
  if (isOpen.value) return 'active'
  if (isFocused.value) return 'focus'
  if (hasValue.value) return 'filled'
  return 'default'
})

function setOpen(next: boolean) {
  if (props.disabled || props.state === 'disabled' || props.state) return
  if (isOpen.value === next) return
  isOpen.value = next
  activeIndex.value = next ? Math.max(0, props.options.findIndex((option) => !option.disabled)) : -1
  if (next) emit('open')
  else emit('close')
}

function toggleOpen() {
  setOpen(!isOpen.value)
}

function selectOption(option: SelectOption) {
  if (option.disabled) return

  let next: SelectValue
  if (isMultiple.value) {
    next = selectedValues.value.includes(option.value)
      ? selectedValues.value.filter((value) => value !== option.value)
      : [...selectedValues.value, option.value]
  } else {
    next = option.value
  }

  emit('update:modelValue', next)
  emit('change', next)
  if (!isMultiple.value) setOpen(false)
}

function isSelected(option: SelectOption) {
  return selectedValues.value.includes(option.value)
}

function moveActive(direction: 1 | -1) {
  if (!props.options.length) return
  let next = activeIndex.value
  for (let index = 0; index < props.options.length; index += 1) {
    next = (next + direction + props.options.length) % props.options.length
    if (!props.options[next]?.disabled) {
      activeIndex.value = next
      return
    }
  }
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled || props.state) return

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!isOpen.value) setOpen(true)
    else moveActive(event.key === 'ArrowDown' ? 1 : -1)
    return
  }

  if ((event.key === 'Enter' || event.key === ' ') && isOpen.value) {
    event.preventDefault()
    const option = props.options[activeIndex.value]
    if (option) selectOption(option)
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    setOpen(false)
  }
}

function onDocumentPointerDown(event: PointerEvent) {
  if (root.value && !root.value.contains(event.target as Node)) setOpen(false)
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown))
</script>

<template>
  <div
    ref="root"
    class="tz-select"
    :class="[`tz-select--${size}`, `tz-select--${resolvedState}`, `tz-select--${mode}`]"
  >
    <label v-if="showLabel" class="tz-select__label">
      {{ label }}<span v-if="required" aria-hidden="true">*</span>
    </label>

    <button
      class="tz-select__control"
      type="button"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-controls="listboxId"
      aria-haspopup="listbox"
      :aria-required="required"
      :aria-invalid="Boolean(error) || resolvedState === 'error'"
      :disabled="resolvedState === 'disabled'"
      @click="toggleOpen"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keydown="onKeydown"
    >
      <Settings v-if="showLeadingIcon" class="tz-select__leading" :size="16" :stroke-width="1.5" aria-hidden="true" />

      <span v-if="mode !== 'chips' || !hasValue" class="tz-select__value" :class="{ 'is-placeholder': !hasValue }">
        {{ hasValue ? displayValue : placeholder }}
      </span>

      <span v-else class="tz-select__trigger-chips">
        <span v-for="option in selectedOptions.slice(0, 2)" :key="option.value">{{ option.label }}</span>
        <span v-if="selectedOptions.length > 2">+{{ selectedOptions.length - 2 }}</span>
      </span>

      <ChevronDown class="tz-select__chevron" :class="{ 'is-open': isOpen }" :size="16" :stroke-width="1.5" aria-hidden="true" />
    </button>

    <div v-if="isOpen" :id="listboxId" class="tz-select__menu" role="listbox" :aria-multiselectable="isMultiple">
      <div v-if="mode === 'chips'" class="tz-select__chip-row" role="group" aria-label="Варианты">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          class="tz-select__chip"
          :class="{ 'is-selected': isSelected(option) }"
          :disabled="option.disabled"
          @click="selectOption(option)"
        >
          {{ option.label }}
          <CircleX v-if="isSelected(option)" :size="14" :stroke-width="1.5" aria-hidden="true" />
        </button>
      </div>

      <button
        v-for="(option, index) in mode === 'chips' ? [] : options"
        :key="option.value"
        type="button"
        class="tz-select__option"
        :class="{ 'is-active': index === activeIndex, 'is-selected': isSelected(option) }"
        role="option"
        :aria-selected="isSelected(option)"
        :disabled="option.disabled"
        @mouseenter="activeIndex = index"
        @click="selectOption(option)"
      >
        <span>{{ option.label }}</span>
        <i v-if="mode === 'radio'" class="tz-select__radio" aria-hidden="true"><b v-if="isSelected(option)" /></i>
        <i v-else-if="mode === 'checkbox'" class="tz-select__checkbox" aria-hidden="true"><b v-if="isSelected(option)">✓</b></i>
      </button>
    </div>

    <span v-if="error || resolvedState === 'error'" class="tz-select__error">{{ error || 'Error' }}</span>
  </div>
</template>

<style scoped>
.tz-select { position: relative; display: flex; width: 100%; flex-direction: column; gap: var(--padding-spacing-4); color: var(--text-default); font-family: var(--tz-font-family); }
.tz-select__label { font: 400 12px/16px var(--tz-font-family); }
.tz-select__label span { margin-left: 2px; color: var(--status-error-fg); }
.tz-select__control { display: flex; width: 100%; align-items: center; gap: var(--padding-spacing-8); padding: 0 var(--padding-spacing-12); color: var(--text-default); border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--bg-surface); text-align: left; cursor: pointer; transition: border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease; }
.tz-select--large .tz-select__control { height: 44px; }
.tz-select--medium .tz-select__control { height: 32px; }
.tz-select__leading, .tz-select__chevron { flex: 0 0 16px; color: var(--icon-default); }
.tz-select__chevron { margin-left: auto; transition: transform 160ms ease; }
.tz-select__chevron.is-open { transform: rotate(180deg); }
.tz-select__value { min-width: 0; flex: 1 1 auto; overflow: hidden; font: 400 14px/20px var(--tz-font-family); text-overflow: ellipsis; white-space: nowrap; }
.tz-select__value.is-placeholder { color: var(--text-muted); }
.tz-select__trigger-chips { display: flex; min-width: 0; flex: 1; gap: 4px; overflow: hidden; }
.tz-select__trigger-chips span, .tz-select__chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; color: var(--text-default); border: 0; border-radius: 6px; background: var(--brand-bg-accent); font: 400 12px/16px var(--tz-font-family); white-space: nowrap; }
.tz-select--hover .tz-select__control, .tz-select:not(.tz-select--disabled):not(.tz-select--error) .tz-select__control:hover { box-shadow: 0 0 4px 2px var(--effect-shadow); }
.tz-select--active .tz-select__control { border-color: var(--brand-primary); box-shadow: 0 0 0 2px var(--effect-shadow); }
.tz-select--focus .tz-select__control, .tz-select__control:focus-visible { border: 2px solid var(--brand-primary); outline: 0; box-shadow: 0 0 0 2px var(--effect-shadow); }
.tz-select--filled .tz-select__value { color: var(--text-default); }
.tz-select--disabled .tz-select__control { color: var(--text-muted); background: var(--bg-disabled); cursor: not-allowed; }
.tz-select--disabled .tz-select__leading, .tz-select--disabled .tz-select__chevron { color: var(--text-muted); }
.tz-select--error .tz-select__control { border-color: var(--status-error-fg); }
.tz-select__error { color: var(--status-error-fg); font: 500 10px/14px var(--tz-font-family); }
.tz-select__menu { position: absolute; z-index: 30; top: calc(100% + 4px); right: 0; left: 0; display: flex; flex-direction: column; padding: 4px; border: 1px solid var(--border-default); border-radius: 6px; background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.tz-select__option { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: var(--padding-spacing-4); color: var(--text-default); border: 0; border-radius: 6px; background: transparent; text-align: left; cursor: pointer; }
.tz-select--large .tz-select__option { min-height: 44px; padding: 12px 8px; font: 400 14px/20px var(--tz-font-family); }
.tz-select--medium .tz-select__option { min-height: 32px; padding: 6px 8px; font: 400 12px/16px var(--tz-font-family); }
.tz-select__option:hover, .tz-select__option.is-active { background: var(--bg-row-hover); }
.tz-select__option:disabled, .tz-select__chip:disabled { opacity: .45; cursor: not-allowed; }
.tz-select__radio { display: grid; width: 20px; height: 20px; place-items: center; border: 1px solid var(--text-muted); border-radius: 50%; }
.tz-select__radio b { width: 10px; height: 10px; border-radius: 50%; background: var(--brand-primary); }
.tz-select__checkbox { display: grid; width: 20px; height: 20px; place-items: center; color: var(--text-inverse); border: 1px solid var(--text-muted); border-radius: 4px; font: 600 12px/1 var(--tz-font-family); }
.tz-select__checkbox:has(b) { border-color: var(--brand-primary); background: var(--brand-primary); }
.tz-select__chip-row { display: flex; flex-wrap: wrap; gap: 4px; padding: 4px; }
.tz-select__chip { cursor: pointer; }
.tz-select__chip.is-selected { background: var(--brand-bg-active); }
</style>
