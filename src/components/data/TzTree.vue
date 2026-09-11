<script setup lang="ts">
import { Search } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Component } from 'vue'
import TzInput from '../forms/TzInput.vue'
import TzTreeNode from './TzTreeNode.vue'
import type { TreeDropPayload, TreeDropScope, TreeKey, TreeNodeItem } from './TzTree.types'

export type { TreeDropPayload, TreeDropScope, TreeKey, TreeNodeBase, TreeNodeItem } from './TzTree.types'

const props = withDefaults(defineProps<{
  items?: TreeNodeItem[]
  getItems?: (params?: Record<string, string>) => Promise<TreeNodeItem[]>
  itemKey?: string
  displayKey?: string
  childrenKey?: string
  descriptionKey?: string
  searchable?: boolean
  isServer?: boolean
  selectable?: boolean
  checkedItems?: TreeKey[]
  expandedItems?: TreeKey[]
  searchPlaceholder?: string
  draggable?: boolean
  showActions?: boolean
  showLines?: boolean
  dropScope?: TreeDropScope
  invalidScopeIcon?: Component
  multipleSearch?: boolean
  onSearch?: (substring: string | string[]) => Promise<TreeNodeItem[]>
  refreshData?: boolean
  loading?: boolean
  emptyText?: string
  ariaLabel?: string
}>(), {
  items: () => [],
  getItems: undefined,
  itemKey: 'id',
  displayKey: 'title',
  childrenKey: 'children',
  descriptionKey: 'description',
  searchable: false,
  isServer: false,
  selectable: false,
  checkedItems: () => [],
  expandedItems: () => [],
  searchPlaceholder: '',
  draggable: false,
  showActions: false,
  showLines: false,
  dropScope: 'tree',
  invalidScopeIcon: undefined,
  multipleSearch: false,
  onSearch: undefined,
  refreshData: false,
  loading: false,
  emptyText: 'Нет данных',
  ariaLabel: 'Дерево',
})

const emit = defineEmits<{
  'update:checkedItems': [keys: TreeKey[]]
  'update:expandedItems': [keys: TreeKey[]]
  'update:items': [items: TreeNodeItem[]]
  'handle:drop': [payload: TreeDropPayload]
  action: [item: TreeNodeItem]
  error: [error: unknown]
}>()

defineSlots<{
  default(props: { item: TreeNodeItem; level: number; expanded: boolean; checked: boolean; indeterminate: boolean }): unknown
  actions(props: { item: TreeNodeItem; level: number }): unknown
  'no-results'(): unknown
}>()

const query = ref('')
const internalItems = ref<TreeNodeItem[]>([])
const remoteResults = ref<TreeNodeItem[] | null>(null)
const internalLoading = ref(false)
const draggedItem = ref<TreeNodeItem | null>(null)
const invalidDrop = ref(false)
let searchTimer: ReturnType<typeof setTimeout> | undefined
let searchRequest = 0

function cloneNodes(nodes: TreeNodeItem[]): TreeNodeItem[] {
  return nodes.map(node => {
    const children = node[props.childrenKey]
    return { ...node, ...(Array.isArray(children) ? { [props.childrenKey]: cloneNodes(children as TreeNodeItem[]) } : {}) }
  })
}

function nodeKey(node: TreeNodeItem) { return node[props.itemKey] as TreeKey }
function nodeLabel(node: TreeNodeItem) { return String(node[props.displayKey] ?? '') }
function nodeChildren(node: TreeNodeItem) {
  const value = node[props.childrenKey]
  return Array.isArray(value) ? value as TreeNodeItem[] : []
}

function syncItems() {
  internalItems.value = cloneNodes(props.items)
  remoteResults.value = null
}

function localFilter(nodes: TreeNodeItem[], terms: string[]): TreeNodeItem[] {
  return nodes.flatMap(node => {
    const children = localFilter(nodeChildren(node), terms)
    const label = nodeLabel(node).toLocaleLowerCase()
    const matches = terms.every(term => label.includes(term))
    if (!matches && !children.length) return []
    return [{ ...node, [props.childrenKey]: children }]
  })
}

