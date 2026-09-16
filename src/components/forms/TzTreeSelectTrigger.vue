<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import type { Component } from 'vue'

withDefaults(defineProps<{ label: string; value?: string | null; placeholder?: string; icon?: Component; disabled?: boolean }>(), { value: null, placeholder: 'Выберите элемент', icon: undefined, disabled: false })
const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <div class="tz-tree-select">
    <span class="tz-tree-select__label">{{ label }}</span>
    <button type="button" class="tz-tree-select__control" aria-haspopup="dialog" :title="value || undefined" :disabled="disabled" @click="emit('open')">
      <component :is="icon" v-if="icon" :size="16" :stroke-width="1.5" aria-hidden="true" />
      <span :class="{ 'is-placeholder': !value }">{{ value || placeholder }}</span>
      <ChevronRight :size="16" :stroke-width="1.5" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.tz-tree-select{display:flex;width:100%;min-width:0;flex-direction:column;gap:var(--padding-spacing-4)}.tz-tree-select__label{color:var(--text-default);font:var(--tz-text-body-small)}.tz-tree-select__control{display:flex;box-sizing:border-box;width:100%;height:32px;padding:0 var(--padding-spacing-12);align-items:center;gap:var(--padding-spacing-8);color:var(--icon-default);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface);cursor:pointer}.tz-tree-select__control>span{min-width:0;flex:1;overflow:hidden;color:var(--text-default);font:var(--tz-text-body-medium);text-align:left;text-overflow:ellipsis;white-space:nowrap}.tz-tree-select__control>span.is-placeholder{color:var(--text-muted)}.tz-tree-select__control:hover{box-shadow:0 0 4px 2px var(--effect-shadow)}.tz-tree-select__control:focus-visible{border-color:var(--brand-primary);outline:0;box-shadow:0 0 0 2px var(--effect-shadow)}.tz-tree-select__control:disabled{color:var(--text-disabled);background:var(--bg-disabled);cursor:not-allowed}
</style>
