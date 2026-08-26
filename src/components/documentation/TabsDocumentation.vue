<script setup lang="ts">
import { Check } from '@lucide/vue'
import { ref } from 'vue'
import TzTabs, { type TabItem, type TabValue } from '../navigation/TzTabs.vue'

const activeDemo = ref<TabValue>('overview')
const activeTwo = ref<TabValue>('first')
const activeThree = ref<TabValue>('first')
const activeFour = ref<TabValue>('first')
const counterActive = ref<TabValue>('info')

const counterItems: TabItem[] = [
  { value: 'zero', label: 'Пусто', count: 0, badgeTone: 'neutral' },
  { value: 'info', label: 'В работе', count: 8, badgeTone: 'info' },
  { value: 'success', label: 'Готово', count: 24, badgeTone: 'success' },
  { value: 'warning', label: 'Внимание', count: 100, badgeTone: 'warning' },
  { value: 'error', label: 'Ошибки', count: 128, badgeTone: 'error', countLabel: 'Ошибок: 128' },
]

const demoItems: TabItem[] = [
  { value: 'overview', label: 'Обзор', count: 8 },
  { value: 'documents', label: 'Документы', count: 100 },
  { value: 'history', label: 'История', count: 3, badgeTone: 'warning' },
  { value: 'disabled', label: 'Недоступно', count: 0, disabled: true },
]

const makeItems = (length: number): TabItem[] => Array.from({ length }, (_, index) => ({
  value: index === 0 ? 'first' : `tab-${index + 1}`,
  label: `Название ${index + 1}`,
  count: index === 1 ? 8 : undefined,
}))

const tokens = [
  ['Контейнер', '--bg-disabled', 'gray-100'],
  ['Активный фон', '--brand-primary', 'green-600'],
  ['Активный текст', '--text-button-fill', 'gray-0'],
  ['Неактивный текст', '--text-muted', 'gray-500'],
  ['Info badge', '--status-info-bg / fg', 'blue-100 / blue-700'],
  ['Радиусы', '--radius-md / --radius-sm', '8px / 6px'],
]
</script>

<template>
  <div class="tabs-docs">
    <header class="tabs-docs__header">
      <div>
        <p class="tabs-docs__eyebrow">COMPONENT · NAVIGATION</p>
        <h1>Tabs</h1>
        <p>Переключение между связанными разделами контента. Стилизация Target Zero по Figma node 542:3625.</p>
      </div>
      <span><Check :size="14" /> Готово</span>
    </header>

    <section class="tabs-card">
      <header><h2>Интерактивный пример</h2><p>Проверьте переключение, состояния счётчиков и недоступную вкладку.</p></header>
      <div class="demo-canvas">
        <TzTabs v-model="activeDemo" :items="demoItems" aria-label="Разделы карточки" />
        <p>Активное значение: <code>{{ activeDemo }}</code></p>
      </div>
    </section>

    <section class="tabs-card">
      <header><h2>Счётчики</h2><p>Цифры сохраняют стабильную ширину, поддерживают семантические состояния и длинные значения.</p></header>
      <div class="counter-showcase">
        <div>
          <small>ТОЧНЫЕ ЗНАЧЕНИЯ</small>
          <TzTabs v-model="counterActive" :items="counterItems" />
        </div>
        <div>
          <small>КОМПАКТНО · MAX 99</small>
          <TzTabs v-model="counterActive" :items="counterItems" :count-max="99" />
        </div>
      </div>
    </section>

    <section class="tabs-card">
      <header><h2>Количество вкладок</h2><p>В макете предусмотрены основные конфигурации из двух, трёх и четырёх вкладок.</p></header>
      <div class="variant-grid">
        <article><small>2 TABS</small><TzTabs v-model="activeTwo" :items="makeItems(2)" /></article>
        <article><small>3 TABS</small><TzTabs v-model="activeThree" :items="makeItems(3)" /></article>
        <article><small>4 TABS · FLUID</small><TzTabs v-model="activeFour" :items="makeItems(4)" fluid /></article>
      </div>
    </section>

    <section class="tabs-card">
      <header><h2>Интерфейс и поведение</h2><p>API компонента и обязательные правила взаимодействия.</p></header>
      <div class="requirements">
        <article><strong>v-model</strong><p>При выборе обновляется <code>modelValue</code>. Дополнительно отправляется <code>change(value, item)</code>.</p></article>
        <article><strong>items</strong><p>Поля: <code>value</code>, <code>label</code>, опциональные <code>count</code>, <code>badgeTone</code>, <code>countLabel</code> и <code>disabled</code>.</p></article>
        <article><strong>Большие значения</strong><p>По умолчанию число показывается полностью. Проп <code>countMax</code> включает компактный формат, например <code>99+</code>.</p></article>
        <article><strong>Клавиатура</strong><p>Стрелки переключают вкладки, Home и End переходят к первой и последней доступной вкладке.</p></article>
        <article><strong>Доступность</strong><p>Роли <code>tablist</code> и <code>tab</code>, <code>aria-selected</code> и roving tabindex.</p></article>
        <article><strong>Слоты</strong><p><code>#label</code> и <code>#badge</code> позволяют переопределить содержимое.</p></article>
        <article><strong>Размер</strong><p>Контейнер — 4px, вкладка — 4×16px, текст 14/20, радиусы 8px и 6px.</p></article>
      </div>
    </section>

    <section class="tabs-card">
      <header><h2>Токены</h2><p>Цвета и скругления берутся только из Variables / Colors UI Kit.</p></header>
      <div class="token-grid">
        <article v-for="token in tokens" :key="token[0]"><strong>{{ token[0] }}</strong><code>{{ token[1] }}</code><span>→ {{ token[2] }}</span></article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tabs-docs { display: grid; gap: var(--padding-spacing-24); }
