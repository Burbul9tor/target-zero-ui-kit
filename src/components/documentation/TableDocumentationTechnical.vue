<script setup lang="ts">
import { Building2, Check, ChevronRight, Columns3, Plus, User, Users, X } from '@lucide/vue'
import { computed, ref } from 'vue'
import TzTable, {
  type TableColumnFilter,
  type TableLoadParams,
  type TableRow,
  type TzTableColumn,
} from '../data/TzTable.vue'
import TzTableFilterPanel from '../data/TzTableFilterPanel.vue'
import TzTreeFilterModal from '../data/TzTreeFilterModal.vue'

const departments = ['Экологический контроль', 'Охрана окружающей среды', 'Управление отходами', 'Экологическая экспертиза']
const objectTree = [
  { id: 'kostanay', name: 'Карьер Костанай', value: 'Карьер Костанай', children: [
    { id: 'kostanay-north', name: 'Карьер Северный', value: 'Карьер Северный' },
    { id: 'kostanay-crushing', name: 'Дробильный комплекс', value: 'Дробильный комплекс' },
  ] },
  { id: 'pavlodar-service', name: 'Нефтесервисная компания (Павлодар)', value: 'Нефтесервисная компания (Павлодар)', children: [
    { id: 'pavlodar-base', name: 'Павлодарская база', value: 'Павлодарская база' },
    { id: 'pavlodar-warehouse', name: 'Центральный склад', value: 'Центральный склад' },
  ] },
  { id: 'almaty-station', name: 'Станция Алматы-1', value: 'Станция Алматы-1', children: [
    { id: 'almaty-lab', name: 'Полевая лаборатория', value: 'Полевая лаборатория' },
  ] },
  { id: 'target-office', name: 'Офис Target Zero', value: 'Офис Target Zero', children: [
    { id: 'main-office', name: 'Главный офис', value: 'Главный офис' },
    { id: 'office-base-1', name: 'Производственная база № 1', value: 'Производственная база № 1' },
    { id: 'office-base-2', name: 'Производственная база № 2', value: 'Производственная база № 2' },
  ] },
  { id: 'new-root', name: 'Новый корневой объект дев 1', value: 'Новый корневой объект дев 1' },
  { id: 'atyrau', name: 'НГДУ Атырау', value: 'НГДУ Атырау', children: [
    { id: 'atyrau-field', name: 'Промысловая площадка', value: 'Промысловая площадка' },
  ] },
  { id: 'semey', name: 'Завод Семей', value: 'Завод Семей' },
  { id: 'pavlodar', name: 'Завод Павлодар', value: 'Завод Павлодар' },
  { id: 'ktl', name: 'Завод КТЛ', value: 'Завод КТЛ' },
  { id: 'astana', name: 'Завод Астана', value: 'Завод Астана' },
  { id: 'aktau', name: 'Завод Актау', value: 'Завод Актау', children: [
    { id: 'aktau-unset', name: 'Не задано', value: 'Не задано', children: [
      { id: 'aktau-production', name: 'Производственный участок', value: 'Производственный участок' },
    ] },
    { id: 'aktau-test', name: 'Test', value: 'Test', children: [
      { id: 'aktau-test-21', name: 'Test21', value: 'Test21' },
    ] },
  ] },
]
const objects = ['Карьер Северный', 'Павлодарская база', 'Станция Алматы-1', 'Полевая лаборатория', 'Главный офис', 'Производственная база № 1', 'Производственная база № 2', 'Промысловая площадка', 'Завод Семей', 'Завод Павлодар', 'Завод КТЛ', 'Завод Астана', 'Производственный участок', 'Test21']

const optionLoader = (items: string[]) => async () => items.map((value, index) => ({ id: index + 1, name: value, value }))
const departmentFilter: TableColumnFilter = { filterKey: 'department', type: 'CHECKBOX', getFilters: optionLoader(departments), title: 'Подразделение', searchable: true }
const objectFilter: TableColumnFilter = { filterKey: 'object', type: 'CHECKBOX_SELECT', getFilters: async () => objectTree, title: 'Объект', searchable: true }

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

