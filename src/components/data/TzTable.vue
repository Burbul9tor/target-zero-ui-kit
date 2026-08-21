<script setup lang="ts">
import {
  ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft,
  ChevronsRight, Filter, Inbox, LoaderCircle, Settings, Trash2, X,
} from '@lucide/vue'
import { computed, nextTick, ref, useSlots, watch, type StyleValue } from 'vue'
import TzSearch from '../forms/TzSearch.vue'
import TzSelect, { type SelectValue } from '../forms/TzSelect.vue'

export type TableRow = Record<string, unknown>
export type TableSortOrder = 'ASC' | 'DESC' | null
export type TableColumnType = 'default' | 'index' | 'selection' | 'settings'
export type TableFixedType = 'left' | 'right'
export type TableFilterType = 'CHECKBOX' | 'RANGE_MAX' | 'RANGE' | 'RADIO' | 'SELECT_MULTIPLE' | 'DATE' | 'TIME_RANGE' | 'CHECKBOX_SELECT'

export interface TableFilterOption { id: string | number; name?: string; value: string; [key: string]: unknown }
export interface TableColumnFilter {
  filterKey: string
  type: TableFilterType
  getFilters: (params?: Record<string, unknown>) => Promise<unknown>
  step?: number
  rangeMin?: number
  rangeMax?: number
  page?: number
  pageSize?: number
  totalPages?: number
  title?: string
  searchable?: boolean
  needPagination?: boolean
}
export interface TableFilterFullInfo { key: string; value: unknown; title?: string; type?: TableFilterType }
export interface TableLoadParams {
  page: number
  countPerPage: number
  search: string
  sortKey: string
  sortOrder: TableSortOrder
  sortValue: string[]
  filters: Record<string, unknown>
}
export interface TzTableColumn {
  key: string
  label?: string
  title?: string
  width?: number | string
  minWidth?: number | string
  type?: TableColumnType
  fixed?: TableFixedType
  active?: boolean
  sortable?: boolean
  sortFieldName?: string
  filter?: TableColumnFilter
  filterable?: boolean
  align?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<{
  data: TableRow[]
  columns: TzTableColumn[]
  searchPlaceholder?: string
  countPerPage?: number
  page?: number
  totalCount?: number
  columnsPerView?: number
  searchable?: boolean
  stripped?: boolean
  isServer?: boolean
  resizable?: boolean
  showPagination?: boolean
  showSettings?: boolean
  showHeader?: boolean
  showBarAlways?: boolean
  selectedItems?: TableRow[]
  countPerPageOptions?: number[]
  resetAllCheckedItems?: boolean
  disabledSelection?: boolean
  disabledRowClick?: boolean
  getData?: (params?: TableLoadParams) => Promise<TableRow[]>
  onRowClick?: (...args: unknown[]) => void
  onRowDoubleClick?: (item: TableRow, event?: Event) => void | Promise<void>
  startFiltersValue?: Record<string, unknown>
  startSearchValue?: string
  startSortKey?: string
  startSortOrder?: TableSortOrder
  startSortValue?: string[]
  startFiltersFullInfo?: TableFilterFullInfo[]
  tableBodyStyle?: StyleValue
  rowKey?: string
  activeFilters?: Record<string, number>
  showActions?: boolean
  emptyTitle?: string
  emptyDescription?: string
}>(), {
  searchPlaceholder: '', countPerPage: 20, page: 0, totalCount: 0, columnsPerView: 4,
  searchable: false, stripped: false, isServer: false, resizable: false, showPagination: false,
  showSettings: false, showHeader: true, showBarAlways: false, selectedItems: () => [],
  countPerPageOptions: () => [], resetAllCheckedItems: true, disabledSelection: false,
  disabledRowClick: false, startFiltersValue: () => ({}), startSearchValue: '', startSortKey: '',
  startSortOrder: null, startSortValue: () => [], startFiltersFullInfo: () => [], rowKey: 'id',
  activeFilters: () => ({}), showActions: false, emptyTitle: 'Нет данных',
  emptyDescription: 'Здесь пока нет записей для отображения',
})

