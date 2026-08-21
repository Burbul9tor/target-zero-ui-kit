<script setup lang="ts">
import { Check, Copy } from '@lucide/vue'
import { computed, ref } from 'vue'

type Token = { figma: string; css: string; value: number }

const spacing: Token[] = [2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80].map(value => ({
  figma: `Padding/spacing-${value}`,
  css: `--padding-spacing-${value}`,
  value,
}))

const radius: Token[] = [
  { figma: 'Radius/none', css: '--radius-none', value: 0 },
  { figma: 'Radius/xs', css: '--radius-xs', value: 4 },
  { figma: 'Radius/sm', css: '--radius-sm', value: 6 },
  { figma: 'Radius/md', css: '--radius-md', value: 8 },
  { figma: 'Radius/lg', css: '--radius-lg', value: 12 },
  { figma: 'Radius/xl', css: '--radius-xl', value: 16 },
  { figma: 'Radius/full', css: '--radius-full', value: 999 },
]

const copied = ref(false)
const cssVariables = computed(() => [...spacing, ...radius]
  .map(token => `  ${token.css}: ${token.value}px;`)
  .join('\n'))

async function copyVariables() {
  await navigator.clipboard?.writeText(`:root {\n${cssVariables.value}\n}`)
  copied.value = true
  window.setTimeout(() => { copied.value = false }, 1200)
}
</script>

<template>
  <div class="variables-docs">
    <header class="variables-hero">
      <div>
        <p>FOUNDATIONS · VARIABLES</p>
        <h1>Отступы и скругления</h1>
        <span>Примитивы из коллекции Figma Primitives. Используйте их вместо произвольных числовых значений.</span>
      </div>
      <small><Check :size="14" /> 20 variables · 2 группы</small>
    </header>

    <section class="token-card">
      <header><h2>Padding / spacing</h2><p>Шкала для gap, padding и пространственных интервалов.</p></header>
      <div class="token-table">
        <article v-for="token in spacing" :key="token.css">
          <div class="spacing-preview"><i :style="{ width: `${token.value}px` }" /></div>
          <code>{{ token.figma }}</code><code>{{ token.css }}</code><strong>{{ token.value }} px</strong>
        </article>
      </div>
    </section>

    <section class="token-card">
      <header><h2>Radius</h2><p>Скругления для контролов, карточек, модальных окон и круглых элементов.</p></header>
      <div class="radius-grid">
        <article v-for="token in radius" :key="token.css">
          <i :style="{ borderRadius: `${token.value}px` }" />
          <code>{{ token.figma }}</code><span>{{ token.css }}</span><strong>{{ token.value }} px</strong>
        </article>
      </div>
    </section>

    <section class="token-card css-card">
      <header>
        <div><h2>CSS variables</h2><p>Готовый набор для подключения в проекте.</p></div>
        <button type="button" @click="copyVariables"><Check v-if="copied" :size="14" /><Copy v-else :size="14" /> {{ copied ? 'Скопировано' : 'Копировать' }}</button>
      </header>
      <pre><code>:root {
{{ cssVariables }}
}</code></pre>
    </section>
  </div>
</template>

<style scoped>
.variables-docs { display: grid; gap: var(--padding-spacing-24); }
.variables-hero { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--padding-spacing-32); padding: var(--padding-spacing-32); color: var(--text-inverse); border-radius: var(--radius-xl); background: var(--brand-primary); }
.variables-hero p { margin: 0 0 var(--padding-spacing-8); color: color-mix(in srgb, var(--text-inverse) 64%, transparent); font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.variables-hero h1 { margin: 0 0 var(--padding-spacing-8); color: var(--text-inverse); font: 700 32px/40px var(--tz-font-family); }
.variables-hero span { display: block; max-width: 720px; color: color-mix(in srgb, var(--text-inverse) 82%, transparent); font: 400 14px/20px var(--tz-font-family); }
.variables-hero small { display: flex; align-items: center; gap: var(--padding-spacing-6); padding: 7px 10px; border-radius: var(--radius-md); background: color-mix(in srgb, var(--text-inverse) 12%, transparent); font: 500 11px/16px var(--tz-font-family); white-space: nowrap; }
.token-card { min-width: 0; padding: var(--padding-spacing-24); border: 1px solid var(--showcase-border); border-radius: var(--radius-lg); background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.token-card > header { margin-bottom: var(--padding-spacing-20); }
.token-card h2, .token-card p { margin-top: 0; }
.token-card h2 { margin-bottom: var(--padding-spacing-4); color: var(--text-default); font: 600 18px/24px var(--tz-font-family); }
.token-card p { margin-bottom: 0; color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.token-table { overflow: hidden; border: 1px solid var(--border-default); border-radius: var(--radius-md); }
.token-table article { display: grid; grid-template-columns: 108px minmax(150px, 1fr) minmax(170px, 1fr) 64px; align-items: center; gap: var(--padding-spacing-16); min-height: 52px; padding: var(--padding-spacing-8) var(--padding-spacing-12); border-bottom: 1px solid var(--border-default); }
.token-table article:last-child { border-bottom: 0; }
.spacing-preview { display: flex; align-items: center; height: 24px; }
.spacing-preview i { min-width: 2px; height: 8px; border-radius: var(--radius-full); background: var(--brand-primary); }
.token-table code, .radius-grid code { color: var(--text-default); font: 500 11px/16px ui-monospace, SFMono-Regular, Consolas, monospace; }
.token-table code:nth-of-type(2), .radius-grid span { color: var(--text-muted); font: 400 11px/16px ui-monospace, SFMono-Regular, Consolas, monospace; }
.token-table strong, .radius-grid strong { color: var(--text-muted); font: 500 11px/16px var(--tz-font-family); text-align: right; }
.radius-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--padding-spacing-12); }
.radius-grid article { display: grid; gap: var(--padding-spacing-8); padding: var(--padding-spacing-16); border: 1px solid var(--border-default); border-radius: var(--radius-md); }
.radius-grid article > i { width: 56px; height: 56px; border: 2px solid var(--brand-primary); background: var(--brand-bg-hover); }
.radius-grid article > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.css-card > header { display: flex; align-items: center; justify-content: space-between; gap: var(--padding-spacing-20); }
.css-card button { display: flex; align-items: center; gap: var(--padding-spacing-6); padding: 7px 10px; color: var(--brand-primary); border: 1px solid var(--border-default); border-radius: var(--radius-sm); background: var(--brand-bg-accent); font: 500 11px/16px var(--tz-font-family); cursor: pointer; }
.css-card pre { max-height: 440px; margin: 0; padding: var(--padding-spacing-20); overflow: auto; color: var(--green-100); border-radius: var(--radius-md); background: var(--gray-900); font: 400 11px/18px ui-monospace, SFMono-Regular, Consolas, monospace; }
@media (max-width: 900px) { .radius-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .token-table article { grid-template-columns: 80px 1fr 60px; } .token-table code:nth-of-type(2) { display: none; } }
@media (max-width: 620px) { .variables-hero, .css-card > header { flex-direction: column; } .variables-hero, .token-card { padding: var(--padding-spacing-16); } .radius-grid { grid-template-columns: 1fr; } .token-table article { grid-template-columns: 48px 1fr 48px; gap: var(--padding-spacing-8); } }
</style>
