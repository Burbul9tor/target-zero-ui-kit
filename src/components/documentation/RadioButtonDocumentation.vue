<script setup lang="ts">
import { Check } from '@lucide/vue'
import { ref } from 'vue'
import TzRadioButton from '../forms/TzRadioButton.vue'

const selected = ref('balanced')
const compactValue = ref(2)
const api = [
  ['modelValue', 'string | number | boolean | null', 'Выбранное значение группы через v-model'],
  ['value', 'string | number | boolean', 'Значение конкретного варианта'],
  ['label', 'string', 'Текст подписи'],
  ['showLabel', 'boolean', 'Показывает или скрывает подпись'],
  ['name', 'string', 'Объединяет нативные radio в одну HTML-группу'],
  ['disabled', 'boolean', 'Отключает выбор варианта'],
  ['required', 'boolean', 'Передаёт required нативному input'],
]
</script>

<template>
  <div class="radio-docs">
    <header class="page-header">
      <div><p class="eyebrow">COMPONENT · FORMS</p><h1>Radio Button</h1><p>Используется для выбора ровно одного варианта из небольшой группы взаимоисключающих значений.</p></div>
      <span class="ready"><Check :size="14" /> Готово</span>
    </header>

    <section class="card">
      <header><h2>Состояния из макета</h2><p>Контрол 20×20 px, подпись 14/20, расстояние между контролом и текстом 8 px.</p></header>
      <div class="states">
        <article><span>Default</span><TzRadioButton :model-value="null" value="default" label="Label" /></article>
        <article class="forced-hover"><span>Hover</span><TzRadioButton :model-value="null" value="hover" label="Label" /></article>
        <article><span>Select</span><TzRadioButton model-value="selected" value="selected" label="Label" /></article>
        <article><span>Disabled selected</span><TzRadioButton model-value="selected" value="selected" label="Label" disabled /></article>
        <article><span>Disabled</span><TzRadioButton :model-value="null" value="disabled" label="Label" disabled /></article>
      </div>
    </section>

    <section class="card">
      <header><h2>Группа выбора</h2><p>Все элементы используют одно состояние <code>v-model</code> и одинаковый атрибут <code>name</code>.</p></header>
      <fieldset class="radio-group">
        <legend>Режим контроля</legend>
        <TzRadioButton v-model="selected" name="control-mode" value="strict" label="Строгий" />
        <TzRadioButton v-model="selected" name="control-mode" value="balanced" label="Сбалансированный" />
        <TzRadioButton v-model="selected" name="control-mode" value="advisory" label="Рекомендательный" />
      </fieldset>
      <p class="result">Выбрано: <code>{{ selected }}</code></p>
    </section>

    <section class="card">
      <header><h2>Типизированные значения</h2><p>Компонент сохраняет исходный тип значения — здесь используется <code>number</code>, а не строка.</p></header>
      <div class="inline-group"><TzRadioButton v-for="item in [1, 2, 3]" :key="item" v-model="compactValue" name="level" :value="item" :label="`Уровень ${item}`" /></div>
      <p class="result">Значение: <code>{{ compactValue }}</code></p>
    </section>

    <section class="card usage-card">
      <header><h2>Правила использования</h2></header>
      <div class="usage-grid">
        <article><strong>Один вариант</strong><p>Radio Button подходит, когда одновременно может быть выбран только один пункт.</p></article>
        <article><strong>Показывайте варианты сразу</strong><p>Для длинного списка используйте Select, для короткого переключения представления — Segmented Control.</p></article>
        <article><strong>Начальное значение</strong><p>Если безопасный вариант известен, выберите его заранее. Не оставляйте обязательную группу без понятного состояния.</p></article>
        <article><strong>Не снимайте выбор повторным нажатием</strong><p>Пользователь меняет значение выбором другого radio, что соответствует нативному поведению.</p></article>
      </div>
    </section>

    <section class="card">
      <header><h2>API</h2><p>Компонент основан на нативном <code>input[type=radio]</code> и поддерживает формы и клавиатурную навигацию.</p></header>
      <div class="api"><div v-for="item in api" :key="item[0]"><code>{{ item[0] }}</code><code>{{ item[1] }}</code><span>{{ item[2] }}</span></div></div>
      <p class="api-note"><strong>Slot:</strong> <code>#default</code>. <strong>Emits:</strong> <code>update:modelValue</code>, <code>change</code>.</p>
    </section>
  </div>
</template>

<style scoped>
.radio-docs{display:grid;gap:var(--padding-spacing-24)}.page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--padding-spacing-24)}.eyebrow{margin:0 0 var(--padding-spacing-8);color:var(--brand-primary);font:var(--tz-text-label-small);letter-spacing:.08em}.page-header h1{margin:0 0 var(--padding-spacing-8);color:var(--text-default);font:var(--tz-text-heading-display)}.page-header p,.card header p{max-width:840px;margin:0;color:var(--text-muted);font:var(--tz-text-body-medium)}.ready{display:flex;padding:7px 10px;align-items:center;gap:var(--padding-spacing-6);color:var(--status-success-fg);border-radius:var(--radius-md);background:var(--status-success-bg);font:var(--tz-text-label-small);white-space:nowrap}.card{min-width:0;padding:var(--padding-spacing-24);border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-surface);box-shadow:0 10px 15px -3px var(--bg-shadow)}.card>header{margin-bottom:var(--padding-spacing-20)}.card h2{margin:0 0 var(--padding-spacing-4);color:var(--text-default);font:600 18px/24px var(--tz-font-family)}.states{display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--padding-spacing-32)}.states article{display:grid;gap:var(--padding-spacing-8)}.states article>span{color:var(--text-muted);font:var(--tz-text-label-small)}.forced-hover :deep(.tz-radio__control){border-color:var(--brand-primary)}.radio-group{display:grid;max-width:440px;margin:0;padding:var(--padding-spacing-16);gap:var(--padding-spacing-12);border:1px solid var(--border-default);border-radius:var(--radius-md)}.radio-group legend{padding:0 var(--padding-spacing-6);color:var(--text-default);font:var(--tz-text-body-strong)}.inline-group{display:flex;flex-wrap:wrap;gap:var(--padding-spacing-24)}.result{margin:var(--padding-spacing-12) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}code{color:var(--brand-primary);font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.usage-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--padding-spacing-12)}.usage-grid article{padding:var(--padding-spacing-16);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.usage-grid strong{color:var(--text-default);font:var(--tz-text-body-strong)}.usage-grid p{margin:var(--padding-spacing-6) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}.api{overflow:hidden;border:1px solid var(--border-default);border-radius:var(--radius-md)}.api>div{display:grid;grid-template-columns:1fr 1.4fr 2.2fr;gap:var(--padding-spacing-12);padding:var(--padding-spacing-12);border-top:1px solid var(--border-default);font:var(--tz-text-body-small)}.api>div:first-child{border-top:0}.api-note{margin:var(--padding-spacing-12) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}@media(max-width:700px){.page-header{flex-direction:column}.usage-grid{grid-template-columns:1fr}.card{padding:var(--padding-spacing-16)}.api{overflow-x:auto}.api>div{min-width:600px}}
</style>