const emit = defineEmits<{
  'update:selectedItems': [items: TableRow[]]
  'update:page': [page: number]
  'update:countPerPage': [count: number]
  'update:filter-full-info': [filters: TableFilterFullInfo[]]
  'row-click': [row: TableRow]
  'row-double-click': [row: TableRow, event?: Event]
  sort: [payload: { key: string; order: TableSortOrder }]
  filter: [payload: { key: string }]
  'clear-filter': [key: string]
  settings: []
  'row-action': [row: TableRow]
  search: [value: string]
}>()

const slots = useSlots()
const scroll = ref<HTMLElement | null>(null)
const searchValue = ref(props.startSearchValue)
const sortKey = ref(props.startSortKey)
const sortOrder = ref<TableSortOrder>(props.startSortOrder)
const sortValue = ref([...props.startSortValue])
const filtersValue = ref<Record<string, unknown>>({ ...props.startFiltersValue })
const filtersFullInfo = ref<TableFilterFullInfo[]>([...props.startFiltersFullInfo])
const serverRows = ref<TableRow[] | null>(null)
const loading = ref(false)
const settingsOpen = ref(false)
const openFilterKey = ref('')
const filterOptions = ref<Record<string, TableFilterOption[]>>({})
const filterLoading = ref('')
const columnWidths = ref<Record<string, number>>({})

watch(() => props.startSortKey, value => { sortKey.value = value })
watch(() => props.startSortOrder, value => { sortOrder.value = value })
watch(() => props.startSearchValue, value => { searchValue.value = value })
watch(() => props.startFiltersValue, value => { filtersValue.value = { ...value } }, { deep: true })
watch(() => props.data, () => { if (props.resetAllCheckedItems && props.selectedItems.length) emit('update:selectedItems', []) })
watch([() => props.isServer, () => props.getData], ([server, loader]) => { if (server && loader) exposedLoadData(props.page, props.countPerPage) }, { immediate: true })

const titleOf = (column: TzTableColumn) => column.label ?? column.title ?? column.key
const alignOf = (column: TzTableColumn) => column.align ?? (column.type === 'index' ? 'center' : 'left')
const dataColumns = computed(() => props.columns
  .filter(column => column.active !== false && (!column.type || column.type === 'default' || column.type === 'index'))
  .slice(0, Math.max(1, props.columnsPerView)))
