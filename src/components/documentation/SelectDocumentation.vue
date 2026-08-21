<script setup lang="ts">
import { Check } from '@lucide/vue'
import { ref } from 'vue'
import TzSelect, { type SelectMode, type SelectOption, type SelectState, type SelectValue } from '../forms/TzSelect.vue'

const options: SelectOption[] = [
  { label: 'Экология', value: 'ecology' },
  { label: 'Отходы', value: 'waste' },
  { label: 'Транспорт', value: 'transport' },
  { label: 'Энергия', value: 'energy' },
]

const states: Array<{ value: SelectState; label: string }> = [
  { value: 'default', label: 'Default' },
  { value: 'hover', label: 'Hover' },
  { value: 'active', label: 'Active' },
  { value: 'focus', label: 'Focus' },
  { value: 'filled', label: 'Filled' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'error', label: 'Error' },
]

const modes: Array<{ value: SelectMode; label: string }> = [
  { value: 'item', label: 'Item' },
  { value: 'radio', label: 'Radio button' },
  { value: 'checkbox', label: 'Check box' },
  { value: 'chips', label: 'Chips' },
]

const interactiveValue = ref<SelectValue>(null)
const interactiveSize = ref<'large' | 'medium'>('large')
const values = ref<Record<SelectMode, SelectValue>>({ item: null, radio: 'ecology', checkbox: ['ecology', 'waste'], chips: ['ecology', 'waste', 'transport'] })

function stateValue(state: SelectState): SelectValue {
  return ['filled', 'disabled', 'error'].includes(state) ? 'ecology' : null
}

function setModeValue(mode: SelectMode, value: SelectValue) {
  values.value = { ...values.value, [mode]: value }
}

const api = [
  ['modelValue', 'string | string[] | null', 'null'], ['options', 'SelectOption[]', 'required'],
  ['size', 'large | medium', 'large'], ['mode', 'item | radio | checkbox | chips', 'item'],
  ['label', 'string', 'Name'], ['placeholder', 'string', 'Введите значение'],
  ['required', 'boolean', 'true'], ['showLabel', 'boolean', 'true'],
  ['showLeadingIcon', 'boolean', 'true'], ['disabled', 'boolean', 'false'], ['error', 'string', '—'],
]

const tokens = [
  ['Surface', 'bg/surface', '#FFFFFF'], ['Disabled', 'bg/disabled', '#F2F3F3'],
  ['Border', 'border/default', '#E4E7E6'], ['Text', 'text/default', '#161616'],
  ['Placeholder', 'text/muted', '#717A7A'], ['Primary', 'brand/primary', '#407C65'],
  ['Focus shadow', 'effect/shadow', '#407C6533'], ['Error', 'status/error-fg', '#B91C1C'],
]
</script>

<template>
  <div class="select-docs">
    <header class="select-docs__header">
      <div><p class="select-docs__eyebrow">COMPONENT · INPUTS</p><h1>Select</h1><p>Компонент выбора одного или нескольких значений. Реализован по Figma node 313:12325.</p></div>
      <span><Check :size="14" /> Реализовано</span>
    </header>

    <section class="select-card">
      <header class="section-header">
        <div><h2>Интерактивный пример</h2><p>Откройте список, выберите значение и проверьте управление с клавиатуры.</p></div>
        <div class="segmented"><button type="button" :class="{ 'is-active': interactiveSize === 'large' }" @click="interactiveSize = 'large'">Large</button><button type="button" :class="{ 'is-active': interactiveSize === 'medium' }" @click="interactiveSize = 'medium'">Medium</button></div>
      </header>
      <div class="interactive-stage"><TzSelect v-model="interactiveValue" :options="options" :size="interactiveSize" label="Категория" /></div>
    </section>

    <section class="select-card">
      <header><h2>Состояния</h2><p>Полный набор визуальных состояний в размерах Large и Medium.</p></header>
      <div class="state-table">
        <div class="state-table__head"><span>State</span><strong>Large · 44px</strong><strong>Medium · 32px</strong></div>
        <div v-for="state in states" :key="state.value" class="state-row">
          <small>{{ state.label }}</small>
          <TzSelect :options="options" :state="state.value" :model-value="stateValue(state.value)" size="large" />
          <TzSelect :options="options" :state="state.value" :model-value="stateValue(state.value)" size="medium" />
        </div>
      </div>
    </section>

    <section class="select-card">
      <header><h2>Типы пунктов меню</h2><p>Обычный выбор, radio, checkbox и мультивыбор через chips.</p></header>
      <div class="mode-grid">
        <article v-for="mode in modes" :key="mode.value">
          <small>{{ mode.label }}</small>
          <TzSelect :model-value="values[mode.value]" :options="options" :mode="mode.value" size="medium" :label="mode.label" @update:model-value="setModeValue(mode.value, $event)" />
        </article>
      </div>
    </section>

    <section class="select-card">
      <header><h2>API</h2><p>Основные props Vue-компонента и значения по умолчанию.</p></header>
      <div class="select-table"><div class="select-table__row select-table__head"><span>Имя</span><span>Тип</span><span>По умолчанию</span></div><div v-for="row in api" :key="row[0]" class="select-table__row"><code>{{ row[0] }}</code><span>{{ row[1] }}</span><span>{{ row[2] }}</span></div></div>
    </section>

    <section class="select-card">
      <header><h2>Стили и токены</h2><p>Семантические роли и resolved values из макета.</p></header>
      <div class="token-grid"><article v-for="token in tokens" :key="token[0]"><strong>{{ token[0] }}</strong><code>{{ token[1] }}</code><span>{{ token[2] }}</span></article></div>
      <div class="specs"><span>Large <strong>44px</strong></span><span>Medium <strong>32px</strong></span><span>Radius <strong>8px</strong></span><span>Horizontal padding <strong>12px</strong></span><span>Icon <strong>16px</strong></span><span>Menu padding <strong>4px</strong></span></div>
    </section>
  </div>
