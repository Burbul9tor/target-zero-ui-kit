<script setup lang="ts">
import arrowUpRightIcon from '../../assets/icons/path/arrowupright--1-2801.svg?no-inline'
import closeIcon from '../../assets/icons/path/close--1-2785.svg?no-inline'

export type TzChipVariant = 'default' | 'icon'

const props = withDefaults(defineProps<{
  label?: string
  variant?: TzChipVariant
  showLeftIcon?: boolean
  showRightIcon?: boolean
  removable?: boolean
  disabled?: boolean
}>(), {
  label: 'Chip',
  variant: 'default',
  showLeftIcon: true,
  showRightIcon: true,
  removable: true,
  disabled: false,
})

const emit = defineEmits<{
  remove: []
  click: [event: MouseEvent]
}>()

function remove(event: MouseEvent) {
  event.stopPropagation()
  if (!props.disabled) emit('remove')
}
</script>

<template>
  <span class="tz-chip" :class="{ 'tz-chip--icon': variant === 'icon', 'is-disabled': disabled }" @click="emit('click', $event)">
    <slot v-if="variant === 'icon' && showLeftIcon" name="icon-left">
      <i class="tz-chip__icon" :style="{ '--tz-chip-icon': `url('${arrowUpRightIcon}')` }" aria-hidden="true" />
    </slot>
    <span class="tz-chip__label"><slot>{{ label }}</slot></span>
    <slot v-if="variant === 'icon' && showRightIcon" name="icon-right">
      <button v-if="removable" class="tz-chip__remove" type="button" :disabled="disabled" :aria-label="`Удалить ${label}`" @click="remove">
        <i class="tz-chip__icon" :style="{ '--tz-chip-icon': `url('${closeIcon}')` }" aria-hidden="true" />
      </button>
      <i v-else class="tz-chip__icon" :style="{ '--tz-chip-icon': `url('${closeIcon}')` }" aria-hidden="true" />
    </slot>
  </span>
</template>

<style scoped>
.tz-chip{display:inline-flex;box-sizing:border-box;max-width:100%;min-height:20px;padding:var(--padding-spacing-2) var(--padding-spacing-8);align-items:center;justify-content:center;color:var(--brand-primary);border:1px solid var(--brand-primary-hover);border-radius:var(--radius-sm);background:var(--brand-bg-hover);font:400 12px/14px var(--tz-font-family);vertical-align:middle}.tz-chip--icon{gap:var(--padding-spacing-4)}.tz-chip__label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tz-chip__icon{display:block;flex:0 0 16px;width:16px;height:16px;background:currentColor;mask:var(--tz-chip-icon) center/contain no-repeat;-webkit-mask:var(--tz-chip-icon) center/contain no-repeat}.tz-chip__remove{display:grid;flex:0 0 16px;width:16px;height:16px;padding:0;place-items:center;color:inherit;border:0;border-radius:var(--radius-xs);background:transparent;cursor:pointer}.tz-chip__remove:hover{color:var(--brand-primary-hover);background:var(--brand-bg-active)}.tz-chip__remove:focus-visible{outline:2px solid var(--brand-primary);outline-offset:1px}.tz-chip.is-disabled{color:var(--text-disabled);border-color:var(--border-default);background:var(--bg-disabled);cursor:not-allowed}.tz-chip__remove:disabled{cursor:not-allowed}
</style>
