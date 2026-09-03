<script setup lang="ts">
import { Recycle } from '@lucide/vue'
import { ref } from 'vue'
import TzModal from '../../feedback/TzModal.vue'
import TzTabs, { type TabItem, type TabValue } from '../../navigation/TzTabs.vue'
import TzTable, { type TzTableColumn } from '../../data/TzTable.vue'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const activeTab = ref<TabValue>('general')
const page = ref(0)
const countPerPage = ref(10)

const tabs: TabItem[] = [
  { value: 'general', label: 'Общая информация' },
  { value: 'waste', label: 'Информация об отходах на месте', count: 10 },
]

const details = [
  ['Наименование чека', '03.09.2026'],
  ['Мощность', 'Нефтесервисная компания (Павлодар)'],
  ['Размещено', 'По требованию'],
  ['Осталось', 'Нефть разлитая [05 01 05*]'],
  ['Использовано', '50 000 т'],
  ['Статус', 'Участок подготовки нефти № 2'],
]

const columns: TzTableColumn[] = [
  { key: 'index', label: '№', type: 'index', width: 52, align: 'center', fixed: 'left' },
  { key: 'date', label: 'Дата поступления', width: 142, sortable: true, filterable: true },
  { key: 'name', label: 'Наименование отхода', minWidth: 250, filterable: true },
  { key: 'volume', label: 'Объем (т)', width: 128, sortable: true, filterable: true },
  { key: 'source', label: 'Источник поступления', minWidth: 240, filterable: true },
  { key: 'hazard', label: 'Уровень опасности', width: 150, filterable: true },
]

const rows = [
  { id: 1, date: '24.08.2026', name: 'Нефть разлитая [05 01 05*]', volume: '12,5 т', source: 'Участок подготовки нефти № 2', hazard: 'Опасный' },
  { id: 2, date: '23.08.2026', name: 'Грунт, загрязнённый нефтепродуктами [17 05 03*]', volume: '48,7 т', source: 'Ремонтная площадка № 1', hazard: 'Опасный' },
  { id: 3, date: '22.08.2026', name: 'Отходы бетона [17 01 01]', volume: '125 т', source: 'Строительный участок «Северный»', hazard: 'Неопасный' },
  { id: 4, date: '21.08.2026', name: 'Отработанные моторные масла [13 02 05*]', volume: '3,8 т', source: 'Транспортный цех', hazard: 'Опасный' },
  { id: 5, date: '20.08.2026', name: 'Смешанные строительные отходы [17 09 04]', volume: '76,4 т', source: 'Реконструкция склада № 3', hazard: 'Неопасный' },
  { id: 6, date: '19.08.2026', name: 'Лом чёрных металлов [17 04 05]', volume: '18,2 т', source: 'Ремонтно-механический цех', hazard: 'Неопасный' },
  { id: 7, date: '18.08.2026', name: 'Загрязнённая ветошь [15 02 02*]', volume: '1,6 т', source: 'Производственный корпус № 4', hazard: 'Опасный' },
  { id: 8, date: '17.08.2026', name: 'Отходы древесины [17 02 01]', volume: '9,4 т', source: 'Участок демонтажных работ', hazard: 'Неопасный' },
  { id: 9, date: '16.08.2026', name: 'Отработанные масляные фильтры [16 01 07*]', volume: '0,9 т', source: 'Автотранспортный участок', hazard: 'Опасный' },
  { id: 10, date: '15.08.2026', name: 'Кирпичи и керамические изделия [17 01 02]', volume: '34,6 т', source: 'Демонтаж административного здания', hazard: 'Неопасный' },
]
</script>

<template>
  <TzModal
    :model-value="modelValue"
    placement="right"
    width="clamp(720px, 58vw, 1120px)"
    title="Чек № 1 — строительные отходы"
    disabled-scroll
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #icon><Recycle :size="20" :stroke-width="1.6" /></template>
    <div class="wide-modal">
      <TzTabs v-model="activeTab" :items="tabs" aria-label="Разделы информации о чеке" />

      <section v-if="activeTab === 'general'" class="details" role="tabpanel">
        <dl v-for="item in details" :key="item[0]">
          <dt>{{ item[0] }}</dt>
          <dd>{{ item[1] }}</dd>
        </dl>
      </section>

      <section v-else class="waste-table" role="tabpanel">
        <TzTable
          :data="rows"
          :columns="columns"
          :page="page"
          :count-per-page="countPerPage"
          :total-count="rows.length"
          :count-per-page-options="[10, 25, 50]"
          show-pagination
          disabled-row-click
          @update:page="page = $event"
          @update:count-per-page="countPerPage = $event"
        >
          <template #column-hazard="{ value }">
            <span class="hazard" :class="value === 'Опасный' ? 'is-danger' : 'is-safe'">{{ value }}</span>
          </template>
        </TzTable>
      </section>
    </div>
  </TzModal>
</template>

<style scoped>
.wide-modal{display:flex;min-height:0;padding:var(--padding-spacing-12);flex-direction:column;gap:var(--padding-spacing-12)}
.details{display:grid}.details dl{display:grid;margin:0;padding:var(--padding-spacing-8) 0;gap:var(--padding-spacing-2);border-bottom:1px solid var(--border-default)}.details dt{color:var(--text-muted);font:var(--tz-text-body-small)}.details dd{margin:0;color:var(--text-default);font:var(--tz-text-body-strong)}
.waste-table{min-width:0}.hazard{display:inline-flex;padding:var(--padding-spacing-4) var(--padding-spacing-8);border-radius:var(--radius-md);font:var(--tz-text-label-small);white-space:nowrap}.hazard.is-danger{color:var(--status-error-fg);background:var(--status-error-bg)}.hazard.is-safe{color:var(--status-success-fg);background:var(--status-success-bg)}
@media(max-width:620px){.wide-modal{padding:var(--padding-spacing-8)}}
</style>
