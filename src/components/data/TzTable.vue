<script setup lang="ts">
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
  Filter,
  Settings,
  Trash2,
  X,
} from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import TzSelect, { type SelectValue } from '../forms/TzSelect.vue'

export type TableRow = Record<string, unknown>
export type TableSortOrder = 'ASC' | 'DESC' | null

export interface TzTableColumn {
  key: string
  title: string
  width?: string
  minWidth?: string
  sortable?: boolean
  filterable?: boolean
  align?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<{
  data: TableRow[]
  columns: TzTableColumn[]
  rowKey?: string
  selectedItems?: TableRow[]
  disabledSelection?: boolean
  disabledRowClick?: boolean
  showHeader?: boolean
  showSettings?: boolean
  showPagination?: boolean
  showActions?: boolean
  stripped?: boolean
  page?: number
  countPerPage?: number
  totalCount?: number
  countPerPageOptions?: number[]
  startSortKey?: string
  startSortOrder?: TableSortOrder
  activeFilters?: Record<string, number>
  emptyTitle?: string
  emptyDescription?: string
}>(), {
  rowKey: 'id',
  selectedItems: () => [],
  disabledSelection: false,
  disabledRowClick: false,
  showHeader: true,
  showSettings: false,
  showPagination: false,
  showActions: false,
  stripped: false,
  page: 0,
  countPerPage: 20,
  totalCount: 0,
  countPerPageOptions: () => [10, 20, 50],
  startSortKey: '',
  startSortOrder: null,
  activeFilters: () => ({}),
  emptyTitle: 'Нет данных',
  emptyDescription: 'Здесь пока нет записей для отображения',
})

const emit = defineEmits<{
  'update:selectedItems': [items: TableRow[]]
  'update:page': [page: number]
  'update:countPerPage': [count: number]
  'row-click': [row: TableRow]
  'row-double-click': [row: TableRow]
  sort: [payload: { key: string; order: TableSortOrder }]
  filter: [payload: { key: string }]
  'clear-filter': [key: string]
  settings: []
  'row-action': [row: TableRow]
}>()

const sortKey = ref(props.startSortKey)
const sortOrder = ref<TableSortOrder>(props.startSortOrder)

watch(() => props.startSortKey, value => { sortKey.value = value })
watch(() => props.startSortOrder, value => { sortOrder.value = value })

const rowId = (row: TableRow) => row[props.rowKey] as string | number
const selectedIds = computed(() => new Set(props.selectedItems.map(rowId)))
const allSelected = computed(() => props.data.length > 0 && props.data.every(row => selectedIds.value.has(rowId(row))))
const someSelected = computed(() => !allSelected.value && props.data.some(row => selectedIds.value.has(rowId(row))))
const total = computed(() => props.totalCount || props.data.length)
const pagesCount = computed(() => Math.max(1, Math.ceil(total.value / props.countPerPage)))
const rangeStart = computed(() => total.value ? props.page * props.countPerPage + 1 : 0)
const rangeEnd = computed(() => Math.min((props.page + 1) * props.countPerPage, total.value))
const countPerPageSelectOptions = computed(() => props.countPerPageOptions.map(option => ({ label: String(option), value: String(option) })))
const visiblePages = computed<Array<number | 'ellipsis'>>(() => {
  const count = pagesCount.value
  const current = props.page + 1
  if (count <= 5) return Array.from({ length: count }, (_, index) => index + 1)
  if (current <= 3) return [1, 2, 3, 'ellipsis', count]
  if (current >= count - 2) return [1, 'ellipsis', count - 2, count - 1, count]
  return [1, 'ellipsis', current, 'ellipsis', count]
})

function toggleAll() {
  emit('update:selectedItems', allSelected.value ? [] : [...props.data])
}

function toggleRow(row: TableRow) {
  const id = rowId(row)
  const next = selectedIds.value.has(id)
    ? props.selectedItems.filter(item => rowId(item) !== id)
    : [...props.selectedItems, row]
  emit('update:selectedItems', next)
}

function toggleSort(column: TzTableColumn) {
  if (!column.sortable) return
  if (sortKey.value !== column.key) {
    sortKey.value = column.key
    sortOrder.value = 'ASC'
  } else if (sortOrder.value === 'ASC') {
    sortOrder.value = 'DESC'
  } else if (sortOrder.value === 'DESC') {
    sortKey.value = ''
    sortOrder.value = null
  } else {
    sortOrder.value = 'ASC'
  }
  emit('sort', { key: sortKey.value, order: sortOrder.value })
}