const hasSelection = computed(() => !props.disabledSelection && (props.columns.some(column => column.type === 'selection') || !props.columns.some(column => column.type)))
const tableMinWidth = computed(() => Math.max(760, dataColumns.value.reduce((sum, column) => sum + (typeof column.width === 'number' ? column.width : 180), 0) + (hasSelection.value ? 36 : 0) + (hasControl.value ? 36 : 0)))
const hasControl = computed(() => props.showActions || props.showSettings || props.columns.some(column => column.type === 'settings'))
const hasBar = computed(() => props.showBarAlways || props.searchable || Boolean(slots['bar-left']) || Boolean(slots['bar-right']))
const rawRows = computed(() => serverRows.value ?? props.data)
const locallyProcessedRows = computed(() => {
  if (props.isServer) return rawRows.value
  const query = searchValue.value.trim().toLocaleLowerCase()
  let rows = query ? rawRows.value.filter(row => dataColumns.value.some(column => String(row[column.key] ?? '').toLocaleLowerCase().includes(query))) : [...rawRows.value]
  for (const [key, filterValue] of Object.entries(filtersValue.value)) {
    if (filterValue == null || filterValue === '' || (Array.isArray(filterValue) && !filterValue.length)) continue
    const accepted = Array.isArray(filterValue) ? filterValue.map(String) : [String(filterValue)]
    rows = rows.filter(row => accepted.includes(String(row[key] ?? '')))
  }
  if (sortKey.value && sortOrder.value) {
    const direction = sortOrder.value === 'ASC' ? 1 : -1
    rows = [...rows].sort((a, b) => String(a[sortKey.value] ?? '').localeCompare(String(b[sortKey.value] ?? ''), undefined, { numeric: true }) * direction)
  }
  return rows
})
const externalPageData = computed(() => props.isServer || (props.totalCount > 0 && props.totalCount > rawRows.value.length))
const total = computed(() => externalPageData.value ? (props.totalCount || locallyProcessedRows.value.length) : locallyProcessedRows.value.length)
const pagesCount = computed(() => Math.max(1, Math.ceil(total.value / props.countPerPage)))
const displayRows = computed(() => {
  if (!props.showPagination || externalPageData.value) return locallyProcessedRows.value
  const start = props.page * props.countPerPage
  return locallyProcessedRows.value.slice(start, start + props.countPerPage)
})
const showNoSearch = computed(() => Boolean(searchValue.value) && rawRows.value.length > 0 && displayRows.value.length === 0)
const rowId = (row: TableRow) => row[props.rowKey] as string | number
const selectedIds = computed(() => new Set(props.selectedItems.map(rowId)))
const allSelected = computed(() => displayRows.value.length > 0 && displayRows.value.every(row => selectedIds.value.has(rowId(row))))
const someSelected = computed(() => !allSelected.value && displayRows.value.some(row => selectedIds.value.has(rowId(row))))
const rangeStart = computed(() => total.value ? props.page * props.countPerPage + 1 : 0)
const rangeEnd = computed(() => Math.min((props.page + 1) * props.countPerPage, total.value))
const pageSizes = computed(() => (props.countPerPageOptions.length ? props.countPerPageOptions : [20]).map(value => ({ label: String(value), value: String(value) })))
const activeFilterCounts = computed(() => ({ ...Object.fromEntries(Object.entries(filtersValue.value).map(([key, value]) => [key, Array.isArray(value) ? value.length : value == null || value === '' ? 0 : 1])), ...props.activeFilters }))
const visiblePages = computed<Array<number | 'ellipsis'>>(() => {
  const count = pagesCount.value; const current = props.page + 1
  if (count <= 5) return Array.from({ length: count }, (_, index) => index + 1)
  if (current <= 3) return [1, 2, 3, 'ellipsis', count]
  if (current >= count - 2) return [1, 'ellipsis', count - 2, count - 1, count]
  return [1, 'ellipsis', current, 'ellipsis', count]
})

