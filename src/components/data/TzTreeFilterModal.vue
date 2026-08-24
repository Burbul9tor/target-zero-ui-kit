<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { X } from '@lucide/vue'
import TzSearch from '../forms/TzSearch.vue'
import TzTreeFilterNode, { type TreeFilterOption } from './TzTreeFilterNode.vue'

const props = withDefaults(defineProps<{
  title?: string
  options: TreeFilterOption[]
  modelValue?: string[]
  loading?: boolean
}>(), { title: 'Выберите объект', modelValue: () => [], loading: false })

const emit = defineEmits<{
  close: []
  apply: [values: string[]]
}>()

const query = ref('')
const selected = ref<string[]>([...props.modelValue])
const expanded = ref<string[]>([])
let previousBodyOverflow = ''

watch(() => props.modelValue, value => { selected.value = [...value] })

const filteredOptions = computed(() => {
  const search = query.value.trim().toLocaleLowerCase()
  if (!search) return props.options
  const filterBranch = (items: TreeFilterOption[]): TreeFilterOption[] => items.flatMap(item => {
    const children = filterBranch(item.children ?? [])
    return (item.name ?? item.value).toLocaleLowerCase().includes(search) || children.length
      ? [{ ...item, children }]
      : []
  })
  return filterBranch(props.options)
})
const dirty = computed(() => {
  const initial = [...props.modelValue].sort().join('|')
  return [...selected.value].sort().join('|') !== initial
})

function toggleExpanded(value: string) {
  expanded.value = expanded.value.includes(value)
    ? expanded.value.filter(item => item !== value)
    : [...expanded.value, value]
}
function toggleSelected(payload: { values: string[]; checked: boolean }) {
  const next = new Set(selected.value)
  payload.values.forEach(value => payload.checked ? next.add(value) : next.delete(value))
  selected.value = [...next]
}
function reset() { selected.value = [] }
function apply() { emit('apply', [...selected.value]) }
function onKeydown(event: KeyboardEvent) { if (event.key === 'Escape') emit('close') }

onMounted(() => {
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.body.style.overflow = previousBodyOverflow
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div class="tree-filter-modal" role="presentation" @mousedown.self="emit('close')">
      <section class="tree-filter-modal__dialog" role="dialog" aria-modal="true" :aria-label="title">
        <header>
          <h2>{{ title }}</h2>
          <button type="button" aria-label="Закрыть окно" @click="emit('close')"><X :size="20" /></button>
        </header>
        <div class="tree-filter-modal__search">
          <TzSearch v-model="query" placeholder="Поиск по объектам" label="Поиск объектов" />
        </div>
        <div class="tree-filter-modal__body">
          <span v-if="loading" class="tree-filter-modal__status">Загрузка объектов…</span>
          <span v-else-if="!filteredOptions.length" class="tree-filter-modal__status">Объекты не найдены</span>
          <TzTreeFilterNode
            v-for="option in filteredOptions"
            v-else
            :key="String(option.id)"
            :node="option"
            :selected="selected"
            :expanded="expanded"
            :force-expanded="Boolean(query)"
            @toggle-expanded="toggleExpanded"
            @toggle-selected="toggleSelected"
          />
        </div>
        <footer>
          <button type="button" class="tree-filter-modal__reset" :disabled="!selected.length" @click="reset">Сбросить</button>
          <span v-if="selected.length">Выбрано: {{ selected.length }}</span>
          <button type="button" class="tree-filter-modal__apply" :disabled="!dirty" @click="apply">Применить</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.tree-filter-modal{position:fixed;z-index:1000;inset:0;display:grid;padding:var(--padding-spacing-16);place-items:center;background:var(--bg-overlay)}.tree-filter-modal__dialog{display:grid;width:min(880px,100%);height:min(760px,calc(100vh - 32px));grid-template-rows:auto auto minmax(0,1fr) auto;overflow:hidden;color:var(--text-default);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:0 20px 48px var(--bg-shadow)}.tree-filter-modal__dialog>header{display:flex;min-height:64px;padding:0 var(--padding-spacing-24);align-items:center;justify-content:space-between;gap:var(--padding-spacing-16);color:var(--text-button-fill);background:var(--brand-primary)}.tree-filter-modal__dialog h2{margin:0;font:600 20px/28px var(--tz-font-family)}.tree-filter-modal__dialog>header button{display:grid;width:32px;height:32px;padding:0;place-items:center;color:inherit;border:0;border-radius:var(--radius-sm);background:transparent;cursor:pointer}.tree-filter-modal__dialog>header button:hover{background:color-mix(in srgb,var(--bg-surface) 16%,transparent)}.tree-filter-modal__search{padding:var(--padding-spacing-20) var(--padding-spacing-20) var(--padding-spacing-12)}.tree-filter-modal__body{min-height:0;padding:0 var(--padding-spacing-12) var(--padding-spacing-16);overflow:auto}.tree-filter-modal__status{display:grid;min-height:180px;place-items:center;color:var(--text-muted);font:400 14px/20px var(--tz-font-family)}.tree-filter-modal__dialog>footer{display:flex;min-height:68px;padding:var(--padding-spacing-12) var(--padding-spacing-20);align-items:center;gap:var(--padding-spacing-12);border-top:1px solid var(--border-default);background:var(--bg-row-hover)}.tree-filter-modal__dialog>footer span{margin-left:auto;color:var(--text-muted);font:400 12px/16px var(--tz-font-family)}.tree-filter-modal__dialog>footer button{height:40px;padding:0 var(--padding-spacing-16);border-radius:var(--radius-sm);font:500 14px/20px var(--tz-font-family);cursor:pointer}.tree-filter-modal__reset{color:var(--text-default);border:1px solid var(--border-default);background:var(--bg-surface)}.tree-filter-modal__apply{margin-left:0;color:var(--text-button-fill);border:1px solid var(--brand-primary);background:var(--brand-primary)}.tree-filter-modal__dialog>footer button:disabled{color:var(--text-disabled);border-color:var(--border-default);background:var(--bg-disabled);cursor:not-allowed}@media(max-width:620px){.tree-filter-modal{padding:0}.tree-filter-modal__dialog{width:100%;height:100vh;border:0;border-radius:0}.tree-filter-modal__dialog>header{padding:0 var(--padding-spacing-16)}.tree-filter-modal__search{padding:var(--padding-spacing-16) var(--padding-spacing-16) var(--padding-spacing-8)}.tree-filter-modal__dialog>footer{padding:var(--padding-spacing-12) var(--padding-spacing-16)}.tree-filter-modal__dialog>footer span{display:none}}
</style>
