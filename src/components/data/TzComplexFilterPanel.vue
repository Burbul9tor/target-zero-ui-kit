<script setup lang="ts">
import { CalendarDays, Factory, Network } from '@lucide/vue'
import { computed, reactive, ref, watch } from 'vue'
import TzInput from '../forms/TzInput.vue'
import type { InputValue } from '../forms/TzInput.vue'
import TzSearch from '../forms/TzSearch.vue'
import TzSegmentedControl, { type SegmentedItem, type SegmentedValue } from '../forms/TzSegmentedControl.vue'
import TzSelect from '../forms/TzSelect.vue'
import TzTreeSelectTrigger from '../forms/TzTreeSelectTrigger.vue'
import TzTreeFilterModal from './TzTreeFilterModal.vue'
import type { TreeFilterOption } from './TzTreeFilterNode.vue'
import TzTableFilterPanel from './TzTableFilterPanel.vue'

export interface ComplexFilterValue {
  checkTypes: string[]
  checkArea: string | null
  controlLevel: string | null
  auditedObject: string | null
  period: string
  inspectorUnit: string | null
  auditedUnit: string | null
  status: string | null
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
  checkTypes: [],
  checkArea: null,
  controlLevel: null,
  auditedObject: null,
  period: '',
  inspectorUnit: null,
  auditedUnit: null,
  status: null,
})
const normalize = (value: Partial<ComplexFilterValue> = {}): ComplexFilterValue => ({
  ...emptyFilters(),
  ...value,
  checkTypes: [...(value.checkTypes ?? [])],
})

const draft = reactive<ComplexFilterValue>(normalize(props.modelValue))
const applied = ref<ComplexFilterValue>(normalize(props.appliedValue))
const query = ref('')
type TreeField = 'auditedObject' | 'inspectorUnit' | 'auditedUnit'
const activeTreeField = ref<TreeField | null>(null)
const treeModalValue = ref<string[]>([])
const openModel = computed({
  get: () => props.open,
  set: value => emit('update:open', value),
})
const dirty = computed(() => JSON.stringify(draft) !== JSON.stringify(applied.value))
const hasDraftFilters = computed(() => draft.checkTypes.length > 0
  || Boolean(draft.checkArea || draft.controlLevel || draft.auditedObject || draft.period || draft.inspectorUnit || draft.auditedUnit || draft.status))

const checkTypeOptions = ['Плановая', 'Внеплановая'].map(value => ({ label: value, value }))
const checkAreaOptions = ['Экология', 'Промышленная безопасность', 'Охрана труда'].map(value => ({ label: value, value }))
const controlLevelOptions = ['Первый уровень', 'Второй уровень', 'Третий уровень'].map(value => ({ label: value, value }))
const objectTree: TreeFilterOption[] = [
  { id: 'kostanay', value: 'Карьер Костанай', children: [
    { id: 'kostanay-north', value: 'Карьер Северный' },
    { id: 'kostanay-crushing', value: 'Дробильный комплекс' },
  ] },
  { id: 'pavlodar', value: 'Полигон Павлодар', children: [
    { id: 'pavlodar-card-1', value: 'Карта размещения № 1' },
    { id: 'pavlodar-card-2', value: 'Карта размещения № 2' },
  ] },
  { id: 'almaty', value: 'Шламонакопитель Алматы' },
]
const organizationTree: TreeFilterOption[] = [
  { id: 'besafe', value: 'BeSafe', children: [
    { id: 'ikod', value: 'IKOD', children: [
      { id: 'tac', value: 'TAC', children: [
        { id: 'production', value: 'Отдел эксплуатации производства' },
        { id: 'hse', value: 'Управление HSE', children: [
          { id: 'ecology', value: 'Департамент экологии' },
          { id: 'safety', value: 'Отдел промышленной безопасности' },
        ] },
      ] },
    ] },
  ] },
]
const treeModalTitle = computed(() => activeTreeField.value === 'auditedObject' ? 'Выберите проверяемый объект'
  : activeTreeField.value === 'inspectorUnit' ? 'Выберите оргструктуру проверяющего'
    : 'Выберите оргструктуру проверяемого')
