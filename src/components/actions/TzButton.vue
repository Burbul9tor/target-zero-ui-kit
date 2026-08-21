<script setup lang="ts">
import { computed, ref, type Component, type ComponentPublicInstance } from 'vue'

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'error'
export type ButtonSize = 'large' | 'medium' | 'small'
export type ButtonTag = 'button' | 'a' | 'router-link'

const props = withDefaults(defineProps<{
  tag?: ButtonTag
  type?: 'button' | 'submit' | 'reset'
  label?: string
  color?: ButtonVariant | 'danger' | 'default'
  size?: ButtonSize
  iconLeft?: Component
  iconRight?: Component
  iconWidth?: string | number
  iconHeight?: string | number
  iconRotate?: 'top' | 'right' | 'bottom' | 'left'
  rounded?: boolean
  disabled?: boolean
  outlined?: boolean
  noBorder?: boolean
  expanded?: boolean
  loading?: boolean
  filled?: boolean
  href?: string
  to?: string | Record<string, unknown>
}>(), {
  tag: 'button',
  type: 'button',
  label: '',
  color: 'primary',
  size: 'large',
  iconWidth: 16,
  iconHeight: 16,
  iconRotate: 'bottom',
  rounded: false,
  disabled: false,
  outlined: false,
  noBorder: false,
  expanded: false,
  loading: false,
  filled: false,
  href: undefined,
  to: undefined,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()
const root = ref<HTMLElement | ComponentPublicInstance | null>(null)

const variant = computed<ButtonVariant>(() => {
  if (props.noBorder) return 'text'
  if (props.outlined) return 'secondary'
  if (props.color === 'danger' || props.color === 'error') return 'error'
  if (props.color === 'secondary' || props.color === 'text') return props.color
  return 'primary'
})

const iconStyle = computed(() => ({
  width: typeof props.iconWidth === 'number' ? `${props.iconWidth}px` : props.iconWidth,
  height: typeof props.iconHeight === 'number' ? `${props.iconHeight}px` : props.iconHeight,
  transform: `rotate(${({ top: 180, right: 270, bottom: 0, left: 90 } as const)[props.iconRotate]}deg)`,
}))

function element() {
  const value = root.value
  return value instanceof HTMLElement ? value : value?.$el as HTMLElement | undefined
}

function onClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }
  emit('click', event)
}

function focus() { element()?.focus() }
function blur() { element()?.blur() }
function click() { if (!props.disabled && !props.loading) element()?.click() }

defineExpose({ focus, blur, click })
</script>

<template>
  <component
    :is="tag"
    ref="root"
    class="tz-button"
    :class="[
      `tz-button--${variant}`,
      `tz-button--${size}`,
      { 'is-rounded': rounded, 'is-expanded': expanded, 'is-loading': loading, 'is-filled': filled },
    ]"
    :type="tag === 'button' ? type : undefined"
    :href="tag === 'a' && !disabled && !loading ? href : undefined"
    :to="tag === 'router-link' ? to : undefined"
    :disabled="tag === 'button' ? disabled || loading : undefined"
    :aria-disabled="tag !== 'button' && (disabled || loading) ? 'true' : undefined"
    :aria-busy="loading || undefined"
    :tabindex="tag !== 'button' && (disabled || loading) ? -1 : undefined"
    @click="onClick"
  >
    <span v-if="loading" class="tz-button__loader" aria-hidden="true" />
    <span v-else-if="$slots['icon-left'] || iconLeft" class="tz-button__icon" :style="iconStyle" aria-hidden="true">
      <slot name="icon-left"><component :is="iconLeft" /></slot>
    </span>

    <span v-if="$slots.default || label" class="tz-button__label"><slot>{{ label }}</slot></span>

    <span v-if="!loading && ($slots['icon-right'] || iconRight)" class="tz-button__icon" :style="iconStyle" aria-hidden="true">
      <slot name="icon-right"><component :is="iconRight" /></slot>
    </span>
  </component>
</template>

<style scoped>
.tz-button {
  display: inline-flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  gap: var(--padding-spacing-8);
  max-width: 100%;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-family: var(--tz-font-family);
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: color 140ms ease, border-color 140ms ease, background-color 140ms ease, box-shadow 140ms ease;
}

.tz-button--large { height: 44px; padding: var(--padding-spacing-12); font-size: 14px; line-height: 20px; }
.tz-button--medium { height: 32px; padding: var(--padding-spacing-8) var(--padding-spacing-12); font-size: 12px; line-height: 16px; }
.tz-button--small { height: 24px; padding: var(--padding-spacing-4) var(--padding-spacing-8); font-size: 10px; line-height: 14px; }
.tz-button.is-rounded { border-radius: var(--radius-full); }
.tz-button.is-expanded { display: flex; width: 100%; }

.tz-button--primary { color: var(--text-button-fill); background: var(--brand-primary); }
.tz-button--primary:hover:not(:disabled), .tz-button--primary.is-preview-hover { background: var(--brand-primary-hover); }
.tz-button--secondary { color: var(--brand-primary); border-color: var(--brand-primary); background: transparent; }
.tz-button--secondary:hover:not(:disabled), .tz-button--secondary.is-preview-hover { background: var(--brand-bg-hover); }
.tz-button--text { color: var(--brand-primary); background: transparent; }
.tz-button--text:hover:not(:disabled), .tz-button--text.is-preview-hover { background: var(--brand-bg-accent); }
.tz-button--error { color: var(--text-button-fill); background: var(--status-error-fg); }
.tz-button--error:hover:not(:disabled), .tz-button--error.is-preview-hover { background: var(--status-error-hover); }

.tz-button:focus-visible { outline: 2px solid var(--brand-primary); outline-offset: 2px; }
.tz-button:disabled, .tz-button[aria-disabled='true'] { color: var(--text-disabled); cursor: not-allowed; }
.tz-button--primary:disabled, .tz-button--primary[aria-disabled='true'] { background: var(--brand-bg-hover); }
.tz-button--secondary:disabled, .tz-button--secondary[aria-disabled='true'] { border-color: var(--text-disabled); background: transparent; }
.tz-button--text:disabled, .tz-button--text[aria-disabled='true'] { background: transparent; }
.tz-button--error:disabled, .tz-button--error[aria-disabled='true'] { background: var(--status-error-bg); }
.tz-button.is-filled { box-shadow: 0 1px 3px var(--bg-shadow); }

.tz-button__icon { display: inline-grid; flex: 0 0 auto; place-items: center; transform-origin: center; }
.tz-button__icon :deep(svg) { width: 100%; height: 100%; }
.tz-button__label { overflow: hidden; text-overflow: ellipsis; }
.tz-button__loader { width: 16px; height: 16px; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: tz-button-spin 700ms linear infinite; }

@keyframes tz-button-spin { to { transform: rotate(360deg); } }
</style>
