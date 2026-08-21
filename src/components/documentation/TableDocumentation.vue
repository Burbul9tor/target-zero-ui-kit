<script setup lang="ts">
import { Check, Plus, User } from '@lucide/vue'
import { computed, ref } from 'vue'
import TzTable, { type TableRow, type TzTableColumn } from '../data/TzTable.vue'

const columns: TzTableColumn[] = [
  { key: 'name', title: 'ФИО сотрудника', filterable: true },
  { key: 'department', title: 'Подразделение', filterable: true },
  { key: 'object', title: 'Объект', filterable: true },
]

const seedRows: TableRow[] = [
  { id: 1, name: 'Ержан Касымов', role: 'Главный эколог', department: 'Отдел экологического контроля', object: 'Производственная база № 2' },
  { id: 2, name: 'Айсулу Токтарова', role: 'Эколог-аналитик', department: 'Отдел экологического контроля', object: 'Офис главного здания' },
  { id: 3, name: 'Бекзат Нурмагамбетов', role: 'Инженер-эколог', department: 'Отдел охраны окружающей среды', object: 'Производственная база № 1' },
  { id: 4, name: 'Диана Мухамедова', role: 'Эколог по мониторингу', department: 'Отдел экологического мониторинга', object: 'Полевая лаборатория' },
  { id: 5, name: 'Мухтар Садыков', role: 'Специалист по отходам', department: 'Отдел управления отходами', object: 'Производственная база № 3' },
  { id: 6, name: 'Жанна Абдрахманова', role: 'Эколог-аудитор', department: 'Отдел экологической экспертизы', object: 'Главный офис' },
]

const rows = ref<TableRow[]>(Array.from({ length: 100 }, (_, index) => {
  const source = seedRows[index % seedRows.length]
  const id = index + 1
  return {
    ...source,
    id,
    name: id <= seedRows.length ? source.name : `${source.name} · ${id}`,
  }
}))

const page = ref(0)
const countPerPage = ref(10)
const activeFilters = ref<Record<string, number>>({})
const visibleRows = computed(() => {
  const start = page.value * countPerPage.value
  return rows.value.slice(start, start + countPerPage.value)
})

function updateCountPerPage(value: number) {
  countPerPage.value = value
  page.value = 0
}

function toggleFilter(key: string) {
  const next = { ...activeFilters.value }
  if (next[key]) delete next[key]
  else next[key] = 1
  activeFilters.value = next
}

function removeRow(row: TableRow) {
  rows.value = rows.value.filter(item => item.id !== row.id)
  const lastPage = Math.max(0, Math.ceil(rows.value.length / countPerPage.value) - 1)
  page.value = Math.min(page.value, lastPage)
}

function addTestRow() {
  const id = rows.value.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
  rows.value.unshift({
    id,
    name: `Тестовый сотрудник · ${id}`,
    role: 'Новая тестовая запись',
    department: 'Тестовое подразделение',
    object: 'Тестовый объект',
  })
  page.value = 0
}

const tokens = [
  ['Header background', 'bg/page', '#F8F9F9'],
  ['Surface', 'bg/surface', '#FFFFFF'],
  ['Border', 'border/default', '#E4E7E6'],
  ['Text', 'text/default', '#161616'],
  ['Secondary text', 'text/muted', '#717A7A'],
  ['Controls', 'brand/primary', '#407C65'],
  ['Danger action', 'status/error-fg', '#B91C1C'],
  ['Radius', 'radius/md', '8px'],
]
</script>

