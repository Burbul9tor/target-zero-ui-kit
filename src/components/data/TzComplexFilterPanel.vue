<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import TzTableFilterPanel from './TzTableFilterPanel.vue'
import TzInput from '../forms/TzInput.vue'
import TzSearch from '../forms/TzSearch.vue'
import TzSelect from '../forms/TzSelect.vue'

export interface ComplexFilterValue {
  place: string | null
  year: string | null
  statuses: string[]
  placeTypes: string[]
  limitFrom: string
  limitTo: string
  factFrom: string
  factTo: string
  remainingFrom: string
  remainingTo: string
  usedFrom: string
  usedTo: string
}

const props = withDefaults(defineProps<{
  open?: boolean
  modelValue?: Partial<ComplexFilterValue>
  appliedValue?: Partial<ComplexFilterValue>
}>(), {
  open: false,
  modelValue: () => ({}),
  appliedValue: () => ({}),
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: ComplexFilterValue]
  apply: [value: ComplexFilterValue]
  reset: []
  search: [value: string]
}>()

const emptyFilters = (): ComplexFilterValue => ({
  place: null,
  year: null,
  statuses: [],
  placeTypes: [],
  limitFrom: '',
  limitTo: '',
  factFrom: '',
  factTo: '',
  remainingFrom: '',
  remainingTo: '',
  usedFrom: '',
  usedTo: '',
})
const normalize = (value: Partial<ComplexFilterValue> = {}): ComplexFilterValue => ({
  ...emptyFilters(),
  ...value,
  statuses: [...(value.statuses ?? [])],
  placeTypes: [...(value.placeTypes ?? [])],
})
const draft = reactive<ComplexFilterValue>(normalize(props.modelValue))
const applied = ref<ComplexFilterValue>(normalize(props.appliedValue))
const query = ref('')
const openModel = computed({
  get: () => props.open,
  set: value => emit('update:open', value),
})
const dirty = computed(() => JSON.stringify(draft) !== JSON.stringify(applied.value))
const placeOptions = [
  { label: 'Шламонакопитель Алматы', value: 'Шламонакопитель Алматы' },
  { label: 'Полигон Павлодар', value: 'Полигон Павлодар' },
  { label: 'Площадка Костанай', value: 'Площадка Костанай' },
]
const yearOptions = ['2026', '2025', '2024'].map(value => ({ label: value, value }))
const statusOptions = ['В пределах нормы', 'Близко к лимиту', 'Лимит превышен']
const placeTypeOptions = ['Накопление', 'Размещение']
const ranges = [
  { keyFrom: 'limitFrom', keyTo: 'limitTo', label: 'Лимит (т)' },
  { keyFrom: 'factFrom', keyTo: 'factTo', label: 'Факт (т)' },
  { keyFrom: 'remainingFrom', keyTo: 'remainingTo', label: 'Остаток (т)' },
  { keyFrom: 'usedFrom', keyTo: 'usedTo', label: 'Использовано (%)' },
] as const

const appliedChips = computed(() => {
  const value = applied.value
  const chips: Array<{ id: string; title: string; label: string; field: keyof ComplexFilterValue; item?: string }> = []
  if (value.place) chips.push({ id: 'place', title: 'Место', label: value.place, field: 'place' })
  value.placeTypes.forEach(item => chips.push({ id: `placeType-${item}`, title: 'Тип места', label: item, field: 'placeTypes', item }))
  if (value.year) chips.push({ id: 'year', title: 'Год', label: value.year, field: 'year' })
  value.statuses.forEach(item => chips.push({ id: `status-${item}`, title: 'Статус', label: item, field: 'statuses', item }))
  ranges.forEach(range => {
    const from = value[range.keyFrom]
    const to = value[range.keyTo]
    if (from || to) chips.push({ id: range.keyFrom, title: range.label, label: `${from || '0'}–${to || '∞'}`, field: range.keyFrom })
  })
  return chips
})

watch(() => props.modelValue, value => Object.assign(draft, normalize(value)), { deep: true })
watch(() => props.appliedValue, value => { applied.value = normalize(value) }, { deep: true })
watch(draft, value => emit('update:modelValue', normalize(value)), { deep: true })

function toggleList(field: 'statuses' | 'placeTypes', value: string) {
  draft[field] = draft[field].includes(value) ? draft[field].filter(item => item !== value) : [...draft[field], value]
}
function applyFilters() {
  applied.value = normalize(draft)
  emit('apply', normalize(applied.value))
  emit('update:open', false)
}
function resetFilters() {
  Object.assign(draft, emptyFilters())
  applied.value = emptyFilters()
  emit('reset')
}
function removeChip(chip: (typeof appliedChips.value)[number]) {
  const next = normalize(applied.value)
  if (chip.field === 'statuses' || chip.field === 'placeTypes') {
    next[chip.field] = next[chip.field].filter(item => item !== chip.item)
    draft[chip.field] = [...next[chip.field]]
  } else if (chip.field === 'place' || chip.field === 'year') {
    next[chip.field] = null
    draft[chip.field] = null
  } else {
    const range = ranges.find(item => item.keyFrom === chip.field)
    if (range) {
      next[range.keyFrom] = ''
      next[range.keyTo] = ''
      draft[range.keyFrom] = ''
      draft[range.keyTo] = ''
    }
  }
  applied.value = next
}
function updateQuery(value: string) {
  query.value = value
  emit('search', value)
}
</script>