</template>

<style scoped>
.select-docs { display: grid; gap: 24px; }
.select-docs__header, .section-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; }
.select-docs__eyebrow { margin: 0 0 8px; color: var(--brand-primary); font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.select-docs__header h1 { margin: 0 0 8px; color: var(--text-default); font: 700 32px/40px var(--tz-font-family); }
.select-docs__header p, .select-card header p { margin: 0; color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.select-docs__header > span { display: flex; align-items: center; gap: 6px; padding: 7px 10px; color: var(--status-success-fg); border-radius: 8px; background: var(--status-success-bg); font: 500 11px/16px var(--tz-font-family); white-space: nowrap; }
.select-card { padding: 24px; border: 1px solid var(--showcase-border); border-radius: 12px; background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.select-card > header { margin-bottom: 20px; }
.select-card h2 { margin: 0 0 4px; color: var(--text-default); font: 600 18px/24px var(--tz-font-family); }
.segmented { display: flex; padding: 2px; border: 1px solid var(--border-default); border-radius: 7px; background: var(--showcase-canvas); }
.segmented button { padding: 6px 10px; color: var(--text-muted); border: 0; border-radius: 5px; background: transparent; font: 500 11px/16px var(--tz-font-family); cursor: pointer; }
.segmented button.is-active { color: var(--brand-primary); background: var(--bg-surface); box-shadow: 0 1px 3px var(--bg-shadow); }
.interactive-stage { width: min(438px, 100%); padding: 24px; border-radius: 8px; background: var(--showcase-canvas); }
.state-table { display: grid; gap: 20px; padding: 20px; border-radius: 8px; background: var(--showcase-canvas); }
.state-table__head, .state-row { display: grid; grid-template-columns: 72px repeat(2, minmax(260px, 438px)); gap: 20px; align-items: start; }
.state-table__head { color: var(--text-muted); font: 500 10px/14px var(--tz-font-family); letter-spacing: .05em; text-transform: uppercase; }
.state-row small, .mode-grid article > small { padding-top: 22px; color: var(--text-muted); font: 500 10px/14px var(--tz-font-family); letter-spacing: .05em; text-transform: uppercase; }
.mode-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.mode-grid article { display: grid; gap: 12px; padding: 16px; border: 1px solid var(--showcase-border); border-radius: 8px; background: var(--showcase-canvas); }
.mode-grid article > small { padding-top: 0; }
.select-table { overflow: hidden; border: 1px solid var(--showcase-border); border-radius: 8px; }
.select-table__row { display: grid; grid-template-columns: .7fr 1.5fr .7fr; border-top: 1px solid var(--showcase-border); }
.select-table__row:first-child { border-top: 0; }
.select-table__row > * { padding: 10px 12px; color: var(--text-muted); font: 400 12px/16px var(--tz-font-family); }
.select-table__row > * + * { border-left: 1px solid var(--showcase-border); }
.select-table__head { background: var(--showcase-canvas); }
.select-table__head > * { color: var(--text-default); font-weight: 500; }
code { color: var(--brand-primary); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
.token-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.token-grid article { display: flex; flex-direction: column; gap: 3px; padding: 12px; border: 1px solid var(--showcase-border); border-radius: 8px; }
.token-grid strong { font: 500 12px/16px var(--tz-font-family); }
.token-grid code, .token-grid span { font: 400 10px/14px var(--tz-font-family); }
.token-grid span { color: var(--text-muted); }
.specs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.specs span { padding: 6px 8px; color: var(--text-muted); border-radius: 6px; background: var(--showcase-canvas); font: 400 11px/16px var(--tz-font-family); }
.specs strong { color: var(--text-default); font-weight: 500; }
@media (max-width: 1100px) { .state-table { overflow-x: auto; } .state-table__head, .state-row { min-width: 760px; } .token-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 700px) { .select-docs__header, .section-header { flex-direction: column; } .select-card { padding: 16px; } .mode-grid, .token-grid { grid-template-columns: 1fr; } .interactive-stage { padding: 16px; } .select-table { overflow-x: auto; } .select-table__row { min-width: 620px; } }
</style>