function toggleAll() { emit('update:selectedItems', allSelected.value ? [] : [...displayRows.value]) }
function toggleRow(row: TableRow) {
  const id = rowId(row)
  emit('update:selectedItems', selectedIds.value.has(id) ? props.selectedItems.filter(item => rowId(item) !== id) : [...props.selectedItems, row])
}
function toggleSort(column: TzTableColumn) {
  if (!column.sortable) return
  const key = column.sortFieldName ?? column.key
  if (sortKey.value !== key) { sortKey.value = key; sortOrder.value = 'ASC' }
  else if (sortOrder.value === 'ASC') sortOrder.value = 'DESC'
  else { sortKey.value = ''; sortOrder.value = null }
  sortValue.value = sortKey.value && sortOrder.value ? [sortKey.value, sortOrder.value] : []
  emit('sort', { key: sortKey.value, order: sortOrder.value })
  if (props.isServer) exposedLoadData(0, props.countPerPage)
}
function changePage(page: number) {
  if (page < 0 || page >= pagesCount.value || page === props.page) return
  emit('update:page', page)
  if (props.isServer) exposedLoadData(page, props.countPerPage)
}
function updateCountPerPage(value: SelectValue) {
  if (typeof value !== 'string') return
  const count = Number(value); emit('update:countPerPage', count); emit('update:page', 0)
  if (props.isServer) exposedLoadData(0, count)
}
function updateSearch(value: string) {
  searchValue.value = value; emit('search', value); emit('update:page', 0)
  if (props.isServer) exposedLoadData(0, props.countPerPage)
}
async function openFilter(column: TzTableColumn) {
  emit('filter', { key: column.key })
  if (!column.filter) return
  openFilterKey.value = openFilterKey.value === column.key ? '' : column.key
  if (!openFilterKey.value || filterOptions.value[column.key]) return
  filterLoading.value = column.key
  try {
    const result = await column.filter.getFilters({ page: column.filter.page ?? 0, pageSize: column.filter.pageSize ?? 20 })
    const options = Array.isArray(result) ? result : (result && typeof result === 'object' && Array.isArray((result as { data?: unknown[] }).data) ? (result as { data: unknown[] }).data : [])
    filterOptions.value[column.key] = options.map((option, index) => typeof option === 'object' && option !== null
      ? ({ id: index, value: String((option as Record<string, unknown>).value ?? (option as Record<string, unknown>).id ?? index), ...(option as Record<string, unknown>) } as TableFilterOption)
      : { id: index, value: String(option), name: String(option) })
  } finally { filterLoading.value = '' }
}
function optionChecked(column: TzTableColumn, option: TableFilterOption) {
  const value = filtersValue.value[column.filter?.filterKey ?? column.key]
  return Array.isArray(value) ? value.includes(option.value) : value === option.value
}
function setOption(column: TzTableColumn, option: TableFilterOption) {
  if (!column.filter) return
  const key = column.filter.filterKey
  const current = filtersValue.value[key]
  const multiple = ['CHECKBOX', 'SELECT_MULTIPLE', 'CHECKBOX_SELECT'].includes(column.filter.type)
  const value = multiple ? (Array.isArray(current) && current.includes(option.value) ? current.filter(item => item !== option.value) : [...(Array.isArray(current) ? current : []), option.value]) : option.value
  filtersValue.value = { ...filtersValue.value, [key]: value }
  filtersFullInfo.value = [...filtersFullInfo.value.filter(item => item.key !== key), { key, value, title: column.filter.title ?? titleOf(column), type: column.filter.type }]
  emit('update:filter-full-info', [...filtersFullInfo.value])
  emit('update:page', 0)
  if (!multiple) openFilterKey.value = ''
  if (props.isServer) exposedLoadData(0, props.countPerPage)
}
function resetFilter(key: string) {
  const next = { ...filtersValue.value }; delete next[key]; filtersValue.value = next
  filtersFullInfo.value = filtersFullInfo.value.filter(item => item.key !== key)
  emit('update:filter-full-info', [...filtersFullInfo.value]); emit('clear-filter', key)
}
async function exposedLoadData(page = props.page, countPerPage = props.countPerPage) {
  if (!props.getData) return
  loading.value = true
  try { serverRows.value = await props.getData({ page, countPerPage, search: searchValue.value, sortKey: sortKey.value, sortOrder: sortOrder.value, sortValue: sortValue.value, filters: filtersValue.value }) }
  finally { loading.value = false }
}
function exposedResetAllFilters() {
  filtersValue.value = {}; filtersFullInfo.value = []; emit('update:filter-full-info', [])
  if (props.isServer) exposedLoadData(0, props.countPerPage)
}
function resetSort() { sortKey.value = ''; sortOrder.value = null; sortValue.value = []; emit('sort', { key: '', order: null }) }
function scrollToTop() { scroll.value?.scrollTo({ top: 0, behavior: 'smooth' }) }
function startResize(event: PointerEvent, column: TzTableColumn) {
  if (!props.resizable) return
  const startX = event.clientX; const startWidth = columnWidths.value[column.key] || (event.currentTarget as HTMLElement).parentElement?.getBoundingClientRect().width || 120
  const move = (moveEvent: PointerEvent) => { columnWidths.value = { ...columnWidths.value, [column.key]: Math.max(80, startWidth + moveEvent.clientX - startX) } }
  const stop = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop) }
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', stop)
}
function clickRow(row: TableRow) { if (!props.disabledRowClick) { props.onRowClick?.(row); emit('row-click', row) } }
async function doubleClickRow(row: TableRow, event: Event) { await props.onRowDoubleClick?.(row, event); emit('row-double-click', row, event) }
async function focusTable() { await nextTick(); scroll.value?.focus() }

