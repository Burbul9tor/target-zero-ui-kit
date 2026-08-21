<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import type { Component } from 'vue'

export type InputSize = 'large' | 'medium'
export type InputState = 'default' | 'hover' | 'active' | 'focus' | 'filled' | 'chips' | 'disabled' | 'disabled-chips' | 'error'
export type InputChip = { id: string | number; label: string; icon?: Component }

const props = withDefaults(defineProps<{
  modelValue?: string | number
  label?: string
  placeholder?: string
  size?: InputSize
  state?: InputState
  type?: string
  name?: string
  autocomplete?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  showLabel?: boolean
  iconLeft?: Component
  iconRight?: Component
  chips?: InputChip[]
  error?: string
  maxlength?: number
}>(), {
  modelValue: '',
  label: 'Name',
  placeholder: 'Введите значение',
  size: 'large',
  state: 'default',
  type: 'text',
  name: undefined,
  autocomplete: undefined,
  required: false,
  disabled: false,
  readonly: false,
  showLabel: true,
  iconLeft: undefined,
  iconRight: undefined,
  chips: () => [],
  error: '',
  maxlength: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  enter: [value: string]
  'remove-chip': [chip: InputChip]
  'icon-left-click': []
  'icon-right-click': []
}>()

const input = ref<HTMLInputElement | null>(null)
const uid = useId()
const inputId = computed(() => `tz-input-${uid}`)
const errorId = computed(() => `${inputId.value}-error`)
const isDisabled = computed(() => props.disabled || props.state === 'disabled' || props.state === 'disabled-chips')
const hasError = computed(() => Boolean(props.error) || props.state === 'error')
const classes = computed(() => [
  `tz-input--${props.size}`,
  `is-${props.state}`,
  { 'is-disabled': isDisabled.value, 'is-error': hasError.value, 'has-chips': props.chips.length > 0 },
])

function update(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function change(event: Event) {
  emit('change', (event.target as HTMLInputElement).value)
}

function focus() {
  input.value?.focus()
}

function onEnter() {
  emit('enter', String(props.modelValue))
}

defineExpose({ focus, blur: () => input.value?.blur(), select: () => input.value?.select() })
</script>

<template>
  <label class="tz-input" :class="classes" :for="inputId">
    <span v-if="showLabel" class="tz-input__label">
      <span>{{ label }}</span><sup v-if="required">*</sup>
    </span>

    <span class="tz-input__container" @click="focus">
      <button v-if="$slots['icon-left'] || iconLeft" class="tz-input__icon-button" type="button" :disabled="isDisabled" tabindex="-1" aria-label="Действие слева" @click.stop="emit('icon-left-click')">
        <slot name="icon-left"><component :is="iconLeft" :size="16" :stroke-width="1.5" /></slot>
      </button>

      <span v-if="chips.length" class="tz-input__chips">
        <span v-for="chip in chips" :key="chip.id" class="tz-input__chip">
          <component :is="chip.icon" v-if="chip.icon" :size="16" :stroke-width="1.5" aria-hidden="true" />
          <span>{{ chip.label }}</span>
          <button v-if="!isDisabled" type="button" :aria-label="`Удалить ${chip.label}`" @click.stop.prevent="emit('remove-chip', chip)">×</button>
        </span>
      </span>

      <input
        :id="inputId"
        ref="input"
        class="tz-input__native"
        :value="modelValue"
        :type="type"
        :name="name"
        :autocomplete="autocomplete"
        :placeholder="chips.length ? undefined : placeholder"
        :required="required"
        :disabled="isDisabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :aria-invalid="hasError || undefined"
        :aria-describedby="hasError ? errorId : undefined"
        @input="update"
        @change="change"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
        @keydown.enter="onEnter"
      >

      <button v-if="$slots['icon-right'] || iconRight" class="tz-input__icon-button" type="button" :disabled="isDisabled" tabindex="-1" aria-label="Действие справа" @click.stop="emit('icon-right-click')">
        <slot name="icon-right"><component :is="iconRight" :size="16" :stroke-width="1.5" /></slot>
      </button>
    </span>

    <span v-if="hasError" :id="errorId" class="tz-input__error">{{ error || 'Error' }}</span>
  </label>
</template>

<style scoped>
.tz-input { display: flex; width: 100%; min-width: 0; flex-direction: column; gap: var(--padding-spacing-4); color: var(--text-default); font-family: var(--tz-font-family); }
.tz-input__label { display: flex; align-items: flex-start; gap: var(--padding-spacing-2); font: var(--tz-text-body-small); }
.tz-input__label sup { top: auto; color: var(--status-error-fg); font: inherit; }
.tz-input__container { display: flex; width: 100%; min-width: 0; align-items: center; gap: var(--padding-spacing-8); overflow: hidden; color: var(--icon-default); border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--bg-surface); transition: border-color 140ms ease, background-color 140ms ease, box-shadow 140ms ease; }
.tz-input--large .tz-input__container { height: 44px; padding: 0 var(--padding-spacing-12); }
.tz-input--medium .tz-input__container { height: 32px; padding: 0 var(--padding-spacing-12); }
.tz-input__container:hover, .tz-input.is-hover .tz-input__container { box-shadow: 0 0 4px 2px var(--effect-shadow); }
.tz-input__container:active, .tz-input.is-active .tz-input__container { border-color: var(--brand-primary); box-shadow: none; }
.tz-input__container:focus-within, .tz-input.is-focus .tz-input__container { border-color: var(--brand-primary); box-shadow: 0 0 0 2px var(--effect-shadow); }
.tz-input__native { width: 100%; min-width: 32px; flex: 1 1 auto; padding: 0; color: var(--text-default); border: 0; outline: 0; background: transparent; font: var(--tz-text-body-medium); text-overflow: ellipsis; }
.tz-input__native::placeholder { color: var(--text-muted); opacity: 1; }
.tz-input__icon-button { display: grid; flex: 0 0 16px; width: 16px; height: 16px; padding: 0; place-items: center; color: currentColor; border: 0; background: transparent; cursor: pointer; }
.tz-input__icon-button svg { display: block; }
.tz-input__chips { display: flex; min-width: 0; flex: 0 1 auto; gap: var(--padding-spacing-4); overflow: hidden; }
.tz-input__chip { display: inline-flex; min-width: 0; height: 20px; padding: var(--padding-spacing-2) var(--padding-spacing-8); align-items: center; gap: var(--padding-spacing-4); color: var(--text-default); border-radius: var(--radius-sm); background: var(--brand-bg-accent); font: var(--tz-text-body-small); white-space: nowrap; }
.tz-input__chip > span { overflow: hidden; text-overflow: ellipsis; }
.tz-input__chip button { width: 14px; height: 14px; padding: 0; color: var(--text-muted); border: 0; border-radius: 50%; background: transparent; font: var(--tz-text-body-small); line-height: 12px; cursor: pointer; }
.tz-input__chip button:hover { color: var(--status-error-fg); }
.tz-input.is-filled .tz-input__native { color: var(--text-default); }
.tz-input.is-disabled .tz-input__container { color: var(--text-disabled); border-color: var(--border-default); background: var(--bg-disabled); box-shadow: none; cursor: not-allowed; }
.tz-input.is-disabled .tz-input__native, .tz-input.is-disabled .tz-input__native::placeholder { color: var(--text-disabled); cursor: not-allowed; }
.tz-input.is-disabled .tz-input__chip { color: var(--text-disabled); }
.tz-input.is-error .tz-input__container { border-color: var(--status-error-fg); box-shadow: none; }
.tz-input__error { color: var(--status-error-fg); font: var(--tz-text-label-small); }
@media (prefers-reduced-motion: reduce) { .tz-input__container { transition: none; } }
</style>