<script setup lang="ts">
import {
  ArrowDown, ArrowUp, ArrowUpDown, ArrowLeftToLine, ArrowRightToLine, ChevronLeft, ChevronRight,
  Filter, Inbox, LoaderCircle, Settings, Trash2, X,
} from '@lucide/vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch, type StyleValue } from 'vue'
import TzSearch from '../forms/TzSearch.vue'
import TzSelect, { type SelectValue } from '../forms/TzSelect.vue'
import TzTreeFilterModal from './TzTreeFilterModal.vue'

export type TableRow = Record<string, unknown>
export type TableSortOrder = 'ASC' | 'DESC' | null
export interface TableSortRule { key: string; order: Exclude<TableSortOrder, null> }
export type TableColumnType = 'default' | 'index' | 'selection' | 'settings'
export type TableFixedType = 'left' | 'right'
export type TableFilterType = 'CHECKBOX' | 'RANGE_MAX' | 'RANGE' | 'RADIO' | 'SELECT_MULTIPLE' | 'DATE' | 'TIME_RANGE' | 'CHECKBOX_SELECT'

export interface TableFilterOption { id: string | number; name?: string; value: string; children?: TableFilterOption[]; [key: string]: unknown }
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
  size: number
  sort: string[]
  sorts: TableSortRule[]
  substring: string
  signal?: AbortSignal
}
export interface TzTablePaginationConfig {
  page?: number
  totalCount?: number
  countPerPage?: number
  countPerPageOptions?: number[]
  showPagination?: boolean
}
export interface TzTableSortConfig { key?: string; order?: TableSortOrder }
export interface TzTableFiltersConfig { value?: Record<string, unknown>; fullInfo?: TableFilterFullInfo[] }
export interface TzTableSearchConfig { enabled?: boolean; placeholder?: string; initialValue?: string; showBarAlways?: boolean }
export interface TzTableSelectionConfig { items?: TableRow[]; disabled?: boolean; resetOnDataChange?: boolean }
export interface TzTableServerConfig {
  isServer?: boolean
  getData?: (params?: TableLoadParams) => Promise<TableRow[]>
  onDataLoaded?: (rows?: TableRow[]) => void
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
  pagination?: TzTablePaginationConfig
  sort?: TzTableSortConfig
  filters?: TzTableFiltersConfig
  search?: TzTableSearchConfig
  selection?: TzTableSelectionConfig
  server?: TzTableServerConfig
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
  startSorts?: TableSortRule[]
  multiSort?: boolean
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
  startSortOrder: null, startSortValue: () => [], startSorts: () => [], multiSort: false, startFiltersFullInfo: () => [], rowKey: 'id',
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
  sort: [payload: { key: string; order: TableSortOrder; sorts: TableSortRule[] }]
  filter: [payload: { key: string }]
  'clear-filter': [key: string]
  settings: []
  'row-action': [row: TableRow]
  search: [value: string]
}>()

const slots = useSlots()
const root = ref<HTMLElement | null>(null)
const scroll = ref<HTMLElement | null>(null)
const currentPage = computed(() => props.pagination?.page ?? props.page)
const currentCountPerPage = computed(() => props.pagination?.countPerPage ?? props.countPerPage)
const currentTotalCount = computed(() => props.pagination?.totalCount ?? props.totalCount)
const currentCountPerPageOptions = computed(() => props.pagination?.countPerPageOptions ?? props.countPerPageOptions)
const paginationVisible = computed(() => props.pagination?.showPagination ?? props.showPagination)
const searchEnabled = computed(() => props.search?.enabled ?? props.searchable)
const normalizedSearchPlaceholder = computed(() => props.search?.placeholder ?? props.searchPlaceholder)
const showBarAlways = computed(() => props.search?.showBarAlways ?? props.showBarAlways)
const selectedRows = computed(() => props.selection?.items ?? props.selectedItems)
const selectionDisabled = computed(() => props.selection?.disabled ?? props.disabledSelection)
const resetSelectionOnDataChange = computed(() => props.selection?.resetOnDataChange ?? props.resetAllCheckedItems)
const serverEnabled = computed(() => props.server?.isServer ?? props.isServer)
const serverLoader = computed(() => props.server?.getData ?? props.getData)
const searchValue = ref(props.search?.initialValue ?? props.startSearchValue)
const sortKey = ref(props.sort?.key ?? props.startSortKey)
const sortOrder = ref<TableSortOrder>(props.sort?.order ?? props.startSortOrder)
const sortValue = ref([...props.startSortValue])
const sortRules = ref<TableSortRule[]>(props.startSorts.length
  ? [...props.startSorts]
  : sortKey.value && sortOrder.value ? [{ key: sortKey.value, order: sortOrder.value }] : [])
const filtersValue = ref<Record<string, unknown>>({ ...(props.filters?.value ?? props.startFiltersValue) })
const filtersFullInfo = ref<TableFilterFullInfo[]>([...(props.filters?.fullInfo ?? props.startFiltersFullInfo)])
const serverRows = ref<TableRow[] | null>(null)
const loading = ref(false)
const loadError = ref<Error | null>(null)
const abortController = ref<AbortController | null>(null)
const settingsOpen = ref(false)
const openFilterKey = ref('')
const filterOptions = ref<Record<string, TableFilterOption[]>>({})
const filterLoading = ref('')
const columnWidths = ref<Record<string, number>>({})

