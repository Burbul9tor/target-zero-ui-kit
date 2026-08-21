<script setup lang="ts">
import { Check, Columns3, Plus, User } from '@lucide/vue'
import { computed, ref } from 'vue'
import TzTable, {
  type TableColumnFilter,
  type TableFilterFullInfo,
  type TableRow,
  type TzTableColumn,
} from '../data/TzTable.vue'

const departments = ['Экологический контроль', 'Охрана окружающей среды', 'Управление отходами', 'Экологическая экспертиза']
const objects = ['Производственная база № 1', 'Производственная база № 2', 'Главный офис', 'Полевая лаборатория']

const optionLoader = (items: string[]) => async () => items.map((value, index) => ({ id: index + 1, name: value, value }))
const departmentFilter: TableColumnFilter = { filterKey: 'department', type: 'CHECKBOX', getFilters: optionLoader(departments), title: 'Подразделение', searchable: true }
const objectFilter: TableColumnFilter = { filterKey: 'object', type: 'CHECKBOX', getFilters: optionLoader(objects), title: 'Объект' }

const columns = ref<TzTableColumn[]>([
  { key: 'index', label: '№', type: 'index', width: 56, active: true },
  { key: 'name', label: 'ФИО сотрудника', sortable: true, sortFieldName: 'name', active: true },
  { key: 'department', label: 'Подразделение', filter: departmentFilter, active: true },
  { key: 'object', label: 'Объект', filter: objectFilter, active: true },
])

const names = ['Ержан Касымов', 'Айсулу Токтарова', 'Бекзат Нурмагамбетов', 'Диана Мухамедова', 'Мухтар Садыков', 'Жанна Абдрахманова']
const roles = ['Главный эколог', 'Эколог-аналитик', 'Инженер-эколог', 'Эколог по мониторингу', 'Специалист по отходам', 'Эколог-аудитор']
const rows = ref<TableRow[]>(Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `${names[index % names.length]} · ${index + 1}`,
  role: roles[index % roles.length],
  department: departments[index % departments.length],
  object: objects[(index * 3) % objects.length],
})))

const page = ref(0)
const countPerPage = ref(10)
const selectedItems = ref<TableRow[]>([])
const filterFullInfo = ref<TableFilterFullInfo[]>([])
const table = ref<InstanceType<typeof TzTable> | null>(null)
const newColumnTitle = ref('')
const customColumnIndex = ref(0)

const selectedLabel = computed(() => selectedItems.value.length ? `Выбрано: ${selectedItems.value.length}` : 'Строки не выбраны')

function addTestColumn() {
  customColumnIndex.value += 1
  const number = customColumnIndex.value
  const key = `custom-${number}`
  const label = newColumnTitle.value.trim() || `Тестовый заголовок ${number}`
  columns.value.push({ key, label, minWidth: 160, active: true })
  rows.value = rows.value.map((row, index) => ({ ...row, [key]: `Значение ${number}.${index + 1}` }))
  newColumnTitle.value = ''
}

function addRow() {
  const id = Math.max(0, ...rows.value.map(row => Number(row.id) || 0)) + 1
  const customValues = Object.fromEntries(columns.value.filter(column => column.key.startsWith('custom-')).map(column => [column.key, `Значение ${column.key.replace('custom-', '')}.${id}`]))
  rows.value.unshift({ id, name: `Новый сотрудник · ${id}`, role: 'Тестовая запись', department: departments[0], object: objects[0], ...customValues })
  page.value = 0
}
function removeRow(row: TableRow) {
  rows.value = rows.value.filter(item => item.id !== row.id)
  selectedItems.value = selectedItems.value.filter(item => item.id !== row.id)
}

const propsApi = [
  ['data', 'Record<string, unknown>[]', '—', 'Обязательные данные таблицы'],
  ['columns', 'ITableColumn[]', '—', 'Колонки из корпоративного API'],
  ['searchable', 'boolean', 'false', 'Показывает встроенный поиск'],
  ['isServer', 'boolean', 'false', 'Серверная загрузка через getData'],
  ['resizable', 'boolean', 'false', 'Изменение ширины колонок'],
  ['selectedItems', 'Record<string, unknown>[]', '[]', 'v-model выбранных строк'],
  ['showPagination', 'boolean', 'false', 'Пагинация и выбор размера страницы'],
  ['showSettings', 'boolean', 'false', 'Настройки колонок'],
  ['startFiltersValue', 'Record<string, unknown>', '{}', 'Начальные значения фильтров'],
  ['tableBodyStyle', 'StyleValue', "''", 'Стили области строк'],
]
const slotsApi = ['bar-left', 'bar-right', 'before-table', 'no-data', 'no-search-result', 'context-menu', 'column-{key}', 'filter-column-{key}', 'filter-title-{key}', 'table-settings']
const methodsApi = ['resetFilter(key)', 'exposedLoadData(page?, countPerPage?)', 'exposedResetAllFilters()', 'resetSort()', 'scrollToTop()']
</script>

