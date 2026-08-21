<script setup lang="ts">
import { Check } from '@lucide/vue'
import { ref } from 'vue'
import TzSearch, { type SearchChip, type SearchState } from '../forms/TzSearch.vue'

const searchValue = ref('')
const chipValue = ref('')
const chips = ref<SearchChip[]>([
  { id: 'waste', label: 'Отходы' },
])

const states: Array<{ state: SearchState; label: string; value?: string; chips?: SearchChip[] }> = [
  { state: 'default', label: 'Default' },
  { state: 'hover', label: 'Hover' },
  { state: 'active', label: 'Click in' },
  { state: 'typing', label: 'Typing', value: 'Отходы' },
  { state: 'filled', label: 'Filled', value: 'Отходы' },
  { state: 'finished', label: 'Finished typing', chips: [{ id: 'chip-1', label: 'Chip' }] },
  { state: 'finished-multiple', label: 'Finished 2 or more', chips: [{ id: 'chip-1', label: 'Chip' }, { id: 'chip-2', label: 'Chip' }, { id: 'chip-3', label: 'Chip' }] },
]

const api = [
  ['modelValue', 'string', "''"],
  ['placeholder', 'string', 'Поиск'],
  ['label', 'string', 'Поиск'],
  ['chips', 'SearchChip[]', '[]'],
  ['chipMode', 'boolean', 'false'],
  ['disabled', 'boolean', 'false'],
  ['@search', 'event', '—'],
  ['@submit', 'event', '—'],
  ['@clear', 'event', '—'],
  ['@removeChip', 'event', '—'],
]

const tokens = [
  ['Surface', 'bg/surface', '#FFFFFF'],
  ['Border', 'border/default', '#E4E7E6'],
  ['Text', 'text/default', '#161616'],
  ['Placeholder', 'text/muted', '#717A7A'],
  ['Hover placeholder', 'gray/400', '#9AA2A2'],
  ['Primary', 'brand/primary', '#407C65'],
  ['Chip', 'brand/bg-chip', '#407C654D'],
  ['Focus shadow', 'effect/shadow', '#407C6533'],
]
</script>

<template>
  <div class="search-docs">
    <header class="search-docs__header">
      <div>
        <p class="search-docs__eyebrow">COMPONENT · INPUTS</p>
        <h1>Search</h1>
        <p>Поисковое поле с обычным вводом и мультизначениями в виде chips. Реализовано по Figma node 19:1267.</p>
      </div>
      <span><Check :size="14" /> Реализовано</span>
    </header>

    <section class="search-card">
      <header><h2>Интерактивные примеры</h2><p>Enter отправляет поиск; в chip-режиме введённое значение превращается в chip.</p></header>
      <div class="interactive-grid">
        <article><small>SEARCH</small><TzSearch v-model="searchValue" /></article>
        <article><small>SEARCH WITH CHIPS</small><TzSearch v-model="chipValue" v-model:chips="chips" chip-mode /></article>
      </div>
    </section>

    <section class="search-card">
      <header><h2>Состояния</h2><p>Полный набор вариантов Small из макета.</p></header>
      <div class="state-stage">
        <article v-for="item in states" :key="item.state">
          <small>{{ item.label }}</small>
          <TzSearch :state="item.state" :model-value="item.value" :chips="item.chips" />
        </article>
      </div>
    </section>

    <section class="search-card">
      <header><h2>Поведение</h2><p>Правила ввода, очистки и работы с несколькими значениями.</p></header>
      <div class="requirement-grid">
        <article><strong>Ввод</strong><p>Событие <code>search</code> отправляется при каждом изменении текста. Enter вызывает <code>submit</code>.</p></article>
        <article><strong>Очистка</strong><p>Кнопка Close очищает строку и все chips, возвращая компонент в Default.</p></article>
        <article><strong>Chip mode</strong><p>В режиме <code>chipMode</code> Enter добавляет уникальный chip. Каждый chip можно удалить отдельно.</p></article>
        <article><strong>Доступность</strong><p>Используется нативный <code>input type="search"</code>, область <code>role="search"</code> и доступные названия кнопок.</p></article>
      </div>
    </section>

    <section class="search-card">
      <header><h2>API</h2><p>Props и события Vue-компонента.</p></header>
      <div class="search-table">
        <div class="search-table__row search-table__head"><span>Имя</span><span>Тип</span><span>По умолчанию</span></div>
        <div v-for="row in api" :key="row[0]" class="search-table__row"><code>{{ row[0] }}</code><span>{{ row[1] }}</span><span>{{ row[2] }}</span></div>
      </div>
    </section>

    <section class="search-card">
      <header><h2>Стили и токены</h2><p>Размеры и семантические значения из макета.</p></header>
      <div class="token-grid"><article v-for="token in tokens" :key="token[0]"><strong>{{ token[0] }}</strong><code>{{ token[1] }}</code><span>{{ token[2] }}</span></article></div>
      <div class="specs"><span>Height <strong>32px</strong></span><span>Example width <strong>350px</strong></span><span>Padding <strong>6px 12px</strong></span><span>Gap <strong>8px</strong></span><span>Radius <strong>8px</strong></span><span>Icon <strong>16px</strong></span></div>
    </section>
  </div>
