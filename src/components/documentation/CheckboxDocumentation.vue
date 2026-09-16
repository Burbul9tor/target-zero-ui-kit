<script setup lang="ts">
import { Check } from '@lucide/vue'
import { computed, ref } from 'vue'
import TzCheckbox from '../forms/TzCheckbox.vue'

const checked = ref(false)
const selected = ref<string[]>(['Экология'])
const options = ['Экология', 'Охрана труда', 'Промышленная безопасность']
const allChecked = computed(() => selected.value.length === options.length)
const someChecked = computed(() => selected.value.length > 0 && !allChecked.value)

function toggleOption(option: string, value: boolean) {
  selected.value = value ? [...selected.value, option] : selected.value.filter(item => item !== option)
}

function toggleAll(value: boolean) {
  selected.value = value ? [...options] : []
}

const api = [
  ['modelValue', 'boolean', 'Управляемое выбранное состояние через v-model'],
  ['indeterminate', 'boolean', 'Частичный выбор группы'],
  ['label', 'string', 'Текст подписи'],
  ['showLabel', 'boolean', 'Показывает или скрывает подпись'],
  ['disabled', 'boolean', 'Отключает изменение значения'],
  ['required', 'boolean', 'Передаёт required нативному input'],
  ['name / value', 'string', 'Значения для отправки HTML-формы'],
]
</script>

<template>
  <div class="checkbox-docs">
    <header class="page-header">
      <div><p class="eyebrow">COMPONENT · FORMS</p><h1>Checkbox</h1><p>Позволяет независимо включать и выключать один или несколько параметров. Для выбора одного варианта используйте Radio Button.</p></div>
      <span class="ready"><Check :size="14" /> Готово</span>
    </header>

    <section class="card">
      <header><h2>Состояния из макета</h2><p>Контрол 20×20 px, радиус 4 px, расстояние до подписи 8 px.</p></header>
      <div class="states">
        <article><span>Default</span><TzCheckbox label="Label" /></article>
        <article class="forced-hover"><span>Hover</span><TzCheckbox label="Label" /></article>
        <article><span>Select</span><TzCheckbox label="Label" :model-value="true" /></article>
        <article><span>Disabled</span><TzCheckbox label="Label" :model-value="true" disabled /></article>
        <article><span>Без подписи</span><TzCheckbox :show-label="false" /></article>
      </div>
    </section>

    <section class="card">
      <header><h2>Интерактивный пример</h2><p>Компонент использует нативный input, поэтому работает с клавиатурой, формами и assistive technologies.</p></header>
      <div class="interactive"><TzCheckbox v-model="checked" label="Получать уведомления" /><p>Значение: <code>{{ checked }}</code></p></div>
    </section>

    <section class="card">
      <header><h2>Групповой выбор</h2><p>Состояние indeterminate показывает, что выбрана только часть дочерних значений.</p></header>
      <div class="checklist">
        <TzCheckbox :model-value="allChecked" :indeterminate="someChecked" label="Все направления" @update:model-value="toggleAll" />
        <div class="checklist__children"><TzCheckbox v-for="option in options" :key="option" :model-value="selected.includes(option)" :label="option" @update:model-value="toggleOption(option, $event)" /></div>
      </div>
    </section>

    <section class="card usage-card">
      <header><h2>Правила использования</h2></header>
      <div class="usage-grid">
        <article><strong>Множественный выбор</strong><p>Каждый пункт изменяется независимо. Для взаимоисключающих вариантов используйте Radio Button или Segmented Control.</p></article>
        <article><strong>Понятная подпись</strong><p>Формулируйте label как состояние или действие: «Получать уведомления», «Показывать архивные».</p></article>
        <article><strong>Indeterminate</strong><p>Используйте только для родительского пункта группы. Пользователь не задаёт это состояние напрямую.</p></article>
        <article><strong>Большая область нажатия</strong><p>Подпись включена в label, поэтому нажатие на текст также переключает значение.</p></article>
      </div>
    </section>

    <section class="card">
      <header><h2>API</h2><p>Галочка и знак частичного выбора используют Check и Minus из раздела Icon.</p></header>
      <div class="api"><div v-for="item in api" :key="item[0]"><code>{{ item[0] }}</code><code>{{ item[1] }}</code><span>{{ item[2] }}</span></div></div>
      <p class="api-note"><strong>Slot:</strong> <code>#default</code>. <strong>Emits:</strong> <code>update:modelValue</code>, <code>change</code>.</p>
    </section>
  </div>
</template>

<style scoped>
.checkbox-docs{display:grid;gap:var(--padding-spacing-24)}.page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--padding-spacing-24)}.eyebrow{margin:0 0 var(--padding-spacing-8);color:var(--brand-primary);font:var(--tz-text-label-small);letter-spacing:.08em}.page-header h1{margin:0 0 var(--padding-spacing-8);color:var(--text-default);font:var(--tz-text-heading-display)}.page-header p,.card header p{max-width:840px;margin:0;color:var(--text-muted);font:var(--tz-text-body-medium)}.ready{display:flex;padding:7px 10px;align-items:center;gap:var(--padding-spacing-6);color:var(--status-success-fg);border-radius:var(--radius-md);background:var(--status-success-bg);font:var(--tz-text-label-small);white-space:nowrap}.card{min-width:0;padding:var(--padding-spacing-24);border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-surface);box-shadow:0 10px 15px -3px var(--bg-shadow)}.card>header{margin-bottom:var(--padding-spacing-20)}.card h2{margin:0 0 var(--padding-spacing-4);color:var(--text-default);font:600 18px/24px var(--tz-font-family)}.states{display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--padding-spacing-32)}.states article{display:grid;gap:var(--padding-spacing-8)}.states article>span{color:var(--text-muted);font:var(--tz-text-label-small)}.forced-hover :deep(.tz-checkbox__control){border-color:var(--brand-primary)}.interactive{display:flex;align-items:center;gap:var(--padding-spacing-24)}.interactive p{margin:0;color:var(--text-muted);font:var(--tz-text-body-small)}code{color:var(--brand-primary);font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.checklist{display:grid;max-width:440px;gap:var(--padding-spacing-12)}.checklist__children{display:grid;padding-left:var(--padding-spacing-28,28px);gap:var(--padding-spacing-12)}.usage-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--padding-spacing-12)}.usage-grid article{padding:var(--padding-spacing-16);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.usage-grid strong{color:var(--text-default);font:var(--tz-text-body-strong)}.usage-grid p{margin:var(--padding-spacing-6) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}.api{overflow:hidden;border:1px solid var(--border-default);border-radius:var(--radius-md)}.api>div{display:grid;grid-template-columns:1fr 1.4fr 2.2fr;gap:var(--padding-spacing-12);padding:var(--padding-spacing-12);border-top:1px solid var(--border-default);font:var(--tz-text-body-small)}.api>div:first-child{border-top:0}.api-note{margin:var(--padding-spacing-12) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}@media(max-width:700px){.page-header{flex-direction:column}.usage-grid{grid-template-columns:1fr}.card{padding:var(--padding-spacing-16)}.api{overflow-x:auto}.api>div{min-width:600px}}
</style>