watch(() => [props.sort?.key ?? props.startSortKey, props.sort?.order ?? props.startSortOrder] as const, ([key, order]) => {
  sortKey.value = key
  sortOrder.value = order
  if (!props.startSorts.length) sortRules.value = key && order ? [{ key, order }] : []
})
watch(() => props.startSorts, value => {
  sortRules.value = [...value]
  sortKey.value = value[0]?.key ?? ''
  sortOrder.value = value[0]?.order ?? null
}, { deep: true })
watch(() => props.search?.initialValue ?? props.startSearchValue, value => { searchValue.value = value })
watch(() => props.filters?.value ?? props.startFiltersValue, value => { filtersValue.value = { ...value } }, { deep: true })
watch(() => props.data, () => { if (resetSelectionOnDataChange.value && selectedRows.value.length) emit('update:selectedItems', []) })
watch([serverEnabled, serverLoader], ([server, loader]) => { if (server && loader) exposedLoadData(currentPage.value, currentCountPerPage.value) }, { immediate: true })

const titleOf = (column: TzTableColumn) => column.label ?? column.title ?? column.key
const alignOf = (column: TzTableColumn) => column.align ?? (column.type === 'index' ? 'center' : 'left')
const dataColumns = computed(() => props.columns
  .filter(column => column.active !== false && (!column.type || column.type === 'default' || column.type === 'index'))
  .slice(0, Math.max(1, props.columnsPerView)))
const modalFilterColumn = computed(() => dataColumns.value.find(column => column.key === openFilterKey.value && column.filter?.type === 'CHECKBOX_SELECT'))
const hasSelection = computed(() => !selectionDisabled.value && (props.columns.some(column => column.type === 'selection') || !props.columns.some(column => column.type)))
const tableMinWidth = computed(() => Math.max(760, dataColumns.value.reduce((sum, column) => sum + (typeof column.width === 'number' ? column.width : 180), 0) + (hasSelection.value ? 36 : 0) + (hasControl.value ? 36 : 0)))
const columnPixelWidth = (column: TzTableColumn) => columnWidths.value[column.key] ?? (typeof column.width === 'number' ? column.width : 180)
function fixedCellStyle(column: TzTableColumn, index: number): Record<string, string | number> {
  if (!column.fixed) return {}
  if (column.fixed === 'left') return { left: ((hasSelection.value ? 36 : 0) + dataColumns.value.slice(0, index).reduce((sum, item) => sum + columnPixelWidth(item), 0)) + 'px' }
  return { right: ((hasControl.value ? 36 : 0) + dataColumns.value.slice(index + 1).reduce((sum, item) => sum + columnPixelWidth(item), 0)) + 'px' }
}
const hasControl = computed(() => props.showActions || props.showSettings || props.columns.some(column => column.type === 'settings'))
const hasBar = computed(() => showBarAlways.value || searchEnabled.value || Boolean(slots['bar-left']) || Boolean(slots['bar-right']))
const rawRows = computed(() => serverRows.value ?? props.data)
const locallyProcessedRows = computed(() => {
  if (serverEnabled.value) return rawRows.value
  const query = searchValue.value.trim().toLocaleLowerCase()
  let rows = query ? rawRows.value.filter(row => dataColumns.value.some(column => String(row[column.key] ?? '').toLocaleLowerCase().includes(query))) : [...rawRows.value]
  for (const [key, filterValue] of Object.entries(filtersValue.value)) {
    if (filterValue == null || filterValue === '' || (Array.isArray(filterValue) && !filterValue.length)) continue
    const accepted = Array.isArray(filterValue) ? filterValue.map(String) : [String(filterValue)]
    rows = rows.filter(row => accepted.includes(String(row[key] ?? '')))
  }
  if (sortRules.value.length) {
    rows = [...rows].sort((a, b) => {
      for (const rule of sortRules.value) {
        const comparison = String(a[rule.key] ?? '').localeCompare(String(b[rule.key] ?? ''), undefined, { numeric: true })
        if (comparison) return comparison * (rule.order === 'ASC' ? 1 : -1)
      }
      return 0
    })
  }
  return rows
})
const externalPageData = computed(() => serverEnabled.value || (currentTotalCount.value > 0 && currentTotalCount.value > rawRows.value.length))
const total = computed(() => externalPageData.value ? (currentTotalCount.value || locallyProcessedRows.value.length) : locallyProcessedRows.value.length)
const pagesCount = computed(() => Math.max(1, Math.ceil(total.value / currentCountPerPage.value)))
const displayRows = computed(() => {
  if (!paginationVisible.value || externalPageData.value) return locallyProcessedRows.value
  const start = currentPage.value * currentCountPerPage.value
  return locallyProcessedRows.value.slice(start, start + currentCountPerPage.value)
})
const showNoSearch = computed(() => Boolean(searchValue.value) && rawRows.value.length > 0 && displayRows.value.length === 0)
const rowId = (row: TableRow) => row[props.rowKey] as string | number
const selectedIds = computed(() => new Set(selectedRows.value.map(rowId)))
const allSelected = computed(() => displayRows.value.length > 0 && displayRows.value.every(row => selectedIds.value.has(rowId(row))))
const someSelected = computed(() => !allSelected.value && displayRows.value.some(row => selectedIds.value.has(rowId(row))))
const rangeStart = computed(() => total.value ? currentPage.value * currentCountPerPage.value + 1 : 0)
const rangeEnd = computed(() => Math.min((currentPage.value + 1) * currentCountPerPage.value, total.value))
const pageSizes = computed(() => (currentCountPerPageOptions.value.length ? currentCountPerPageOptions.value : [20]).map(value => ({ label: String(value), value: String(value) })))
const activeFilterCounts = computed(() => ({ ...Object.fromEntries(Object.entries(filtersValue.value).map(([key, value]) => [key, Array.isArray(value) ? value.length : value == null || value === '' ? 0 : 1])), ...props.activeFilters }))
const activeFilterChips = computed(() => Object.entries(filtersValue.value).flatMap(([key, rawValue]) => {
  const values = Array.isArray(rawValue) ? rawValue : rawValue == null || rawValue === '' ? [] : [rawValue]
  const column = props.columns.find(item => (item.filter?.filterKey ?? item.key) === key)
  const title = column?.filter?.title ?? (column ? titleOf(column) : key)
  const options = column ? filterOptions.value[column.key] ?? [] : []
  return values.map((value, index) => ({
    id: `${key}-${String(value)}-${index}`,
    key,
    value,
    title,
    label: findFilterOptionName(options, value) ?? String(value),
  }))
}))
const visiblePages = computed<number[]>(() => {
  const count = pagesCount.value
  const current = currentPage.value + 1
  const visibleCount = Math.min(5, count)
  const start = Math.min(Math.max(1, current - 3), Math.max(1, count - visibleCount + 1))
  return Array.from({ length: visibleCount }, (_, index) => start + index)
})

