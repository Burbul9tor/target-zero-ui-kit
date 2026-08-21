<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import type { Component, StyleValue } from 'vue'

export type InputValue = string | number | null
export type InputSize = 'default' | 'small' | 'medium' | 'large'
export type InputState = 'default' | 'hover' | 'active' | 'focus' | 'filled' | 'chips' | 'disabled' | 'disabled-chips' | 'error'
export type InputLabelPosition = 'left' | 'right'
export type InputResize = 'none' | 'both' | 'horizontal' | 'vertical'
export type InputChip = { id: string | number; value?: string; label?: string; deletable?: boolean; icon?: Component; [key: string]: unknown }
export type InputMultipleItem = InputChip

const props = withDefaults(defineProps<{
  id?: string; name?: string; value?: InputValue; modelValue?: InputValue; placeholder?: string; type?: string
  label?: string; labelPosition?: InputLabelPosition; errorMessage?: string; error?: string; resize?: InputResize
  iconLeft?: Component; iconRight?: Component; iconColor?: string; borderColor?: string; autocomplete?: string
  cols?: number; rows?: number; disabled?: boolean; isTextarea?: boolean; required?: boolean; multiple?: boolean
  clearable?: boolean; loading?: boolean; readonly?: boolean; multipleItems?: InputMultipleItem[]; chips?: InputChip[]
  clickableMultipleItems?: boolean; size?: InputSize; maxLength?: string | number; maxlength?: number
  disabledKeydownEnter?: boolean; passwordIconOn?: Component; passwordIconOff?: Component
  onBlur?: (event: FocusEvent) => void; prohibitedKeys?: string[]; onFieldClick?: (event?: Event) => void
  state?: InputState; showLabel?: boolean
}>(), {
  id: undefined, name: '', value: undefined, modelValue: undefined, placeholder: '', type: 'text', label: '',
  labelPosition: 'left', errorMessage: '', error: '', resize: 'both', iconLeft: undefined, iconRight: undefined,
  iconColor: 'default', borderColor: 'default', autocomplete: 'on', cols: 10, rows: 10, disabled: false,
  isTextarea: false, required: false, multiple: false, clearable: false, loading: false, readonly: false,
  multipleItems: () => [], chips: () => [], clickableMultipleItems: false, size: 'default', maxLength: '',
  maxlength: undefined, disabledKeydownEnter: false, passwordIconOn: undefined, passwordIconOff: undefined,
  onBlur: undefined, prohibitedKeys: () => [], onFieldClick: undefined, state: 'default', showLabel: true,
})

const emit = defineEmits<{
  'update:value': [value: InputValue]
  'update:modelValue': [value: InputValue]
  'update:multipleItems': [items: InputMultipleItem[]]
  clear: []
  change: [value: InputValue]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  enter: [value: InputValue]
  'remove-chip': [chip: InputChip]
  'chip-click': [chip: InputChip]
  'icon-left-click': []
  'icon-right-click': []
}>()

const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)
const passwordVisible = ref(false)
const uid = useId()
const inputId = computed(() => props.id || `tz-input-${uid}`)
const errorId = computed(() => `${inputId.value}-error`)
const currentValue = computed<InputValue>(() => props.value !== undefined ? props.value : (props.modelValue ?? ''))
const items = computed<InputMultipleItem[]>(() => props.multipleItems.length ? props.multipleItems : props.chips)
const isDisabled = computed(() => props.disabled || props.state === 'disabled' || props.state === 'disabled-chips')
const validationMessage = computed(() => props.errorMessage || props.error)
const hasError = computed(() => Boolean(validationMessage.value) || props.state === 'error')
const hasValue = computed(() => currentValue.value !== '' && currentValue.value !== null)
const maxLengthValue = computed(() => {
  const raw = props.maxLength === '' ? props.maxlength : props.maxLength
  if (raw === undefined || raw === '') return undefined
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : undefined
})
const nativeType = computed(() => props.type === 'password' && passwordVisible.value ? 'text' : props.type)
const canClear = computed(() => props.clearable && hasValue.value && !isDisabled.value && !props.readonly && !props.loading)
const classes = computed(() => [`tz-input--${props.size}`, `is-${props.state}`, {
  'is-disabled': isDisabled.value, 'is-error': hasError.value, 'has-chips': items.value.length > 0,
  'is-textarea': props.isTextarea,
}])
const colorMap: Record<string, string> = {
  default: 'var(--border-default)', primary: 'var(--brand-primary)', secondary: 'var(--text-muted)',
  success: 'var(--status-success-fg)', error: 'var(--status-error-fg)', danger: 'var(--status-error-fg)',
  warning: 'var(--status-warning-fg)', info: 'var(--status-info-fg)', white: 'var(--text-inverse)',
}
const fieldStyle = computed<StyleValue>(() => ({
  '--tz-input-border': colorMap[props.borderColor] || props.borderColor,
  '--tz-input-icon': colorMap[props.iconColor] || props.iconColor,
  '--tz-input-resize': props.resize,
}))