.tabs-docs__header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--padding-spacing-32); }
.tabs-docs__eyebrow { margin: 0 0 var(--padding-spacing-8); color: var(--brand-primary); font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.tabs-docs__header h1 { margin: 0 0 var(--padding-spacing-8); color: var(--text-default); font: 700 32px/40px var(--tz-font-family); }
.tabs-docs__header p, .tabs-card header p { margin: 0; color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.tabs-docs__header > span { display: flex; align-items: center; gap: var(--padding-spacing-6); padding: 7px 10px; color: var(--status-success-fg); border-radius: var(--radius-md); background: var(--status-success-bg); font: 500 11px/16px var(--tz-font-family); white-space: nowrap; }
.tabs-card { min-width: 0; padding: var(--padding-spacing-24); border: 1px solid var(--border-default); border-radius: var(--radius-lg); background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.tabs-card > header { margin-bottom: var(--padding-spacing-20); }
.tabs-card h2 { margin: 0 0 var(--padding-spacing-4); color: var(--text-default); font: 600 18px/24px var(--tz-font-family); }
.demo-canvas { display: flex; min-height: 128px; padding: var(--padding-spacing-24); flex-direction: column; align-items: flex-start; justify-content: center; gap: var(--padding-spacing-16); border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--bg-page); }
.demo-canvas p { margin: 0; color: var(--text-muted); font: 400 12px/18px var(--tz-font-family); }
.counter-showcase { display: grid; gap: var(--padding-spacing-16); padding: var(--padding-spacing-20); overflow-x: auto; border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--bg-page); }
.counter-showcase > div { display: flex; min-width: max-content; flex-direction: column; align-items: flex-start; gap: var(--padding-spacing-8); }
.counter-showcase small { color: var(--text-muted); font: 500 10px/14px var(--tz-font-family); letter-spacing: .05em; }
.variant-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--padding-spacing-12); }
.variant-grid article { display: flex; min-width: 0; min-height: 104px; padding: var(--padding-spacing-20); flex-direction: column; align-items: flex-start; justify-content: center; gap: var(--padding-spacing-16); border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--bg-page); }
.variant-grid article:last-child { grid-column: 1 / -1; }
.variant-grid small { color: var(--text-muted); font: 500 10px/14px var(--tz-font-family); letter-spacing: .05em; }
.requirements { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--padding-spacing-12); }
.requirements article, .token-grid article { padding: var(--padding-spacing-16); border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--bg-page); }
.requirements strong, .token-grid strong { color: var(--text-default); font: 500 12px/16px var(--tz-font-family); }
.requirements p { margin: var(--padding-spacing-6) 0 0; color: var(--text-muted); font: 400 12px/18px var(--tz-font-family); }
code { color: var(--brand-primary); font: 400 11px/16px ui-monospace, SFMono-Regular, Consolas, monospace; }
.token-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--padding-spacing-12); }
.token-grid article { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
.token-grid code, .token-grid span { overflow: hidden; color: var(--text-muted); font: 400 10px/14px var(--tz-font-family); text-overflow: ellipsis; }
@media (max-width: 800px) { .variant-grid, .requirements, .token-grid { grid-template-columns: 1fr; } .variant-grid article:last-child { grid-column: auto; } }
@media (max-width: 620px) { .tabs-docs__header { flex-direction: column; } .tabs-card { padding: var(--padding-spacing-16); } }
</style>