<template>
  <div class="table-docs">
    <header class="page-header">
      <div><p class="eyebrow">COMPONENT · DATA DISPLAY</p><h1>TableNew</h1><p>Стилизация Target Zero поверх технического контракта корпоративного IKod UI Kit v0.2.2.</p></div>
      <span class="ready"><Check :size="14" /> API синхронизирован</span>
    </header>

    <section class="card wide">
      <header><div><h2>Интерактивный пример</h2><p>Поиск, сортировка, фильтры, выбор строк, настройка колонок и пагинация работают в одном сценарии.</p></div></header>
      <TzTable
        ref="table"
        v-model:selected-items="selectedItems"
        :data="rows"
        :columns="columns"
        :page="page"
        :count-per-page="countPerPage"
        :count-per-page-options="[10, 20, 50]"
        :total-count="rows.length"
        :columns-per-view="columns.length"
        searchable
        search-placeholder="Поиск по сотрудникам"
        resizable
        show-bar-always
        show-settings
        show-actions
        show-pagination
        @update:page="page = $event"
        @update:count-per-page="countPerPage = $event; page = 0"
        @update:filter-full-info="filterFullInfo = $event"
        @row-action="removeRow"
      >
        <template #bar-left><span class="bar-status">{{ rows.length }} записей · {{ selectedLabel }}</span></template>
        <template #bar-right><div class="bar-actions"><div class="column-creator"><input v-model="newColumnTitle" type="text" placeholder="Название заголовка" @keydown.enter.prevent="addTestColumn"><button class="secondary-button" type="button" @click="addTestColumn"><Columns3 :size="16" /> Добавить заголовок</button></div><button class="primary-button" type="button" @click="addRow"><Plus :size="16" /> Добавить строку</button></div></template>
        <template #column-name="{ item }"><span class="employee"><i><User :size="18" /></i><span><strong>{{ item.name }}</strong><small>{{ item.role }}</small></span></span></template>
        <template #table-settings><div class="settings-demo"><strong>Настройки таблицы</strong><span>Содержимое передаётся через slot <code>table-settings</code>.</span></div></template>
      </TzTable>
      <div v-if="filterFullInfo.length" class="active-filters"><strong>Активные фильтры:</strong><span v-for="filter in filterFullInfo" :key="filter.key">{{ filter.title }}: {{ Array.isArray(filter.value) ? filter.value.join(', ') : filter.value }}</span><button type="button" @click="table?.exposedResetAllFilters()">Сбросить все</button></div>
    </section>

    <section class="card">
      <header><h2>Props</h2><p>Ключевая часть контракта TableNew. Дополнительные props сохранены в типах компонента.</p></header>
      <div class="api-table"><div class="api-row api-head"><span>Name</span><span>Type</span><span>Default</span><span>Назначение</span></div><div v-for="item in propsApi" :key="item[0]" class="api-row"><code>{{ item[0] }}</code><code>{{ item[1] }}</code><span>{{ item[2] }}</span><span>{{ item[3] }}</span></div></div>
    </section>

    <section class="api-columns">
      <article class="card"><header><h2>Slots</h2><p>Динамические слоты колонок и фильтров совпадают с IKod UI Kit.</p></header><div class="chips"><code v-for="slot in slotsApi" :key="slot">#{{ slot }}</code></div></article>
      <article class="card"><header><h2>Exposed methods</h2><p>Методы доступны через template ref компонента.</p></header><div class="method-list"><code v-for="method in methodsApi" :key="method">{{ method }}</code></div></article>
    </section>

    <section class="card">
      <header><h2>Состояния</h2><p>Отдельные empty и no-search-result slots предусмотрены техническим контрактом.</p></header>
      <TzTable :data="[]" :columns="columns" :columns-per-view="columns.length" disabled-selection show-settings show-pagination />
    </section>
  </div>
</template>