function toggleAll() { emit('update:selectedItems', allSelected.value ? [] : [...displayRows.value]) }
function toggleRow(row: TableRow) {
  const id = rowId(row)
  emit('update:selectedItems', selectedIds.value.has(id) ? selectedRows.value.filter(item => rowId(item) !== id) : [...selectedRows.value, row])
}
function sortRuleFor(column: TzTableColumn) {
  const key = column.sortFieldName ?? column.key
  return sortRules.value.find(rule => rule.key === key)
}
function sortPriority(column: TzTableColumn) {
  const key = column.sortFieldName ?? column.key
  const index = sortRules.value.findIndex(rule => rule.key === key)
  return index >= 0 ? index + 1 : 0
}
function toggleSort(column: TzTableColumn, event?: MouseEvent) {
  if (!column.sortable) return
  const key = column.sortFieldName ?? column.key
  const current = sortRules.value.find(rule => rule.key === key)
  const nextOrder: TableSortOrder = !current ? 'ASC' : current.order === 'ASC' ? 'DESC' : null
  const additive = props.multiSort && Boolean(event?.shiftKey)
  const remaining = additive ? sortRules.value.filter(rule => rule.key !== key) : []
  sortRules.value = nextOrder ? [...remaining, { key, order: nextOrder }] : remaining
  sortKey.value = sortRules.value[0]?.key ?? ''
  sortOrder.value = sortRules.value[0]?.order ?? null
  sortValue.value = sortRules.value.flatMap(rule => [rule.key, rule.order])
  emit('sort', { key: sortKey.value, order: sortOrder.value, sorts: [...sortRules.value] })
  if (serverEnabled.value) exposedLoadData(0, currentCountPerPage.value)
}
function changePage(page: number) {
  if (page < 0 || page >= pagesCount.value || page === currentPage.value) return
  emit('update:page', page)
  if (serverEnabled.value) exposedLoadData(page, currentCountPerPage.value)
}
function updateCountPerPage(value: SelectValue) {
  if (typeof value !== 'string') return
  const count = Number(value); emit('update:countPerPage', count); emit('update:page', 0)
  if (serverEnabled.value) exposedLoadData(0, count)
}
function updateSearch(value: string) {
  searchValue.value = value; emit('search', value); emit('update:page', 0)
  if (serverEnabled.value) exposedLoadData(0, currentCountPerPage.value)
}
const isTreeFilter = (column: TzTableColumn) => column.filter?.type === 'CHECKBOX_SELECT'
function filterSelectedValues(column: TzTableColumn) {
  const value = filtersValue.value[column.filter?.filterKey ?? column.key]
  return Array.isArray(value) ? value.map(String) : []
}
function normalizeFilterOptions(options: unknown[], path = 'root'): TableFilterOption[] {
  return options.map((option, index) => {
    if (typeof option !== 'object' || option === null) return { id: `${path}-${index}`, value: String(option), name: String(option) }
    const source = option as Record<string, unknown>
    const value = String(source.value ?? source.id ?? `${path}-${index}`)
    const children = Array.isArray(source.children) ? normalizeFilterOptions(source.children, value) : undefined
    return { ...source, id: (source.id as string | number | undefined) ?? `${path}-${index}`, value, name: String(source.name ?? value), children } as TableFilterOption
  })
}
function findFilterOptionName(options: TableFilterOption[], value: unknown): string | undefined {
  for (const option of options) {
    if (String(option.value) === String(value)) return option.name ?? String(option.value)
    const childName = option.children?.length ? findFilterOptionName(option.children, value) : undefined
    if (childName) return childName
  }
}
function closeFilter() { openFilterKey.value = '' }
function handleDocumentPointerDown(event: PointerEvent) {
  const target = event.target as HTMLElement | null
  if (target?.closest('.tree-filter-modal')) return
  const interactiveTarget = target?.closest('.filter-popover, .filter-button')
  if (!interactiveTarget || !root.value?.contains(interactiveTarget)) closeFilter()
}
function handleDocumentKeydown(event: KeyboardEvent) { if (event.key === 'Escape') closeFilter() }
async function openFilter(column: TzTableColumn) {
  emit('filter', { key: column.key })
  if (!column.filter) return
  openFilterKey.value = openFilterKey.value === column.key ? '' : column.key
  if (!openFilterKey.value || filterOptions.value[column.key]) return
  filterLoading.value = column.key
  try {
    const result = await column.filter.getFilters({ page: column.filter.page ?? 0, pageSize: column.filter.pageSize ?? 20 })
    const options = Array.isArray(result) ? result : (result && typeof result === 'object' && Array.isArray((result as { data?: unknown[] }).data) ? (result as { data: unknown[] }).data : [])
    filterOptions.value[column.key] = normalizeFilterOptions(options)
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
  if (serverEnabled.value) exposedLoadData(0, currentCountPerPage.value)
}
function applyTreeFilter(values: string[]) {
  const column = modalFilterColumn.value
  if (!column?.filter) return
  const key = column.filter.filterKey
  const next = { ...filtersValue.value }
  if (values.length) next[key] = values
  else delete next[key]
  filtersValue.value = next
  filtersFullInfo.value = values.length
    ? [...filtersFullInfo.value.filter(item => item.key !== key), { key, value: values, title: column.filter.title ?? titleOf(column), type: column.filter.type }]
    : filtersFullInfo.value.filter(item => item.key !== key)
  emit('update:filter-full-info', [...filtersFullInfo.value])
  if (!values.length) emit('clear-filter', key)
  emit('update:page', 0)
  closeFilter()
  if (serverEnabled.value) exposedLoadData(0, currentCountPerPage.value)
}
function resetFilter(key: string) {
  const next = { ...filtersValue.value }; delete next[key]; filtersValue.value = next
  filtersFullInfo.value = filtersFullInfo.value.filter(item => item.key !== key)
  emit('update:filter-full-info', [...filtersFullInfo.value]); emit('clear-filter', key)
  emit('update:page', 0)
  if (serverEnabled.value) exposedLoadData(0, currentCountPerPage.value)
}
function removeFilterChip(key: string, value: unknown) {
  const current = filtersValue.value[key]
  if (!Array.isArray(current)) { resetFilter(key); return }
  const values = current.filter(item => String(item) !== String(value))
  if (!values.length) { resetFilter(key); return }
  filtersValue.value = { ...filtersValue.value, [key]: values }
  filtersFullInfo.value = filtersFullInfo.value.map(item => item.key === key ? { ...item, value: values } : item)
  emit('update:filter-full-info', [...filtersFullInfo.value])
  emit('update:page', 0)
  if (serverEnabled.value) exposedLoadData(0, currentCountPerPage.value)
}
function cancelLoad() {
  abortController.value?.abort()
  abortController.value = null
  loading.value = false
}
async function exposedLoadData(page = currentPage.value, countPerPage = currentCountPerPage.value) {
  const loader = serverLoader.value
  if (!loader) return
  cancelLoad()
  const controller = new AbortController()
  abortController.value = controller
  loadError.value = null
  loading.value = true
  try {
    const rows = await loader({
      page,
      countPerPage,
      size: countPerPage,
      search: searchValue.value,
      substring: searchValue.value,
      sortKey: sortKey.value,
      sortOrder: sortOrder.value,
      sortValue: sortValue.value,
      sort: sortRules.value.map(rule => `${rule.key},${rule.order}`),
      sorts: [...sortRules.value],
      filters: filtersValue.value,
      signal: controller.signal,
    })
    if (controller.signal.aborted) return
    serverRows.value = rows
    props.server?.onDataLoaded?.(rows)
  } catch (error) {
    if (!controller.signal.aborted) loadError.value = error instanceof Error ? error : new Error(String(error))
  } finally {
    if (abortController.value === controller) {
      abortController.value = null
      loading.value = false
    }
  }
}
function exposedResetAllFilters() {
  const keys = Object.keys(filtersValue.value)
  filtersValue.value = { ...(props.filters?.value ?? props.startFiltersValue) }
  filtersFullInfo.value = [...(props.filters?.fullInfo ?? props.startFiltersFullInfo)]
  searchValue.value = props.search?.initialValue ?? props.startSearchValue
  sortKey.value = props.sort?.key ?? props.startSortKey
  sortOrder.value = props.sort?.order ?? props.startSortOrder
  sortRules.value = sortKey.value && sortOrder.value ? [{ key: sortKey.value, order: sortOrder.value }] : []
  sortValue.value = sortRules.value.flatMap(rule => [rule.key, rule.order])
  emit('update:filter-full-info', [...filtersFullInfo.value])
  keys.forEach(key => emit('clear-filter', key))
  emit('update:page', 0)
  if (serverEnabled.value) exposedLoadData(0, currentCountPerPage.value)
}
function clearSelection() { emit('update:selectedItems', []) }
function resetSort() { sortKey.value = ''; sortOrder.value = null; sortValue.value = []; sortRules.value = []; emit('sort', { key: '', order: null, sorts: [] }) }
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

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown, true)
  document.addEventListener('keydown', handleDocumentKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown, true)
  document.removeEventListener('keydown', handleDocumentKeydown)
  cancelLoad()
})