function setValue(value: InputValue) { emit('update:value', value); emit('update:modelValue', value) }
function update(event: Event) { setValue((event.target as HTMLInputElement | HTMLTextAreaElement).value) }
function change(event: Event) { emit('change', (event.target as HTMLInputElement | HTMLTextAreaElement).value) }
function focus() { field.value?.focus() }
function clearValue() { setValue(''); emit('clear'); focus() }
function removeItem(item: InputMultipleItem) {
  if (isDisabled.value || item.deletable === false) return
  emit('update:multipleItems', items.value.filter(candidate => candidate.id !== item.id))
  emit('remove-chip', item)
}
function clickItem(item: InputMultipleItem) { if (props.clickableMultipleItems) emit('chip-click', item) }
function handleBlur(event: FocusEvent) { props.onBlur?.(event); emit('blur', event) }
function handleKeydown(event: KeyboardEvent) {
  if (props.prohibitedKeys.includes(event.key)) { event.preventDefault(); return }
  if (event.key === 'Enter') {
    if (props.disabledKeydownEnter) event.preventDefault()
    else emit('enter', currentValue.value)
  }
}
function fieldClick(event: Event) { props.onFieldClick?.(event); focus() }
defineExpose({ focus, blur: () => field.value?.blur(), select: () => field.value?.select(), clear: clearValue })
</script>

<template>
  <label class="tz-input" :class="classes" :for="inputId">
    <span v-if="showLabel && (label || $slots['label-suffix'])" class="tz-input__label" :class="`is-${labelPosition}`">
      <span>{{ label }}</span><sup v-if="required">*</sup><slot name="label-suffix" />
    </span>
    <span class="tz-input__container" :style="fieldStyle" @click="fieldClick">
      <slot name="button-left" />
      <button v-if="$slots['icon-left'] || iconLeft" class="tz-input__icon-button" type="button" :disabled="isDisabled" tabindex="-1" aria-label="Left input action" @click.stop="emit('icon-left-click')">
        <slot name="icon-left"><component :is="iconLeft" :size="16" :stroke-width="1.5" /></slot>
      </button>
      <span v-if="items.length" class="tz-input__chips">
        <span v-for="item in items" :key="item.id" class="tz-input__chip" :class="{ clickable: clickableMultipleItems }" @click.stop="clickItem(item)">
          <slot name="chips" :item="item">
            <component :is="item.icon" v-if="item.icon" :size="16" :stroke-width="1.5" aria-hidden="true" />
            <span>{{ item.value ?? item.label }}</span>
            <button v-if="!isDisabled && item.deletable !== false" type="button" :aria-label="`Remove ${item.value ?? item.label}`" @click.stop.prevent="removeItem(item)">&times;</button>
          </slot>
        </span>
      </span>
      <textarea
        v-if="isTextarea" :id="inputId" ref="field" class="tz-input__native" :value="currentValue ?? ''"
        :name="name" :autocomplete="autocomplete" :placeholder="items.length ? undefined : placeholder"
        :required="required" :disabled="isDisabled" :readonly="readonly" :maxlength="maxLengthValue"
        :cols="cols" :rows="rows" :aria-invalid="hasError || undefined" :aria-describedby="hasError ? errorId : undefined"
        @input="update" @change="change" @focus="emit('focus', $event)" @blur="handleBlur" @keydown="handleKeydown"
      />
      <input
        v-else :id="inputId" ref="field" class="tz-input__native" :value="currentValue ?? ''" :type="nativeType"
        :name="name" :autocomplete="autocomplete" :placeholder="items.length ? undefined : placeholder"
        :required="required" :disabled="isDisabled" :readonly="readonly" :maxlength="maxLengthValue"
        :aria-invalid="hasError || undefined" :aria-describedby="hasError ? errorId : undefined"
        @input="update" @change="change" @focus="emit('focus', $event)" @blur="handleBlur" @keydown="handleKeydown"
      >
      <span v-if="loading" class="tz-input__loader" role="status" aria-label="Loading" />
      <button v-if="type === 'password' && (passwordIconOn || passwordIconOff)" class="tz-input__icon-button" type="button" :disabled="isDisabled" aria-label="Toggle password visibility" @click.stop="passwordVisible = !passwordVisible">
        <component :is="passwordVisible ? passwordIconOn : passwordIconOff" :size="16" :stroke-width="1.5" />
      </button>
      <button v-if="canClear" class="tz-input__icon-button tz-input__clear" type="button" aria-label="Clear input" @click.stop="clearValue"><slot name="clear-icon">&times;</slot></button>
      <button v-if="$slots['icon-right'] || iconRight" class="tz-input__icon-button" type="button" :disabled="isDisabled" tabindex="-1" aria-label="Right input action" @click.stop="emit('icon-right-click')">
        <slot name="icon-right"><component :is="iconRight" :size="16" :stroke-width="1.5" /></slot>
      </button>
      <slot name="button-right" />
    </span>
    <span v-if="hasError" :id="errorId" class="tz-input__error">{{ validationMessage || 'Error' }}</span>
  </label>