<style scoped>
.table-docs{display:grid;gap:var(--padding-spacing-24)}.page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--padding-spacing-32)}.eyebrow{margin:0 0 var(--padding-spacing-8);color:var(--brand-primary);font:500 10px/14px var(--tz-font-family);letter-spacing:.08em}.page-header h1{margin:0 0 var(--padding-spacing-8);color:var(--text-default);font:700 32px/40px var(--tz-font-family)}.page-header p,.card header p{margin:0;color:var(--text-muted);font:400 14px/20px var(--tz-font-family)}.ready{display:flex;align-items:center;gap:var(--padding-spacing-6);padding:7px 10px;color:var(--status-success-fg);border-radius:var(--radius-md);background:var(--status-success-bg);font:500 11px/16px var(--tz-font-family);white-space:nowrap}
.card{min-width:0;padding:var(--padding-spacing-24);border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-surface);box-shadow:0 10px 15px -3px var(--bg-shadow)}.card>header{margin-bottom:var(--padding-spacing-20)}.card h2{margin:0 0 var(--padding-spacing-4);color:var(--text-default);font:600 18px/24px var(--tz-font-family)}
.bar-status{color:var(--text-muted);font:400 12px/16px var(--tz-font-family);white-space:nowrap}.bar-actions,.column-creator{display:flex;align-items:center;gap:var(--padding-spacing-8)}.column-creator input{width:160px;height:32px;padding:0 var(--padding-spacing-8);color:var(--text-default);border:1px solid var(--border-default);border-radius:var(--radius-sm);outline:0;background:var(--bg-surface);font:400 12px/16px var(--tz-font-family)}.column-creator input:focus{border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--effect-shadow)}.secondary-button{display:inline-flex;height:32px;padding:0 var(--padding-spacing-12);align-items:center;gap:var(--padding-spacing-6);color:var(--brand-primary);border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--brand-bg-hover);font:500 12px/16px var(--tz-font-family);white-space:nowrap;cursor:pointer}.primary-button{display:inline-flex;height:32px;padding:0 var(--padding-spacing-12);align-items:center;gap:var(--padding-spacing-6);color:var(--text-button-fill);border:0;border-radius:var(--radius-sm);background:var(--brand-primary);font:500 12px/16px var(--tz-font-family);cursor:pointer}.primary-button:hover{background:var(--brand-primary-hover)}
.employee{display:flex;min-width:0;align-items:center;gap:var(--padding-spacing-6)}.employee>i{display:grid;flex:0 0 32px;width:32px;height:32px;place-items:center;color:var(--brand-primary);border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--bg-surface)}.employee>span{display:flex;min-width:0;flex-direction:column}.employee strong,.employee small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.employee strong{font:400 14px/20px var(--tz-font-family)}.employee small{color:var(--text-muted);font:400 10px/14px var(--tz-font-family)}
.settings-demo{display:flex;align-items:center;gap:var(--padding-spacing-12)}.settings-demo strong{font:500 12px/16px var(--tz-font-family)}.settings-demo span{color:var(--text-muted);font:400 12px/16px var(--tz-font-family)}code{color:var(--brand-primary);font:400 11px/16px ui-monospace,SFMono-Regular,Consolas,monospace}.active-filters{display:flex;flex-wrap:wrap;align-items:center;gap:var(--padding-spacing-8);margin-top:var(--padding-spacing-12);font:400 11px/16px var(--tz-font-family)}.active-filters span{padding:var(--padding-spacing-4) var(--padding-spacing-8);border-radius:var(--radius-full);background:var(--brand-bg-hover)}.active-filters button{color:var(--brand-primary);border:0;background:transparent;cursor:pointer}
.api-table{overflow:auto;border:1px solid var(--border-default);border-radius:var(--radius-md)}.api-row{display:grid;grid-template-columns:180px 260px 100px minmax(220px,1fr);min-width:820px;min-height:44px;align-items:center;border-bottom:1px solid var(--border-default)}.api-row:last-child{border-bottom:0}.api-row>*{padding:var(--padding-spacing-8) var(--padding-spacing-12)}.api-row span{color:var(--text-muted);font:400 12px/16px var(--tz-font-family)}.api-head{background:var(--bg-row-hover)}.api-head span{color:var(--text-default);font-weight:500}.api-columns{display:grid;grid-template-columns:1fr 1fr;gap:var(--padding-spacing-24)}.chips{display:flex;flex-wrap:wrap;gap:var(--padding-spacing-8)}.chips code,.method-list code{padding:var(--padding-spacing-6) var(--padding-spacing-8);border-radius:var(--radius-sm);background:var(--brand-bg-hover)}.method-list{display:grid;gap:var(--padding-spacing-8)}
@media(max-width:800px){.page-header{flex-direction:column}.api-columns{grid-template-columns:1fr}.card{padding:var(--padding-spacing-16)}}
</style>
