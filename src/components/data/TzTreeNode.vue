<script setup lang="ts">
import { ChevronDown, ChevronRight, File, Folder, GripVertical, MoreVertical } from '@lucide/vue'
import { computed } from 'vue'
import type { TreeKey, TreeNodeItem } from './TzTree.types'

defineOptions({ name: 'TzTreeNode' })

const props = withDefaults(defineProps<{
  item: TreeNodeItem
  itemKey: string
  displayKey: string
  childrenKey: string
  descriptionKey?: string
  level?: number
  checkedItems: TreeKey[]
  expandedItems: TreeKey[]
  selectable?: boolean
  draggable?: boolean
  showActions?: boolean
  showLines?: boolean
  forceExpanded?: boolean
}>(), {
  level: 1,
  selectable: false,
  draggable: false,
  showActions: false,
  showLines: false,
  forceExpanded: false,
})

const emit = defineEmits<{
  'toggle-expanded': [key: TreeKey]
  'toggle-checked': [payload: { keys: TreeKey[]; checked: boolean }]
  'drag-start': [item: TreeNodeItem]
  drop: [item: TreeNodeItem]
  action: [item: TreeNodeItem]
}>()

defineSlots<{
  default(props: { item: TreeNodeItem; level: number; expanded: boolean; checked: boolean; indeterminate: boolean }): unknown
  actions(props: { item: TreeNodeItem; level: number }): unknown
}>()

const nodeKey = computed(() => props.item[props.itemKey] as TreeKey)
const label = computed(() => String(props.item[props.displayKey] ?? ''))
const description = computed(() => props.descriptionKey ? String(props.item[props.descriptionKey] ?? '') : '')
const children = computed<TreeNodeItem[]>(() => {
  const value = props.item[props.childrenKey]
  return Array.isArray(value) ? value as TreeNodeItem[] : []
})
const hasChildren = computed(() => children.value.length > 0)
const isExpanded = computed(() => props.forceExpanded || props.expandedItems.includes(nodeKey.value))
const disabled = computed(() => props.item.disabled === true)

function collectKeys(item: TreeNodeItem): TreeKey[] {
  const values = [item[props.itemKey] as TreeKey]
  const nested = item[props.childrenKey]
  if (Array.isArray(nested)) nested.forEach(child => values.push(...collectKeys(child as TreeNodeItem)))
  return values
}

const branchKeys = computed(() => collectKeys(props.item))
const selectedCount = computed(() => branchKeys.value.filter(key => props.checkedItems.includes(key)).length)
const checked = computed(() => selectedCount.value === branchKeys.value.length)
const indeterminate = computed(() => selectedCount.value > 0 && !checked.value)

function toggleExpanded() {
  if (hasChildren.value && !disabled.value) emit('toggle-expanded', nodeKey.value)
}

function toggleChecked() {
  if (props.selectable && !disabled.value) {
    emit('toggle-checked', { keys: branchKeys.value, checked: !checked.value })
  } else {
    toggleExpanded()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || (event.key === ' ' && props.selectable)) {
    event.preventDefault()
    props.selectable ? toggleChecked() : toggleExpanded()
  } else if (event.key === 'ArrowRight' && hasChildren.value && !isExpanded.value) {
    event.preventDefault()
    toggleExpanded()
  } else if (event.key === 'ArrowLeft' && isExpanded.value) {
    event.preventDefault()
    toggleExpanded()
  }
}
</script>