const searchTerms = computed(() => {
  const normalized = query.value.trim().toLocaleLowerCase()
  if (!normalized) return []
  return props.multipleSearch ? normalized.split(/[,;\n]+/).map(value => value.trim()).filter(Boolean) : [normalized]
})

const visibleItems = computed(() => {
  if (remoteResults.value !== null) return remoteResults.value
  return searchTerms.value.length ? localFilter(internalItems.value, searchTerms.value) : internalItems.value
})
const isBusy = computed(() => props.loading || internalLoading.value)

async function loadItems() {
  if (!props.getItems) return
  internalLoading.value = true
  try {
    internalItems.value = cloneNodes(await props.getItems())
  } catch (error) {
    emit('error', error)
  } finally {
    internalLoading.value = false
  }
}

async function runRemoteSearch(value: string) {
  if (!props.onSearch) return
  const request = ++searchRequest
  if (!value.trim()) { remoteResults.value = null; return }
  internalLoading.value = true
  try {
    const input = props.multipleSearch ? searchTerms.value : value
    const result = await props.onSearch(input)
    if (request === searchRequest) remoteResults.value = cloneNodes(result)
  } catch (error) {
    if (request === searchRequest) emit('error', error)
  } finally {
    if (request === searchRequest) internalLoading.value = false
  }
}

watch(() => props.items, syncItems, { deep: true, immediate: true })
watch(() => props.childrenKey, syncItems)
watch(query, value => {
  remoteResults.value = null
  if (!props.onSearch) return
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => runRemoteSearch(value), 300)
})
watch(() => props.refreshData, (value, previous) => { if (value !== previous) loadItems() })
onMounted(() => { if (props.isServer || (!props.items.length && props.getItems)) loadItems() })
onBeforeUnmount(() => { if (searchTimer) clearTimeout(searchTimer) })

function toggleExpanded(key: TreeKey) {
  const next = props.expandedItems.includes(key)
    ? props.expandedItems.filter(value => value !== key)
    : [...props.expandedItems, key]
  emit('update:expandedItems', next)
}

function toggleChecked(payload: { keys: TreeKey[]; checked: boolean }) {
  const next = new Set(props.checkedItems)
  payload.keys.forEach(key => payload.checked ? next.add(key) : next.delete(key))
  emit('update:checkedItems', [...next])
}

interface Location { node: TreeNodeItem; list: TreeNodeItem[]; index: number; parent: TreeNodeItem | null }
function findLocation(nodes: TreeNodeItem[], key: TreeKey, parent: TreeNodeItem | null = null): Location | null {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index]
    if (nodeKey(node) === key) return { node, list: nodes, index, parent }
    const nested = findLocation(nodeChildren(node), key, node)
    if (nested) return nested
  }
  return null
}

function containsNode(node: TreeNodeItem, key: TreeKey): boolean {
  return nodeKey(node) === key || nodeChildren(node).some(child => containsNode(child, key))
}

function rejectDrop() {
  invalidDrop.value = true
  window.setTimeout(() => { invalidDrop.value = false }, 1400)
}

function handleDrop(target: TreeNodeItem) {
  if (!draggedItem.value || nodeKey(draggedItem.value) === nodeKey(target)) return
  if (containsNode(draggedItem.value, nodeKey(target))) { rejectDrop(); return }

  const next = cloneNodes(internalItems.value)
  const source = findLocation(next, nodeKey(draggedItem.value))
  const initialTarget = findLocation(next, nodeKey(target))
  if (!source || !initialTarget) return
  if (props.dropScope === 'siblings' && nodeKey(source.parent ?? {}) !== nodeKey(initialTarget.parent ?? {})) {
    rejectDrop()
    return
  }

  const [moved] = source.list.splice(source.index, 1)
  const destination = findLocation(next, nodeKey(target))
  if (!destination) return
  let parent: TreeNodeItem | null
  let items: TreeNodeItem[]

  if (props.dropScope === 'tree') {
    const children = nodeChildren(destination.node)
    if (!Array.isArray(destination.node[props.childrenKey])) destination.node[props.childrenKey] = children
    children.push(moved)
    parent = destination.node
    items = children
    if (!props.expandedItems.includes(nodeKey(destination.node))) emit('update:expandedItems', [...props.expandedItems, nodeKey(destination.node)])
  } else {
    destination.list.splice(destination.index, 0, moved)
    parent = destination.parent
    items = destination.list
  }

  internalItems.value = next
  emit('update:items', cloneNodes(next))
  emit('handle:drop', { parent, items: cloneNodes(items) })
  draggedItem.value = null
}
</script>