defineExpose({ resetFilter, exposedLoadData, exposedResetAllFilters, resetSort, scrollToTop, focusTable, clearSelection, cancelLoad, loadError, isLoading: loading })
</script>

<template>
  <div ref="root" class="tz-table-new" :class="{ 'is-loading': loading }">
    <div v-if="hasBar" class="tz-table-new__bar">
      <div class="tz-table-new__bar-left"><slot name="bar-left" /></div>
      <TzSearch v-if="searchEnabled" class="tz-table-new__search" :model-value="searchValue" :placeholder="normalizedSearchPlaceholder || 'Поиск'" @update:model-value="updateSearch" />
      <div class="tz-table-new__bar-right"><slot name="bar-right" /></div>
    </div>
    <div v-if="activeFilterChips.length" class="tz-table-new__active-filters" aria-label="Применённые фильтры">
      <span class="tz-table-new__active-filters-label">Фильтры:</span>
      <button
        v-for="chip in activeFilterChips"
        :key="chip.id"
        type="button"
        class="tz-table-new__filter-chip"
        :aria-label="`Удалить фильтр ${chip.title}: ${chip.label}`"
        @click="removeFilterChip(chip.key, chip.value)"
      >
        <span><strong>{{ chip.title }}:</strong> {{ chip.label }}</span><X :size="14" />
      </button>
      <button type="button" class="tz-table-new__reset-all-filters" @click="exposedResetAllFilters">Сбросить все</button>
    </div>
    <slot name="before-table" />
    <div ref="scroll" class="tz-table-new__scroll" tabindex="-1">
      <div v-if="loading" class="tz-table-new__loading"><LoaderCircle :size="24" /></div>
      <div v-if="loadError" class="tz-table-new__load-error"><slot name="load-error" :load-error="loadError"><strong>Не удалось загрузить данные</strong><span>{{ loadError.message }}</span></slot></div>
      <table v-else class="tz-table-new__table" :class="{ 'is-stripped': stripped }" :style="{ minWidth: `${tableMinWidth}px` }">
        <colgroup>
          <col v-if="hasSelection" class="selection-col">
          <col v-for="column in dataColumns" :key="column.key" :style="{ width: columnWidths[column.key] ? `${columnWidths[column.key]}px` : typeof column.width === 'number' ? `${column.width}px` : column.width, minWidth: typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth }">
          <col v-if="hasControl" class="control-col">
        </colgroup>
        <thead v-if="showHeader"><tr>
          <th v-if="hasSelection" class="selection-cell"><button type="button" class="tz-checkbox" :class="{ checked: allSelected, indeterminate: someSelected }" :aria-pressed="allSelected" aria-label="Выбрать все строки" @click="toggleAll"><span /></button></th>
          <th v-for="(column, columnIndex) in dataColumns" :key="column.key" :style="fixedCellStyle(column, columnIndex)" :class="[`is-${alignOf(column)}`, { filterable: column.filter || column.filterable, fixed: column.fixed }]" @click="(column.filter || column.filterable) && openFilter(column)">
            <div class="heading">
              <button v-if="column.sortable" type="button" class="icon-button sort-button" :class="{ active: sortRuleFor(column) }" :aria-label="`Сортировать по ${titleOf(column)}`" :title="multiSort ? 'Клик — сортировка, Shift + клик — добавить критерий' : 'Сортировать'" @click.stop="toggleSort(column, $event)"><ArrowUp v-if="sortRuleFor(column)?.order === 'ASC'" :size="12" /><ArrowDown v-else-if="sortRuleFor(column)?.order === 'DESC'" :size="12" /><ArrowUpDown v-else :size="12" /><sup v-if="multiSort && sortPriority(column)">{{ sortPriority(column) }}</sup></button>
              <span class="heading-title">{{ titleOf(column) }}</span>
              <span v-if="column.filter || column.filterable" class="filter-wrap"><button type="button" class="icon-button filter-button" :class="{ active: activeFilterCounts[column.filter?.filterKey ?? column.key] }" @click.stop="openFilter(column)"><Filter :size="12" /><b v-if="activeFilterCounts[column.filter?.filterKey ?? column.key]">{{ activeFilterCounts[column.filter?.filterKey ?? column.key] > 99 ? '99+' : activeFilterCounts[column.filter?.filterKey ?? column.key] }}</b></button><button v-if="activeFilterCounts[column.filter?.filterKey ?? column.key]" class="clear-filter" type="button" @click.stop="resetFilter(column.filter?.filterKey ?? column.key)"><X :size="16" /></button></span>
              <i v-if="resizable" class="resize-handle" @pointerdown.stop.prevent="startResize($event, column)" />
            </div>
            <div v-if="openFilterKey === column.key && column.filter && !isTreeFilter(column)" class="filter-popover" @click.stop>
              <header><span><slot :name="`filter-title-${column.key}`" :title="column.filter.title ?? titleOf(column)">{{ column.filter.title ?? titleOf(column) }}</slot></span><button type="button" class="close-filter-popover" aria-label="Закрыть фильтр" title="Закрыть" @click="closeFilter"><X :size="16" /></button></header>
              <span v-if="filterLoading === column.key" class="filter-status">Загрузка…</span>
              <label v-for="option in filterOptions[column.key] ?? []" :key="String(option.id)"><input :type="column.filter.type === 'RADIO' ? 'radio' : 'checkbox'" :checked="optionChecked(column, option)" @change="setOption(column, option)"><slot :name="`filter-column-${column.key}`" :option="option" :search-value="searchValue">{{ option.name ?? option.value }}</slot></label>
              <button v-if="activeFilterCounts[column.filter.filterKey]" type="button" class="reset-filter" @click="resetFilter(column.filter.filterKey)">Сбросить фильтр</button>
            </div>
          </th>
          <th v-if="hasControl" class="settings-cell"><span class="settings-cell__inner"><button v-if="showSettings" type="button" class="icon-button" @click="settingsOpen = !settingsOpen; emit('settings')"><Settings :size="16" /></button></span></th>
        </tr></thead>
        <tbody v-if="displayRows.length" :style="tableBodyStyle">
          <tr v-for="(row, index) in displayRows" :key="String(rowId(row) ?? index)" :class="{ selected: selectedIds.has(rowId(row)), clickable: !disabledRowClick }" @click="clickRow(row)" @dblclick="doubleClickRow(row, $event)">
            <td v-if="hasSelection" class="selection-cell" @click.stop><button type="button" class="tz-checkbox" :class="{ checked: selectedIds.has(rowId(row)) }" :aria-pressed="selectedIds.has(rowId(row))" aria-label="Выбрать строку" @click="toggleRow(row)"><span /></button></td>
            <td v-for="(column, columnIndex) in dataColumns" :key="column.key" :style="fixedCellStyle(column, columnIndex)" :class="[`is-${alignOf(column)}`, { fixed: column.fixed }]"><slot :name="`column-${column.key}`" :item="row" :value="row[column.key]">{{ column.type === 'index' ? currentPage * currentCountPerPage + index + 1 : row[column.key] }}</slot></td>
            <td v-if="hasControl" class="action-cell" @click.stop><slot name="context-menu" :item="row"><button v-if="showActions" type="button" class="row-action" @click="emit('row-action', row)"><Trash2 :size="16" /></button></slot></td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loadError && !displayRows.length" class="empty"><slot v-if="showNoSearch" name="no-search-result"><span class="empty-icon"><Inbox :size="24" /></span><strong>Ничего не найдено</strong><p>Измените поисковый запрос или сбросьте фильтры</p></slot><slot v-else name="no-data"><span class="empty-icon"><Inbox :size="24" /></span><strong>{{ emptyTitle }}</strong><p>{{ emptyDescription }}</p></slot></div>
    </div>
    <div v-if="settingsOpen && slots['table-settings']" class="settings-panel"><slot name="table-settings" /></div>
    <TzTreeFilterModal
      v-if="modalFilterColumn?.filter"
      :title="`Выберите ${(modalFilterColumn.filter.title ?? titleOf(modalFilterColumn)).toLocaleLowerCase()}`"
      :options="filterOptions[modalFilterColumn.key] ?? []"
      :model-value="filterSelectedValues(modalFilterColumn)"
      :loading="filterLoading === modalFilterColumn.key"
      @close="closeFilter"
      @apply="applyTreeFilter"
    />
    <div v-if="paginationVisible" class="pagination">
      <div class="pagination-info"><span>Показано {{ rangeStart }}–{{ rangeEnd }} из {{ total }}</span><label><span>Показать</span><TzSelect class="page-size" :model-value="String(currentCountPerPage)" :options="pageSizes" size="medium" :show-label="false" :show-leading-icon="false" :required="false" @update:model-value="updateCountPerPage" /><span>записей</span></label></div>
      <nav aria-label="Страницы"><button type="button" :disabled="currentPage === 0" @click="changePage(0)"><ArrowLeftToLine :size="12" /></button><button type="button" :disabled="currentPage === 0" @click="changePage(currentPage - 1)"><ChevronLeft :size="12" /></button><button v-for="item in visiblePages" :key="item" type="button" :class="{ current: item === currentPage + 1 }" @click="changePage(item - 1)">{{ item }}</button><button type="button" :disabled="currentPage >= pagesCount - 1" @click="changePage(currentPage + 1)"><ChevronRight :size="12" /></button><button type="button" :disabled="currentPage >= pagesCount - 1" @click="changePage(pagesCount - 1)"><ArrowRightToLine :size="12" /></button></nav>
    </div>
  </div>
