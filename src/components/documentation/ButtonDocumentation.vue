<script setup lang="ts">
import { ArrowUpRight, Check, Copy } from '@lucide/vue'
import { ref } from 'vue'
import TzButton, { type ButtonSize, type ButtonVariant } from '../actions/TzButton.vue'

const variants: ButtonVariant[] = ['primary', 'secondary', 'text', 'error']
const sizes: ButtonSize[] = ['large', 'medium', 'small']
const clicks = ref(0)
const loading = ref(false)
const copied = ref('')

const propsRows = [
  ['tag', "'button' | 'a' | 'router-link'", "'button'", 'Корневой элемент'],
  ['type', "'button' | 'submit' | 'reset'", "'button'", 'Нативный тип button'],
  ['label', 'string', "''", 'Текст без default slot'],
  ['color', "'primary' | 'secondary' | 'text' | 'error'", "'primary'", 'Визуальный вариант Target Zero'],
  ['size', "'large' | 'medium' | 'small'", "'large'", '44 / 32 / 24px'],
  ['iconLeft / iconRight', 'Component', 'undefined', 'Компоненты иконок'],
  ['iconWidth / iconHeight', 'string | number', '16', 'Размер иконки'],
  ['iconRotate', "'top' | 'right' | 'bottom' | 'left'", "'bottom'", 'Поворот иконок'],
  ['disabled', 'boolean', 'false', 'Блокирует взаимодействие'],
  ['loading', 'boolean', 'false', 'Показывает loader и блокирует click'],
  ['expanded', 'boolean', 'false', 'Ширина 100%'],
  ['rounded', 'boolean', 'false', 'Полное скругление'],
  ['outlined / noBorder', 'boolean', 'false', 'Алиасы Secondary / Text'],
  ['filled', 'boolean', 'false', 'Добавляет elevation'],
]

function startLoading() {
  loading.value = true
  window.setTimeout(() => { loading.value = false }, 1800)
}

async function copy(value: string) {
  await navigator.clipboard?.writeText(value)
  copied.value = value
  window.setTimeout(() => { if (copied.value === value) copied.value = '' }, 1200)
}
</script>

<template>
  <div class="button-docs">
    <header class="button-hero">
      <div><p>COMPONENT · ACTION</p><h1>Button</h1><span>Контракт основан на IKod UI Kit. Внешний вид и доступные варианты — Target Zero Design System.</span></div>
      <small><Check :size="14" /> Vue 3 · готово к проверке</small>
    </header>

    <section class="button-card">
      <header><h2>Варианты и состояния</h2><p>Primary, Secondary, Text и Error — текущий набор из Figma.</p></header>
      <div class="state-table">
        <div class="state-table__head"><span>Variant</span><span>Default</span><span>Hover</span><span>Disabled</span></div>
        <div v-for="variant in variants" :key="variant" class="state-table__row">
          <strong>{{ variant }}</strong>
          <TzButton :color="variant" label="Кнопка" />
          <TzButton class="is-preview-hover" :color="variant" label="Кнопка" />
          <TzButton :color="variant" label="Кнопка" disabled />
        </div>
      </div>
    </section>

    <section class="button-card">
      <header><h2>Размеры</h2><p>Высота Large — 44px, Medium — 32px, Small — 24px.</p></header>
      <div class="button-row">
        <TzButton v-for="size in sizes" :key="size" :size="size" :label="size" />
      </div>
    </section>

    <section class="button-card">
      <header><h2>Иконки</h2><p>Поддерживаются компонентные props и именованные slots слева и справа.</p></header>
      <div class="button-row">
        <TzButton label="Слева" :icon-left="ArrowUpRight" />
        <TzButton color="secondary" label="Справа" :icon-right="ArrowUpRight" />
        <TzButton color="text" label="С двух сторон" :icon-left="ArrowUpRight" :icon-right="ArrowUpRight" />
        <TzButton color="error" aria-label="Открыть" :icon-left="ArrowUpRight" />
      </div>
    </section>

    <section class="button-card">
      <header><h2>Интерактивный пример</h2><p>Loading и disabled не отправляют событие click.</p></header>
      <div class="button-row">
        <TzButton label="Нажать" @click="clicks += 1" />
        <TzButton :loading="loading" :label="loading ? 'Загрузка' : 'Запустить loading'" @click="startLoading" />
        <span class="click-count">Событий click: {{ clicks }}</span>
      </div>
    </section>

    <section class="button-card api-card">
      <header><h2>API</h2><p>Совместимый контракт IKod UI Kit, ограниченный текущими визуальными вариантами Target Zero.</p></header>
      <div class="api-table">
        <div class="api-table__head"><span>Prop</span><span>Type</span><span>Default</span><span>Поведение</span></div>
        <div v-for="row in propsRows" :key="row[0]" class="api-table__row"><code>{{ row[0] }}</code><code>{{ row[1] }}</code><code>{{ row[2] }}</code><span>{{ row[3] }}</span></div>
      </div>
    </section>

    <section class="button-card contracts">
      <article><h3>Slots</h3><code>default</code><code>icon-left</code><code>icon-right</code></article>
      <article><h3>Emits</h3><code>click(event: MouseEvent)</code><p>Не вызывается при disabled или loading.</p></article>
      <article><h3>Методы</h3><code>focus()</code><code>blur()</code><code>click()</code></article>
      <article><h3>Поведение</h3><p>Enter/Space работают нативно для button. Loading выставляет aria-busy. Ссылки получают aria-disabled и исключаются из tab-порядка.</p></article>
    </section>

    <section class="button-card code-card">
      <header><h2>Пример</h2><button type="button" @click="copy(`<TzButton color=&quot;primary&quot; size=&quot;large&quot; label=&quot;Сохранить&quot; @click=&quot;save&quot; />`)"><Copy :size="14" /> {{ copied ? 'Скопировано' : 'Копировать' }}</button></header>
      <pre><code>&lt;TzButton color="primary" size="large" label="Сохранить" @click="save" /&gt;</code></pre>
    </section>
  </div>
