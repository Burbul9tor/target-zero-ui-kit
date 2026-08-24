<script setup lang="ts">
import { ArrowUpRight, Check, ChevronRight, Info, Settings } from '@lucide/vue'
import { ref } from 'vue'
import TzInput from '../forms/TzInput.vue'
import type { InputChip, InputMultipleItem, InputSize, InputState } from '../forms/TzInput.vue'

const value = ref('')
const size = ref<InputSize>('large')
const required = ref(true)
const disabled = ref(false)
const clearable = ref(true)
const loading = ref(false)
const isTextarea = ref(false)
const withLeftIcon = ref(true)
const withRightIcon = ref(true)
const errorMessage = ref('')
const multipleItems = ref<InputMultipleItem[]>([])
const demoChips: InputChip[] = [{ id: 'chip-1', value: 'Chip', label: 'Chip', icon: ArrowUpRight }]
const states: { value: InputState; label: string }[] = [
  { value: 'default', label: 'Default' }, { value: 'hover', label: 'Hover' },
  { value: 'active', label: 'Active' }, { value: 'focus', label: 'Focus' },
  { value: 'filled', label: 'Filled' }, { value: 'chips', label: 'Chips' },
  { value: 'disabled', label: 'Disabled' }, { value: 'disabled-chips', label: 'Disabled Chips' },
  { value: 'error', label: 'Error' },
]
const propsApi = [
  ['id / name', 'string', "''", 'Атрибуты нативного поля.'],
  ['value', 'string | number | null', "''", 'Основная модель IKod: v-model:value.'],
  ['placeholder / type', 'string', "'' / 'text'", 'Подсказка и нативный тип поля.'],
  ['label / labelPosition', "string / 'left' | 'right'", "'' / 'left'", 'Заголовок и его выравнивание.'],
  ['errorMessage', 'string', "''", 'Текст ошибки и error-состояние.'],
  ['size', "'default' | 'small' | 'medium' | 'large'", "'default'", 'Размеры API IKod; стили Target Zero: 44px и 32px.'],
  ['iconLeft / iconRight', 'Component', 'undefined', 'Компоненты иконок слева и справа.'],
  ['iconColor / borderColor', 'ColorTypes | string', "'default'", 'Семантический цвет IKod или CSS-цвет.'],
  ['disabled / readonly / required', 'boolean', 'false', 'Нативные состояния поля.'],
  ['clearable / loading', 'boolean', 'false', 'Очистка значения и индикатор загрузки.'],
  ['isTextarea / resize', 'boolean / InputResize', "false / 'both'", 'Многострочный ввод, cols и rows.'],
  ['multiple / multipleItems', 'boolean / IMultipleItem[]', 'false / []', 'Выбранные элементы внутри поля.'],
  ['clickableMultipleItems', 'boolean', 'false', 'Разрешает взаимодействие с chip.'],
  ['maxLength', 'string | number', "''", 'Максимальная длина значения.'],
  ['disabledKeydownEnter', 'boolean', 'false', 'Отключает обработку Enter.'],
  ['prohibitedKeys', 'string[]', '[]', 'Запрещённые клавиши.'],
  ['passwordIconOn / passwordIconOff', 'Component', 'undefined', 'Переключение видимости пароля.'],
  ['onBlur / onFieldClick', 'Function', 'undefined', 'Callback совместимости IKod.'],
]
const slotsApi = ['icon-left', 'icon-right', 'button-left', 'button-right', 'clear-icon', 'label-suffix', 'chips { item }']
const emitsApi = ['update:value', 'update:multipleItems', 'clear']
const compatibilityApi = ['update:modelValue', 'change', 'focus', 'blur', 'enter', 'remove-chip', 'chip-click', 'icon-left-click', 'icon-right-click']

function valueFor(state: InputState) {
  return state === 'filled' || state === 'error' ? 'Введённое значение' : ''
}
function chipsFor(state: InputState) {
  return state === 'chips' || state === 'disabled-chips' ? demoChips : []
}
function toggleChip() {
  multipleItems.value = multipleItems.value.length ? [] : [...demoChips]
}
</script>

