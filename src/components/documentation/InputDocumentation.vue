<script setup lang="ts">
import { ArrowUpRight, Check, ChevronRight, Settings } from '@lucide/vue'
import { ref } from 'vue'
import TzInput from '../forms/TzInput.vue'
import type { InputChip, InputSize, InputState } from '../forms/TzInput.vue'

const value = ref('')
const size = ref<InputSize>('large')
const required = ref(true)
const disabled = ref(false)
const withChips = ref(false)
const demoChips: InputChip[] = [{ id: 1, label: 'Chip', icon: ArrowUpRight }]
const states: { value: InputState; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'hover', label: 'Hover' },
  { value: 'active', label: 'Active' },
  { value: 'focus', label: 'Focus' },
  { value: 'filled', label: 'Filled' },
  { value: 'chips', label: 'Chips' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'disabled-chips', label: 'Disabled Chips' },
  { value: 'error', label: 'Error' },
]
const propsApi = [
  ['modelValue', 'string | number', "''", 'Значение поля, поддерживает v-model.'],
  ['size', "'large' | 'medium'", "'large'", 'Высота 44px или 32px.'],
  ['state', 'InputState', "'default'", 'Принудительное состояние для документации и тестов.'],
  ['label / showLabel', 'string / boolean', "'Name' / true", 'Заголовок поля.'],
  ['required', 'boolean', 'false', 'Показывает обязательность и добавляет required.'],
  ['disabled / readonly', 'boolean', 'false', 'Блокировка или режим только для чтения.'],
  ['iconLeft / iconRight', 'Component', '—', 'Иконки также можно передать через slots.'],
  ['chips', 'InputChip[]', '[]', 'Выбранные значения внутри поля.'],
  ['error', 'string', "''", 'Текст ошибки и error-состояние.'],
]

function valueFor(state: InputState) {
  return state === 'filled' || state === 'error' ? 'Введенное значение' : ''
}

function chipsFor(state: InputState) {
  return state === 'chips' || state === 'disabled-chips' ? demoChips : []
}
</script>

<template>
  <div class="input-docs">
    <header class="page-header">
      <div>
        <p class="eyebrow">COMPONENT · FORM CONTROL</p>
        <h1>Input</h1>
        <p>Поле ввода Target Zero из Figma node 123:2570: размеры, состояния, иконки, chips и validation.</p>
      </div>
      <span class="ready"><Check :size="14" /> Готово к проверке</span>
    </header>

    <section class="card">
      <header><h2>Интерактивный пример</h2><p>Введите значение и переключите конфигурацию компонента.</p></header>
      <div class="playground">
        <div class="controls">
          <div class="segmented"><button type="button" :class="{ active: size === 'large' }" @click="size = 'large'">Large · 44px</button><button type="button" :class="{ active: size === 'medium' }" @click="size = 'medium'">Medium · 32px</button></div>
          <label><input v-model="required" type="checkbox"> Обязательное</label>
          <label><input v-model="disabled" type="checkbox"> Disabled</label>
          <label><input v-model="withChips" type="checkbox"> С chip</label>
        </div>
        <div class="interactive-stage">
          <TzInput v-model="value" label="Name" :size="size" :required="required" :disabled="disabled" :chips="withChips ? demoChips : []" :icon-left="Settings" :icon-right="ChevronRight" @remove-chip="withChips = false" />
          <code>modelValue: {{ JSON.stringify(value) }}</code>
        </div>
      </div>
    </section>

    <section class="card">
      <header><h2>Состояния</h2><p>Полный набор из макета для двух размеров.</p></header>
      <div class="state-grid">
        <div class="state-grid__head"><span>State</span><span>Large · 44px</span><span>Medium · 32px</span></div>
        <div v-for="item in states" :key="item.value" class="state-grid__row">
          <strong>{{ item.label }}</strong>
          <TzInput :model-value="valueFor(item.value)" label="Name" required size="large" :state="item.value" :chips="chipsFor(item.value)" :icon-left="Settings" :icon-right="ChevronRight" :error="item.value === 'error' ? 'Error' : ''" />
          <TzInput :model-value="valueFor(item.value)" label="Name" required size="medium" :state="item.value" :chips="chipsFor(item.value)" :icon-left="Settings" :icon-right="ChevronRight" :error="item.value === 'error' ? 'Error' : ''" />
        </div>
      </div>
    </section>

    <section class="card">
      <header><h2>API</h2><p>Основные props компонента <code>TzInput</code>.</p></header>
      <div class="api-table">
        <div class="api-row api-head"><span>Prop</span><span>Type</span><span>Default</span><span>Описание</span></div>
        <div v-for="row in propsApi" :key="row[0]" class="api-row"><code>{{ row[0] }}</code><span>{{ row[1] }}</span><code>{{ row[2] }}</code><span>{{ row[3] }}</span></div>
      </div>
      <div class="contracts"><p><strong>Slots:</strong> <code>icon-left</code>, <code>icon-right</code></p><p><strong>Emits:</strong> <code>update:modelValue</code>, <code>change</code>, <code>focus</code>, <code>blur</code>, <code>enter</code>, <code>remove-chip</code>, <code>icon-left-click</code>, <code>icon-right-click</code></p></div>
    </section>
  </div>
