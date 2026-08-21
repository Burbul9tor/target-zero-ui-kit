<script setup lang="ts">
import { Check } from '@lucide/vue'
import { ref } from 'vue'
import TzToggle from '../forms/TzToggle.vue'

const medium = ref(false)
const small = ref(false)

const tokens = [
  ['On track', 'brand/primary', 'green-600'],
  ['Off track', 'bg/track-off', 'gray-200'],
  ['Thumb', 'bg/surface', 'gray-0'],
  ['Label', 'text/default', 'gray-900'],
  ['Focus', 'brand/primary', 'green-600'],
]
</script>

<template>
  <div class="toggle-docs">
    <header class="toggle-docs__header">
      <div>
        <p class="toggle-docs__eyebrow">COMPONENT · FORM CONTROL</p>
        <h1>Toggle</h1>
        <p>Переключатель бинарного состояния из Target Zero Design System, Figma node 137:4302.</p>
      </div>
      <span><Check :size="14" /> Готово</span>
    </header>

    <section class="toggle-card">
      <header><h2>Интерактивный пример</h2><p>Нажмите на переключатель, чтобы проверить On и Off.</p></header>
      <div class="interactive-grid">
        <article><small>MEDIUM</small><TzToggle v-model="medium" label="Title" /></article>
        <article><small>SMALL</small><TzToggle v-model="small" size="small" label="Тема" /></article>
      </div>
    </section>

    <section class="toggle-card">
      <header><h2>Варианты</h2><p>Полный набор размеров и состояний для визуальной проверки.</p></header>
      <div class="variant-grid">
        <article><small>MEDIUM · OFF</small><TzToggle :model-value="false" label="Title" /></article>
        <article><small>MEDIUM · ON</small><TzToggle :model-value="true" label="Title" /></article>
        <article><small>SMALL · OFF</small><TzToggle :model-value="false" size="small" label="Светлая тема" /></article>
        <article><small>SMALL · ON</small><TzToggle :model-value="true" size="small" label="Тёмная тема" /></article>
        <article><small>WITHOUT LABEL</small><TzToggle :model-value="false" :show-label="false" label="Переключатель" /></article>
        <article><small>DISABLED</small><TzToggle :model-value="true" label="Title" disabled /></article>
      </div>
    </section>

    <section class="toggle-card">
      <header><h2>Интерфейс и поведение</h2><p>Требования для использования компонента во фронтенде.</p></header>
      <div class="requirements">
        <article><strong>v-model</strong><p>При нажатии обновляет boolean-значение и отправляет события <code>update:modelValue</code> и <code>change</code>.</p></article>
        <article><strong>Доступность</strong><p>Использует нативную кнопку, <code>role="switch"</code> и <code>aria-checked</code>. Управляется Tab, Enter и Space.</p></article>
        <article><strong>Medium</strong><p>Control 36×20px, thumb 16px, label — Body/Medium 14/20 Regular, gap 8px.</p></article>
        <article><strong>Small</strong><p>Control 32×16px, thumb 12px. Иконки солнца и луны взяты из Figma.</p></article>
      </div>
    </section>

    <section class="toggle-card">
      <header><h2>Токены</h2><p>Компонент использует только семантические цвета из Colors.</p></header>
      <div class="token-grid">
        <article v-for="token in tokens" :key="token[0]"><strong>{{ token[0] }}</strong><code>{{ token[1] }}</code><span>→ {{ token[2] }}</span></article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.toggle-docs { display: grid; gap: 24px; }
.toggle-docs__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; }
.toggle-docs__eyebrow { margin: 0 0 8px; color: var(--brand-primary); font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.toggle-docs__header h1 { margin: 0 0 8px; color: var(--text-default); font: 700 32px/40px var(--tz-font-family); }
.toggle-docs__header p, .toggle-card header p { margin: 0; color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.toggle-docs__header > span { display: flex; align-items: center; gap: 6px; padding: 7px 10px; color: var(--status-success-fg); border-radius: 8px; background: var(--status-success-bg); font: 500 11px/16px var(--tz-font-family); white-space: nowrap; }
.toggle-card { min-width: 0; padding: 24px; border: 1px solid var(--border-default); border-radius: 12px; background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.toggle-card > header { margin-bottom: 20px; }
.toggle-card h2 { margin: 0 0 4px; color: var(--text-default); font: 600 18px/24px var(--tz-font-family); }
.interactive-grid, .variant-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.interactive-grid article, .variant-grid article { display: flex; min-height: 88px; padding: 20px; align-items: center; gap: 24px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--bg-page); }
.interactive-grid small, .variant-grid small { min-width: 112px; color: var(--text-muted); font: 500 10px/14px var(--tz-font-family); letter-spacing: .05em; }
.requirements { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.requirements article, .token-grid article { padding: 16px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--bg-page); }
.requirements strong, .token-grid strong { color: var(--text-default); font: 500 12px/16px var(--tz-font-family); }
.requirements p { margin: 6px 0 0; color: var(--text-muted); font: 400 12px/18px var(--tz-font-family); }
code { color: var(--brand-primary); font: 400 11px/16px ui-monospace, SFMono-Regular, Consolas, monospace; }
.token-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
.token-grid article { display: flex; min-width: 0; padding: 12px; flex-direction: column; gap: 3px; }
.token-grid code, .token-grid span { overflow: hidden; color: var(--text-muted); font: 400 10px/14px var(--tz-font-family); text-overflow: ellipsis; }
@media (max-width: 900px) { .token-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 620px) { .toggle-docs__header { flex-direction: column; } .toggle-card { padding: 16px; } .interactive-grid, .variant-grid, .requirements, .token-grid { grid-template-columns: 1fr; } }
</style>
