<script setup lang="ts">
import { Check, Grid3X3, List, Rows3 } from '@lucide/vue'
import { ref } from 'vue'
import TzSegmentedControl, { type SegmentedItem, type SegmentedValue } from '../forms/TzSegmentedControl.vue'

const health = ref<SegmentedValue>('normal')
const period = ref<SegmentedValue>('month')
const view = ref<SegmentedValue>('list')
const status = ref<SegmentedValue>('all')
const compactValue = ref<SegmentedValue>(1)

const healthItems: SegmentedItem[] = [
  { value: 'normal', label: 'В пределах нормы' },
  { value: 'near', label: 'Близко к лимиту' },
  { value: 'over', label: 'Лимит превышен' },
]
const periodItems: SegmentedItem[] = [
  { value: 'day', label: 'День' }, { value: 'week', label: 'Неделя' }, { value: 'month', label: 'Месяц' },
]
const viewItems: SegmentedItem[] = [
  { value: 'list', label: 'Список', icon: List }, { value: 'grid', label: 'Плитка', icon: Grid3X3 }, { value: 'compact', label: 'Компактно', icon: Rows3 },
]
const statusItems: SegmentedItem[] = [
  { value: 'all', label: 'Все', count: 24 }, { value: 'active', label: 'Активные', count: 8 }, { value: 'done', label: 'Завершённые', count: 16 },
]
const compactItems: SegmentedItem[] = [1, 2, 3, 4, 5].map(value => ({ value, label: String(value) }))

const api = [
  ['modelValue', 'string | number', 'Выбранное значение'],
  ['items', 'SegmentedItem[]', 'value, label, icon, count и disabled'],
  ['label', 'string', 'Видимая подпись и доступное имя группы'],
  ['appearance', 'filled | surface', 'Filled по референсу; surface для компактной панели'],
  ['size', 'compact | small | medium | large', 'Compact — 24px по макету; medium по умолчанию'],
  ['fluid', 'boolean', 'Равномерно распределяет сегменты по ширине'],
  ['disabled', 'boolean', 'Блокирует всю группу'],
]
</script>

<template>
  <div class="segmented-docs">
    <header class="page-header">
      <div><p class="eyebrow">SELECTION · SINGLE VALUE</p><h1>Segmented Control</h1><p>Компактный выбор одного значения из небольшого набора взаимно исключающих вариантов.</p></div>
      <span class="ready"><Check :size="14" /> Готово</span>
    </header>

    <section class="card reference-card">
      <header><h2>Основной вариант</h2><p>Filled соответствует референсу: нейтральные сегменты разделены промежутками, выбранный вариант выделен цветом бренда.</p></header>
      <div class="reference-stage">
        <TzSegmentedControl v-model="health" label="Статус" :items="healthItems" size="large" fluid />
      </div>
    </section>

    <section class="card">
      <header><h2>Компактный размер</h2><p>Вариант из Figma node 3581:164960 для плотных панелей: высота 24px, отступы 2×16px, текст 14/20 и радиус 6px.</p></header>
      <div class="compact-stage">
        <TzSegmentedControl v-model="compactValue" :items="compactItems" size="compact" aria-label="Компактный выбор значения" />
        <code>size="compact"</code>
      </div>
    </section>

    <section class="card">
      <header><h2>Когда использовать</h2><p>Переключатель подходит для короткого, мгновенного выбора без открытия меню.</p></header>
      <div class="usage-grid">
        <article class="do"><strong>Используйте</strong><ul><li>для 2–5 взаимоисключающих вариантов;</li><li>когда все варианты важно видеть сразу;</li><li>для режима отображения, периода, статуса или фильтра;</li><li>когда выбор применяется сразу после нажатия.</li></ul></article>
        <article class="dont"><strong>Не используйте</strong><ul><li>для множественного выбора — нужен Checkbox;</li><li>для длинного списка — нужен Select;</li><li>для перехода между разделами — нужны Tabs;</li><li>для отдельных команд — нужны Buttons.</li></ul></article>
      </div>
    </section>

    <section class="card">
      <header><h2>Варианты содержимого и стиля</h2><p>Текст может дополняться иконкой или счётчиком. Во всех вариантах выбранный сегмент выделяется зелёной заливкой и белым текстом.</p></header>
      <div class="examples">
        <article><small>TEXT · FILLED</small><TzSegmentedControl v-model="period" :items="periodItems" /></article>
        <article><small>ICON + TEXT · FILLED</small><TzSegmentedControl v-model="view" :items="viewItems" size="large" /></article>
        <article><small>COUNTERS · FLUID</small><TzSegmentedControl v-model="status" :items="statusItems" fluid /></article>
        <article><small>SURFACE · COMPACT</small><TzSegmentedControl v-model="period" :items="periodItems" appearance="surface" /></article>
        <article><small>DISABLED</small><TzSegmentedControl :model-value="'week'" :items="periodItems" disabled /></article>
      </div>
    </section>

    <section class="card">
      <header><h2>Поведение</h2><p>Это контрол выбора, поэтому используется семантика radio, а не tab.</p></header>
      <div class="rules">
        <article><strong>Выбор</strong><p>Активен только один сегмент. Нажатие обновляет <code>v-model</code> и вызывает событие <code>change</code>.</p></article>
        <article><strong>Клавиатура</strong><p>Стрелки переключают значение, Home и End выбирают крайний доступный сегмент.</p></article>
        <article><strong>Доступность</strong><p><code>radiogroup</code>, <code>radio</code>, <code>aria-checked</code> и управляемый tabindex.</p></article>
        <article><strong>Подписи</strong><p>Формулируйте варианты параллельно и коротко. Не меняйте смысл выбранного состояния только цветом.</p></article>
      </div>
    </section>

    <section class="card">
      <header><h2>API</h2><p>Минимальный управляемый контракт Vue 3.</p></header>
      <div class="api"><div v-for="item in api" :key="item[0]"><code>{{ item[0] }}</code><code>{{ item[1] }}</code><span>{{ item[2] }}</span></div></div>
    </section>
  </div>
