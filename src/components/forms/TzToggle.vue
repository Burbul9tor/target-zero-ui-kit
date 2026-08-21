<script setup lang="ts">
import moonIcon from '../../assets/toggle/moon.svg'
import sunIcon from '../../assets/toggle/sun.svg'

export type ToggleSize = 'medium' | 'small'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  label?: string
  showLabel?: boolean
  size?: ToggleSize
  disabled?: boolean
  name?: string
}>(), {
  modelValue: false,
  label: 'Title',
  showLabel: true,
  size: 'medium',
  disabled: false,
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

function toggle() {
  if (props.disabled) return
  const value = !props.modelValue
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <button
    type="button"
    class="tz-toggle"
    :class="[`tz-toggle--${size}`, { 'is-on': modelValue, 'is-disabled': disabled }]"
    role="switch"
    :name="name"
    :aria-checked="modelValue"
    :aria-label="showLabel && size === 'medium' ? undefined : label"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="tz-toggle__track" aria-hidden="true">
      <img v-if="size === 'small' && modelValue" class="tz-toggle__mode-icon" :src="moonIcon" alt="">
      <span class="tz-toggle__thumb" />
      <img v-if="size === 'small' && !modelValue" class="tz-toggle__mode-icon" :src="sunIcon" alt="">
    </span>
    <span v-if="showLabel && size === 'medium'" class="tz-toggle__label">{{ label }}</span>
  </button>
</template>

<style scoped>
.tz-toggle {
  display: inline-flex;
  width: fit-content;
  padding: 0;
  align-items: center;
  justify-content: center;
  gap: var(--tz-space-8);
  color: var(--text-default);
  border: 0;
  background: transparent;
  font: var(--tz-font-weight-regular) 14px/20px var(--tz-font-family);
  text-align: left;
  cursor: pointer;
}

.tz-toggle__track {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  box-sizing: border-box;
  align-items: center;
  background: var(--bg-track-off);
  transition: background-color 160ms ease;
}

.tz-toggle--medium .tz-toggle__track {
  width: 36px;
  height: 20px;
  padding: 2px;
  border-radius: 10px;
}

.tz-toggle--small .tz-toggle__track {
  width: 32px;
  height: 16px;
  padding: 2px;
  justify-content: space-between;
  gap: var(--tz-space-4);
  border-radius: 10px;
}

.tz-toggle.is-on .tz-toggle__track {
  background: var(--brand-primary);
}

.tz-toggle--small.is-on .tz-toggle__track {
  background: var(--icon-default);
}

.tz-toggle__thumb {
  z-index: 1;
  display: block;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--bg-surface);
  box-shadow: 0 1px 3px var(--bg-shadow);
  transition: transform 160ms ease;
}

.tz-toggle--medium .tz-toggle__thumb {
  width: 16px;
  height: 16px;
}

.tz-toggle--medium.is-on .tz-toggle__thumb {
  transform: translateX(16px);
}

.tz-toggle--small .tz-toggle__thumb {
  width: 12px;
  height: 12px;
}

.tz-toggle__mode-icon {
  display: block;
  width: 12px;
  height: 12px;
  object-fit: contain;
}

.tz-toggle:focus-visible {
  border-radius: 4px;
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}

.tz-toggle.is-disabled {
  opacity: .45;
  cursor: not-allowed;
}
</style>
