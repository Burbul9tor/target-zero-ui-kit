<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import checkIcon from '../../assets/icons/path/check--62-23117.svg?no-inline'
import minusIcon from '../../assets/icons/path/minus--240-3890.svg?no-inline'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  indeterminate?: boolean
  label?: string
  showLabel?: boolean
  disabled?: boolean
  required?: boolean
  name?: string
  value?: string
}>(), {
  modelValue: false,
  indeterminate: false,
  label: 'Label',
  showLabel: true,
  disabled: false,
  required: false,
  name: undefined,
  value: 'on',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean, event: Event]
}>()

const input = ref<HTMLInputElement | null>(null)

function syncIndeterminate() {
  if (input.value) input.value.indeterminate = props.indeterminate
}

watch(() => props.indeterminate, syncIndeterminate)
onMounted(syncIndeterminate)

function update(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  emit('update:modelValue', checked)
  emit('change', checked, event)
}
</script>

<template>
  <label class="tz-checkbox" :class="{ 'is-checked': modelValue, 'is-indeterminate': indeterminate, 'is-disabled': disabled }">
    <input ref="input" class="tz-checkbox__native" type="checkbox" :checked="modelValue" :disabled="disabled" :required="required" :name="name" :value="value" :aria-checked="indeterminate ? 'mixed' : modelValue" @change="update">
    <span class="tz-checkbox__control" aria-hidden="true">
      <i v-if="modelValue || indeterminate" :style="{ '--tz-checkbox-icon': `url('${indeterminate ? minusIcon : checkIcon}')` }" />
    </span>
    <span v-if="showLabel" class="tz-checkbox__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<style scoped>
.tz-checkbox{position:relative;display:inline-flex;max-width:100%;align-items:center;gap:var(--padding-spacing-8);color:var(--text-default);font:400 14px/20px var(--tz-font-family);cursor:pointer}.tz-checkbox__native{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}.tz-checkbox__control{display:grid;box-sizing:border-box;flex:0 0 20px;width:20px;height:20px;place-items:center;border:1px solid var(--gray-400);border-radius:var(--radius-xs);background:var(--bg-surface);transition:border-color 140ms ease,background-color 140ms ease,box-shadow 140ms ease}.tz-checkbox:hover:not(.is-disabled) .tz-checkbox__control{border-color:var(--brand-primary)}.tz-checkbox.is-checked .tz-checkbox__control,.tz-checkbox.is-indeterminate .tz-checkbox__control{color:var(--text-button-fill);border-color:var(--brand-primary);background:var(--brand-primary)}.tz-checkbox__control i{display:block;width:16px;height:16px;background:currentColor;mask:var(--tz-checkbox-icon) center/contain no-repeat;-webkit-mask:var(--tz-checkbox-icon) center/contain no-repeat}.tz-checkbox__native:focus-visible+.tz-checkbox__control{border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--effect-shadow)}.tz-checkbox__label{min-width:0;overflow:hidden;text-overflow:ellipsis}.tz-checkbox.is-disabled{color:var(--text-disabled);cursor:not-allowed}.tz-checkbox.is-disabled .tz-checkbox__control{color:var(--text-button-fill);border-color:var(--bg-track-off);background:var(--bg-track-off);box-shadow:none}.tz-checkbox.is-disabled:not(.is-checked):not(.is-indeterminate) .tz-checkbox__control{background:var(--bg-disabled)}
</style>