defineExpose({ resetFilter, exposedLoadData, exposedResetAllFilters, resetSort, scrollToTop, focusTable })
</script>

<template>
  <div class="tz-table-new" :class="{ 'is-loading': loading }">
    <div v-if="hasBar" class="tz-table-new__bar">
      <div class="tz-table-new__bar-left"><slot name="bar-left" /></div>
      <TzSearch v-if="searchable" class="tz-table-new__search" :model-value="searchValue" :placeholder="searchPlaceholder || 'Поиск'" @update:model-value="updateSearch" />
      <div class="tz-table-new__bar-right"><slot name="bar-right" /></div>
    </div>
    <slot name="before-table" />
    <div ref="scroll" class="tz-table-new__scroll" tabindex="-1">
      <div v-if="loading" class="tz-table-new__loading"><LoaderCircle :size="24" /></div>
      <table class="tz-table-new__table" :class="{ 'is-stripped': stripped }" :style="{ minWidth: `${tableMinWidth}px` }">
        <colgroup>
          <col v-if="hasSelection" class="selection-col">
          <col v-for="column in dataColumns" :key="column.key" :style="{ width: columnWidths[column.key] ? `${columnWidths[column.key]}px` : typeof column.width === 'number' ? `${column.width}px` : column.width, minWidth: typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth }">
          <col v-if="hasControl" class="control-col">
        </colgroup>
        <thead v-if="showHeader"><tr>
          <th v-if="hasSelection" class="selection-cell"><button type="button" class="tz-checkbox" :class="{ checked: allSelected, indeterminate: someSelected }" :aria-pressed="allSelected" aria-label="Выбрать все строки" @click="toggleAll"><span /></button></th>
          <th v-for="column in dataColumns" :key="column.key" :class="[`is-${alignOf(column)}`, { filterable: column.filter || column.filterable, fixed: column.fixed }]" @click="(column.filter || column.filterable) && openFilter(column)">
            <div class="heading">
              <button v-if="column.sortable" type="button" class="icon-button" :class="{ active: sortKey === (column.sortFieldName ?? column.key) && sortOrder }" @click.stop="toggleSort(column)"><ArrowUp v-if="sortKey === (column.sortFieldName ?? column.key) && sortOrder === 'ASC'" :size="12" /><ArrowDown v-else-if="sortKey === (column.sortFieldName ?? column.key) && sortOrder === 'DESC'" :size="12" /><ArrowUpDown v-else :size="12" /></button>
              <span class="heading-title">{{ titleOf(column) }}</span>
              <span v-if="column.filter || column.filterable" class="filter-wrap"><button type="button" class="icon-button" :class="{ active: activeFilterCounts[column.filter?.filterKey ?? column.key] }" @click.stop="openFilter(column)"><Filter :size="12" /><b v-if="activeFilterCounts[column.filter?.filterKey ?? column.key]">{{ activeFilterCounts[column.filter?.filterKey ?? column.key] > 99 ? '99+' : activeFilterCounts[column.filter?.filterKey ?? column.key] }}</b></button><button v-if="activeFilterCounts[column.filter?.filterKey ?? column.key]" class="clear-filter" type="button" @click.stop="resetFilter(column.filter?.filterKey ?? column.key)"><X :size="16" /></button></span>
              <i v-if="resizable" class="resize-handle" @pointerdown.stop.prevent="startResize($event, column)" />
            </div>
            <div v-if="openFilterKey === column.key && column.filter" class="filter-popover" @click.stop>
              <header><slot :name="`filter-title-${column.key}`" :title="column.filter.title ?? titleOf(column)">{{ column.filter.title ?? titleOf(column) }}</slot></header>
              <span v-if="filterLoading === column.key" class="filter-status">Загрузка…</span>
              <label v-for="option in filterOptions[column.key] ?? []" :key="String(option.id)"><input :type="column.filter.type === 'RADIO' ? 'radio' : 'checkbox'" :checked="optionChecked(column, option)" @change="setOption(column, option)"><slot :name="`filter-column-${column.key}`" :option="option" :search-value="searchValue">{{ option.name ?? option.value }}</slot></label>
              <button v-if="activeFilterCounts[column.filter.filterKey]" type="button" class="reset-filter" @click="resetFilter(column.filter.filterKey)">Сбросить фильтр</button>
            </div>
          </th>
          <th v-if="hasControl" class="settings-cell"><button v-if="showSettings" type="button" class="icon-button" @click="settingsOpen = !settingsOpen; emit('settings')"><Settings :size="20" /></button></th>
        </tr></thead>
        <tbody v-if="displayRows.length" :style="tableBodyStyle">
          <tr v-for="(row, index) in displayRows" :key="String(rowId(row) ?? index)" :class="{ selected: selectedIds.has(rowId(row)), clickable: !disabledRowClick }" @click="clickRow(row)" @dblclick="doubleClickRow(row, $event)">
            <td v-if="hasSelection" class="selection-cell" @click.stop><button type="button" class="tz-checkbox" :class="{ checked: selectedIds.has(rowId(row)) }" :aria-pressed="selectedIds.has(rowId(row))" aria-label="Выбрать строку" @click="toggleRow(row)"><span /></button></td>
            <td v-for="column in dataColumns" :key="column.key" :class="`is-${alignOf(column)}`"><slot :name="`column-${column.key}`" :item="row" :value="row[column.key]">{{ column.type === 'index' ? page * countPerPage + index + 1 : row[column.key] }}</slot></td>
            <td v-if="hasControl" class="action-cell" @click.stop><slot name="context-menu" :item="row"><button v-if="showActions" type="button" class="row-action" @click="emit('row-action', row)"><Trash2 :size="16" /></button></slot></td>
          </tr>
        </tbody>
      </table>
      <div v-if="!displayRows.length" class="empty"><slot v-if="showNoSearch" name="no-search-result"><span class="empty-icon"><Inbox :size="24" /></span><strong>Ничего не найдено</strong><p>Измените поисковый запрос или сбросьте фильтры</p></slot><slot v-else name="no-data"><span class="empty-icon"><Inbox :size="24" /></span><strong>{{ emptyTitle }}</strong><p>{{ emptyDescription }}</p></slot></div>
    </div>
    <div v-if="settingsOpen && slots['table-settings']" class="settings-panel"><slot name="table-settings" /></div>
    <div v-if="showPagination" class="pagination">
      <div class="pagination-info"><span>Показано {{ rangeStart }}–{{ rangeEnd }} из {{ total }}</span><label><span>Показать</span><TzSelect class="page-size" :model-value="String(countPerPage)" :options="pageSizes" size="medium" :show-label="false" :show-leading-icon="false" :required="false" @update:model-value="updateCountPerPage" /><span>записей</span></label></div>
      <nav aria-label="Страницы"><button type="button" :disabled="page === 0" @click="changePage(0)"><ChevronsLeft :size="12" /></button><button type="button" :disabled="page === 0" @click="changePage(page - 1)"><ChevronLeft :size="16" /></button><template v-for="(item, index) in visiblePages" :key="`${item}-${index}`"><span v-if="item === 'ellipsis'">…</span><button v-else type="button" :class="{ current: item === page + 1 }" @click="changePage(item - 1)">{{ item }}</button></template><button type="button" :disabled="page >= pagesCount - 1" @click="changePage(page + 1)"><ChevronRight :size="16" /></button><button type="button" :disabled="page >= pagesCount - 1" @click="changePage(pagesCount - 1)"><ChevronsRight :size="12" /></button></nav>
    </div>
  </div>