<template>
  <div class="tz-tree" :aria-busy="isBusy || undefined">
    <TzInput
      v-if="searchable"
      v-model="query"
      class="tz-tree__search"
      :placeholder="searchPlaceholder || (multipleSearch ? 'Поиск по нескольким значениям' : 'Поиск')"
      :icon-left="Search"
      clearable
      size="medium"
      aria-label="Поиск по дереву"
    />

    <div v-if="isBusy" class="tz-tree__state" role="status"><i /> Загрузка данных…</div>
    <div v-else-if="!visibleItems.length" class="tz-tree__state">
      <slot name="no-results">{{ query ? 'Ничего не найдено' : emptyText }}</slot>
    </div>
    <div v-else class="tz-tree__content" role="tree" :aria-label="ariaLabel" :aria-multiselectable="selectable || undefined">
      <TzTreeNode
        v-for="item in visibleItems"
        :key="String(item[itemKey])"
        :item="item"
        :item-key="itemKey"
        :display-key="displayKey"
        :children-key="childrenKey"
        :description-key="descriptionKey"
        :checked-items="checkedItems"
        :expanded-items="expandedItems"
        :selectable="selectable"
        :draggable="draggable"
        :show-actions="showActions"
        :show-lines="showLines"
        :force-expanded="Boolean(query)"
        @toggle-expanded="toggleExpanded"
        @toggle-checked="toggleChecked"
        @drag-start="draggedItem = $event"
        @drop="handleDrop"
        @action="emit('action', $event)"
      >
        <template v-if="$slots.default" #default="slotProps"><slot v-bind="slotProps" /></template>
        <template v-if="$slots.actions" #actions="slotProps"><slot name="actions" v-bind="slotProps" /></template>
      </TzTreeNode>
    </div>

    <div v-if="invalidDrop" class="tz-tree__drop-warning" role="status">
      <component :is="invalidScopeIcon" v-if="invalidScopeIcon" :size="16" />
      Нельзя переместить узел в эту область
    </div>
  </div>
</template>

<style scoped>
.tz-tree{position:relative;display:grid;min-width:0;gap:var(--padding-spacing-12);color:var(--text-default);font-family:var(--tz-font-family)}.tz-tree__content{display:grid;min-width:0;padding:0;gap:var(--padding-spacing-8);background:transparent}.tz-tree__state{display:flex;min-height:120px;padding:var(--padding-spacing-16);align-items:center;justify-content:center;gap:var(--padding-spacing-8);color:var(--text-muted);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface);font:var(--tz-text-body-medium)}.tz-tree__state i{width:16px;height:16px;border:2px solid var(--border-default);border-top-color:var(--brand-primary);border-radius:50%;animation:tz-tree-spin .7s linear infinite}.tz-tree__drop-warning{position:absolute;z-index:2;right:var(--padding-spacing-8);bottom:var(--padding-spacing-8);display:flex;padding:var(--padding-spacing-8) var(--padding-spacing-12);align-items:center;gap:var(--padding-spacing-6);color:var(--status-error-fg);border-radius:var(--radius-md);background:var(--status-error-bg);box-shadow:0 4px 12px var(--bg-shadow);font:var(--tz-text-body-small)}
@keyframes tz-tree-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.tz-tree__state i{animation:none}}
</style>