<template>
  <div class="input-docs">
    <header class="page-header">
      <div>
        <p class="eyebrow">COMPONENT · FORM CONTROL</p>
        <h1>Input</h1>
        <p>Функциональный контракт IKod UI Kit v0.2.2 и визуальная стилизация Target Zero из Figma node 123:2570.</p>
      </div>
      <span class="ready"><Check :size="14" /> Готово к проверке</span>
    </header>

    <section class="card">
      <header><h2>Интерактивный пример</h2><p>Пример использует API IKod: <code>v-model:value</code> и <code>v-model:multiple-items</code>.</p></header>
      <div class="playground">
        <div class="controls">
          <div class="segmented"><button type="button" :class="{ active: size === 'large' }" @click="size = 'large'">Large · 44px</button><button type="button" :class="{ active: size === 'medium' }" @click="size = 'medium'">Medium · 32px</button></div>
          <label><input v-model="required" type="checkbox"> Обязательное</label>
          <label><input v-model="disabled" type="checkbox"> Disabled</label>
          <label><input v-model="clearable" type="checkbox"> Clearable</label>
          <label><input v-model="loading" type="checkbox"> Loading</label>
          <label><input v-model="isTextarea" type="checkbox"> Textarea</label>
          <label><input v-model="withLeftIcon" type="checkbox"> Иконка слева</label>
          <label><input v-model="withRightIcon" type="checkbox"> Иконка справа</label>
          <button class="chip-toggle" type="button" @click="toggleChip">{{ multipleItems.length ? 'Убрать chip' : 'Добавить chip' }}</button>
        </div>
        <div class="interactive-stage">
          <TzInput
            id="input-demo" v-model:value="value" v-model:multiple-items="multipleItems"
            label="Name" placeholder="Введите значение" :size="size" :required="required"
            :disabled="disabled" :clearable="clearable" :loading="loading" :is-textarea="isTextarea"
            :icon-left="withLeftIcon ? Settings : undefined" :icon-right="withRightIcon ? ChevronRight : undefined" :error-message="errorMessage"
          >
            <template #label-suffix><Info :size="12" /></template>
          </TzInput>
          <label class="error-control"><input v-model="errorMessage" type="checkbox" true-value="Поле заполнено неверно" false-value=""> Показать ошибку</label>
          <code>value: {{ JSON.stringify(value) }} · multipleItems: {{ multipleItems.length }}</code>
        </div>
      </div>
    </section>

    <section class="card">
      <header><h2>Состояния Figma</h2><p>Визуальный набор Target Zero для двух используемых высот.</p></header>
      <div class="state-grid">
        <div class="state-grid__head"><span>State</span><span>Large · 44px</span><span>Medium · 32px</span></div>
        <div v-for="item in states" :key="item.value" class="state-grid__row">
          <strong>{{ item.label }}</strong>
          <TzInput :value="valueFor(item.value)" label="Name" placeholder="Введите значение" required size="large" :state="item.value" :multiple-items="chipsFor(item.value)" :icon-left="Settings" :icon-right="ChevronRight" :error-message="item.value === 'error' ? 'Error' : ''" />
          <TzInput :value="valueFor(item.value)" label="Name" placeholder="Введите значение" required size="medium" :state="item.value" :multiple-items="chipsFor(item.value)" :icon-left="Settings" :icon-right="ChevronRight" :error-message="item.value === 'error' ? 'Error' : ''" />
        </div>
      </div>
    </section>

    <section class="card">
      <header><h2>API IKod UI Kit</h2><p>Технический источник: <a href="https://ui-kit.ikod.kz/components/input" target="_blank" rel="noreferrer">Input · IKod/UI-Kit</a>.</p></header>
      <div class="api-table">
        <div class="api-row api-head"><span>Prop</span><span>Type</span><span>Default</span><span>Описание</span></div>
        <div v-for="row in propsApi" :key="row[0]" class="api-row"><code>{{ row[0] }}</code><span>{{ row[1] }}</span><code>{{ row[2] }}</code><span>{{ row[3] }}</span></div>
      </div>
      <div class="contracts">
        <p><strong>Slots:</strong> <code v-for="item in slotsApi" :key="item">{{ item }}</code></p>
        <p><strong>Emits IKod:</strong> <code v-for="item in emitsApi" :key="item">{{ item }}</code></p>
        <p><strong>Совместимость Target Zero:</strong> <code v-for="item in compatibilityApi" :key="item">{{ item }}</code></p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.input-docs{display:grid;gap:var(--padding-spacing-24)}.page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--padding-spacing-32)}.eyebrow{margin:0 0 var(--padding-spacing-8);color:var(--brand-primary);font:var(--tz-text-label-small);letter-spacing:.08em}.page-header h1{margin:0 0 var(--padding-spacing-8);color:var(--text-default);font:var(--tz-text-heading-display)}.page-header p,.card header p{margin:0;color:var(--text-muted);font:var(--tz-text-body-medium)}.ready{display:flex;align-items:center;gap:var(--padding-spacing-6);padding:7px 10px;color:var(--status-success-fg);border-radius:var(--radius-md);background:var(--status-success-bg);font:var(--tz-text-label-small);white-space:nowrap}
