<script setup lang="ts">
import { Building2, ChevronDown, ChevronRight } from '@lucide/vue'
import { computed } from 'vue'

export interface TreeFilterOption {
  id: string | number
  value: string
  name?: string
  children?: TreeFilterOption[]
}

const props = withDefaults(defineProps<{
  node: TreeFilterOption
  level?: number
  selected: string[]
  expanded: string[]
  forceExpanded?: boolean
}>(), { level: 0, forceExpanded: false })

const emit = defineEmits<{
  'toggle-expanded': [value: string]
  'toggle-selected': [payload: { values: string[]; checked: boolean }]
}>()

const children = computed(() => props.node.children ?? [])
const hasChildren = computed(() => children.value.length > 0)
const isExpanded = computed(() => props.forceExpanded || props.expanded.includes(props.node.value))
const branchValues = computed(() => {
  const values: string[] = []
  const visit = (item: TreeFilterOption) => {
    values.push(item.value)
    item.children?.forEach(visit)
  }
  visit(props.node)
  return values
})
const selectedCount = computed(() => branchValues.value.filter(value => props.selected.includes(value)).length)
const checked = computed(() => selectedCount.value === branchValues.value.length)
const indeterminate = computed(() => selectedCount.value > 0 && !checked.value)

function toggleSelected() {
  emit('toggle-selected', { values: branchValues.value, checked: !checked.value })
}
</script>

<template>
  <div class="tree-node">
    <div class="tree-node__row" :style="{ paddingInlineStart: `${level * 24 + 8}px` }">
      <button
        type="button"
        class="tree-node__expand"
        :class="{ invisible: !hasChildren }"
        :aria-label="isExpanded ? 'Свернуть ветку' : 'Развернуть ветку'"
        :aria-expanded="hasChildren ? isExpanded : undefined"
        @click="hasChildren && emit('toggle-expanded', node.value)"
      >
        <ChevronDown v-if="isExpanded" :size="18" />
        <ChevronRight v-else :size="18" />
      </button>
      <Building2 class="tree-node__icon" :size="20" />
      <button type="button" class="tree-node__select" @click="toggleSelected">
        <span class="tree-node__checkbox" :class="{ checked, indeterminate }" aria-hidden="true"><i /></span>
        <span>{{ node.name ?? node.value }}</span>
      </button>
    </div>
    <div v-if="hasChildren && isExpanded" class="tree-node__children">
      <TzTreeFilterNode
        v-for="child in children"
        :key="String(child.id)"
        :node="child"
        :level="level + 1"
        :selected="selected"
        :expanded="expanded"
        :force-expanded="forceExpanded"
        @toggle-expanded="emit('toggle-expanded', $event)"
        @toggle-selected="emit('toggle-selected', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.tree-node__row{display:flex;min-height:42px;align-items:center;gap:var(--padding-spacing-8);border-radius:var(--radius-sm);transition:background-color 140ms ease}.tree-node__row:hover{background:var(--brand-bg-hover)}.tree-node__expand{display:grid;flex:0 0 24px;width:24px;height:24px;padding:0;place-items:center;color:var(--icon-default);border:0;border-radius:var(--radius-xs);background:transparent;cursor:pointer}.tree-node__expand:hover{color:var(--brand-primary);background:var(--brand-bg-active)}.tree-node__expand.invisible{visibility:hidden}.tree-node__icon{flex:0 0 auto;color:var(--brand-primary)}.tree-node__select{display:flex;min-width:0;flex:1;align-items:center;gap:var(--padding-spacing-8);padding:0 var(--padding-spacing-8) 0 0;color:var(--text-default);border:0;background:transparent;font:400 14px/20px var(--tz-font-family);text-align:left;cursor:pointer}.tree-node__select>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tree-node__checkbox{display:grid;box-sizing:border-box;flex:0 0 20px;width:20px;height:20px;place-items:center;border:1px solid var(--border-default);border-radius:var(--radius-xs);background:var(--bg-surface)}.tree-node__checkbox.checked,.tree-node__checkbox.indeterminate{border-color:var(--brand-primary);background:var(--brand-primary)}.tree-node__checkbox.checked i{width:9px;height:5px;border-bottom:1.5px solid var(--text-button-fill);border-left:1.5px solid var(--text-button-fill);transform:translateY(-1px) rotate(-45deg)}.tree-node__checkbox.indeterminate i{width:10px;height:1.5px;background:var(--text-button-fill)}.tree-node__select:focus-visible,.tree-node__expand:focus-visible{outline:2px solid var(--brand-primary);outline-offset:1px}
</style>