function updateCountPerPage(value: SelectValue) {
  if (typeof value === 'string') emit('update:countPerPage', Number(value))
}

function changePage(nextPage: number) {
  if (nextPage >= 0 && nextPage < pagesCount.value && nextPage !== props.page) emit('update:page', nextPage)
}
</script>

<template>
  <div class="tz-table-component">
    <div class="tz-table-scroll">
      <table class="tz-table" :class="{ 'tz-table--stripped': stripped }">
        <colgroup>
          <col v-if="!disabledSelection" class="tz-table__selection-col">
          <col v-for="column in columns" :key="column.key" :style="{ width: column.width, minWidth: column.minWidth }">
          <col v-if="showActions || showSettings" class="tz-table__control-col">
        </colgroup>
        <thead v-if="showHeader">
          <tr>
            <th v-if="!disabledSelection" class="tz-table__selection-cell">
              <button
                type="button"
                class="tz-checkbox"
                :class="{ 'is-checked': allSelected, 'is-indeterminate': someSelected }"
                :aria-label="allSelected ? 'Снять выделение со всех строк' : 'Выбрать все строки'"
                :aria-pressed="allSelected"
                @click="toggleAll"
              ><span /></button>
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[`is-${column.align ?? 'left'}`, { 'is-filterable': column.filterable }]"
              :tabindex="column.filterable ? 0 : undefined"
              @click="column.filterable && emit('filter', { key: column.key })"
              @keydown.enter.prevent="column.filterable && emit('filter', { key: column.key })"
              @keydown.space.prevent="column.filterable && emit('filter', { key: column.key })"
            >
              <div class="tz-table__heading">
                <span>{{ column.title }}</span>
                <button
                  v-if="column.sortable"
                  type="button"
                  class="tz-table__icon-button"
                  :class="{ 'is-active': sortKey === column.key && sortOrder }"
                  :aria-label="`Сортировать: ${column.title}`"
                  @click.stop="toggleSort(column)"
                >
                  <ArrowUp v-if="sortKey === column.key && sortOrder === 'ASC'" :size="16" />
                  <ArrowDown v-else-if="sortKey === column.key && sortOrder === 'DESC'" :size="16" />
                  <ArrowUpDown v-else :size="16" />
                </button>
                <span v-if="column.filterable" class="tz-table__filter-wrap">
                  <button
                    type="button"
                    class="tz-table__icon-button"
                    :class="{ 'is-active': activeFilters[column.key] }"
                    :aria-label="`Фильтр: ${column.title}`"
                    @click.stop="emit('filter', { key: column.key })"
                  ><Filter :size="16" /><b v-if="activeFilters[column.key]">{{ activeFilters[column.key] }}</b></button>
                  <button
                    v-if="activeFilters[column.key]"
                    type="button"
                    class="tz-table__clear-filter"
                    :aria-label="`Сбросить фильтр: ${column.title}`"
                    @click.stop="emit('clear-filter', column.key)"
                  ><X :size="16" /></button>
                </span>
              </div>
            </th>
            <th v-if="showActions || showSettings" class="tz-table__settings-cell">
              <button v-if="showSettings" type="button" class="tz-table__icon-button" aria-label="Настроить колонки" @click="emit('settings')"><Settings :size="20" /></button>
            </th>
          </tr>
        </thead>
        <tbody v-if="data.length">
          <tr
            v-for="(row, index) in data"
            :key="String(rowId(row) ?? index)"
            :class="{ 'is-selected': selectedIds.has(rowId(row)), 'is-clickable': !disabledRowClick }"
            @click="!disabledRowClick && emit('row-click', row)"
            @dblclick="emit('row-double-click', row)"
          >
            <td v-if="!disabledSelection" class="tz-table__selection-cell" @click.stop>
              <button
                type="button"
                class="tz-checkbox"
                :class="{ 'is-checked': selectedIds.has(rowId(row)) }"
                :aria-label="selectedIds.has(rowId(row)) ? 'Снять выделение со строки' : 'Выбрать строку'"
                :aria-pressed="selectedIds.has(rowId(row))"
                @click="toggleRow(row)"
              ><span /></button>
            </td>
            <td v-for="column in columns" :key="column.key" :class="`is-${column.align ?? 'left'}`">
              <slot :name="`column-${column.key}`" :item="row" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </td>
            <td v-if="showActions || showSettings" class="tz-table__action-cell" @click.stop>
              <slot name="context-menu" :item="row">
                <button v-if="showActions" type="button" class="tz-table__row-action" aria-label="Удалить строку" @click="emit('row-action', row)"><Trash2 :size="16" /></button>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!data.length" class="tz-table__empty">
        <slot name="no-data">
          <span class="tz-table__empty-icon"><Inbox :size="24" :stroke-width="1.5" /></span>
          <strong>{{ emptyTitle }}</strong>
          <p>{{ emptyDescription }}</p>
        </slot>
      </div>
    </div>

    <div v-if="showPagination" class="tz-table__pagination" aria-label="Пагинация таблицы">
      <div class="tz-table__pagination-info">
        <span>Показано {{ rangeStart }}-{{ rangeEnd }} из {{ total }}</span>
        <label>
          <span>Показать</span>
          <TzSelect
            class="tz-table__page-size"
            :model-value="String(countPerPage)"
            :options="countPerPageSelectOptions"
            size="medium"
            :show-label="false"
            :show-leading-icon="false"
            :required="false"
            @update:model-value="updateCountPerPage"
          />
          <span>записей</span>
        </label>
      </div>
      <nav aria-label="Страницы">
        <button type="button" :disabled="page === 0" aria-label="Первая страница" @click="changePage(0)"><ChevronsLeft :size="12" /></button>
        <button type="button" :disabled="page === 0" aria-label="Предыдущая страница" @click="changePage(page - 1)"><ChevronLeft :size="16" /></button>
        <template v-for="(item, index) in visiblePages" :key="`${item}-${index}`">
          <span v-if="item === 'ellipsis'">…</span>
          <button v-else type="button" :class="{ 'is-current': item === page + 1 }" @click="changePage(item - 1)">{{ item }}</button>
        </template>
        <button type="button" :disabled="page >= pagesCount - 1" aria-label="Следующая страница" @click="changePage(page + 1)"><ChevronRight :size="16" /></button>
        <button type="button" :disabled="page >= pagesCount - 1" aria-label="Последняя страница" @click="changePage(pagesCount - 1)"><ChevronsRight :size="12" /></button>
      </nav>
    </div>  </div>