<template>
  <div class="tz-tree-node">
    <div
      class="tz-tree-node__row"
      :class="{ 'is-disabled': disabled, 'is-draggable': draggable, 'has-parent': level > 1, 'has-lines': showLines }"
      :style="{ '--tree-indent': `${(level - 1) * 16}px` }"
      role="treeitem"
      :aria-level="level"
      :aria-expanded="hasChildren ? isExpanded : undefined"
      :aria-checked="selectable ? (indeterminate ? 'mixed' : checked) : undefined"
      :aria-disabled="disabled || undefined"
      :draggable="draggable && !disabled"
      tabindex="0"
      @keydown="onKeydown"
      @dragstart.stop="emit('drag-start', item)"
      @dragover.prevent
      @drop.stop.prevent="emit('drop', item)"
    >
      <GripVertical v-if="draggable" class="tz-tree-node__grip" :size="16" aria-hidden="true" />
      <button
        type="button"
        class="tz-tree-node__expand"
        :class="{ invisible: !hasChildren }"
        :disabled="disabled"
        :aria-label="isExpanded ? 'Свернуть ветку' : 'Развернуть ветку'"
        tabindex="-1"
        @click.stop="toggleExpanded"
      >
        <ChevronDown v-if="isExpanded" :size="18" />
        <ChevronRight v-else :size="18" />
      </button>

      <button type="button" class="tz-tree-node__content" :disabled="disabled" tabindex="-1" @click="toggleChecked">
        <span v-if="selectable" class="tz-tree-node__checkbox" :class="{ checked, indeterminate }" aria-hidden="true"><i /></span>
        <component :is="item.icon ?? (hasChildren ? Folder : File)" class="tz-tree-node__icon" :size="18" :stroke-width="1.5" aria-hidden="true" />
        <span class="tz-tree-node__label">
          <slot :item="item" :level="level" :expanded="isExpanded" :checked="checked" :indeterminate="indeterminate">
            <span class="tz-tree-node__title">{{ label }}</span>
            <span v-if="description" class="tz-tree-node__description">[{{ description }}]</span>
          </slot>
        </span>
      </button>
      <button v-if="showActions" type="button" class="tz-tree-node__action" :aria-label="`Действия: ${label}`" @click.stop="emit('action', item)">
        <slot name="actions" :item="item" :level="level"><MoreVertical :size="20" aria-hidden="true" /></slot>
      </button>
    </div>

    <div v-if="hasChildren && isExpanded" class="tz-tree-node__children" :class="{ 'has-lines': showLines }" :style="{ '--tree-parent-indent': `${(level - 1) * 16}px` }" role="group">
      <TzTreeNode
        v-for="child in children"
        :key="String(child[itemKey])"
        :item="child"
        :item-key="itemKey"
        :display-key="displayKey"
        :children-key="childrenKey"
        :description-key="descriptionKey"
        :level="level + 1"
        :checked-items="checkedItems"
        :expanded-items="expandedItems"
        :selectable="selectable"
        :draggable="draggable"
        :show-actions="showActions"
        :show-lines="showLines"
        :force-expanded="forceExpanded"
        @toggle-expanded="emit('toggle-expanded', $event)"
        @toggle-checked="emit('toggle-checked', $event)"
        @drag-start="emit('drag-start', $event)"
        @drop="emit('drop', $event)"
        @action="emit('action', $event)"
      >
        <template #default="slotProps"><slot v-bind="slotProps" /></template>
        <template #actions="slotProps"><slot name="actions" v-bind="slotProps"><MoreVertical :size="20" /></slot></template>
      </TzTreeNode>
    </div>
  </div>
</template>