const activeTreeOptions = computed(() => activeTreeField.value === 'auditedObject' ? objectTree : organizationTree)
const treeSearchPlaceholder = computed(() => activeTreeField.value === 'auditedObject' ? 'Поиск по объектам' : 'Поиск по организационной структуре')
const statusOptions: SegmentedItem[] = [
  { value: 'draft', label: 'Черновик' },
  { value: 'in-progress', label: 'В процессе' },
  { value: 'completed', label: 'Завершена' },
  { value: 'assigning', label: 'Назначение ответственного' },
  { value: 'actions-required', label: 'Требуются меры' },
  { value: 'actions-planned', label: 'Меры запланированы' },
  { value: 'actions-overdue', label: 'Меры просрочены' },
  { value: 'closed', label: 'Закрыта' },
]
const statusValue = computed<SegmentedValue | undefined>({
  get: () => draft.status ?? undefined,
  set: value => { draft.status = value === undefined ? null : String(value) },
})
const statusLabel = (value: string) => statusOptions.find(option => option.value === value)?.label ?? value

interface AppliedChip {
  id: string
  title: string
  label: string
  field: keyof ComplexFilterValue
  item?: string
}
const appliedChips = computed<AppliedChip[]>(() => {
  const value = applied.value
  const chips: AppliedChip[] = []
  value.checkTypes.forEach(item => chips.push({ id: `checkType-${item}`, title: 'Вид проверки', label: item, field: 'checkTypes', item }))
  if (value.checkArea) chips.push({ id: 'checkArea', title: 'Область проверки', label: value.checkArea, field: 'checkArea' })
  if (value.controlLevel) chips.push({ id: 'controlLevel', title: 'Уровень контроля', label: value.controlLevel, field: 'controlLevel' })
  if (value.auditedObject) chips.push({ id: 'auditedObject', title: 'Проверяемый объект', label: value.auditedObject, field: 'auditedObject' })
  if (value.period) chips.push({ id: 'period', title: 'Период проверки', label: value.period, field: 'period' })
  if (value.inspectorUnit) chips.push({ id: 'inspectorUnit', title: 'Подразделение проверяющего', label: value.inspectorUnit, field: 'inspectorUnit' })
  if (value.auditedUnit) chips.push({ id: 'auditedUnit', title: 'Подразделение проверяемого', label: value.auditedUnit, field: 'auditedUnit' })
  if (value.status) chips.push({ id: 'status', title: 'Статус', label: statusLabel(value.status), field: 'status' })
  return chips
})

watch(() => props.modelValue, value => Object.assign(draft, normalize(value)), { deep: true })
watch(() => props.appliedValue, value => { applied.value = normalize(value) }, { deep: true })
watch(draft, value => emit('update:modelValue', normalize(value)), { deep: true })

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
function removeChip(chip: AppliedChip) {
  const next = normalize(applied.value)
  if (chip.field === 'checkTypes') {
    next.checkTypes = next.checkTypes.filter(item => item !== chip.item)
    draft.checkTypes = [...next.checkTypes]
  } else {
    ;(next[chip.field] as string | null) = chip.field === 'period' ? '' : null
    ;(draft[chip.field] as string | null) = chip.field === 'period' ? '' : null
  }
  applied.value = next
}
function updateQuery(value: string) {
  query.value = value
  emit('search', value)
}
function formatPeriodMask(value: InputValue) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 16)
  const formatDate = (date: string) => [date.slice(0, 2), date.slice(2, 4), date.slice(4, 8)].filter(Boolean).join('.')
  const start = formatDate(digits.slice(0, 8))
  const end = formatDate(digits.slice(8))
  draft.period = end ? start + ' – ' + end : start
}

