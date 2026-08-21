<script setup lang="ts">
import { Check } from '@lucide/vue'
import { ref } from 'vue'
import TzToast, { type ToastType } from '../feedback/TzToast.vue'

const variants: Array<{ type: ToastType; label: string }> = [
  { type: 'neutral', label: 'Neutral' },
  { type: 'error', label: 'Error' },
  { type: 'info', label: 'Info' },
  { type: 'warning', label: 'Warning' },
  { type: 'success', label: 'Success' },
]

type LiveToast = { id: number; type: ToastType; showDescription: boolean }

const showSubtitle = ref(true)
const liveToasts = ref<LiveToast[]>([])
let nextToastId = 0

function playToast(type: ToastType) {
  liveToasts.value.push({ id: ++nextToastId, type, showDescription: showSubtitle.value })
}

function closeToast(id: number) {
  liveToasts.value = liveToasts.value.filter((toast) => toast.id !== id)
}

const props = [
  ['type', 'neutral | success | info | warning | error', 'neutral'],
  ['title', 'string', 'Notification'],
  ['description', 'string', 'Something happened.'],
  ['icon', 'boolean', 'true'],
  ['progress', 'boolean', 'true'],
  ['showDescription', 'boolean', 'true'],
  ['duration', 'number (ms)', '4000'],
  ['autoClose', 'boolean', 'true'],
  ['@close', 'event', '—'],
]

const tokens = [
  ['Background', 'bg/background-card', '#FFFFFF'],
  ['Shadow', 'bg/shadow', '#0000001A'],
  ['Title', 'text/default', '#161616'],
  ['Description', 'text/muted', '#717A7A'],
  ['Neutral badge', 'slate-bg / slate-fg', '#EBF0F2 / #607781'],
  ['Success', 'status/success-bg / fg', '#E2EEEA / #386C58'],
  ['Info', 'status/info-bg / fg', '#DAECF6 / #18628B'],
  ['Warning', 'status/warning-bg / fg', '#FEF3C7 / #B45309'],
  ['Error', 'status/error-bg / fg', '#FEE2E2 / #B91C1C'],
]
</script>