const filterPanelOpen = ref(true)
const filterPanelPage = ref(0)
const departmentPopoverOpen = ref(false)
const objectModalOpen = ref(false)
const draftDepartments = ref<string[]>([])
const draftObjects = ref<string[]>([])
const appliedDepartments = ref<string[]>([])
const appliedObjects = ref<string[]>([])
const panelColumns = computed<TzTableColumn[]>(() => columns.value.slice(0, 4).map(column => ({ ...column, filter: undefined, filterable: false })))
const panelActiveCount = computed(() => appliedDepartments.value.length + appliedObjects.value.length)
const panelDirty = computed(() => {
  const normalize = (value: string[]) => [...value].sort().join('|')
  return normalize(draftDepartments.value) !== normalize(appliedDepartments.value)
    || normalize(draftObjects.value) !== normalize(appliedObjects.value)
})
const panelRows = computed(() => rows.value.filter(row => {
  const departmentMatches = !appliedDepartments.value.length || appliedDepartments.value.includes(String(row.department))
  const objectMatches = !appliedObjects.value.length || appliedObjects.value.includes(String(row.object))
  return departmentMatches && objectMatches
}))
function toggleDraftDepartment(value: string) {
  draftDepartments.value = draftDepartments.value.includes(value)
    ? draftDepartments.value.filter(item => item !== value)
    : [...draftDepartments.value, value]
}
function applyDraftObjects(values: string[]) {
  draftObjects.value = [...values]
  objectModalOpen.value = false
}
function applyFilterPanel() {
  appliedDepartments.value = [...draftDepartments.value]
  appliedObjects.value = [...draftObjects.value]
  filterPanelPage.value = 0
  filterPanelOpen.value = false
  departmentPopoverOpen.value = false
  objectModalOpen.value = false
}
function resetFilterPanel() {
  draftDepartments.value = []
  draftObjects.value = []
  appliedDepartments.value = []
  appliedObjects.value = []
  filterPanelPage.value = 0
}

type TechnicalVariant = 'default' | 'stripped' | 'fixed' | 'resizable' | 'utility' | 'client-pagination' | 'server-data' | 'server-search' | 'server-pagination' | 'server-sort' | 'server-filter' | 'methods'
const technicalVariants: Array<{ key: TechnicalVariant; label: string }> = [
  ['default','Default'], ['stripped','Stripped'], ['fixed','Fixed columns'], ['resizable','Resizable'],
  ['utility','Utility columns'], ['client-pagination','Client pagination'], ['server-data','Server data'],
  ['server-search','Server searchable'], ['server-pagination','Server pagination'], ['server-sort','Server sortable'],
  ['server-filter','Server filterable'], ['methods','Exposed methods'],
].map(([key, label]) => ({ key: key as TechnicalVariant, label }))
const technicalVariant = ref<TechnicalVariant>('default')
const technicalPage = ref(0)
const technicalCount = ref(5)
const technicalTotal = ref(rows.value.length)
const technicalSelected = ref<TableRow[]>([])
const technicalTable = ref<InstanceType<typeof TzTable> | null>(null)
const methodStatus = ref('Методы готовы к проверке')
const isServerTechnical = computed(() => ['server-data','server-search','server-pagination','server-sort','server-filter'].includes(technicalVariant.value))
const technicalColumns = computed<TzTableColumn[]>(() => {
  const result: TzTableColumn[] = columns.value.slice(0, 4).map(column => ({ ...column, filter: undefined, filterable: false }))
  if (technicalVariant.value === 'fixed') result[1] = { ...result[1], fixed: 'left' }
  if (technicalVariant.value === 'server-filter') {
    result[2] = { ...result[2], filter: departmentFilter, filterable: true }
    result[3] = { ...result[3], filter: objectFilter, filterable: true }
  }
  return technicalVariant.value === 'utility'
    ? [{ key: 'selection', type: 'selection', width: 36 }, ...result, { key: 'settings', type: 'settings', width: 36 }]
    : result
})
const technicalDescription = computed(() => ({
  default: 'Базовая таблица с Target Zero стилизацией.',
  stripped: 'Чередование фона строк.',
  fixed: 'Контентная колонка закрепляется при горизонтальном скролле.',
  resizable: 'Ширина колонок меняется перетаскиванием границы.',
  utility: 'Выбор строк, настройки и контекстные действия.',
  'client-pagination': 'Локальная пагинация без запроса к серверу.',
  'server-data': 'Загрузка данных через getData.',
  'server-search': 'Серверный поиск через substring.',
  'server-pagination': 'Серверная пагинация с page и size.',
  'server-sort': 'Серверная сортировка с массивом sort.',
  'server-filter': 'Серверные фильтры и filter-full-info.',
  methods: 'Публичные методы через template ref.',
}[technicalVariant.value]))
async function technicalServerLoader(params: TableLoadParams = {} as TableLoadParams) {
  await new Promise(resolve => setTimeout(resolve, 220))
  if (params.signal?.aborted) return []
  let result = [...rows.value]
  const query = (params.substring ?? params.search ?? '').trim().toLocaleLowerCase()
  if (query) result = result.filter(row => Object.values(row).some(value => String(value).toLocaleLowerCase().includes(query)))
  for (const [key, raw] of Object.entries(params.filters ?? {})) {
    const accepted = (Array.isArray(raw) ? raw : [raw]).map(String)
    if (accepted.length) result = result.filter(row => accepted.includes(String(row[key] ?? '')))
  }
  if (params.sortKey && params.sortOrder) {
    const direction = params.sortOrder === 'ASC' ? 1 : -1
    result.sort((a, b) => String(a[params.sortKey] ?? '').localeCompare(String(b[params.sortKey] ?? ''), 'ru', { numeric: true }) * direction)
  }
  technicalTotal.value = result.length
  const pageIndex = params.page ?? 0
  const pageSize = params.size ?? params.countPerPage ?? technicalCount.value
  return result.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
}
function chooseTechnicalVariant(key: TechnicalVariant) { technicalVariant.value = key; technicalPage.value = 0; technicalSelected.value = [] }
function runTableMethod(method: 'reset' | 'sort' | 'top' | 'selection' | 'reload') {
  const table = technicalTable.value
  if (!table) return
  if (method === 'reset') table.exposedResetAllFilters()
  if (method === 'sort') table.resetSort()
  if (method === 'top') table.scrollToTop()
  if (method === 'selection') table.clearSelection()
  if (method === 'reload') table.exposedLoadData()
  methodStatus.value = `Выполнено: ${method}`
}