</template>

<style scoped>
.tz-table-component { width: 100%; color: var(--text-default); font-family: var(--tz-font-family); }
.tz-table-scroll { overflow-x: auto; border: 1px solid var(--border-default); border-radius: 8px 8px 0 0; background: var(--bg-surface); }
.tz-table { width: 100%; min-width: 760px; border-spacing: 0; border-collapse: separate; table-layout: fixed; }
.tz-table__selection-col { width: 36px; }
.tz-table__control-col { width: 36px; min-width: 36px; }
.tz-table th, .tz-table td { box-sizing: border-box; border-right: 1px solid var(--border-default); border-bottom: 1px solid var(--border-default); text-align: left; }
.tz-table tr > :last-child { border-right: 0; }
.tz-table tbody tr:last-child > td { border-bottom: 0; }
.tz-table th { height: 36px; padding: 8px; color: var(--brand-primary); background: var(--bg-row-hover); font: 400 12px/16px var(--tz-font-family); transition: background-color 140ms ease; }
.tz-table thead th:hover { background: var(--brand-bg-hover); }
.tz-table thead th.is-filterable { cursor: pointer; }
.tz-table thead th.is-filterable:focus-visible { outline: 2px solid var(--brand-primary); outline-offset: -2px; }
.tz-table td { height: 56px; padding: 12px 8px; color: var(--text-default); background: var(--bg-surface); font: 400 14px/20px var(--tz-font-family); vertical-align: middle; }
.tz-table--stripped tbody tr:nth-child(even) td { background: var(--bg-row-hover); }
.tz-table tbody tr:hover td, .tz-table tbody tr.is-selected td { background: var(--brand-bg-hover); }
.tz-table tbody tr.is-clickable { cursor: pointer; }
.tz-table .is-center { text-align: center; }
.tz-table .is-right { text-align: right; }
.tz-table__heading { display: flex; align-items: center; gap: 4px; min-width: 0; }
.tz-table__heading > span:first-child { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tz-table__icon-button, .tz-table__clear-filter, .tz-table__row-action { display: inline-grid; flex: 0 0 auto; width: 20px; height: 20px; padding: 2px; place-items: center; color: var(--icon-default); border: 0; border-radius: 4px; background: transparent; cursor: pointer; }
.tz-table__icon-button:hover, .tz-table__row-action:hover { color: var(--brand-primary); background: var(--brand-bg-hover); }
.tz-table__icon-button:active, .tz-table__icon-button.is-active { color: var(--brand-primary); background: var(--brand-bg-active); }
.tz-table__filter-wrap { display: inline-flex; align-items: center; gap: 2px; }
.tz-table__icon-button b { position: absolute; margin: -12px 0 0 15px; min-width: 12px; height: 12px; padding: 0 2px; color: var(--text-inverse); border-radius: 6px; background: var(--brand-primary); font: 500 8px/12px var(--tz-font-family); }
.tz-table__clear-filter:hover { color: var(--status-error-fg); background: var(--status-error-bg); }
.tz-table__selection-cell { padding: 8px 4px !important; text-align: center !important; }
.tz-table__settings-cell, .tz-table__action-cell { width: 36px; min-width: 36px; padding: 0 !important; text-align: center !important; }
.tz-table__settings-cell .tz-table__icon-button { display: grid; margin-inline: auto; color: var(--brand-primary); }
.tz-table__action-cell .tz-table__row-action { display: grid; margin-inline: auto; }
.tz-table__row-action { color: var(--status-error-fg); }
.tz-table__row-action:hover { color: var(--status-error-fg); background: var(--status-error-bg); }
.tz-checkbox { position: relative; display: grid; width: 20px; height: 20px; padding: 0; place-items: center; border: 1px solid var(--border-default); border-radius: 4px; background: var(--bg-surface); cursor: pointer; }
.tz-checkbox:hover { border-color: var(--brand-primary); }
.tz-checkbox.is-checked, .tz-checkbox.is-indeterminate { border-color: var(--brand-primary); background: var(--brand-primary); }
.tz-checkbox.is-checked span { width: 9px; height: 5px; border-bottom: 1.5px solid var(--text-button-fill); border-left: 1.5px solid var(--text-button-fill); transform: translateY(-1px) rotate(-45deg); }
.tz-checkbox.is-indeterminate span { width: 10px; height: 1.5px; background: var(--bg-surface); }
.tz-table__empty { display: grid; min-height: 190px; padding: 32px; place-items: center; align-content: center; text-align: center; }
.tz-table__empty-icon { display: grid; width: 44px; height: 44px; margin-bottom: 12px; place-items: center; color: var(--brand-primary); border-radius: 12px; background: var(--blue-400); }
.tz-table__empty strong { color: var(--text-default); font: 500 14px/20px var(--tz-font-family); }
.tz-table__empty p { margin: 4px 0 0; color: var(--text-muted); font: 400 12px/16px var(--tz-font-family); }
.tz-table__pagination { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 64px; padding: 12px; border: 1px solid var(--border-default); border-top: 0; border-radius: 0 0 8px 8px; background: var(--bg-surface); }
.tz-table__pagination-info, .tz-table__pagination label, .tz-table__pagination nav { display: flex; align-items: center; gap: 10px; }
.tz-table__pagination-info, .tz-table__pagination label { color: var(--text-default); font: 400 12px/16px var(--tz-font-family); }
.tz-table__page-size { width: 60px; flex: 0 0 60px; }
.tz-table__pagination nav { gap: 5px; }
.tz-table__pagination nav button { display: grid; min-width: 30px; height: 30px; padding: 0 8px; place-items: center; color: var(--text-muted); border: 1px solid var(--border-default); border-radius: 8px; background: var(--bg-surface); font: 500 14px/20px var(--tz-font-family); cursor: pointer; }
.tz-table__pagination nav button:hover:not(:disabled) { color: var(--brand-primary); background: var(--brand-bg-hover); }
.tz-table__pagination nav button.is-current { color: var(--text-inverse); border-color: var(--brand-primary); background: var(--brand-primary); }
.tz-table__pagination nav button:disabled { opacity: .35; cursor: default; }
.tz-table__pagination nav span { min-width: 20px; color: var(--text-muted); text-align: center; }
@media (max-width: 620px) { .tz-table__pagination { align-items: flex-start; flex-direction: column; } }
</style>
