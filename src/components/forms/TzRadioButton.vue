<script setup lang="ts" generic="T extends string | number | boolean">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: T | null
  value: T
  label?: string
  showLabel?: boolean
  disabled?: boolean
  required?: boolean
  name?: string
}>(), {
  modelValue: null,
  label: 'Label',
  showLabel: true,
  disabled: false,
  required: false,
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: T]
  change: [value: T, event: Event]
}>()

const checked = computed(() => Object.is(props.modelValue, props.value))

function update(event: Event) {
  if (!(event.target as HTMLInputElement).checked) return
  emit('update:modelValue', props.value)
  emit('change', props.value, event)
}
</script>

<template>
  <label class="tz-radio" :class="{ 'is-checked': checked, 'is-disabled': disabled }">
    <input class="tz-radio__native" type="radio" :checked="checked" :disabled="disabled" :required="required" :name="name" :value="String(value)" @change="update">
    <span class="tz-radio__control" aria-hidden="true"><i v-if="checked" /></span>
    <span v-if="showLabel" class="tz-radio__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<style scoped>
.tz-radio{position:relative;display:inline-flex;max-width:100%;align-items:center;gap:var(--padding-spacing-8);color:var(--text-default);font:400 14px/20px var(--tz-font-family);cursor:pointer}.tz-radio__native{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}.tz-radio__control{display:grid;box-sizing:border-box;flex:0 0 20px;width:20px;height:20px;place-items:center;border:1px solid var(--gray-400);border-radius:var(--radius-full);background:var(--bg-surface);transition:border-color 140ms ease,box-shadow 140ms ease}.tz-radio:hover:not(.is-disabled) .tz-radio__control{border-color:var(--brand-primary)}.tz-radio.is-checked .tz-radio__control{border-color:var(--brand-primary)}.tz-radio__control i{display:block;width:12px;height:12px;border-radius:var(--radius-full);background:var(--brand-primary)}.tz-radio__native:focus-visible+.tz-radio__control{border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--effect-shadow)}.tz-radio__label{min-width:0;overflow:hidden;text-overflow:ellipsis}.tz-radio.is-disabled{color:var(--text-muted);cursor:not-allowed}.tz-radio.is-disabled .tz-radio__control{border-color:var(--gray-400);box-shadow:none}.tz-radio.is-disabled .tz-radio__control i{background:var(--text-muted)}
</style>