</template>

<style scoped>
.search-docs { display: grid; gap: 24px; }
.search-docs__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; }
.search-docs__eyebrow { margin: 0 0 8px; color: var(--brand-primary); font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.search-docs__header h1 { margin: 0 0 8px; color: var(--text-default); font: 700 32px/40px var(--tz-font-family); }
.search-docs__header p, .search-card header p { margin: 0; color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.search-docs__header > span { display: flex; align-items: center; gap: 6px; padding: 7px 10px; color: var(--status-success-fg); border-radius: 8px; background: var(--status-success-bg); font: 500 11px/16px var(--tz-font-family); white-space: nowrap; }
.search-card { padding: 24px; border: 1px solid var(--border-default); border-radius: 12px; background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.search-card > header { margin-bottom: 20px; }
.search-card h2 { margin: 0 0 4px; color: var(--text-default); font: 600 18px/24px var(--tz-font-family); }
.interactive-grid { display: grid; grid-template-columns: repeat(2, minmax(280px, 350px)); gap: 24px; }
.interactive-grid article { display: grid; gap: 10px; }
.interactive-grid small, .state-stage small { color: var(--text-muted); font: 500 10px/14px var(--tz-font-family); letter-spacing: .06em; text-transform: uppercase; }
.state-stage { display: grid; gap: 20px; padding: 24px; border-radius: 8px; background: var(--bg-page); }
.state-stage article { display: grid; grid-template-columns: 120px minmax(280px, 350px); align-items: center; gap: 20px; }
.requirement-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.requirement-grid article { padding: 16px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--bg-page); }
.requirement-grid strong { color: var(--text-default); font: 500 12px/16px var(--tz-font-family); }
.requirement-grid p { margin: 6px 0 0; color: var(--text-muted); font: 400 12px/18px var(--tz-font-family); }
code { color: var(--brand-primary); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 11px; }
.search-table { overflow: hidden; border: 1px solid var(--border-default); border-radius: 8px; }
.search-table__row { display: grid; grid-template-columns: .7fr 1.4fr .7fr; border-top: 1px solid var(--border-default); }
.search-table__row:first-child { border-top: 0; }
.search-table__row > * { padding: 10px 12px; color: var(--text-muted); font: 400 12px/16px var(--tz-font-family); }
.search-table__row > * + * { border-left: 1px solid var(--border-default); }
.search-table__head { background: var(--bg-page); }
.search-table__head > * { color: var(--text-default); font-weight: 500; }
.token-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.token-grid article { display: flex; flex-direction: column; gap: 3px; padding: 12px; border: 1px solid var(--border-default); border-radius: 8px; }
.token-grid strong { font: 500 12px/16px var(--tz-font-family); }
.token-grid code, .token-grid span { font: 400 10px/14px var(--tz-font-family); }
.token-grid span { color: var(--text-muted); }
.specs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.specs span { padding: 6px 8px; color: var(--text-muted); border-radius: 6px; background: var(--bg-page); font: 400 11px/16px var(--tz-font-family); }
.specs strong { color: var(--text-default); font-weight: 500; }
@media (max-width: 820px) { .interactive-grid, .requirement-grid, .token-grid { grid-template-columns: 1fr; } }
@media (max-width: 620px) { .search-docs__header { flex-direction: column; } .search-card { padding: 16px; } .state-stage { overflow-x: auto; padding: 16px; } .state-stage article { min-width: 480px; } .search-table { overflow-x: auto; } .search-table__row { min-width: 560px; } }
</style>