</template>

<style scoped>
.tz-table-new { position: relative; width: 100%; color: var(--text-default); font-family: var(--tz-font-family); }
.tz-table-new__bar { display: flex; align-items: center; gap: var(--padding-spacing-12); padding: var(--padding-spacing-12); border: 1px solid var(--border-default); border-bottom: 0; border-radius: var(--radius-md) var(--radius-md) 0 0; background: var(--bg-surface); }
.tz-table-new__bar-left,.tz-table-new__bar-right { display: flex; align-items: center; gap: var(--padding-spacing-8); }.tz-table-new__bar-left { flex: 1 }.tz-table-new__search { max-width: 360px }.tz-table-new__bar-right { margin-left: auto }
.tz-table-new__scroll { position: relative; overflow: auto; border: 1px solid var(--border-default); border-radius: var(--radius-md) var(--radius-md) 0 0; background: var(--bg-surface); outline: none }.tz-table-new__bar + .tz-table-new__scroll { border-radius: 0 }
.tz-table-new__loading { position: absolute; z-index: 8; inset: 0; display: grid; place-items: center; color: var(--brand-primary); background: color-mix(in srgb,var(--bg-surface) 75%,transparent) }.tz-table-new__loading svg { animation: spin .8s linear infinite }
.tz-table-new__table { width: 100%; min-width: 760px; border-spacing: 0; border-collapse: separate; table-layout: fixed }.selection-col,.control-col { width: 36px; min-width: 36px }
th,td { box-sizing: border-box; border-right: 1px solid var(--border-default); border-bottom: 1px solid var(--border-default); text-align: left }tr>:last-child { border-right: 0 }tbody tr:last-child td { border-bottom: 0 }
th { position: relative; height: 36px; padding: var(--padding-spacing-8); color: var(--brand-primary); background: var(--bg-row-hover); font: 400 12px/16px var(--tz-font-family); transition: background-color 140ms ease }thead th:hover { background: var(--brand-bg-hover) }th.filterable { cursor: pointer }
td { height: 56px; padding: var(--padding-spacing-12) var(--padding-spacing-8); background: var(--bg-surface); font: 400 14px/20px var(--tz-font-family) }.is-stripped tbody tr:nth-child(even) td { background: var(--bg-row-hover) }tbody tr:hover td,tbody tr.selected td { background: var(--brand-bg-hover) }tr.clickable { cursor: pointer }.is-center{text-align:center}.is-right{text-align:right}
.heading { display:flex;align-items:center;gap:var(--padding-spacing-4);min-width:0;height:100% }.heading-title{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.icon-button,.clear-filter,.row-action{position:relative;display:inline-grid;flex:0 0 auto;width:20px;height:20px;padding:2px;place-items:center;color:var(--icon-default);border:0;border-radius:var(--radius-xs);background:transparent;cursor:pointer}.heading>.icon-button,.filter-wrap>.icon-button{color:var(--brand-primary)}.icon-button:hover,.icon-button.active{color:var(--brand-primary);background:var(--brand-bg-active)}.filter-wrap{display:inline-flex;align-items:center;gap:2px}.icon-button b{position:absolute;top:-5px;right:-6px;min-width:14px;height:14px;padding:0 3px;color:var(--text-inverse);border-radius:var(--radius-full);background:var(--brand-primary);font:500 8px/14px var(--tz-font-family)}.clear-filter:hover,.row-action:hover{color:var(--status-error-fg);background:var(--status-error-bg)}
.selection-cell,.settings-cell,.action-cell{width:36px;min-width:36px;padding:0!important;text-align:center!important}.selection-cell .tz-checkbox,.settings-cell .icon-button,.action-cell .row-action{margin-inline:auto}.settings-cell .icon-button{position:absolute;top:50%;left:50%;margin:0;color:var(--brand-primary);transform:translate(-50%,-50%)}.row-action{color:var(--status-error-fg)}
.tz-checkbox{display:grid;width:20px;height:20px;padding:0;place-items:center;border:1px solid var(--border-default);border-radius:var(--radius-xs);background:var(--bg-surface);cursor:pointer}.tz-checkbox:hover{border-color:var(--brand-primary)}.tz-checkbox.checked,.tz-checkbox.indeterminate{border-color:var(--brand-primary);background:var(--brand-primary)}.tz-checkbox.checked span{width:9px;height:5px;border-bottom:1.5px solid var(--text-button-fill);border-left:1.5px solid var(--text-button-fill);transform:translateY(-1px) rotate(-45deg)}.tz-checkbox.indeterminate span{width:10px;height:1.5px;background:var(--text-button-fill)}
.resize-handle{position:absolute;top:0;right:-5px;width:10px;height:100%;cursor:col-resize}.filter-popover{position:absolute;z-index:12;top:calc(100% + 4px);right:4px;display:grid;min-width:220px;max-height:280px;padding:var(--padding-spacing-12);overflow:auto;color:var(--text-default);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:0 10px 24px var(--bg-shadow);cursor:default}.filter-popover header{margin-bottom:var(--padding-spacing-8);font:500 12px/16px var(--tz-font-family)}.filter-popover label{display:flex;align-items:center;gap:var(--padding-spacing-8);padding:var(--padding-spacing-6) 0;font:400 12px/16px var(--tz-font-family)}.filter-status{color:var(--text-muted)}.reset-filter{margin-top:var(--padding-spacing-8);padding:var(--padding-spacing-6) var(--padding-spacing-8);color:var(--brand-primary);border:0;border-radius:var(--radius-sm);background:var(--brand-bg-hover);cursor:pointer}
.empty{display:grid;min-height:190px;padding:var(--padding-spacing-32);place-items:center;align-content:center;text-align:center}.empty-icon{display:grid;width:44px;height:44px;margin-bottom:var(--padding-spacing-12);place-items:center;color:var(--text-inverse);border-radius:var(--radius-lg);background:var(--blue-400)}.empty strong{font:500 14px/20px var(--tz-font-family)}.empty p{margin:var(--padding-spacing-4) 0 0;color:var(--text-muted);font:400 12px/16px var(--tz-font-family)}
.settings-panel{padding:var(--padding-spacing-16);border:1px solid var(--border-default);border-top:0;background:var(--bg-surface)}.pagination{display:flex;align-items:center;justify-content:space-between;gap:var(--padding-spacing-16);min-height:64px;padding:var(--padding-spacing-12);border:1px solid var(--border-default);border-top:0;border-radius:0 0 var(--radius-md) var(--radius-md);background:var(--bg-surface)}.pagination-info,.pagination-info label,.pagination nav{display:flex;align-items:center;gap:var(--padding-spacing-10,10px)}.pagination-info{font:400 12px/16px var(--tz-font-family)}.page-size{width:60px;flex:0 0 60px}.pagination nav{gap:5px}.pagination nav button{display:grid;min-width:30px;height:30px;padding:0 var(--padding-spacing-8);place-items:center;color:var(--text-muted);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface);font:500 14px/20px var(--tz-font-family);cursor:pointer}.pagination nav button:hover:not(:disabled){color:var(--brand-primary);background:var(--brand-bg-hover)}.pagination nav button.current{color:var(--text-inverse);border-color:var(--brand-primary);background:var(--brand-primary)}.pagination nav button:disabled{opacity:.35;cursor:default}.pagination nav span{min-width:20px;color:var(--text-muted);text-align:center}
@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:700px){.tz-table-new__bar,.pagination{align-items:flex-start;flex-direction:column}.tz-table-new__search{max-width:none}.radius-grid{grid-template-columns:1fr}}
</style>