</template>

<style scoped>
.tz-table-new { position: relative; width: 100%; color: var(--text-default); font-family: var(--tz-font-family); }
.tz-table-new__bar { display: flex; align-items: center; gap: var(--padding-spacing-12); padding: var(--padding-spacing-12); border: 1px solid var(--border-default); border-bottom: 0; border-radius: var(--radius-md) var(--radius-md) 0 0; background: var(--bg-surface); }
.tz-table-new__bar-left,.tz-table-new__bar-right { display: flex; align-items: center; gap: var(--padding-spacing-8); }.tz-table-new__bar-left { flex: 1 }.tz-table-new__search { max-width: 360px }.tz-table-new__bar-right { margin-left: auto }
.tz-table-new__active-filters{display:flex;min-height:40px;padding:var(--padding-spacing-8) var(--padding-spacing-12);flex-wrap:wrap;align-items:center;gap:var(--padding-spacing-6);border:1px solid var(--border-default);border-bottom:0;background:var(--bg-surface)}.tz-table-new__active-filters-label{margin-right:var(--padding-spacing-2);color:var(--text-muted);font:400 12px/16px var(--tz-font-family)}.tz-table-new__filter-chip{display:inline-flex;max-width:min(320px,100%);min-height:28px;padding:var(--padding-spacing-4) var(--padding-spacing-8);align-items:center;gap:var(--padding-spacing-6);color:var(--brand-primary);border:1px solid color-mix(in srgb,var(--brand-primary) 24%,var(--border-default));border-radius:var(--radius-full);background:var(--brand-bg-hover);font:400 12px/16px var(--tz-font-family);cursor:pointer}.tz-table-new__filter-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tz-table-new__filter-chip strong{font-weight:500}.tz-table-new__filter-chip svg{flex:0 0 auto}.tz-table-new__filter-chip:hover{border-color:var(--brand-primary);background:var(--brand-bg-active)}.tz-table-new__filter-chip:focus-visible,.tz-table-new__reset-all-filters:focus-visible{outline:2px solid var(--brand-primary);outline-offset:1px}.tz-table-new__reset-all-filters{min-height:28px;padding:var(--padding-spacing-4) var(--padding-spacing-8);color:var(--brand-primary);border:0;border-radius:var(--radius-sm);background:transparent;font:500 12px/16px var(--tz-font-family);cursor:pointer}.tz-table-new__reset-all-filters:hover{background:var(--brand-bg-hover)}
.tz-table-new__scroll { position: relative; overflow: auto; border: 1px solid var(--border-default); border-radius: var(--radius-md) var(--radius-md) 0 0; background: var(--bg-surface); outline: none }.tz-table-new__bar + .tz-table-new__scroll,.tz-table-new__active-filters + .tz-table-new__scroll { border-radius: 0 }
.tz-table-new__loading { position: absolute; z-index: 8; inset: 0; display: grid; place-items: center; color: var(--brand-primary); background: color-mix(in srgb,var(--bg-surface) 75%,transparent) }.tz-table-new__loading svg { animation: spin .8s linear infinite }
.tz-table-new__table { width: 100%; min-width: 760px; border-spacing: 0; border-collapse: separate; table-layout: fixed }.selection-col,.control-col { width: 36px; min-width: 36px }
th,td { box-sizing: border-box; border-right: 1px solid var(--border-default); border-bottom: 1px solid var(--border-default); text-align: left }tr>:last-child { border-right: 0 }tbody tr:last-child td { border-bottom: 0 }
th { position: relative; height: 36px; padding: var(--padding-spacing-8); color: var(--brand-primary); background: var(--bg-row-hover); font: 400 12px/16px var(--tz-font-family); transition: background-color 140ms ease }thead th:hover { background: var(--brand-bg-hover) }th.filterable { cursor: pointer }
th.fixed,td.fixed{position:sticky;z-index:3}th.fixed{z-index:5}td { height: 56px; padding: var(--padding-spacing-12) var(--padding-spacing-8); background: var(--bg-surface); font: 400 14px/20px var(--tz-font-family) }.is-stripped tbody tr:nth-child(even) td { background: var(--bg-row-hover) }tbody tr:hover td,tbody tr.selected td { background: var(--brand-bg-hover) }tr.clickable { cursor: pointer }.is-center{text-align:center}.is-right{text-align:right}
.heading { display:flex;align-items:center;gap:var(--padding-spacing-4);min-width:0;height:100% }.heading-title{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.icon-button,.clear-filter,.row-action{position:relative;display:inline-grid;flex:0 0 auto;width:20px;height:20px;padding:2px;place-items:center;color:var(--icon-default);border:0;border-radius:var(--radius-xs);background:transparent;cursor:pointer}.heading>.icon-button,.filter-wrap>.icon-button{color:var(--brand-primary)}.icon-button:hover,.icon-button.active{color:var(--brand-primary);background:var(--brand-bg-active)}.filter-wrap{display:inline-flex;align-items:center;gap:2px}.filter-button.active{display:inline-flex;width:auto;min-width:20px;padding:2px;align-items:center;gap:var(--padding-spacing-2);border-radius:var(--radius-xs);background:var(--brand-bg-active)}.filter-button b{position:static;min-width:0;height:16px;padding:0;color:var(--brand-primary);border-radius:0;background:transparent;font:400 12px/16px var(--tz-font-family)}.clear-filter:hover,.row-action:hover{color:var(--status-error-fg);background:var(--status-error-bg)}
.sort-button sup{position:absolute;top:-5px;right:-5px;display:grid;width:13px;height:13px;place-items:center;color:var(--text-button-fill);border:1px solid var(--bg-surface);border-radius:var(--radius-full);background:var(--brand-primary);font:600 8px/1 var(--tz-font-family)}
.selection-cell,.settings-cell,.action-cell{width:36px;min-width:36px;padding:0!important;text-align:center!important}.selection-cell .tz-checkbox,.action-cell .row-action{margin-inline:auto}.settings-cell{position:relative;overflow:hidden}.settings-cell__inner{position:absolute;inset:0;display:grid;place-items:center}.settings-cell .icon-button{position:static;box-sizing:border-box;width:24px;height:24px;margin:0;padding:4px;color:var(--brand-primary);line-height:0;transform:none}.settings-cell .icon-button:focus-visible{outline:0;box-shadow:inset 0 0 0 2px var(--brand-primary)}.settings-cell .icon-button svg{display:block;width:16px;height:16px}.row-action{color:var(--status-error-fg)}
.tz-checkbox{display:grid;width:20px;height:20px;padding:0;place-items:center;border:1px solid var(--border-default);border-radius:var(--radius-xs);background:var(--bg-surface);cursor:pointer}.tz-checkbox:hover{border-color:var(--brand-primary)}.tz-checkbox.checked,.tz-checkbox.indeterminate{border-color:var(--brand-primary);background:var(--brand-primary)}.tz-checkbox.checked span{width:9px;height:5px;border-bottom:1.5px solid var(--text-button-fill);border-left:1.5px solid var(--text-button-fill);transform:translateY(-1px) rotate(-45deg)}.tz-checkbox.indeterminate span{width:10px;height:1.5px;background:var(--text-button-fill)}
.resize-handle{position:absolute;top:0;right:-5px;width:10px;height:100%;cursor:col-resize}.filter-popover{position:absolute;z-index:12;top:calc(100% + 4px);right:4px;display:grid;min-width:220px;max-height:280px;padding:var(--padding-spacing-12);overflow:auto;color:var(--text-default);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:0 10px 24px var(--bg-shadow);cursor:default}.filter-popover header{display:flex;align-items:center;justify-content:space-between;gap:var(--padding-spacing-8);margin-bottom:var(--padding-spacing-8);font:500 12px/16px var(--tz-font-family)}.close-filter-popover{display:grid;width:24px;height:24px;padding:0;place-items:center;color:var(--icon-default);border:0;border-radius:var(--radius-xs);background:transparent;cursor:pointer}.close-filter-popover:hover{color:var(--brand-primary);background:var(--brand-bg-hover)}.close-filter-popover:focus-visible{outline:2px solid var(--brand-primary);outline-offset:1px}.filter-popover label{display:flex;align-items:center;gap:var(--padding-spacing-8);padding:var(--padding-spacing-6) 0;font:400 12px/16px var(--tz-font-family)}.filter-status{color:var(--text-muted)}.reset-filter{margin-top:var(--padding-spacing-8);padding:var(--padding-spacing-6) var(--padding-spacing-8);color:var(--brand-primary);border:0;border-radius:var(--radius-sm);background:var(--brand-bg-hover);cursor:pointer}
.tz-table-new__load-error{display:grid;min-height:190px;padding:var(--padding-spacing-32);place-items:center;align-content:center;gap:var(--padding-spacing-6);color:var(--status-error-fg);text-align:center}.tz-table-new__load-error span{color:var(--text-muted);font:400 12px/16px var(--tz-font-family)}.empty{display:grid;min-height:190px;padding:var(--padding-spacing-32);place-items:center;align-content:center;text-align:center}.empty-icon{display:grid;width:44px;height:44px;margin-bottom:var(--padding-spacing-12);place-items:center;color:var(--text-inverse);border-radius:var(--radius-lg);background:var(--blue-400)}.empty strong{font:500 14px/20px var(--tz-font-family)}.empty p{margin:var(--padding-spacing-4) 0 0;color:var(--text-muted);font:400 12px/16px var(--tz-font-family)}
.settings-panel{padding:var(--padding-spacing-16);border:1px solid var(--border-default);border-top:0;background:var(--bg-surface)}.pagination{display:flex;align-items:center;justify-content:space-between;gap:var(--padding-spacing-16);min-height:64px;padding:var(--padding-spacing-12);border:1px solid var(--border-default);border-top:0;border-radius:0 0 var(--radius-md) var(--radius-md);background:var(--bg-surface)}.pagination-info,.pagination-info label,.pagination nav{display:flex;align-items:center;gap:var(--padding-spacing-10,10px)}.pagination-info{font:400 12px/16px var(--tz-font-family)}.page-size{width:76px;min-width:76px;flex:0 0 76px}.pagination nav{gap:5px}.pagination nav button{display:grid;min-width:30px;height:30px;padding:0 var(--padding-spacing-8);place-items:center;color:var(--text-default);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface);font:500 14px/20px var(--tz-font-family);cursor:pointer}.pagination nav button:hover:not(:disabled){color:var(--brand-primary);background:var(--brand-bg-hover)}.pagination nav button.current{color:var(--text-inverse);border-color:var(--brand-primary);background:var(--brand-primary)}.pagination nav button:disabled{opacity:.35;cursor:default}.pagination nav span{min-width:20px;color:var(--text-muted);text-align:center}
@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:700px){.tz-table-new__bar,.pagination{align-items:flex-start;flex-direction:column}.tz-table-new__search{max-width:none}.radius-grid{grid-template-columns:1fr}}
</style>