</template>

<style scoped>
.tz-input{display:flex;width:100%;min-width:0;flex-direction:column;gap:var(--padding-spacing-4);color:var(--text-default);font-family:var(--tz-font-family)}
.tz-input__label{display:flex;align-items:flex-start;gap:var(--padding-spacing-2);font:var(--tz-text-body-small)}.tz-input__label.is-right{justify-content:flex-end}.tz-input__label sup{top:auto;color:var(--status-error-fg);font:inherit}
.tz-input__container{display:flex;box-sizing:border-box;width:100%;min-width:0;min-height:44px;padding:0 var(--padding-spacing-12);align-items:center;gap:var(--padding-spacing-8);overflow:hidden;color:var(--tz-input-icon,var(--icon-default));border:1px solid var(--tz-input-border,var(--border-default));border-radius:var(--radius-md);background:var(--bg-surface);transition:border-color 140ms ease,background-color 140ms ease,box-shadow 140ms ease}
.tz-input--large .tz-input__container,.tz-input--default .tz-input__container{min-height:44px}.tz-input--medium .tz-input__container,.tz-input--small .tz-input__container{min-height:32px}
.tz-input__container:hover,.tz-input.is-hover .tz-input__container{box-shadow:0 0 4px 2px var(--effect-shadow)}.tz-input__container:active,.tz-input.is-active .tz-input__container{border-color:var(--brand-primary);box-shadow:none}.tz-input__container:focus-within,.tz-input.is-focus .tz-input__container{border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--effect-shadow)}
.tz-input__native{width:100%;min-width:32px;flex:1 1 auto;padding:0;color:var(--text-default);border:0;outline:0;background:transparent;font:var(--tz-text-body-medium);text-overflow:ellipsis}.tz-input__native::placeholder{color:var(--text-muted);opacity:1}
textarea.tz-input__native{min-height:72px;padding:var(--padding-spacing-12) 0;resize:var(--tz-input-resize,both)}.tz-input.is-textarea .tz-input__container{align-items:flex-start;height:auto}
.tz-input__icon-button{display:grid;flex:0 0 16px;width:16px;height:16px;padding:0;place-items:center;color:currentColor;border:0;background:transparent;cursor:pointer}.tz-input__icon-button svg{display:block}.tz-input__icon-button:disabled{cursor:not-allowed}.tz-input__clear{color:var(--text-muted);font:var(--tz-text-body-medium)}
.tz-input__loader{box-sizing:border-box;flex:0 0 16px;width:16px;height:16px;border:2px solid var(--border-default);border-top-color:var(--brand-primary);border-radius:50%;animation:tz-input-spin .7s linear infinite}
.tz-input__chips{display:flex;min-width:0;flex:0 1 auto;gap:var(--padding-spacing-4);overflow:hidden}.tz-input__chip{display:inline-flex;min-width:0;height:20px;padding:var(--padding-spacing-2) var(--padding-spacing-8);align-items:center;gap:var(--padding-spacing-4);color:var(--text-default);border-radius:var(--radius-sm);background:var(--brand-bg-accent);font:var(--tz-text-body-small);white-space:nowrap}.tz-input__chip.clickable{cursor:pointer}.tz-input__chip>span{overflow:hidden;text-overflow:ellipsis}.tz-input__chip button{width:14px;height:14px;padding:0;color:var(--text-muted);border:0;border-radius:50%;background:transparent;font:var(--tz-text-body-small);line-height:12px;cursor:pointer}.tz-input__chip button:hover{color:var(--status-error-fg)}
.tz-input.is-disabled .tz-input__container{color:var(--text-disabled);border-color:var(--border-default);background:var(--bg-disabled);box-shadow:none;cursor:not-allowed}.tz-input.is-disabled .tz-input__native,.tz-input.is-disabled .tz-input__native::placeholder{color:var(--text-disabled);cursor:not-allowed}.tz-input.is-disabled .tz-input__chip{color:var(--text-disabled)}.tz-input.is-error .tz-input__container{border-color:var(--status-error-fg);box-shadow:none}.tz-input__error{color:var(--status-error-fg);font:var(--tz-text-label-small)}
@keyframes tz-input-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.tz-input__container{transition:none}.tz-input__loader{animation:none}}
</style>
