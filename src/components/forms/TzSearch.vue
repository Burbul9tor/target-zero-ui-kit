<script setup lang="ts">
import { ArrowUpRight, CircleX, Search, X } from '@lucide/vue'
import { computed, ref } from 'vue'

export type SearchState = 'default' | 'hover' | 'active' | 'typing' | 'filled' | 'finished' | 'finished-multiple'

export type SearchChip = {
  id: string
  label: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    label?: string
    chips?: SearchChip[]
    chipMode?: boolean
    disabled?: boolean
    state?: SearchState
  }>(),
  {
    modelValue: '',
    placeholder: 'Поиск',
    label: 'Поиск',
    chips: () => [],
    chipMode: false,
    disabled: false,
    state: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:chips': [chips: SearchChip[]]
  search: [value: string]
  submit: [value: string]
  clear: []
  removeChip: [chip: SearchChip]
}>()

const input = ref<HTMLInputElement | null>(null)
const focused = ref(false)

const hasContent = computed(() => Boolean(props.modelValue) || props.chips.length > 0)
const resolvedState = computed<SearchState>(() => {
  if (props.state) return props.state
  if (props.chips.length > 1) return 'finished-multiple'
  if (props.chips.length === 1) return 'finished'
  if (focused.value && props.modelValue) return 'typing'
  if (focused.value) return 'active'
  if (props.modelValue) return 'filled'
  return 'default'
})

function updateValue(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('search', value)
}

function submitSearch() {
  const value = props.modelValue.trim()
  if (!value) return

  if (props.chipMode) {
    const exists = props.chips.some((chip) => chip.label.toLocaleLowerCase() === value.toLocaleLowerCase())
    if (!exists) {
      emit('update:chips', [...props.chips, { id: `search-${Date.now()}`, label: value }])
    }
    emit('update:modelValue', '')
  }

  emit('submit', value)
}

function removeChip(chip: SearchChip) {
  emit('update:chips', props.chips.filter((item) => item.id !== chip.id))
  emit('removeChip', chip)
  input.value?.focus()
}

function clear() {
  emit('update:modelValue', '')
  emit('update:chips', [])
  emit('search', '')
  emit('clear')
  input.value?.focus()
}

function focus() {
  input.value?.focus()
}

defineExpose({ focus, clear })
</script>

<template>
  <div
    class="tz-search"
    :class="[`tz-search--${resolvedState}`, { 'tz-search--disabled': disabled }]"
    role="search"
    @click="focus"
  >
    <Search class="tz-search__search-icon" :size="16" :stroke-width="1.5" aria-hidden="true" />

    <div v-if="chips.length" class="tz-search__chips">
      <span v-for="chip in chips" :key="chip.id" class="tz-search__chip">
        <ArrowUpRight :size="16" :stroke-width="1.5" aria-hidden="true" />
        <span>{{ chip.label }}</span>
        <button type="button" :aria-label="`Удалить ${chip.label}`" @click.stop="removeChip(chip)">
          <CircleX :size="16" :stroke-width="1.5" aria-hidden="true" />
        </button>
      </span>
    </div>

    <input
      ref="input"
      class="tz-search__input"
      type="search"
      :value="modelValue"
      :placeholder="chips.length ? '' : placeholder"
      :aria-label="label"
      :disabled="disabled"
      @input="updateValue"
      @focus="focused = true"
      @blur="focused = false"
      @keydown.enter.prevent="submitSearch"
    />

    <button v-if="hasContent" class="tz-search__clear" type="button" aria-label="Очистить поиск" :disabled="disabled" @click.stop="clear">
      <X :size="16" :stroke-width="1.5" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.tz-search {
  display: flex;
  width: 100%;
  min-width: 0;
  height: 32px;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  color: var(--text-default);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  background: var(--bg-surface);
  transition: border-color 140ms ease, box-shadow 140ms ease;
  cursor: text;
}

.tz-search__search-icon {
  flex: 0 0 16px;
  color: var(--icon-default);
}

.tz-search__input {
  min-width: 24px;
  height: 20px;
  flex: 1;
  padding: 0;
  color: var(--tz-text-primary);
  border: 0;
  outline: 0;
  background: transparent;
  font: 400 14px/20px var(--tz-font-family);
}

.tz-search__input::placeholder { color: var(--text-muted); opacity: 1; }
.tz-search--hover .tz-search__input::placeholder { color: var(--tz-text-subtle); }
.tz-search__input::-webkit-search-cancel-button { display: none; }

.tz-search__clear, .tz-search__chip button {
  display: grid;
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  padding: 0;
  place-items: center;
  color: var(--icon-default);
  border: 0;
  background: transparent;
  cursor: pointer;
}

.tz-search__chips {
  display: flex;
  min-width: 0;
  gap: 8px;
  overflow: hidden;
}

.tz-search__chip {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  color: var(--text-default);
  border-radius: 6px;
  background: var(--brand-bg-chip);
  font: 400 12px/16px var(--tz-font-family);
  white-space: nowrap;
}

.tz-search--hover,
.tz-search:not(.tz-search--disabled):hover {
  box-shadow: 0 0 4px 2px var(--effect-shadow);
}

.tz-search--active,
.tz-search--finished {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px var(--effect-shadow);
}

.tz-search--typing,
.tz-search--finished-multiple {
  border-color: var(--brand-primary);
}

.tz-search--disabled {
  color: var(--text-muted);
  background: var(--bg-disabled);
  cursor: not-allowed;
}

.tz-search--disabled .tz-search__input,
.tz-search--disabled .tz-search__clear { cursor: not-allowed; }
</style>
