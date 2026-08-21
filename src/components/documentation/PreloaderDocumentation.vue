<script setup lang="ts">
import { Check, Pause, Play, RotateCcw } from '@lucide/vue'
import { ref } from 'vue'
import TzPreloader from '../feedback/TzPreloader.vue'

type PreloaderInstance = InstanceType<typeof TzPreloader>

const bluePreloader = ref<PreloaderInstance | null>(null)
const brandPreloader = ref<PreloaderInstance | null>(null)

const api = [
  ['variant', 'blue | brand', 'brand'],
  ['size', 'number | string', '96'],
  ['autoplay', 'boolean', 'true'],
  ['loop', 'boolean', 'true'],
  ['speed', 'number', '1'],
  ['label', 'string', 'Загрузка'],
  ['@ready', 'event', '—'],
  ['@complete', 'event', '—'],
  ['@loopComplete', 'event', '—'],
]

const sizes = [32, 48, 64, 96]
</script>

<template>
  <div class="preloader-docs">
    <header class="preloader-docs__header">
      <div>
        <p class="preloader-docs__eyebrow">COMPONENT · FEEDBACK</p>
        <h1>Preloader</h1>
        <p>Анимированный индикатор загрузки Target Zero в двух цветовых вариантах. Источник — Lottie JSON, 60 FPS, цикл 140 кадров.</p>
      </div>
      <span><Check :size="14" /> Реализовано</span>
    </header>

    <section class="preloader-card">
      <header><h2>Цветовые варианты</h2><p>Brand для основного интерфейса и Blue для альтернативного контекста.</p></header>
      <div class="variant-grid">
        <article>
          <div class="preview preview--light"><TzPreloader ref="brandPreloader" variant="brand" :size="140" /></div>
          <div class="variant-info"><div><small>BRAND</small><strong>Target Zero Brand</strong></div><div class="controls"><button type="button" aria-label="Воспроизвести Brand" @click="brandPreloader?.play()"><Play :size="16" /></button><button type="button" aria-label="Пауза Brand" @click="brandPreloader?.pause()"><Pause :size="16" /></button><button type="button" aria-label="Перезапустить Brand" @click="brandPreloader?.restart()"><RotateCcw :size="16" /></button></div></div>
        </article>

        <article>
          <div class="preview preview--blue"><TzPreloader ref="bluePreloader" variant="blue" :size="140" /></div>
          <div class="variant-info"><div><small>BLUE</small><strong>Target Zero Blue</strong></div><div class="controls"><button type="button" aria-label="Воспроизвести Blue" @click="bluePreloader?.play()"><Play :size="16" /></button><button type="button" aria-label="Пауза Blue" @click="bluePreloader?.pause()"><Pause :size="16" /></button><button type="button" aria-label="Перезапустить Blue" @click="bluePreloader?.restart()"><RotateCcw :size="16" /></button></div></div>
        </article>
      </div>
    </section>

    <section class="preloader-card">
      <header><h2>Размеры</h2><p>Компонент масштабируется с сохранением исходных пропорций анимации 1300 × 1874.</p></header>
      <div class="size-stage">
        <article v-for="size in sizes" :key="size"><div><TzPreloader variant="brand" :size="size" /></div><code>{{ size }}px</code></article>
      </div>
    </section>

    <section class="preloader-card requirements">
      <header><h2>Правила использования</h2><p>Поведение и доступность индикатора загрузки.</p></header>
      <div class="requirement-grid">
        <article><strong>Назначение</strong><p>Показывает, что система выполняет операцию с неизвестной или неопределённой длительностью.</p></article>
        <article><strong>Цикл</strong><p>По умолчанию анимация запускается автоматически и повторяется непрерывно до завершения загрузки.</p></article>
        <article><strong>Размещение</strong><p>Центрируется внутри блокируемой области. Размер задаётся контекстом через prop <code>size</code>.</p></article>
        <article><strong>Доступность</strong><p>Контейнер использует <code>role="status"</code> и доступное имя. Сама декоративная анимация скрыта от screen reader.</p></article>
      </div>
    </section>

    <section class="preloader-card">
      <header><h2>API</h2><p>Props, события и публичные методы Vue-компонента.</p></header>
      <div class="preloader-table">
        <div class="preloader-table__row preloader-table__head"><span>Имя</span><span>Тип</span><span>По умолчанию</span></div>
        <div v-for="row in api" :key="row[0]" class="preloader-table__row"><code>{{ row[0] }}</code><span>{{ row[1] }}</span><span>{{ row[2] }}</span></div>
      </div>
      <p class="methods">Публичные методы: <code>play()</code>, <code>pause()</code>, <code>stop()</code>, <code>restart()</code>.</p>
    </section>
  </div>