const propsApi = [
  ['data', 'Record<string, unknown>[]', '—', 'Обязательные данные таблицы'],
  ['columns', 'ITableColumn[]', '—', 'Колонки из корпоративного API'],
  ['pagination', 'ITablePaginationConfig', '{}', 'Пагинация и размер страницы'],
  ['sort', 'ITableSortConfig', '{}', 'Сортировка'],
  ['filters', 'ITableFiltersConfig', '{}', 'Значения фильтров'],
  ['search', 'ITableSearchConfig', '{}', 'Поиск и placeholder'],
  ['selection', 'ITableSelectionConfig', '{}', 'Выбор строк'],
  ['server', 'ITableServerConfig', '{}', 'Серверная загрузка'],
  ['searchable', 'boolean', 'false', 'Показывает встроенный поиск'],
  ['isServer', 'boolean', 'false', 'Серверная загрузка через getData'],
  ['resizable', 'boolean', 'false', 'Изменение ширины колонок'],
  ['selectedItems', 'Record<string, unknown>[]', '[]', 'v-model выбранных строк'],
  ['showPagination', 'boolean', 'false', 'Пагинация и выбор размера страницы'],
  ['showSettings', 'boolean', 'false', 'Настройки колонок'],
  ['startFiltersValue', 'Record<string, unknown>', '{}', 'Начальные значения фильтров'],
  ['tableBodyStyle', 'StyleValue', "''", 'Стили области строк'],
]
const slotsApi = ['bar-left', 'bar-right', 'before-table', 'no-data', 'no-search-result', 'context-menu', 'column-{key}', 'filter-column-{key}', 'filter-title-{key}', 'table-settings', 'load-error']
const methodsApi = ['resetFilter(key)', 'exposedLoadData(page?, countPerPage?)', 'exposedResetAllFilters()', 'resetSort()', 'scrollToTop()', 'clearSelection()', 'cancelLoad()', 'loadError', 'isLoading']
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
        @row-action="removeRow"
      >
        <template #bar-left><span class="bar-status">{{ rows.length }} записей · {{ selectedLabel }}</span></template>
        <template #bar-right><div class="bar-actions"><div class="column-creator"><input v-model="newColumnTitle" type="text" placeholder="Название заголовка" @keydown.enter.prevent="addTestColumn"><button class="secondary-button" type="button" @click="addTestColumn"><Columns3 :size="16" /> Добавить заголовок</button></div><button class="primary-button" type="button" @click="addRow"><Plus :size="16" /> Добавить строку</button></div></template>
        <template #column-name="{ item }"><span class="employee"><i><User :size="18" /></i><span><strong>{{ item.name }}</strong><small>{{ item.role }}</small></span></span></template>
        <template #table-settings><div class="settings-demo"><strong>Настройки таблицы</strong><span>Содержимое передаётся через slot <code>table-settings</code>.</span></div></template>
      </TzTable>
    </section>

    <section class="card wide">
      <header><div><h2>Панель сложных фильтров</h2><p>Компактная панель показывает доступные фильтры. Простые значения открываются в popover, большое дерево объектов — в модальном окне.</p></div></header>
      <TzTableFilterPanel
        v-model:open="filterPanelOpen"
        title="Фильтры таблицы"
        :active-count="panelActiveCount"
        :dirty="panelDirty"
        :reset-disabled="!draftDepartments.length && !draftObjects.length && !panelActiveCount"
        @apply="applyFilterPanel"
        @reset="resetFilterPanel"
      >
        <template #summary>
          <span v-if="appliedDepartments.length" class="panel-chip">Подразделения: {{ appliedDepartments.length }}</span>
          <span v-if="appliedObjects.length" class="panel-chip">Объекты: {{ appliedObjects.length }}</span>
          <span v-if="!panelActiveCount" class="panel-empty-summary">Фильтры не применены</span>
        </template>

        <div class="filter-launcher-list">
          <div class="filter-launcher-wrap">
            <button
              type="button"
              class="filter-launcher"
              :class="{ active: draftDepartments.length }"
              :aria-expanded="departmentPopoverOpen"
              @click="departmentPopoverOpen = !departmentPopoverOpen"
            >
              <i><Users :size="16" /></i>
              <span><strong>Подразделение</strong><small>Выбор нескольких значений · Popover</small></span>
              <b v-if="draftDepartments.length">{{ draftDepartments.length }}</b>
              <ChevronRight :size="16" />
            </button>
            <button v-if="departmentPopoverOpen" type="button" class="filter-popover-dismiss" aria-label="Закрыть выбор подразделения" @click="departmentPopoverOpen = false" />
            <section v-if="departmentPopoverOpen" class="department-popover" aria-label="Фильтр по подразделению">
              <header><strong>Подразделение</strong><button type="button" aria-label="Закрыть" @click="departmentPopoverOpen = false"><X :size="16" /></button></header>
              <button
                v-for="department in departments"
                :key="department"
                type="button"
                class="filter-option"
                :class="{ selected: draftDepartments.includes(department) }"
                @click="toggleDraftDepartment(department)"
              >
                <span class="filter-option__check" aria-hidden="true" />
                <span>{{ department }}</span>
              </button>
              <footer><button type="button" :disabled="!draftDepartments.length" @click="draftDepartments = []">Сбросить</button><button type="button" @click="departmentPopoverOpen = false">Готово</button></footer>
            </section>
          </div>

          <button type="button" class="filter-launcher" :class="{ active: draftObjects.length }" @click="objectModalOpen = true">
            <i><Building2 :size="16" /></i>
            <span><strong>Объект</strong><small>Поиск и выбор по иерархии · Модальное окно</small></span>
            <b v-if="draftObjects.length">{{ draftObjects.length }}</b>
            <ChevronRight :size="16" />
          </button>
        </div>
        <template #hint>Выбранные значения не влияют на таблицу до нажатия «Применить»</template>
      </TzTableFilterPanel>

      <TzTreeFilterModal
        v-if="objectModalOpen"
        title="Выберите объект"
        :options="objectTree"
        :model-value="draftObjects"
        @close="objectModalOpen = false"
        @apply="applyDraftObjects"
      />

      <TzTable
        :data="panelRows"
        :columns="panelColumns"
        :columns-per-view="panelColumns.length"
        :pagination="{ page: filterPanelPage, countPerPage: 10, countPerPageOptions: [10, 20], totalCount: panelRows.length, showPagination: true }"
        :selection="{ disabled: true }"
        @update:page="filterPanelPage = $event"
      >
        <template #column-name="{ item }"><span class="employee"><i><User :size="18" /></i><span><strong>{{ item.name }}</strong><small>{{ item.role }}</small></span></span></template>
      </TzTable>
      <p class="implementation-note"><strong>Для сервера:</strong> после применения передавайте <code>departmentIds</code> и <code>objectIds</code> в <code>getData()</code>. Панель не зависит от внутреннего API фильтров таблицы.</p>
    </section>

    <section class="card wide">
      <header><div><h2>Варианты из IKod UI Kit</h2><p>Техническое поведение сверено с локальным источником. Внешний вид использует токены Target Zero.</p></div></header>
      <div class="variant-switcher" role="tablist" aria-label="Варианты таблицы">
        <button v-for="variant in technicalVariants" :key="variant.key" type="button" role="tab" :aria-selected="technicalVariant === variant.key" :class="{ active: technicalVariant === variant.key }" @click="chooseTechnicalVariant(variant.key)">{{ variant.label }}</button>
      </div>
      <p class="variant-description">{{ technicalDescription }}</p>
      <div v-if="technicalVariant === 'methods'" class="method-actions">
        <button type="button" @click="runTableMethod('reset')">Сбросить фильтры</button><button type="button" @click="runTableMethod('sort')">Сбросить сортировку</button><button type="button" @click="runTableMethod('top')">Наверх</button><button type="button" @click="runTableMethod('selection')">Очистить выбор</button><button type="button" @click="runTableMethod('reload')">Перезагрузить</button><span>{{ methodStatus }}</span>
      </div>
      <TzTable
        ref="technicalTable"
        v-model:selected-items="technicalSelected"
        :data="isServerTechnical ? [] : rows.slice(0, 18)"
        :columns="technicalColumns"
        :columns-per-view="technicalColumns.length"
        :pagination="{ page: technicalPage, countPerPage: technicalCount, countPerPageOptions: [5, 10, 20], totalCount: isServerTechnical ? technicalTotal : 18, showPagination: ['client-pagination', 'server-pagination', 'methods'].includes(technicalVariant) }"
        :search="{ enabled: ['server-search', 'methods'].includes(technicalVariant), placeholder: 'Поиск по таблице', showBarAlways: ['server-search', 'utility', 'methods'].includes(technicalVariant) }"
        :selection="{ items: technicalSelected, disabled: !['utility', 'methods'].includes(technicalVariant), resetOnDataChange: true }"
        :server="{ isServer: isServerTechnical, getData: technicalServerLoader }"
        :stripped="technicalVariant === 'stripped'"
        :resizable="technicalVariant === 'resizable'"
        :show-settings="technicalVariant === 'utility'"
        :show-actions="technicalVariant === 'utility'"
        @update:page="technicalPage = $event"
        @update:count-per-page="technicalCount = $event; technicalPage = 0"
      >
        <template #column-name="{ item }"><span class="employee"><i><User :size="18" /></i><span><strong>{{ item.name }}</strong><small>{{ item.role }}</small></span></span></template>
        <template #table-settings><div class="settings-demo"><strong>Настройки таблицы</strong><span>Utility slot из технического API.</span></div></template>
        <template #load-error="{ loadError }"><strong>Ошибка загрузки</strong><span>{{ loadError.message }}</span></template>
      </TzTable>
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
.card>.tz-filter-panel{margin-bottom:var(--padding-spacing-12)}
.filter-launcher-list{display:grid;grid-template-columns:repeat(2,minmax(240px,1fr));gap:var(--padding-spacing-12)}
.filter-launcher-wrap{position:relative;min-width:0}
.filter-launcher{display:grid;width:100%;min-height:64px;padding:var(--padding-spacing-10) var(--padding-spacing-12);grid-template-columns:auto minmax(0,1fr) auto auto;align-items:center;gap:var(--padding-spacing-10);color:var(--text-default);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface);font-family:var(--tz-font-family);text-align:left;cursor:pointer;transition:border-color 160ms ease,background-color 160ms ease,box-shadow 160ms ease}
.filter-launcher:hover{border-color:var(--brand-primary);background:var(--brand-bg-hover)}.filter-launcher:focus-visible{outline:2px solid var(--brand-primary);outline-offset:2px}.filter-launcher.active{border-color:var(--brand-primary);box-shadow:inset 0 0 0 1px var(--brand-primary)}
.filter-launcher>i{display:grid;width:32px;height:32px;place-items:center;color:var(--brand-primary);border-radius:var(--radius-sm);background:var(--brand-bg-active)}.filter-launcher>span{display:flex;min-width:0;flex-direction:column;gap:var(--padding-spacing-2)}.filter-launcher strong{color:var(--text-default);font:var(--tz-text-body-strong)}.filter-launcher small{overflow:hidden;color:var(--text-muted);font:var(--tz-text-caption-regular);text-overflow:ellipsis;white-space:nowrap}.filter-launcher>b{display:grid;min-width:24px;height:24px;padding:0 var(--padding-spacing-6);place-items:center;color:var(--brand-primary);border-radius:var(--radius-full);background:var(--brand-bg-active);font:var(--tz-text-label-small)}
.filter-popover-dismiss{position:fixed;z-index:20;inset:0;width:100%;height:100%;padding:0;border:0;background:transparent;cursor:default}.department-popover{position:absolute;z-index:21;top:calc(100% + var(--padding-spacing-8));left:0;display:grid;width:min(360px,calc(100vw - 64px));padding:var(--padding-spacing-12);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:0 12px 32px var(--bg-shadow)}.department-popover>header{display:flex;min-height:32px;align-items:center;justify-content:space-between;gap:var(--padding-spacing-8);margin-bottom:var(--padding-spacing-6);color:var(--text-default);font:var(--tz-text-body-strong)}.department-popover>header button{display:grid;width:28px;height:28px;padding:0;place-items:center;color:var(--icon-default);border:0;border-radius:var(--radius-xs);background:transparent;cursor:pointer}.department-popover>header button:hover{color:var(--brand-primary);background:var(--brand-bg-hover)}
.filter-option{display:flex;width:100%;min-height:36px;padding:var(--padding-spacing-6) var(--padding-spacing-8);align-items:center;gap:var(--padding-spacing-8);color:var(--text-default);border:0;border-radius:var(--radius-sm);background:transparent;font:var(--tz-text-body-small);text-align:left;cursor:pointer}.filter-option:hover{background:var(--brand-bg-hover)}.filter-option__check{display:grid;box-sizing:border-box;flex:0 0 20px;width:20px;height:20px;place-items:center;border:1px solid var(--border-default);border-radius:var(--radius-xs);background:var(--bg-surface)}.filter-option.selected .filter-option__check{border-color:var(--brand-primary);background:var(--brand-primary)}.filter-option.selected .filter-option__check:after{width:9px;height:5px;border-bottom:1.5px solid var(--text-button-fill);border-left:1.5px solid var(--text-button-fill);content:"";transform:translateY(-1px) rotate(-45deg)}
.department-popover>footer{display:flex;margin-top:var(--padding-spacing-8);padding-top:var(--padding-spacing-8);justify-content:flex-end;gap:var(--padding-spacing-8);border-top:1px solid var(--border-default)}.department-popover>footer button{min-height:32px;padding:0 var(--padding-spacing-10);color:var(--brand-primary);border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--bg-surface);font:var(--tz-text-label-small);cursor:pointer}.department-popover>footer button:last-child{color:var(--text-button-fill);border-color:var(--brand-primary);background:var(--brand-primary)}.department-popover>footer button:disabled{color:var(--text-disabled);background:var(--bg-disabled);cursor:not-allowed}
.panel-chip{padding:var(--padding-spacing-4) var(--padding-spacing-8);color:var(--brand-primary);border-radius:var(--radius-full);background:var(--brand-bg-active);font:var(--tz-text-label-small)}.panel-empty-summary{color:var(--text-muted);font:var(--tz-text-caption-regular)}.implementation-note{margin:var(--padding-spacing-12) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}.variant-switcher{display:flex;flex-wrap:wrap;gap:var(--padding-spacing-8);margin-bottom:var(--padding-spacing-12)}.variant-switcher button,.method-actions button{min-height:32px;padding:0 var(--padding-spacing-12);color:var(--brand-primary);border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--bg-surface);font:500 12px/16px var(--tz-font-family);cursor:pointer}.variant-switcher button:hover,.method-actions button:hover{background:var(--brand-bg-hover)}.variant-switcher button.active{color:var(--text-button-fill);border-color:var(--brand-primary);background:var(--brand-primary)}.variant-description{margin:0 0 var(--padding-spacing-16);color:var(--text-muted);font:400 13px/18px var(--tz-font-family)}.method-actions{display:flex;flex-wrap:wrap;align-items:center;gap:var(--padding-spacing-8);margin-bottom:var(--padding-spacing-12)}.method-actions span{color:var(--text-muted);font:400 12px/16px var(--tz-font-family)}.bar-status{color:var(--text-muted);font:400 12px/16px var(--tz-font-family);white-space:nowrap}.bar-actions,.column-creator{display:flex;align-items:center;gap:var(--padding-spacing-8)}.column-creator input{width:160px;height:32px;padding:0 var(--padding-spacing-8);color:var(--text-default);border:1px solid var(--border-default);border-radius:var(--radius-sm);outline:0;background:var(--bg-surface);font:400 12px/16px var(--tz-font-family)}.column-creator input:focus{border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--effect-shadow)}.secondary-button{display:inline-flex;height:32px;padding:0 var(--padding-spacing-12);align-items:center;gap:var(--padding-spacing-6);color:var(--brand-primary);border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--brand-bg-hover);font:500 12px/16px var(--tz-font-family);white-space:nowrap;cursor:pointer}.primary-button{display:inline-flex;height:32px;padding:0 var(--padding-spacing-12);align-items:center;gap:var(--padding-spacing-6);color:var(--text-button-fill);border:0;border-radius:var(--radius-sm);background:var(--brand-primary);font:500 12px/16px var(--tz-font-family);cursor:pointer}.primary-button:hover{background:var(--brand-primary-hover)}
.employee{display:flex;min-width:0;align-items:center;gap:var(--padding-spacing-6)}.employee>i{display:grid;flex:0 0 32px;width:32px;height:32px;place-items:center;color:var(--brand-primary);border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--bg-surface)}.employee>span{display:flex;min-width:0;flex-direction:column}.employee strong,.employee small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.employee strong{font:400 14px/20px var(--tz-font-family)}.employee small{color:var(--text-muted);font:400 10px/14px var(--tz-font-family)}
.settings-demo{display:flex;align-items:center;gap:var(--padding-spacing-12)}.settings-demo strong{font:500 12px/16px var(--tz-font-family)}.settings-demo span{color:var(--text-muted);font:400 12px/16px var(--tz-font-family)}code{color:var(--brand-primary);font:400 11px/16px ui-monospace,SFMono-Regular,Consolas,monospace}
.api-table{overflow:auto;border:1px solid var(--border-default);border-radius:var(--radius-md)}.api-row{display:grid;grid-template-columns:180px 260px 100px minmax(220px,1fr);min-width:820px;min-height:44px;align-items:center;border-bottom:1px solid var(--border-default)}.api-row:last-child{border-bottom:0}.api-row>*{padding:var(--padding-spacing-8) var(--padding-spacing-12)}.api-row span{color:var(--text-muted);font:400 12px/16px var(--tz-font-family)}.api-head{background:var(--bg-row-hover)}.api-head span{color:var(--text-default);font-weight:500}.api-columns{display:grid;grid-template-columns:1fr 1fr;gap:var(--padding-spacing-24)}.chips{display:flex;flex-wrap:wrap;gap:var(--padding-spacing-8)}.chips code,.method-list code{padding:var(--padding-spacing-6) var(--padding-spacing-8);border-radius:var(--radius-sm);background:var(--brand-bg-hover)}.method-list{display:grid;gap:var(--padding-spacing-8)}
@media(max-width:800px){.card>.tz-filter-panel{margin-bottom:var(--padding-spacing-12)}.filter-launcher-list{grid-template-columns:1fr}.page-header{flex-direction:column}.api-columns{grid-template-columns:1fr}.card{padding:var(--padding-spacing-16)}}
</style>
