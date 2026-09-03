<script setup lang="ts">
import { ChevronRight, Factory } from '@lucide/vue'
import { computed, ref } from 'vue'
import TzButton from '../../actions/TzButton.vue'
import TzModal from '../../feedback/TzModal.vue'
import TzSearch from '../../forms/TzSearch.vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const query = ref('')
const selected = ref<string[]>([])
const objects = [
  'Карьер Костанай', 'Карьер Алматы', 'Карьер Астана', 'Карьер Актобе',
  'Карьер Павлодар', 'Карьер Караганда', 'Карьер Атырау', 'Карьер Актау',
  'Карьер Уральск', 'Карьер Тараз', 'Карьер Шымкент', 'Карьер Семей',
  'Карьер Кокшетау', 'Карьер Петропавловск', 'Карьер Талдыкорган',
]

const filteredObjects = computed(() => {
  const value = query.value.trim().toLocaleLowerCase()
  return value ? objects.filter(object => object.toLocaleLowerCase().includes(value)) : objects
})

function toggle(object: string) {
  selected.value = selected.value.includes(object)
    ? selected.value.filter(value => value !== object)
    : [...selected.value, object]
}

function close() { emit('update:modelValue', false) }
</script>

<template>
  <TzModal
    :model-value="props.modelValue"
    title="Выберите объект"
    width="600px"
    height="760px"
    initial-focus=".tz-search__input"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="object-picker">
      <div class="object-picker__search">
        <TzSearch v-model="query" label="Поиск объектов" placeholder="Поиск по объектам" />
      </div>

      <div class="object-picker__list" role="listbox" aria-label="Объекты" aria-multiselectable="true">
        <button
          v-for="object in filteredObjects"
          :key="object"
          type="button"
          class="object-picker__row"
          role="option"
          :aria-selected="selected.includes(object)"
          @click="toggle(object)"
        >
          <ChevronRight class="object-picker__chevron" :size="20" :stroke-width="1.5" aria-hidden="true" />
          <Factory class="object-picker__factory" :size="20" :stroke-width="1.5" aria-hidden="true" />
          <i class="object-picker__checkbox" :class="{ checked: selected.includes(object) }" aria-hidden="true" />
          <span>{{ object }}</span>
        </button>
        <p v-if="!filteredObjects.length" class="object-picker__empty">Объекты не найдены</p>
      </div>
    </div>

    <template #footer>
      <TzButton size="medium" color="text" :disabled="!selected.length" @click="selected = []">Сбросить</TzButton>
      <TzButton size="medium" @click="close">Применить ({{ selected.length }})</TzButton>
    </template>
  </TzModal>
</template>

<style scoped>
.object-picker{display:grid;height:100%;min-height:0;grid-template-rows:auto minmax(0,1fr)}
.object-picker__search{padding:var(--padding-spacing-8) var(--padding-spacing-16)}
.object-picker__list{min-height:0;padding-bottom:var(--padding-spacing-8);overflow:auto;scrollbar-color:var(--brand-primary) var(--gray-100);scrollbar-width:thin}
.object-picker__list::-webkit-scrollbar{width:10px}.object-picker__list::-webkit-scrollbar-track{background:var(--gray-100)}.object-picker__list::-webkit-scrollbar-thumb{border:2px solid var(--gray-100);border-radius:var(--radius-xs);background:var(--brand-primary)}
.object-picker__row{display:flex;width:100%;min-height:42px;padding:var(--padding-spacing-8) var(--padding-spacing-16);align-items:center;gap:var(--padding-spacing-8);color:var(--text-default);border:0;border-radius:var(--radius-md);background:transparent;font:var(--tz-text-body-medium);text-align:left;cursor:pointer}
.object-picker__row:hover{background:var(--brand-bg-hover)}.object-picker__row:focus-visible{outline:2px solid var(--brand-primary);outline-offset:-2px}
.object-picker__chevron{flex:0 0 20px;color:var(--icon-default)}.object-picker__factory{flex:0 0 20px;color:var(--brand-primary)}
.object-picker__checkbox{position:relative;box-sizing:border-box;flex:0 0 20px;width:20px;height:20px;border:1px solid var(--text-placeholder,var(--gray-400));border-radius:var(--radius-xs);background:var(--bg-surface)}
.object-picker__checkbox.checked{border-color:var(--brand-primary);background:var(--brand-primary)}.object-picker__checkbox.checked::after{position:absolute;top:4px;left:4px;width:9px;height:5px;border-bottom:2px solid var(--text-button-fill);border-left:2px solid var(--text-button-fill);content:'';transform:rotate(-45deg)}
.object-picker__row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.object-picker__empty{display:grid;min-height:160px;margin:0;place-items:center;color:var(--text-muted);font:var(--tz-text-body-medium)}
</style>
