<script setup lang="ts">
import { Check } from '@lucide/vue'
import { ref } from 'vue'
import TzStatus from '../data/TzStatus.vue'
import type { TzStatusSize, TzStatusTone } from '../data/TzStatus.vue'
import TzToggle from '../forms/TzToggle.vue'

const showIndicator = ref(true)
const sizes: TzStatusSize[] = ['small', 'medium']
const semanticTones: Array<{ tone: TzStatusTone; name: string; label: string }> = [
  { tone: 'neutral', name: 'Neutral', label: 'Не определён' },
  { tone: 'brand', name: 'Brand', label: 'Выбран' },
  { tone: 'success', name: 'Success', label: 'Активен' },
  { tone: 'info', name: 'Info', label: 'На рассмотрении' },
  { tone: 'warning', name: 'Warning', label: 'Требует внимания' },
  { tone: 'error', name: 'Error', label: 'Просрочен' },
]
const decorativeTones: Array<{ tone: TzStatusTone; name: string }> = [
  { tone: 'blue', name: 'Blue' }, { tone: 'violet', name: 'Violet' },
  { tone: 'amber', name: 'Amber' }, { tone: 'orange', name: 'Orange' },
  { tone: 'rose', name: 'Rose' }, { tone: 'cyan', name: 'Cyan' },
]
const api = [
  ['label', 'string', "Текст статуса, по умолчанию 'Статус'"],
  ['tone', 'TzStatusTone', 'Семантический или декоративный цвет'],
  ['size', "'small' | 'medium'", 'Small для таблиц, Medium для карточек'],
  ['showIndicator', 'boolean', 'Показывает цветную точку перед текстом'],
  ['showIcon', 'boolean', 'Показывает дополнительную иконку после текста'],
  ['icon', 'Component', 'Компонент дополнительной иконки'],
]
</script>

<template>
  <div class="status-docs">
    <header class="page-header">
      <div><p class="eyebrow">COMPONENT · DATA DISPLAY</p><h1>Status</h1><p>Компактная метка состояния объекта или процесса. Цвет передаёт смысл, а текст всегда остаётся основным носителем статуса.</p></div>
      <span class="ready"><Check :size="14" /> Готово</span>
    </header>
    <section class="card">
      <header class="card-header">
        <div><h2>Варианты</h2><p>Размер Small — для таблиц и плотных списков. Medium — для карточек и заголовочных областей.</p></div>
        <TzToggle v-model="showIndicator" label="Индикатор" />
      </header>
      <div v-for="size in sizes" :key="size" class="size-section">
        <h3>{{ size === 'small' ? 'Small · 22 px' : 'Medium · 28 px' }}</h3>
        <div class="status-grid">
          <article v-for="item in semanticTones" :key="`${size}-${item.tone}`"><span class="tone-name">{{ item.name }}</span><TzStatus :tone="item.tone" :size="size" :label="item.label" :show-indicator="showIndicator" /></article>
        </div>
      </div>
    </section>
    <section class="card">
      <header><h2>Дополнительные цвета палитры</h2><p>Используйте их для категорий и группировки. Для результата операции выбирайте семантические Success, Info, Warning или Error.</p></header>
      <div class="status-grid"><article v-for="item in decorativeTones" :key="item.tone"><span class="tone-name">{{ item.name }}</span><TzStatus :tone="item.tone" size="medium" :label="item.name" :show-indicator="showIndicator" /></article></div>
    </section>
    <section class="card">
      <header><h2>Использование</h2><p>Status сообщает состояние, но не является кнопкой или фильтром.</p></header>
      <div class="usage-grid">
        <article><strong>Выбирайте по смыслу</strong><p>Success — положительный результат, Info — процесс, Warning — внимание, Error — проблема, Neutral — неизвестное состояние.</p></article>
        <article><strong>Не полагайтесь только на цвет</strong><p>Всегда оставляйте понятную текстовую подпись. Индикатор можно отключить, если интерфейс слишком плотный.</p></article>
        <article><strong>Одна строка</strong><p>Длинный текст сокращается многоточием. Полное описание размещайте рядом или во всплывающей подсказке.</p></article>
        <article><strong>Без интерактивности</strong><p>Если статус должен открывать меню, используйте отдельную кнопку рядом или хвостовую иконку.</p></article>
      </div>
    </section>
    <section class="card">
      <header><h2>API</h2><p>Компонент использует семантические и декоративные токены Target Zero.</p></header>
      <div class="api"><div v-for="item in api" :key="item[0]"><code>{{ item[0] }}</code><code>{{ item[1] }}</code><span>{{ item[2] }}</span></div></div>
    </section>
  </div>
</template>

<style scoped>
.status-docs{display:grid;gap:var(--padding-spacing-24)}.page-header,.card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--padding-spacing-24)}.eyebrow{margin:0 0 var(--padding-spacing-8);color:var(--brand-primary);font:var(--tz-text-label-small);letter-spacing:.08em}.page-header h1{margin:0 0 var(--padding-spacing-8);color:var(--text-default);font:var(--tz-text-heading-display)}.page-header p,.card header p{max-width:840px;margin:0;color:var(--text-muted);font:var(--tz-text-body-medium)}.ready{display:flex;padding:7px 10px;align-items:center;gap:var(--padding-spacing-6);color:var(--status-success-fg);border-radius:var(--radius-md);background:var(--status-success-bg);font:var(--tz-text-label-small);white-space:nowrap}
.card{min-width:0;padding:var(--padding-spacing-24);border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-surface);box-shadow:0 10px 15px -3px var(--bg-shadow)}.card>header{margin-bottom:var(--padding-spacing-20)}.card h2{margin:0 0 var(--padding-spacing-4);color:var(--text-default);font:600 18px/24px var(--tz-font-family)}.size-section+.size-section{margin-top:var(--padding-spacing-24);padding-top:var(--padding-spacing-20);border-top:1px solid var(--border-default)}.size-section h3{margin:0 0 var(--padding-spacing-12);color:var(--text-muted);font:var(--tz-text-label-medium)}
.status-grid{display:grid;grid-template-columns:repeat(6,minmax(120px,1fr));gap:var(--padding-spacing-16)}.status-grid article{display:flex;min-width:0;flex-direction:column;align-items:flex-start;gap:var(--padding-spacing-8)}.status-grid article>.tone-name{color:var(--text-muted);font:400 10px/14px var(--tz-font-family);letter-spacing:.1px}
.usage-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--padding-spacing-12)}.usage-grid article{padding:var(--padding-spacing-16);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.usage-grid strong{color:var(--text-default);font:var(--tz-text-body-strong)}.usage-grid p{margin:var(--padding-spacing-6) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}
.api{overflow:hidden;border:1px solid var(--border-default);border-radius:var(--radius-md)}.api>div{display:grid;grid-template-columns:1fr 1.4fr 2.2fr;gap:var(--padding-spacing-12);padding:var(--padding-spacing-12);border-top:1px solid var(--border-default);font:var(--tz-text-body-small)}.api>div:first-child{border-top:0}.api code{color:var(--brand-primary);font-family:ui-monospace,SFMono-Regular,Consolas,monospace}
@media(max-width:1100px){.status-grid{grid-template-columns:repeat(3,minmax(120px,1fr))}}@media(max-width:700px){.page-header,.card-header{flex-direction:column}.status-grid,.usage-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.card{padding:var(--padding-spacing-16)}.api{overflow-x:auto}.api>div{min-width:600px}}@media(max-width:440px){.status-grid,.usage-grid{grid-template-columns:1fr}}
</style>