</template>

<style scoped>
.input-docs { display: grid; gap: var(--padding-spacing-24); }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--padding-spacing-32); }
.eyebrow { margin: 0 0 var(--padding-spacing-8); color: var(--brand-primary); font: var(--tz-text-label-small); letter-spacing: .08em; }
.page-header h1 { margin: 0 0 var(--padding-spacing-8); color: var(--text-default); font: var(--tz-text-heading-page); }
.page-header p, .card header p { margin: 0; color: var(--text-muted); font: var(--tz-text-body-medium); }
.ready { display: flex; align-items: center; gap: var(--padding-spacing-6); padding: 7px 10px; color: var(--status-success-fg); border-radius: var(--radius-md); background: var(--status-success-bg); font: var(--tz-text-label-small); white-space: nowrap; }
.card { min-width: 0; padding: var(--padding-spacing-24); border: 1px solid var(--border-default); border-radius: var(--radius-lg); background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.card > header { margin-bottom: var(--padding-spacing-20); }
.card h2 { margin: 0 0 var(--padding-spacing-4); color: var(--text-default); font: var(--tz-text-heading-h2); }
.playground { display: grid; grid-template-columns: 280px minmax(320px, 480px); gap: var(--padding-spacing-32); padding: var(--padding-spacing-24); border-radius: var(--radius-md); background: var(--bg-page); }
.controls { display: flex; flex-direction: column; align-items: flex-start; gap: var(--padding-spacing-12); }
.controls label { display: flex; align-items: center; gap: var(--padding-spacing-8); color: var(--text-default); font: var(--tz-text-body-small); }
.segmented { display: flex; padding: var(--padding-spacing-2); border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--bg-surface); }
.segmented button { height: 28px; padding: 0 var(--padding-spacing-8); color: var(--text-muted); border: 0; border-radius: var(--radius-sm); background: transparent; font: var(--tz-text-label-small); cursor: pointer; }
.segmented button.active { color: var(--brand-primary); background: var(--brand-bg-active); }
.interactive-stage { display: grid; align-content: center; gap: var(--padding-spacing-12); }
.interactive-stage code, .contracts code, .api-row code { color: var(--brand-primary); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
.state-grid { overflow: auto; border: 1px solid var(--border-default); border-radius: var(--radius-md); }
.state-grid__head, .state-grid__row { display: grid; grid-template-columns: 100px minmax(300px, 1fr) minmax(300px, 1fr); min-width: 780px; gap: var(--padding-spacing-24); padding: var(--padding-spacing-16); align-items: center; border-bottom: 1px solid var(--border-default); }
.state-grid__head { color: var(--text-muted); background: var(--bg-page); font: var(--tz-text-label-medium); text-align: center; }
.state-grid__head span:first-child { text-align: left; }
.state-grid__row:last-child { border-bottom: 0; }
.state-grid__row > strong { color: var(--text-muted); font: var(--tz-text-label-small); text-transform: uppercase; }
.api-table { overflow: auto; border: 1px solid var(--border-default); border-radius: var(--radius-md); }
.api-row { display: grid; grid-template-columns: 180px 220px 120px minmax(260px, 1fr); min-width: 820px; min-height: 44px; align-items: center; border-bottom: 1px solid var(--border-default); }
.api-row:last-child { border-bottom: 0; }
.api-row > * { padding: var(--padding-spacing-8) var(--padding-spacing-12); }
.api-row span { color: var(--text-muted); font: var(--tz-text-body-small); }
.api-head { background: var(--bg-page); }
.api-head span { color: var(--text-default); font: var(--tz-text-label-medium); }
.contracts { display: grid; gap: var(--padding-spacing-8); margin-top: var(--padding-spacing-16); }
.contracts p { margin: 0; color: var(--text-muted); font: var(--tz-text-body-small); }
.contracts strong { color: var(--text-default); }
@media (max-width: 880px) { .playground { grid-template-columns: 1fr; } }
@media (max-width: 620px) { .page-header { flex-direction: column; } .card { padding: var(--padding-spacing-16); } }
</style>