<template>
  <div class="toast-docs">
    <header class="toast-docs__header">
      <div>
        <p class="toast-docs__eyebrow">COMPONENT · FEEDBACK</p>
        <h1>Toasts</h1>
        <p>Временные системные уведомления о результате действия или изменении состояния. Toast не блокирует интерфейс, появляется справа сверху и закрывается автоматически либо вручную.</p>
      </div>
      <span><Check :size="14" /> Реализовано</span>
    </header>

    <section class="toast-card toast-requirements">
      <header><div><h2>Интерфейсные требования</h2><p>Правила отображения, взаимодействия и motion-поведения компонента.</p></div></header>
      <div class="requirement-grid">
        <article><strong>Назначение</strong><p>Сообщает о результате операции, ошибке, предупреждении или информационном событии. Не требует перехода на отдельный экран.</p></article>
        <article><strong>Размещение</strong><p>Viewport фиксируется справа сверху с отступом <code>24px</code>. На узких экранах ширина ограничивается доступной областью.</p></article>
        <article><strong>Стек</strong><p>Новые Toasts добавляются вертикально с интервалом <code>12px</code>. Каждый элемент имеет независимый таймер и может быть закрыт отдельно.</p></article>
        <article><strong>Время показа</strong><p>Стандартная длительность — <code>4000ms</code>. Значение настраивается через prop <code>duration</code>.</p></article>
        <article><strong>Progress</strong><p>Полоска высотой <code>3px</code> заполняется слева направо и показывает оставшееся время. При заполнении Toast закрывается.</p></article>
        <article><strong>Hover-пауза</strong><p>При наведении останавливаются progress-анимация и фактический таймер. После ухода курсора отсчёт продолжается с сохранённой позиции.</p></article>
        <article><strong>Появление</strong><p><code>220ms</code>, fade + slide справа, easing <code>cubic-bezier(.2, .8, .2, 1)</code>.</p></article>
        <article><strong>Исчезновение</strong><p><code>180ms</code>, fade + slide вправо. Элемент удаляется из DOM только после exit-анимации.</p></article>
        <article><strong>Закрытие</strong><p>Автоматическое — по окончании таймера. Ручное — по кнопке с иконкой Close. Оба сценария используют одинаковую exit-анимацию.</p></article>
        <article><strong>Контент</strong><p>Заголовок обязателен. Подзаголовок, статусная иконка и progress опциональны. Длинный текст переносится внутри ширины компонента.</p></article>
        <article><strong>Типы</strong><p><code>Neutral</code>, <code>Success</code>, <code>Info</code>, <code>Warning</code>, <code>Error</code>. Цвет бейджа и progress соответствует семантике типа.</p></article>
        <article><strong>Доступность</strong><p><code>Warning</code> и <code>Error</code> используют <code>role=&quot;alert&quot;</code>, остальные — <code>role=&quot;status&quot;</code>. Кнопка закрытия имеет доступное имя.</p></article>
      </div>
    </section>

    <section class="toast-card">
      <header class="toast-types-header">
        <div><h2>Типы</h2><p>Полный набор вариантов из Figma node 22:942.</p></div>
        <label class="subtitle-toggle">
          <span>Подзаголовок</span>
          <input v-model="showSubtitle" type="checkbox" />
          <i aria-hidden="true" />
        </label>
      </header>
      <div class="toast-stage">
        <div v-for="variant in variants" :key="variant.type" class="toast-example">
          <small>{{ variant.label }}</small>
          <div class="toast-example__preview">
            <TzToast :type="variant.type" :show-description="showSubtitle" :auto-close="false" />
          </div>
          <button class="play-button" type="button" @click="playToast(variant.type)">Воспроизвести</button>
        </div>
      </div>
    </section>


    <section class="toast-card">
      <header><div><h2>API</h2><p>Пропсы и событие Vue-компонента.</p></div></header>
      <div class="toast-table">
        <div class="toast-table__row toast-table__head"><span>Имя</span><span>Тип</span><span>По умолчанию</span></div>
        <div v-for="row in props" :key="row[0]" class="toast-table__row"><code>{{ row[0] }}</code><span>{{ row[1] }}</span><span>{{ row[2] }}</span></div>
      </div>
    </section>

    <section class="toast-card">
      <header><div><h2>Стили и токены</h2><p>Цветовые роли и resolved values из макета.</p></div></header>
      <div class="toast-tokens">
        <article v-for="token in tokens" :key="token[0]"><strong>{{ token[0] }}</strong><code>{{ token[1] }}</code><span>{{ token[2] }}</span></article>
      </div>
      <div class="toast-specs">
        <span>Width <strong>360px</strong></span><span>Padding <strong>12px 16px</strong></span><span>Gap <strong>12px</strong></span><span>Radius <strong>8px</strong></span><span>Badge <strong>32px</strong></span><span>Progress <strong>3px</strong></span>
      </div>
    </section>

    <Teleport to="body">
      <div class="toast-viewport" aria-live="polite" aria-label="Уведомления">
        <TzToast
          v-for="toast in liveToasts"
          :key="toast.id"
          :type="toast.type"
          :show-description="toast.showDescription"
          @close="closeToast(toast.id)"
        />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.toast-docs { display: grid; gap: 24px; }
