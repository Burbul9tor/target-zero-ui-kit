<script setup lang="ts">
import { Check } from '@lucide/vue'
import TzBreadcrumbs from '../navigation/TzBreadcrumbs.vue'

const sampleItems = [
  { label: 'Главная', href: '#home' },
  { label: 'Экология', href: '#ecology' },
  { label: 'Отходы', href: '#waste' },
  { label: 'Информационное табло' },
]

const colors = [
  { token: '--text-default', figma: 'text/default', value: '#161616', usage: 'Active и разделитель' },
  { token: '--text-muted', figma: 'text/muted', value: '#717A7A', usage: 'Default и предыдущие уровни Primary и Secondary' },
  { token: '--brand-primary-hover', figma: 'brand/primary-hover', value: '#386C58', usage: 'Hover и underline ссылки' },
  { token: '--icon-default', figma: 'icon/default → Gray-700', value: '#404040', usage: 'Иконка ArrowLeft' },
  { token: '--bg-surface', figma: 'bg/surface', value: '#FFFFFF', usage: 'Фон компонента и карточек' },
]

const specs = [
  ['Font', 'Roboto Regular', 'font-weight: 400'],
  ['Atom text', '12px / 16px', 'Default, Hover, Active и все уровни'],
  ['Primary separator', '12px / 16px', 'letter-spacing: normal'],
  ['Secondary separator', '10px / 14px', 'letter-spacing: 0.1px'],
  ['Primary height', '16px', '1–4 уровня'],
  ['Secondary height', '20px', '1–6 уровней'],
  ['Gap', '4px', 'Между Atom и разделителем'],
  ['Secondary item padding', '2px', 'Со всех сторон'],
  ['Hover underline', '1px', 'brand/primary-hover'],
  ['Wrapping', 'flex-wrap', 'Secondary; row-gap: 4px'],
]
</script>

<template>
  <div class="breadcrumb-docs">
    <header class="docs-header">
      <div>
        <p class="eyebrow">COMPONENT · NAVIGATION</p>
        <h1>Breadcrumbs</h1>
        <p>Primary показывает стрелку только с одним пунктом. В цепочке из 2–4 уровней стрелки нет. Secondary поддерживает путь до 6 уровней.</p>
      </div>
      <span class="status"><Check :size="14" /> Обновлено</span>
    </header>

    <section class="doc-card">
      <header><h2>Варианты</h2><p>Актуальная реализация по Figma node 1:423.</p></header>
      <div class="examples">
        <article><small>PRIMARY · 1 LEVEL / BACK</small><TzBreadcrumbs :items="sampleItems.slice(-1)" variant="primary" /></article>
        <article><small>PRIMARY · 4 LEVEL</small><TzBreadcrumbs :items="sampleItems" variant="primary" /></article>
        <article><small>SECONDARY · 4 LEVEL</small><TzBreadcrumbs :items="sampleItems" variant="secondary" /></article>
        <article>
          <small>ATOM · DEFAULT / HOVER / ACTIVE</small>
          <div class="atom-preview"><a href="#default">Name page</a><a class="hover" href="#hover">Name page</a><span>Name page</span></div>
        </article>
      </div>
    </section>

    <section class="doc-card">
      <header><h2>Типографика и геометрия</h2><p>Все значения, используемые внутри компонента.</p></header>
      <div class="spec-table">
        <div class="spec-row spec-head"><span>Свойство</span><span>Значение</span><span>Применение</span></div>
        <div v-for="spec in specs" :key="spec[0]" class="spec-row"><span>{{ spec[0] }}</span><code>{{ spec[1] }}</code><span>{{ spec[2] }}</span></div>
      </div>
    </section>

    <section class="doc-card">
      <header><h2>Цветовые токены</h2><p>CSS-имя, токен Figma, resolved value и назначение.</p></header>
      <div class="token-grid">
        <article v-for="color in colors" :key="color.token" class="token-card">
          <i :style="{ backgroundColor: color.value }" />
          <div><strong>{{ color.token }}</strong><small>{{ color.figma }}</small></div>
          <code>{{ color.value }}</code><p>{{ color.usage }}</p>
        </article>
      </div>
    </section>

  </div>
</template>

<style scoped>
.breadcrumb-docs { display: grid; gap: 24px; }
.docs-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 32px; }
.eyebrow { margin: 0 0 8px; color: var(--brand-primary); font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.docs-header h1 { margin: 0 0 8px; color: var(--text-default); font: 700 32px/40px var(--tz-font-family); }
.docs-header p, .doc-card header p { margin: 0; color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.status { display: flex; align-items: center; gap: 6px; padding: 7px 10px; color: var(--status-success-fg); border-radius: 8px; background: var(--status-success-bg); font: 500 11px/16px var(--tz-font-family); white-space: nowrap; }
.doc-card { padding: 24px; border: 1px solid var(--border-default); border-radius: 12px; background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.doc-card > header { margin-bottom: 20px; }
.doc-card h2 { margin: 0 0 4px; color: var(--text-default); font: 600 18px/24px var(--tz-font-family); }
.examples, .token-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.examples article { min-height: 106px; padding: 20px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--bg-page); }
.examples small { display: block; margin-bottom: 20px; color: var(--text-muted); font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.atom-preview { display: flex; flex-wrap: wrap; gap: 32px; }
.atom-preview a, .atom-preview span { color: var(--text-muted); font: 400 12px/16px var(--tz-font-family); text-decoration: none; }
.atom-preview .hover { color: var(--brand-primary-hover); box-shadow: inset 0 -1px var(--brand-primary-hover); }
.atom-preview span { color: var(--text-default); }
.spec-table { overflow: hidden; border: 1px solid var(--border-default); border-radius: 8px; }
.spec-row { display: grid; grid-template-columns: minmax(150px,.8fr) minmax(130px,.6fr) minmax(220px,1.4fr); border-top: 1px solid var(--border-default); }
.spec-row:first-child { border-top: 0; }
.spec-row > * { padding: 10px 12px; color: var(--text-muted); font: 400 12px/16px var(--tz-font-family); }
.spec-row > * + * { border-left: 1px solid var(--border-default); }
.spec-head { background: var(--bg-page); }
.spec-head > * { color: var(--text-default); font-weight: 500; }
code { color: var(--brand-primary); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
.token-card { display: grid; grid-template-columns: 40px minmax(0,1fr) auto; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-default); border-radius: 8px; }
.token-card i { grid-row: span 2; width: 40px; height: 40px; border: 1px solid var(--border-default); border-radius: 7px; }
.token-card div { display: flex; flex-direction: column; }
.token-card strong { color: var(--text-default); font: 500 12px/16px var(--tz-font-family); }
.token-card small, .token-card p, .token-card code { font: 400 10px/14px var(--tz-font-family); }
.token-card small, .token-card p { color: var(--text-muted); }
.token-card p { grid-column: 2/-1; margin: 0; }
@media (max-width: 760px) { .docs-header { flex-direction: column; } .examples, .token-grid { grid-template-columns: 1fr; } .spec-table { overflow-x: auto; } .spec-row { min-width: 620px; } }
</style>