function openTreePicker(field: TreeField) {
  activeTreeField.value = field
  const value = draft[field]
  treeModalValue.value = value ? [value] : []
}
function applyTreeSelection(values: string[]) {
  if (!activeTreeField.value) return
  draft[activeTreeField.value] = values[0] ?? null
  activeTreeField.value = null
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
    :reset-disabled="!hasDraftFilters"
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
      <div class="tz-complex-filter__row tz-complex-filter__row--primary">
        <TzSelect v-model="draft.checkTypes" :options="checkTypeOptions" mode="chips" label="Вид проверки" placeholder="Выберите вид" size="medium" :required="false" :show-leading-icon="false" />
        <TzSelect v-model="draft.checkArea" :options="checkAreaOptions" label="Область проверки" placeholder="Выберите область" size="medium" :required="false" :show-leading-icon="false" />
        <TzSelect v-model="draft.controlLevel" :options="controlLevelOptions" label="Уровень контроля" placeholder="Выберите уровень" size="medium" :required="false" :show-leading-icon="false" />
        <TzTreeSelectTrigger :value="draft.auditedObject" :icon="Factory" label="Проверяемый объект" placeholder="Выберите объект" @open="openTreePicker('auditedObject')" />
      </div>

      <div class="tz-complex-filter__row tz-complex-filter__row--secondary">
        <TzInput :model-value="draft.period" label="Период проверки" placeholder="дд.мм.гггг – дд.мм.гггг" size="medium" inputmode="numeric" :maxlength="23" :icon-right="CalendarDays" @update:model-value="formatPeriodMask" />
        <TzTreeSelectTrigger :value="draft.inspectorUnit" :icon="Network" label="Оргструктура проверяющего" placeholder="Выберите элемент" @open="openTreePicker('inspectorUnit')" />
        <TzTreeSelectTrigger :value="draft.auditedUnit" :icon="Network" label="Оргструктура проверяемого" placeholder="Выберите область" @open="openTreePicker('auditedUnit')" />
      </div>

      <TzSegmentedControl v-model="statusValue" class="tz-complex-filter__statuses" :items="statusOptions" label="Статус" size="medium" allow-empty />
    </div>

    <template #hint />
  </TzTableFilterPanel>
  <TzTreeFilterModal
    v-if="activeTreeField"
    :title="treeModalTitle"
    :options="activeTreeOptions"
    :model-value="treeModalValue"
    selection-mode="single"
    :search-placeholder="treeSearchPlaceholder"
    @close="activeTreeField = null"
    @apply="applyTreeSelection"
  />
</template>

<style scoped>
.tz-complex-filter__caption{color:var(--text-muted);font:var(--tz-text-body-small);white-space:nowrap}
.tz-complex-filter__chip{display:inline-flex;min-height:24px;padding:var(--padding-spacing-2) var(--padding-spacing-8);align-items:center;gap:var(--padding-spacing-4);color:var(--brand-primary);border:1px solid var(--brand-primary-hover);border-radius:var(--radius-md);background:var(--brand-bg-hover);font:var(--tz-text-body-small);cursor:pointer}
.tz-complex-filter__chip strong{font-weight:500}.tz-complex-filter__chip b{font-size:17px;font-weight:400;line-height:14px}.tz-complex-filter__chip:hover{background:var(--brand-bg-active)}
.tz-complex-filter__clear-all{min-height:24px;padding:0 var(--padding-spacing-12);color:var(--brand-primary);border:0;border-radius:var(--radius-sm);background:transparent;font:600 12px/16px var(--tz-font-family);cursor:pointer}.tz-complex-filter__clear-all:hover{background:var(--brand-bg-hover)}
.tz-complex-filter__form{display:grid;gap:var(--padding-spacing-16)}
.tz-complex-filter__row{display:grid;gap:var(--padding-spacing-8);align-items:start}
.tz-complex-filter__row--primary{grid-template-columns:repeat(4,minmax(0,1fr))}
.tz-complex-filter__row--secondary{grid-template-columns:repeat(3,minmax(0,1fr))}
.tz-complex-filter__statuses{width:100%}
.tz-complex-filter__statuses :deep(.tz-segmented-field__label){font:var(--tz-text-body-small)}
.tz-complex-filter__statuses :deep(.tz-segmented){flex-wrap:wrap;gap:var(--padding-spacing-4)}
.tz-complex-filter__statuses :deep(.tz-segmented__item){min-height:32px;padding:var(--padding-spacing-6) var(--padding-spacing-16);font:400 14px/20px var(--tz-font-family)}
@media(max-width:1050px){.tz-complex-filter__row--primary{grid-template-columns:repeat(2,minmax(0,1fr))}.tz-complex-filter__row--secondary{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:650px){.tz-complex-filter__row--primary,.tz-complex-filter__row--secondary{grid-template-columns:1fr}}
</style>