.toast-docs__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; }
.toast-docs__eyebrow { margin: 0 0 8px; color: var(--brand-primary); font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.toast-docs__header h1 { margin: 0 0 8px; color: var(--text-default); font: 700 32px/40px var(--tz-font-family); }
.toast-docs__header p, .toast-card header p { margin: 0; color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.toast-docs__header > span { display: flex; align-items: center; gap: 6px; padding: 7px 10px; color: var(--status-success-fg); border-radius: 8px; background: var(--status-success-bg); font: 500 11px/16px var(--tz-font-family); white-space: nowrap; }
.toast-card { padding: 24px; border: 1px solid var(--showcase-border); border-radius: 12px; background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.toast-card > header { margin-bottom: 20px; }
.toast-types-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.subtitle-toggle { display: flex; align-items: center; gap: 10px; color: var(--text-default); font: 500 12px/16px var(--tz-font-family); cursor: pointer; }
.subtitle-toggle input { position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0; pointer-events: none; }
.subtitle-toggle i { position: relative; width: 32px; height: 18px; border-radius: 999px; background: var(--bg-track-off); transition: background-color 160ms ease; }
.subtitle-toggle i::after { position: absolute; top: 3px; left: 3px; width: 12px; height: 12px; border-radius: 50%; background: var(--bg-surface); box-shadow: 0 1px 3px var(--bg-shadow); content: ''; transition: transform 160ms ease; }
.subtitle-toggle input:checked + i { background: var(--brand-primary); }
.subtitle-toggle input:checked + i::after { transform: translateX(14px); }
.subtitle-toggle input:focus-visible + i { outline: 2px solid var(--brand-primary); outline-offset: 2px; }
.toast-card h2 { margin: 0 0 4px; color: var(--text-default); font: 600 18px/24px var(--tz-font-family); }
.requirement-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.requirement-grid article { padding: 16px; border: 1px solid var(--showcase-border); border-radius: 8px; background: var(--showcase-canvas); }
.requirement-grid strong { color: var(--text-default); font: 500 12px/16px var(--tz-font-family); }
.requirement-grid p { margin: 6px 0 0; color: var(--text-muted); font: 400 12px/18px var(--tz-font-family); }
.requirement-grid code { font-size: 11px; }
.toast-stage { display: grid; gap: 16px; padding: 24px; border-radius: 8px; background: var(--bg-disabled); }
.toast-example { display: grid; grid-template-columns: 72px minmax(0, 360px) auto; align-items: center; gap: 16px; }
.toast-example__preview { display: flex; min-height: 64px; align-items: center; }
.toast-example small { color: var(--text-muted); font: 500 10px/14px var(--tz-font-family); letter-spacing: .06em; text-transform: uppercase; }
.play-button { width: fit-content; padding: 8px 12px; color: var(--brand-primary); border: 1px solid var(--border-default); border-radius: 6px; background: var(--brand-bg-accent); font: 500 12px/16px var(--tz-font-family); cursor: pointer; }
.play-button { white-space: nowrap; }
.toast-viewport { position: fixed; z-index: 2000; top: 24px; right: 24px; display: flex; width: min(360px, calc(100vw - 32px)); flex-direction: column; align-items: flex-end; gap: 12px; pointer-events: none; }
.toast-viewport :deep(.tz-toast) { pointer-events: auto; }
.toast-table { overflow: hidden; border: 1px solid var(--showcase-border); border-radius: 8px; }
.toast-table__row { display: grid; grid-template-columns: .6fr 1.5fr .7fr; border-top: 1px solid var(--showcase-border); }
.toast-table__row:first-child { border-top: 0; }
.toast-table__row > * { padding: 10px 12px; color: var(--text-muted); font: 400 12px/16px var(--tz-font-family); }
.toast-table__row > * + * { border-left: 1px solid var(--showcase-border); }
.toast-table__head { background: var(--showcase-canvas); }
.toast-table__head > * { color: var(--text-default); font-weight: 500; }
code { color: var(--brand-primary); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
.toast-tokens { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.toast-tokens article { display: flex; flex-direction: column; gap: 3px; padding: 12px; border: 1px solid var(--showcase-border); border-radius: 8px; }
.toast-tokens strong { color: var(--text-default); font: 500 12px/16px var(--tz-font-family); }
.toast-tokens code, .toast-tokens span { font: 400 10px/14px var(--tz-font-family); }
.toast-tokens span { color: var(--text-muted); }
.toast-specs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.toast-specs span { padding: 6px 8px; color: var(--text-muted); border-radius: 6px; background: var(--showcase-canvas); font: 400 11px/16px var(--tz-font-family); }
.toast-specs strong { color: var(--text-default); font-weight: 500; }
@media (max-width: 1000px) { .requirement-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 820px) { .toast-tokens, .requirement-grid { grid-template-columns: 1fr; } }
@media (max-width: 620px) { .toast-docs__header { flex-direction: column; } .toast-card { padding: 16px; } .toast-stage { padding: 16px; } .toast-example { grid-template-columns: 1fr; } .toast-table { overflow-x: auto; } .toast-table__row { min-width: 620px; } }
</style>
