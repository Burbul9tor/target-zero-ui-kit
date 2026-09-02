<script setup lang="ts">
import { Check } from '@lucide/vue'
import { ref } from 'vue'
import TzComplexFilterPanel, { type ComplexFilterValue } from '../data/TzComplexFilterPanel.vue'

const appliedExample: Partial<ComplexFilterValue> = {
  place: 'Шламонакопитель Алматы',
  year: '2026',
  placeTypes: ['Накопление'],
}
const firstOpen = ref(true)
const secondOpen = ref(false)
const thirdOpen = ref(false)
</script>

<template>
  <div class="complex-filters-docs">
    <header class="page-header">
      <div>
        <p class="eyebrow">PATTERN · DATA FILTERING</p>
        <h1>Сложные фильтры</h1>
        <p>Композиционный паттерн для поиска, нескольких групп фильтров, диапазонов и применённых значений.</p>
      </div>
      <span class="ready"><Check :size="14" /> Figma 2679:122246</span>
    </header>

    <section class="state-card">
      <header><div><span>Состояние 1</span><h2>Фильтры открыты и применены</h2><p>Пользователь видит текущие чипы и может скорректировать поля. Кнопка «Применить фильтр» сохраняет значения и сворачивает панель.</p></div></header>
      <div class="state-stage">
        <TzComplexFilterPanel v-model:open="firstOpen" :model-value="appliedExample" :applied-value="appliedExample" />
      </div>
    </section>

    <section class="state-card">
      <header><div><span>Состояние 2</span><h2>Фильтры применены и свернуты</h2><p>Применённые значения остаются видимыми в чипах. Каждый чип удаляется отдельно, «Сбросить всё» очищает набор.</p></div></header>
      <div class="state-stage">
        <TzComplexFilterPanel v-model:open="secondOpen" :model-value="appliedExample" :applied-value="appliedExample" />
      </div>
    </section>

    <section class="state-card">
      <header><div><span>Состояние 3</span><h2>Фильтры свернуты</h2><p>Начальное компактное состояние: поиск остаётся доступным, а кнопка «Фильтры» раскрывает расширенную форму.</p></div></header>
      <div class="state-stage">
        <TzComplexFilterPanel v-model:open="thirdOpen" />
      </div>
    </section>

    <section class="state-card guidance">
      <header><div><span>Поведение</span><h2>Правила использования</h2></div></header>
      <div class="guidance-grid">
        <article><strong>Черновик</strong><p>Изменения в полях не влияют на результаты до нажатия «Применить фильтр».</p></article>
        <article><strong>Применённые значения</strong><p>После применения фильтры отображаются чипами и доступны даже при свернутой форме.</p></article>
        <article><strong>Сброс</strong><p>Чип удаляет одно условие; «Сбросить всё» очищает весь набор; нижняя кнопка очищает форму.</p></article>
        <article><strong>Адаптивность</strong><p>На узких экранах две колонки формы и диапазонов перестраиваются в одну.</p></article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.complex-filters-docs{display:grid;gap:var(--padding-spacing-24)}
.page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--padding-spacing-32)}
.eyebrow{margin:0 0 var(--padding-spacing-8);color:var(--brand-primary);font:500 10px/14px var(--tz-font-family);letter-spacing:.08em}
.page-header h1{margin:0 0 var(--padding-spacing-8);color:var(--text-default);font:700 32px/40px var(--tz-font-family)}
.page-header p,.state-card header p{margin:0;color:var(--text-muted);font:400 14px/20px var(--tz-font-family)}
.ready{display:flex;align-items:center;gap:var(--padding-spacing-6);padding:7px 10px;color:var(--status-success-fg);border-radius:var(--radius-md);background:var(--status-success-bg);font:500 11px/16px var(--tz-font-family);white-space:nowrap}
.state-card{min-width:0;padding:var(--padding-spacing-24);border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-surface);box-shadow:0 10px 15px -3px var(--bg-shadow)}
.state-card>header{margin-bottom:var(--padding-spacing-20)}
.state-card>header span{display:inline-block;margin-bottom:var(--padding-spacing-4);color:var(--brand-primary);font:500 10px/14px var(--tz-font-family);letter-spacing:.05em;text-transform:uppercase}
.state-card h2{margin:0 0 var(--padding-spacing-4);color:var(--text-default);font:600 18px/24px var(--tz-font-family)}
.state-stage{padding:var(--padding-spacing-16);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface)}
.guidance-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--padding-spacing-12)}
.guidance-grid article{padding:var(--padding-spacing-16);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}
.guidance-grid strong{color:var(--text-default);font:var(--tz-text-body-strong)}
.guidance-grid p{margin:var(--padding-spacing-6) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}
@media(max-width:760px){.page-header{flex-direction:column}.state-card{padding:var(--padding-spacing-16)}.state-stage{padding:var(--padding-spacing-12)}.guidance-grid{grid-template-columns:1fr}}
</style>