</template>

<style scoped>
.segmented-docs{display:grid;gap:var(--padding-spacing-24)}.page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--padding-spacing-32)}.eyebrow{margin:0 0 var(--padding-spacing-8);color:var(--brand-primary);font:500 10px/14px var(--tz-font-family);letter-spacing:.08em}.page-header h1{margin:0 0 var(--padding-spacing-8);color:var(--text-default);font:700 32px/40px var(--tz-font-family)}.page-header p,.card header p{margin:0;color:var(--text-muted);font:var(--tz-text-body-medium)}.ready{display:flex;align-items:center;gap:var(--padding-spacing-6);padding:7px 10px;color:var(--status-success-fg);border-radius:var(--radius-md);background:var(--status-success-bg);font:500 11px/16px var(--tz-font-family);white-space:nowrap}
.card{min-width:0;padding:var(--padding-spacing-24);border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-surface);box-shadow:0 10px 15px -3px var(--bg-shadow)}.card>header{margin-bottom:var(--padding-spacing-20)}.card h2{margin:0 0 var(--padding-spacing-4);color:var(--text-default);font:600 18px/24px var(--tz-font-family)}.reference-stage{padding:var(--padding-spacing-24);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface)}
.compact-stage{display:flex;min-height:96px;padding:var(--padding-spacing-20);flex-direction:column;align-items:flex-start;justify-content:center;gap:var(--padding-spacing-12);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}
.usage-grid,.rules{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--padding-spacing-12)}.usage-grid article,.rules article{padding:var(--padding-spacing-16);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.usage-grid .do{border-color:color-mix(in srgb,var(--brand-primary) 28%,var(--border-default));background:var(--brand-bg-hover)}.usage-grid .dont{border-color:color-mix(in srgb,var(--status-error-fg) 24%,var(--border-default));background:var(--status-error-bg)}.usage-grid strong,.rules strong{font:var(--tz-text-body-strong)}.usage-grid ul{margin:var(--padding-spacing-8) 0 0;padding-left:var(--padding-spacing-20);color:var(--text-muted);font:var(--tz-text-body-small)}.usage-grid li+li{margin-top:var(--padding-spacing-6)}.rules p{margin:var(--padding-spacing-6) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}
.examples{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--padding-spacing-12)}.examples article{display:flex;min-width:0;min-height:128px;padding:var(--padding-spacing-20);flex-direction:column;align-items:flex-start;justify-content:center;gap:var(--padding-spacing-12);overflow-x:auto;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.examples article:nth-child(3){grid-column:1/-1}.examples small{color:var(--text-muted);font:500 10px/14px var(--tz-font-family);letter-spacing:.05em}
code{color:var(--brand-primary)}.api{overflow:hidden;border:1px solid var(--border-default);border-radius:var(--radius-md)}.api>div{display:grid;grid-template-columns:1fr 1.2fr 2fr;gap:var(--padding-spacing-12);padding:var(--padding-spacing-12);border-top:1px solid var(--border-default);font:var(--tz-text-body-small)}.api>div:first-child{border-top:0}
@media(max-width:760px){.page-header{flex-direction:column}.card{padding:var(--padding-spacing-16)}.examples,.usage-grid,.rules{grid-template-columns:1fr}.examples article:nth-child(3){grid-column:auto}.reference-stage{padding:var(--padding-spacing-16);overflow-x:auto}.api{overflow-x:auto}.api>div{min-width:620px}}
</style>
