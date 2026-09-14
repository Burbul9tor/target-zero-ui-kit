<script setup lang="ts">
import { Columns3, GripVertical } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import TzButton from '../../actions/TzButton.vue'
import TzModal from '../../feedback/TzModal.vue'
import TzToggle from '../../forms/TzToggle.vue'

export interface ColumnSettingsItem {
  key: string
  label: string
  active: boolean
  locked?: boolean
}

const props = defineProps<{
  modelValue: boolean
  columns: ColumnSettingsItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  apply: [columns: ColumnSettingsItem[]]
}>()

const draft = ref<ColumnSettingsItem[]>([])
const draggedKey = ref<string | null>(null)
const enabledCount = computed(() => draft.value.filter(column => column.active).length)

function cloneColumns(columns: ColumnSettingsItem[]) {
  return columns.map(column => ({ ...column }))
}

watch(() => props.modelValue, open => {
  if (open) draft.value = cloneColumns(props.columns)
}, { immediate: true })

function close() {
  emit('update:modelValue', false)
}

function reset() {
  draft.value = draft.value.map(column => ({ ...column, active: true }))
}

function moveColumn(targetKey: string) {
  if (!draggedKey.value || draggedKey.value === targetKey) return
  const sourceIndex = draft.value.findIndex(column => column.key === draggedKey.value)
  const targetIndex = draft.value.findIndex(column => column.key === targetKey)
  if (sourceIndex < 0 || targetIndex < 0 || draft.value[sourceIndex].locked || draft.value[targetIndex].locked) return
  const next = cloneColumns(draft.value)
  const [moved] = next.splice(sourceIndex, 1)
  next.splice(targetIndex, 0, moved)
  draft.value = next
  draggedKey.value = null
}

function apply() {
  emit('apply', cloneColumns(draft.value))
  close()
}
</script>

<template>
  <TzModal
    :model-value="modelValue"
    placement="right"
    width="440px"
    title="Настройка столбцов"
    description="Выберите видимые столбцы и задайте их порядок."
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #icon><Columns3 :size="18" /></template>

    <div class="column-settings">
      <div class="column-settings__summary">
        <span>Включено {{ enabledCount }} из {{ draft.length }}</span>
        <button type="button" @click="reset">Сбросить</button>
      </div>
      <div class="column-settings__list">
        <article
          v-for="column in draft"
          :key="column.key"
          :class="{ 'is-locked': column.locked }"
          :draggable="!column.locked"
          @dragstart="draggedKey = column.key"
          @dragend="draggedKey = null"
          @dragover.prevent
          @drop.prevent="moveColumn(column.key)"
        >
          <GripVertical class="column-settings__grip" :size="16" aria-hidden="true" />
          <div><strong>{{ column.label }}</strong><p>{{ column.locked ? 'Обязательный столбец' : 'Можно скрыть или переместить' }}</p></div>
          <TzToggle v-model="column.active" size="medium" :show-label="false" :label="column.label" :disabled="column.locked" />
        </article>
      </div>
    </div>

    <template #footer>
      <TzButton color="secondary" size="medium" @click="close">Отмена</TzButton>
      <TzButton size="medium" @click="apply">Сохранить</TzButton>
    </template>
  </TzModal>
</template>

<style scoped>
.column-settings{display:grid;height:100%;min-height:0;grid-template-rows:auto minmax(0,1fr)}
.column-settings__summary{display:flex;min-height:44px;padding:0 var(--padding-spacing-16);align-items:center;justify-content:space-between;color:var(--text-muted);border-bottom:1px solid var(--border-default);font:var(--tz-text-body-small)}
.column-settings__summary button{padding:var(--padding-spacing-4) var(--padding-spacing-8);color:var(--brand-primary);border:0;border-radius:var(--radius-xs);background:transparent;font:var(--tz-text-button-medium);cursor:pointer}.column-settings__summary button:hover{background:var(--brand-bg-hover)}
.column-settings__list{display:grid;min-height:0;padding:var(--padding-spacing-8);align-content:start;gap:var(--padding-spacing-8);overflow:auto}
.column-settings__list article{display:grid;min-height:56px;padding:var(--padding-spacing-8) var(--padding-spacing-12);grid-template-columns:16px minmax(0,1fr) auto;align-items:center;gap:var(--padding-spacing-12);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface)}
.column-settings__list article:not(.is-locked){cursor:grab}.column-settings__list article:not(.is-locked):active{cursor:grabbing}.column-settings__list article.is-locked{background:var(--bg-page)}
.column-settings__grip{color:var(--icon-default)}.is-locked .column-settings__grip{visibility:hidden}
.column-settings__list article>div{min-width:0}.column-settings__list strong{display:block;overflow:hidden;color:var(--text-default);font:var(--tz-text-body-strong);text-overflow:ellipsis;white-space:nowrap}.column-settings__list p{margin:0;color:var(--text-muted);font:var(--tz-text-caption-regular)}
</style>