<template>
  <div class="table-docs">
    <header class="table-docs__header">
      <div><p class="table-docs__eyebrow">COMPONENT · DATA DISPLAY</p><h1>Table</h1><p>Таблица сотрудников по обновлённому макету Target ZERO, Figma node 1961:47801.</p></div>
      <span><Check :size="14" /> Обновлено</span>
    </header>

    <section class="table-card table-card--wide">
      <header class="interactive-header">
        <div><h2>Интерактивный пример</h2><p>100 тестовых записей: переключайте страницы и количество строк, добавляйте и удаляйте элементы.</p></div>
        <div class="example-actions"><span>{{ rows.length }} записей</span><button type="button" @click="addTestRow"><Plus :size="16" /> Добавить запись</button></div>
      </header>
      <TzTable
        :data="visibleRows"
        :columns="columns"
        :page="page"
        :count-per-page="countPerPage"
        :count-per-page-options="[10, 20, 50]"
        :total-count="rows.length"
        :active-filters="activeFilters"
        disabled-selection
        disabled-row-click
        show-actions
        show-settings
        show-pagination
        @filter="toggleFilter($event.key)"
        @clear-filter="toggleFilter"
        @row-action="removeRow"
        @update:page="page = $event"
        @update:count-per-page="updateCountPerPage"
      >
        <template #column-name="{ item }">
          <span class="employee">
            <i><User :size="19" :stroke-width="1.5" /></i>
            <span><strong>{{ item.name }}</strong><small>{{ item.role }}</small></span>
          </span>
        </template>
      </TzTable>
    </section>

    <section class="table-card table-card--wide">
      <header><h2>Empty</h2><p>Состояние без данных использует ту же шапку, служебную колонку и пагинацию.</p></header>
      <TzTable :data="[]" :columns="columns" disabled-selection show-settings show-pagination :count-per-page="10" />
    </section>

    <section class="table-card">
      <header><h2>Поведение и интерфейс</h2><p>Контракт TableNew сохранён, визуальная структура обновлена.</p></header>
      <div class="requirements">
        <article><strong>Колонки</strong><p>Три равные колонки растягиваются на доступную ширину. Служебная колонка имеет минимальную ширину 36px, иконка центрируется внутри ячейки.</p></article>
        <article><strong>Сотрудник</strong><p>Avatar 32×32px, основная строка 14/20 Regular, должность 10px и токен <code>text/muted</code>.</p></article>
        <article><strong>Фильтры</strong><p>Иконка 16px расположена справа в заголовке. Активный фильтр показывает состояние и кнопку сброса.</p></article>
        <article><strong>Пагинация</strong><p>Высота 64px. Отображаются диапазон, page size и кнопки первой, предыдущей, следующей и последней страниц.</p></article>
      </div>
    </section>

    <section class="table-card">
      <header><h2>Стили и токены</h2><p>Семантические значения из обновлённого макета.</p></header>
      <div class="tokens"><article v-for="token in tokens" :key="token[0]"><strong>{{ token[0] }}</strong><code>{{ token[1] }}</code><span>{{ token[2] }}</span></article></div>
      <div class="specs"><span>Header <strong>38px</strong></span><span>Cell padding <strong>12px 8px</strong></span><span>Body type <strong>14/20 Regular</strong></span><span>Avatar <strong>32px</strong></span><span>Action column min <strong>36px</strong></span><span>Pagination <strong>64px</strong></span></div>
    </section>
  </div>
</template>

<style scoped>
.table-docs { display: grid; gap: 24px; }
.table-docs__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; }
.table-docs__eyebrow { margin: 0 0 8px; color: var(--brand-primary); font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.table-docs__header h1 { margin: 0 0 8px; color: var(--text-default); font: 700 32px/40px var(--tz-font-family); }
.table-docs__header p, .table-card header p { margin: 0; color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.table-docs__header > span { display: flex; align-items: center; gap: 6px; padding: 7px 10px; color: var(--status-success-fg); border-radius: 8px; background: var(--status-success-bg); font: 500 11px/16px var(--tz-font-family); white-space: nowrap; }
.table-card { min-width: 0; padding: 24px; border: 1px solid var(--showcase-border); border-radius: 12px; background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.table-card > header { margin-bottom: 20px; }
.interactive-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.example-actions { display: flex; align-items: center; gap: 10px; }
.example-actions > span { color: var(--text-muted); font: 400 12px/16px var(--tz-font-family); white-space: nowrap; }
.example-actions button { display: inline-flex; min-height: 36px; padding: 8px 12px; align-items: center; gap: 6px; color: var(--text-button-fill); border: 0; border-radius: 6px; background: var(--brand-primary); font: 500 12px/16px var(--tz-font-family); white-space: nowrap; cursor: pointer; }
.example-actions button:hover { background: var(--brand-primary-hover); }
.table-card h2 { margin: 0 0 4px; color: var(--text-default); font: 600 18px/24px var(--tz-font-family); }
.employee { display: flex; min-width: 0; align-items: center; gap: 4px; }
.employee > i { display: grid; flex: 0 0 32px; width: 32px; height: 32px; place-items: center; color: var(--brand-primary); border: .8px solid var(--border-default); border-radius: 6.4px; background: var(--bg-surface); font-style: normal; }
.employee > span { display: flex; min-width: 0; flex-direction: column; }
.employee strong, .employee small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.employee strong { color: var(--text-default); font: 400 14px/20px var(--tz-font-family); }
.employee small { color: var(--text-muted); font: 400 10px/normal var(--tz-font-family); }
.requirements { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.requirements article, .tokens article { padding: 16px; border: 1px solid var(--showcase-border); border-radius: 8px; background: var(--showcase-canvas); }
.requirements strong, .tokens strong { color: var(--text-default); font: 500 12px/16px var(--tz-font-family); }
.requirements p { margin: 6px 0 0; color: var(--text-muted); font: 400 12px/18px var(--tz-font-family); }
code { color: var(--brand-primary); font: 400 11px/16px ui-monospace, SFMono-Regular, Consolas, monospace; }
.tokens { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.tokens article { display: flex; flex-direction: column; gap: 3px; padding: 12px; }
.tokens span { color: var(--text-muted); font: 400 10px/14px var(--tz-font-family); }
.specs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.specs span { padding: 6px 8px; color: var(--text-muted); border-radius: 6px; background: var(--showcase-canvas); font: 400 11px/16px var(--tz-font-family); }
.specs strong { color: var(--text-default); font-weight: 500; }
@media (max-width: 900px) { .requirements, .tokens { grid-template-columns: 1fr 1fr; } }
@media (max-width: 620px) { .table-docs__header, .interactive-header { align-items: flex-start; flex-direction: column; } .table-card { padding: 16px; } .requirements, .tokens { grid-template-columns: 1fr; } }
</style>