.card{min-width:0;padding:var(--padding-spacing-24);border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-surface);box-shadow:0 10px 15px -3px var(--bg-shadow)}.card>header{margin-bottom:var(--padding-spacing-20)}.card h2{margin:0 0 var(--padding-spacing-4);color:var(--text-default);font:var(--tz-text-heading-h2)}.card a{color:var(--brand-primary)}
.playground{display:grid;grid-template-columns:280px minmax(320px,480px);gap:var(--padding-spacing-32);padding:var(--padding-spacing-24);border-radius:var(--radius-md);background:var(--bg-page)}.controls{display:flex;flex-direction:column;align-items:flex-start;gap:var(--padding-spacing-12)}.controls label,.error-control{display:flex;align-items:center;gap:var(--padding-spacing-8);color:var(--text-default);font:var(--tz-text-body-small)}.segmented{display:flex;padding:var(--padding-spacing-2);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface)}.segmented button,.chip-toggle{height:28px;padding:0 var(--padding-spacing-8);color:var(--text-muted);border:0;border-radius:var(--radius-sm);background:transparent;font:var(--tz-text-label-small);cursor:pointer}.segmented button.active,.chip-toggle{color:var(--brand-primary);background:var(--brand-bg-active)}.interactive-stage{display:grid;align-content:center;gap:var(--padding-spacing-12)}
.interactive-stage code,.contracts code,.api-row code{color:var(--brand-primary);font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.state-grid{overflow:auto;border:1px solid var(--border-default);border-radius:var(--radius-md)}.state-grid__head,.state-grid__row{display:grid;grid-template-columns:100px minmax(300px,1fr) minmax(300px,1fr);min-width:780px;gap:var(--padding-spacing-24);padding:var(--padding-spacing-16);align-items:center;border-bottom:1px solid var(--border-default)}.state-grid__head{color:var(--text-muted);background:var(--bg-page);font:var(--tz-text-label-medium);text-align:center}.state-grid__head span:first-child{text-align:left}.state-grid__row:last-child{border-bottom:0}.state-grid__row>strong{color:var(--text-muted);font:var(--tz-text-label-small);text-transform:uppercase}
.api-table{overflow:auto;border:1px solid var(--border-default);border-radius:var(--radius-md)}.api-row{display:grid;grid-template-columns:210px 250px 120px minmax(260px,1fr);min-width:900px;min-height:44px;align-items:center;border-bottom:1px solid var(--border-default)}.api-row:last-child{border-bottom:0}.api-row>*{padding:var(--padding-spacing-8) var(--padding-spacing-12)}.api-row span{color:var(--text-muted);font:var(--tz-text-body-small)}.api-head{background:var(--bg-page)}.api-head span{color:var(--text-default);font:var(--tz-text-label-medium)}.contracts{display:grid;gap:var(--padding-spacing-8);margin-top:var(--padding-spacing-16)}.contracts p{display:flex;flex-wrap:wrap;gap:var(--padding-spacing-6);margin:0;color:var(--text-muted);font:var(--tz-text-body-small)}.contracts strong{color:var(--text-default)}
@media(max-width:880px){.playground{grid-template-columns:1fr}}@media(max-width:620px){.page-header{flex-direction:column}.card{padding:var(--padding-spacing-16)}}
</style>