<style scoped>
.tz-tree-node{min-width:0}.tz-tree-node__row{position:relative;display:flex;box-sizing:border-box;width:calc(100% - var(--tree-indent));min-height:40px;margin-inline-start:var(--tree-indent);padding:var(--padding-spacing-8) var(--padding-spacing-12);align-items:center;gap:var(--padding-spacing-8);color:var(--text-default);border:1px solid var(--border-default);border-radius:var(--radius-xs);outline:none;background:var(--bg-surface);transition:border-color 140ms ease,background-color 140ms ease,box-shadow 140ms ease}.tz-tree-node__row:hover:not(.is-disabled){border-color:color-mix(in srgb,var(--brand-primary) 32%,var(--border-default));background:var(--brand-bg-hover)}.tz-tree-node__row:focus-visible{border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--effect-shadow)}.tz-tree-node__row.is-disabled{color:var(--text-disabled);background:var(--bg-disabled);cursor:not-allowed}.tz-tree-node__row.is-draggable:not(.is-disabled){cursor:grab}.tz-tree-node__row.is-draggable:not(.is-disabled):active{cursor:grabbing}.tz-tree-node__row.has-parent.has-lines::before{position:absolute;top:50%;left:-17px;width:17px;border-top:1px solid var(--border-default);content:''}.tz-tree-node__grip{flex:0 0 auto;color:var(--icon-muted)}
.tz-tree-node__expand{display:grid;flex:0 0 16px;width:16px;height:16px;padding:0;place-items:center;color:var(--icon-default);border:0;border-radius:var(--radius-xs);background:transparent;cursor:pointer}.tz-tree-node__expand svg{width:16px;height:16px}.tz-tree-node__expand:hover:not(:disabled){color:var(--brand-primary);background:var(--brand-bg-active)}.tz-tree-node__expand.invisible{visibility:hidden}.tz-tree-node__expand:disabled{color:var(--text-disabled);cursor:not-allowed}
.tz-tree-node__content{display:flex;min-width:0;min-height:20px;flex:1;align-items:center;gap:var(--padding-spacing-8);padding:0;color:var(--text-default);border:0;background:transparent;font:var(--tz-text-body-medium);text-align:left;cursor:pointer}.tz-tree-node__content:disabled{color:var(--text-disabled);cursor:not-allowed}.tz-tree-node__icon{flex:0 0 auto;width:16px;height:16px;color:var(--brand-primary)}.is-disabled .tz-tree-node__icon{color:var(--text-disabled)}.tz-tree-node__label{display:flex;min-width:0;align-items:center;gap:var(--padding-spacing-8);overflow:hidden;white-space:nowrap}.tz-tree-node__title,.tz-tree-node__description{overflow:hidden;text-overflow:ellipsis}.tz-tree-node__title{flex:0 1 auto;color:var(--text-default)}.tz-tree-node__description{flex:1 1 auto;color:var(--text-placeholder)}.is-disabled .tz-tree-node__title,.is-disabled .tz-tree-node__description{color:var(--text-disabled)}
.tz-tree-node__action{display:grid;flex:0 0 24px;width:24px;height:24px;padding:0;place-items:center;color:var(--icon-default);border:0;border-radius:var(--radius-xs);background:transparent;cursor:pointer}.tz-tree-node__action:hover{color:var(--brand-primary);background:var(--brand-bg-active)}.tz-tree-node__action:focus-visible{outline:2px solid var(--brand-primary);outline-offset:1px}
.tz-tree-node__checkbox{display:grid;box-sizing:border-box;flex:0 0 18px;width:18px;height:18px;place-items:center;border:1px solid var(--border-default);border-radius:var(--radius-xs);background:var(--bg-surface)}.tz-tree-node__checkbox.checked,.tz-tree-node__checkbox.indeterminate{border-color:var(--brand-primary);background:var(--brand-primary)}.tz-tree-node__checkbox.checked i{width:8px;height:4px;border-bottom:1.5px solid var(--text-button-fill);border-left:1.5px solid var(--text-button-fill);transform:translateY(-1px) rotate(-45deg)}.tz-tree-node__checkbox.indeterminate i{width:9px;height:1.5px;background:var(--text-button-fill)}
.tz-tree-node__children{position:relative;display:grid;min-width:0;padding-top:var(--padding-spacing-8);gap:var(--padding-spacing-8)}.tz-tree-node__children.has-lines>.tz-tree-node{position:relative}.tz-tree-node__children.has-lines>.tz-tree-node::before{position:absolute;z-index:0;top:-8px;bottom:0;left:var(--tree-parent-indent);border-left:1px solid var(--border-default);content:'';pointer-events:none}.tz-tree-node__children.has-lines>.tz-tree-node:last-child::before{bottom:auto;height:28px}
@media(max-width:620px){.tz-tree-node__description{display:none}}@media(prefers-reduced-motion:reduce){.tz-tree-node__row{transition:none}}
</style>