</template>

<style scoped>
.button-docs { display: grid; gap: var(--padding-spacing-24); }
.button-hero { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--padding-spacing-32); padding: var(--padding-spacing-32); color: var(--text-inverse); border-radius: var(--radius-xl); background: var(--brand-primary); }
.button-hero p, .button-hero h1 { margin: 0 0 var(--padding-spacing-8); color: inherit; }
.button-hero p { font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.button-hero h1 { font: 700 32px/40px var(--tz-font-family); }
.button-hero span { font: 400 14px/20px var(--tz-font-family); }
.button-hero small { display: flex; align-items: center; gap: var(--padding-spacing-6); padding: 7px 10px; border-radius: var(--radius-md); background: color-mix(in srgb, var(--text-inverse) 12%, transparent); white-space: nowrap; }
.button-card { min-width: 0; padding: var(--padding-spacing-24); border: 1px solid var(--border-default); border-radius: var(--radius-lg); background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.button-card > header { margin-bottom: var(--padding-spacing-20); }
.button-card h2, .button-card h3, .button-card p { margin-top: 0; }
.button-card h2 { margin-bottom: var(--padding-spacing-4); font: 600 18px/24px var(--tz-font-family); }
.button-card h3 { margin-bottom: var(--padding-spacing-8); font: 600 14px/20px var(--tz-font-family); }
.button-card header p, .contracts p { margin-bottom: 0; color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.button-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--padding-spacing-16); }
.click-count { color: var(--text-muted); font: 400 12px/16px var(--tz-font-family); }
.state-table, .api-table { overflow: auto; border: 1px solid var(--border-default); border-radius: var(--radius-md); }
.state-table__head, .state-table__row { display: grid; grid-template-columns: 120px repeat(3, minmax(130px, 1fr)); align-items: center; gap: var(--padding-spacing-16); min-width: 600px; padding: var(--padding-spacing-12); }
.state-table__head, .api-table__head { color: var(--text-muted); background: var(--bg-row-hover); font: 500 11px/16px var(--tz-font-family); }
.state-table__row + .state-table__row, .api-table__row + .api-table__row { border-top: 1px solid var(--border-default); }
.state-table__row strong { color: var(--text-muted); font: 500 11px/16px var(--tz-font-family); text-transform: uppercase; }
.state-table__row :deep(.tz-button) { justify-self: start; }
.api-table__head, .api-table__row { display: grid; grid-template-columns: 160px minmax(220px, 1fr) 120px minmax(220px, 1fr); gap: var(--padding-spacing-12); min-width: 760px; padding: var(--padding-spacing-12); align-items: center; }
.api-table__row { font: 400 12px/16px var(--tz-font-family); }
.api-table code, .contracts code { color: var(--brand-primary); font: 500 11px/16px ui-monospace, SFMono-Regular, Consolas, monospace; }
.contracts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--padding-spacing-16); }
.contracts article { display: flex; min-width: 0; flex-direction: column; gap: var(--padding-spacing-4); }
.code-card > header { display: flex; align-items: center; justify-content: space-between; gap: var(--padding-spacing-16); }
.code-card header button { display: flex; align-items: center; gap: var(--padding-spacing-6); padding: var(--padding-spacing-6) var(--padding-spacing-8); color: var(--brand-primary); border: 1px solid var(--border-default); border-radius: var(--radius-sm); background: var(--brand-bg-hover); cursor: pointer; }
.code-card pre { margin: 0; padding: var(--padding-spacing-16); overflow: auto; color: var(--green-100); border-radius: var(--radius-md); background: var(--gray-900); }
@media (max-width: 900px) { .contracts { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 620px) { .button-hero { flex-direction: column; padding: var(--padding-spacing-24); } .button-card { padding: var(--padding-spacing-16); } .contracts { grid-template-columns: 1fr; } }
</style>