<template>
  <TzTableFilterPanel
    v-model:open="openModel"
    class="tz-complex-filter"
    layout="figma"
    title="Фильтры"
    :show-chevron="false"
    :show-applied="appliedChips.length > 0"
    :dirty="dirty"
    :require-dirty="false"
    reset-label="Сбросить фильтр"
    apply-label="Применить фильтр"
    @apply="applyFilters"
    @reset="resetFilters"
  >
    <template #toolbar-start>
      <TzSearch :model-value="query" placeholder="Поиск по отходам" label="Поиск по отходам" @update:model-value="updateQuery" />
    </template>

    <template #applied>
      <span class="tz-complex-filter__caption">Фильтры:</span>
      <button v-for="chip in appliedChips" :key="chip.id" type="button" class="tz-complex-filter__chip" :aria-label="`Удалить фильтр ${chip.title}: ${chip.label}`" @click="removeChip(chip)">
        <span><strong>{{ chip.title }}:</strong> {{ chip.label }}</span><b aria-hidden="true">×</b>
      </button>
      <button type="button" class="tz-complex-filter__clear-all" @click="resetFilters">Сбросить всё</button>
    </template>

    <div class="tz-complex-filter__form">
      <div class="tz-complex-filter__primary">
        <div class="tz-complex-filter__selects">
          <TzSelect v-model="draft.place" :options="placeOptions" label="Место" placeholder="Выберите место" size="medium" :required="false" :show-leading-icon="false" />
          <TzSelect v-model="draft.year" :options="yearOptions" label="Год" placeholder="Выберите год" size="medium" :required="false" :show-leading-icon="false" />
        </div>

        <fieldset>
          <legend>Статус</legend>
          <div class="tz-complex-filter__options">
            <button v-for="option in statusOptions" :key="option" type="button" :class="{ selected: draft.statuses.includes(option) }" :aria-pressed="draft.statuses.includes(option)" @click="toggleList('statuses', option)">{{ option }}</button>
          </div>
        </fieldset>

        <fieldset>
          <legend>Тип места</legend>
          <div class="tz-complex-filter__options">
            <button v-for="option in placeTypeOptions" :key="option" type="button" :class="{ selected: draft.placeTypes.includes(option) }" :aria-pressed="draft.placeTypes.includes(option)" @click="toggleList('placeTypes', option)">{{ option }}</button>
          </div>
        </fieldset>
      </div>

      <div class="tz-complex-filter__ranges">
        <fieldset v-for="range in ranges" :key="range.label">
          <legend>{{ range.label }}</legend>
          <div>
            <TzInput v-model="draft[range.keyFrom]" type="number" placeholder="от" size="medium" :show-label="false" />
            <TzInput v-model="draft[range.keyTo]" type="number" placeholder="до" size="medium" :show-label="false" />
          </div>
        </fieldset>
      </div>
    </div>

    <template #hint />
  </TzTableFilterPanel>
</template>

<style scoped>
.tz-complex-filter__caption{color:var(--text-muted);font:var(--tz-text-body-small);white-space:nowrap}
.tz-complex-filter__chip{display:inline-flex;min-height:24px;padding:var(--padding-spacing-2) var(--padding-spacing-8);align-items:center;gap:var(--padding-spacing-4);color:var(--brand-primary);border:1px solid var(--brand-primary-hover);border-radius:var(--radius-md);background:var(--brand-bg-hover);font:var(--tz-text-body-small);cursor:pointer}
.tz-complex-filter__chip strong{font-weight:500}.tz-complex-filter__chip b{font-size:17px;font-weight:400;line-height:14px}.tz-complex-filter__chip:hover{background:var(--brand-bg-active)}
.tz-complex-filter__clear-all{min-height:24px;padding:0 var(--padding-spacing-12);color:var(--brand-primary);border:0;border-radius:var(--radius-sm);background:transparent;font:600 12px/16px var(--tz-font-family);cursor:pointer}.tz-complex-filter__clear-all:hover{background:var(--brand-bg-hover)}
.tz-complex-filter__form{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px}
.tz-complex-filter__primary{display:grid;align-content:start;gap:var(--padding-spacing-16)}
.tz-complex-filter__selects{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--padding-spacing-8)}
fieldset{min-width:0;margin:0;padding:0;border:0}legend{margin-bottom:var(--padding-spacing-4);color:var(--text-default);font:var(--tz-text-body-small)}
.tz-complex-filter__options{display:flex;flex-wrap:wrap;gap:var(--padding-spacing-4)}
.tz-complex-filter__options button{min-height:30px;padding:var(--padding-spacing-4) var(--padding-spacing-16);color:var(--text-default);border:1px solid transparent;border-radius:var(--radius-sm);background:var(--bg-disabled);font:400 14px/20px var(--tz-font-family);cursor:pointer;transition:background-color 140ms ease,border-color 140ms ease,color 140ms ease}
.tz-complex-filter__options button:hover{border-color:var(--brand-primary)}.tz-complex-filter__options button.selected{color:var(--brand-primary);border-color:var(--brand-primary);background:var(--brand-bg-active)}
.tz-complex-filter__ranges{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-content:start;gap:var(--padding-spacing-16)}
.tz-complex-filter__ranges field>div{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--padding-spacing-8)}
@media(max-width:900px){.tz-complex-filter__form{grid-template-columns:1fr;gap:var(--padding-spacing-24)}}
@media(max-width:600px){.tz-complex-filter__selects,.tz-complex-filter__ranges{grid-template-columns:1fr}.tz-complex-filter__options button{width:100%}}
</style>