</template>

<style scoped>
.preloader-docs { display: grid; gap: 24px; }
.preloader-docs__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; }
.preloader-docs__eyebrow { margin: 0 0 8px; color: var(--brand-primary); font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.preloader-docs__header h1 { margin: 0 0 8px; color: var(--text-default); font: 700 32px/40px var(--tz-font-family); }
.preloader-docs__header p, .preloader-card header p { margin: 0; color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.preloader-docs__header > span { display: flex; align-items: center; gap: 6px; padding: 7px 10px; color: var(--status-success-fg); border-radius: 8px; background: var(--status-success-bg); font: 500 11px/16px var(--tz-font-family); white-space: nowrap; }
.preloader-card { padding: 24px; border: 1px solid var(--showcase-border); border-radius: 12px; background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.preloader-card > header { margin-bottom: 20px; }
.preloader-card h2 { margin: 0 0 4px; color: var(--text-default); font: 600 18px/24px var(--tz-font-family); }
.variant-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.variant-grid > article { overflow: hidden; border: 1px solid var(--showcase-border); border-radius: 10px; }
.preview { display: grid; min-height: 280px; place-items: center; background: var(--showcase-canvas); }
.preview--blue { background: var(--blue-50); }
.variant-info { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px; border-top: 1px solid var(--showcase-border); }
.variant-info > div:first-child { display: flex; flex-direction: column; }
.variant-info small { color: var(--text-muted); font: 500 10px/14px var(--tz-font-family); letter-spacing: .06em; }
.variant-info strong { color: var(--text-default); font: 500 13px/20px var(--tz-font-family); }
.controls { display: flex; gap: 6px; }
.controls button { display: grid; width: 32px; height: 32px; padding: 0; place-items: center; color: var(--brand-primary); border: 1px solid var(--border-default); border-radius: 6px; background: var(--brand-bg-accent); cursor: pointer; }
.size-stage { display: flex; align-items: flex-end; gap: 32px; min-height: 190px; padding: 24px; border-radius: 8px; background: var(--showcase-canvas); }
.size-stage article { display: grid; gap: 12px; justify-items: center; }
.size-stage article > div { display: flex; min-width: 100px; height: 145px; align-items: center; justify-content: center; }
code { color: var(--brand-primary); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 11px; }
.requirement-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.requirement-grid article { padding: 16px; border: 1px solid var(--showcase-border); border-radius: 8px; background: var(--showcase-canvas); }
.requirement-grid strong { color: var(--text-default); font: 500 12px/16px var(--tz-font-family); }
.requirement-grid p { margin: 6px 0 0; color: var(--text-muted); font: 400 12px/18px var(--tz-font-family); }
.preloader-table { overflow: hidden; border: 1px solid var(--showcase-border); border-radius: 8px; }
.preloader-table__row { display: grid; grid-template-columns: .7fr 1.4fr .7fr; border-top: 1px solid var(--showcase-border); }
.preloader-table__row:first-child { border-top: 0; }
.preloader-table__row > * { padding: 10px 12px; color: var(--text-muted); font: 400 12px/16px var(--tz-font-family); }
.preloader-table__row > * + * { border-left: 1px solid var(--showcase-border); }
.preloader-table__head { background: var(--showcase-canvas); }
.preloader-table__head > * { color: var(--text-default); font-weight: 500; }
.methods { margin: 14px 0 0; color: var(--text-muted); font: 400 12px/18px var(--tz-font-family); }
@media (max-width: 760px) { .preloader-docs__header { flex-direction: column; } .variant-grid, .requirement-grid { grid-template-columns: 1fr; } .preloader-card { padding: 16px; } .size-stage { overflow-x: auto; } .preloader-table { overflow-x: auto; } .preloader-table__row { min-width: 560px; } }
</style>
