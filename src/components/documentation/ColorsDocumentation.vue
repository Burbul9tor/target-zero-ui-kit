<script setup lang="ts">
import { Check, Copy } from '@lucide/vue'
import { ref } from 'vue'
import tokensCss from '../../styles/tokens.css?raw'

type Swatch = { name: string; value: string }
type SemanticToken = { name: string; values: Record<string, { value: string; alias?: string }> }

const primitiveGroups: Array<{ name: string; colors: Swatch[] }> = [
  { name: 'green', colors: [
    ['50', '#F2F8F5'], ['100', '#E2EEEA'], ['200', '#C2E0D5'], ['300', '#9ACBB8'], ['400', '#72B69C'],
    ['500', '#53A184'], ['600', '#407C65'], ['700', '#386C58'], ['800', '#2A5142'], ['900', '#20372E'],
  ].map(([name, value]) => ({ name, value })) },
  { name: 'blue', colors: [
    ['50', '#EFF6FB'], ['100', '#DAECF6'], ['200', '#B1DAF2'], ['300', '#7CC1E9'], ['400', '#48A9E0'],
    ['500', '#2492D1'], ['600', '#2D9CDB'], ['700', '#18628B'], ['800', '#124968'], ['900', '#113345'],
  ].map(([name, value]) => ({ name, value })) },
  { name: 'gray', colors: [
    ['0', '#FFFFFF'], ['50', '#F8F9F9'], ['100', '#F2F3F3'], ['200', '#E4E7E6'], ['300', '#CFD3D3'], ['400', '#9AA2A2'],
    ['500', '#717A7A'], ['600', '#5F5F5F'], ['700', '#404040'], ['800', '#2B2B2B'], ['900', '#161616'], ['950', '#0C0C0C'],
  ].map(([name, value]) => ({ name, value })) },
  { name: 'red', colors: [['100', '#FEE2E2'], ['600', '#DC2626'], ['700', '#B91C1C']].map(([name, value]) => ({ name, value })) },
  { name: 'amber', colors: [['100', '#FEF3C7'], ['600', '#D97706'], ['700', '#B45309']].map(([name, value]) => ({ name, value })) },
  { name: 'alpha', colors: [
    ['green-600 10%', '#407C651A'], ['green-600 20%', '#407C651F'], ['green-600 30%', '#407C654D'],
    ['blue-600 10%', '#2D9CDB1A'], ['blue-600 20%', '#2D9CDB33'], ['blue-600 30%', '#2D9CDB4D'],
  ].map(([name, value]) => ({ name, value })) },
]

const brandMode = ref('Client A')
const appearanceMode = ref('Light')
const copied = ref('')

const brandTokens: SemanticToken[] = [
  { name: 'brand/primary', values: { 'Client A': { value: '#407C65', alias: 'green-600' }, 'Client B': { value: '#2D9CDB', alias: 'blue-600' } } },
  { name: 'brand/primary-hover', values: { 'Client A': { value: '#386C58', alias: 'green-700' }, 'Client B': { value: '#18628B', alias: 'blue-700' } } },
  { name: 'brand/bg-hover', values: { 'Client A': { value: '#407C651A', alias: 'green-600 10%' }, 'Client B': { value: '#2D9CDB1A', alias: 'blue-600 10%' } } },
  { name: 'brand/bg-active', values: { 'Client A': { value: '#407C651F', alias: 'green-600 20%' }, 'Client B': { value: '#2D9CDB33', alias: 'blue-600 20%' } } },
  { name: 'brand/bg-accent', values: { 'Client A': { value: '#407C654D', alias: 'green-600 30%' }, 'Client B': { value: '#2D9CDB1A', alias: 'blue-600 10%' } } },
]

const appearanceTokens: SemanticToken[] = [
  ['bg/Surface', '#FFFFFF', '#2B2B2B', 'gray-0', 'gray-800'], ['bg/page', '#F8F9F9', '#161616', 'gray-50', 'gray-900'],
  ['text/default', '#161616', '#F8F9F9', 'gray-900', 'gray-50'], ['text/muted', '#717A7A', '#9AA2A2', 'gray-500', 'gray-400'],
  ['text/placeholder', '#9AA2A2', '#717A7A', 'gray-400', 'gray-500'], ['text/inverse', '#FFFFFF', '#161616', 'gray-0', 'gray-900'],
  ['text/disabled', '#CFD3D3', '#5F5F5F', 'gray-300', 'gray-600'], ['border/default', '#E4E7E6', '#404040', 'gray-200', 'gray-700'],
  ['bg/disabled', '#F2F3F3', '#2B2B2B', 'gray-100', 'gray-800'], ['bg/track-off', '#E4E7E6', '#404040', 'gray-200', 'gray-700'],
  ['bg/row-hover', '#F8F9F9', '#2B2B2B', 'gray-50', 'gray-800'], ['bg/overlay', '#00000066', '#00000099', '', ''],
  ['Icon/default', '#404040', '#CFD3D3', 'gray-700', 'gray-300'], ['text/Button-fill', '#FFFFFF', '#FFFFFF', 'gray-0', 'gray-0'],
  ['bg/Shadow', '#0000001A', '#FFFFFF1A', '', ''], ['bg/Background card', '#FFFFFF', '#2B2B2B', 'gray-0', 'gray-800'],
].map(([name, light, dark, lightAlias, darkAlias]) => ({ name, values: { Light: { value: light, alias: lightAlias || undefined }, Dark: { value: dark, alias: darkAlias || undefined } } }))

const statusTokens: SemanticToken[] = [
  ['status/success-bg', '#E2EEEA', 'green-100'], ['status/success-fg', '#386C58', 'green-700'],
  ['status/error-bg', '#FEE2E2', 'red-100'], ['status/error-fg', '#B91C1C', 'red-700'],
  ['status/warning-bg', '#FEF3C7', 'amber-100'], ['status/warning-fg', '#B45309', 'amber-700'],
  ['status/info-bg', '#DAECF6', 'blue-100'], ['status/info-fg', '#18628B', 'blue-700'],
  ['status/Default-bg', '#FFFFFF', 'gray-0'], ['status/success-fg 2', '#386C58', 'green-700'],
].map(([name, value, alias]) => ({ name, values: { Light: { value, alias } } }))

const effectTokens: SemanticToken[] = [
  { name: 'Effect/shadow', values: { 'Client A': { value: '#407C6533' }, 'Client B': { value: '#2D9CDB33' } } },
  { name: 'Hover', values: { 'Client A': { value: '#407C6533' }, Mode: { value: '#407C6533' } } },
]

const decorativeTokens: SemanticToken[] = [
  ['blue-bg', '#E9F3F8'], ['blue-fg', '#397DA3'], ['violet-bg', '#F0EEF9'], ['violet-fg', '#7467AA'],
  ['amber-bg', '#FBF1DF'], ['amber-fg', '#A87420'], ['orange-bg', '#FBEEE5'], ['orange-fg', '#B56D3A'],
  ['rose-bg', '#F9E9EC'], ['rose-fg', '#B05D68'], ['slate-bg', '#EBF0F2'], ['slate-fg', '#607781'],
  ['сyan-bg', '#E7F5F5'], ['cyan-fg', '#27848B'],
].map(([name, value]) => ({ name, values: { 'Mode 1': { value } } }))

const fullCssVariables = tokensCss.trim()

async function copyValue(value: string) {
  await navigator.clipboard?.writeText(value)
  copied.value = value
  window.setTimeout(() => { if (copied.value === value) copied.value = '' }, 1200)
}
</script>

<template>
  <div class="colors-docs">
    <header class="color-hero">
      <div><p>FOUNDATIONS · COLORS</p><h1>Цветовая система Target Zero</h1><span>Единый справочник примитивов, семантических токенов и режимов. В интерфейсах используйте семантические variables; примитивы служат источником значений.</span></div>
      <small><Check :size="14" /> 91 цветовая variable · 6 коллекций</small>
    </header>

    <section class="color-card">
      <header><h2>Primitives</h2><p>Сырые значения. Не используйте напрямую в компонентах.</p></header>
      <div class="primitive-groups">
        <article v-for="group in primitiveGroups" :key="group.name" class="primitive-group">
          <h3>{{ group.name }}</h3>
          <div class="swatch-grid">
            <button v-for="color in group.colors" :key="color.name" type="button" class="swatch" :title="`Скопировать ${color.value}`" @click="copyValue(color.value)">
              <i :style="{ background: color.value }" /><strong>{{ color.name }}</strong><code>{{ color.value }}</code>
              <span v-if="copied === color.value">Скопировано</span>
            </button>
          </div>
        </article>
      </div>
    </section>

    <section class="color-card">
      <header class="section-header"><div><h2>Brand</h2><p>Брендовые алиасы переключаются между Client A и Client B.</p></div><div class="mode-switch"><button v-for="mode in ['Client A', 'Client B']" :key="mode" :class="{ active: brandMode === mode }" @click="brandMode = mode">{{ mode }}</button></div></header>
      <div class="semantic-grid"><article v-for="token in brandTokens" :key="token.name"><i :style="{ background: token.values[brandMode].value }" /><div><code>{{ token.name }}</code><span v-if="token.values[brandMode].alias">→ {{ token.values[brandMode].alias }}</span></div><strong>{{ token.values[brandMode].value }}</strong></article></div>
    </section>

    <section class="color-card">
      <header class="section-header"><div><h2>Appearance</h2><p>Семантические цвета интерфейса для светлой и тёмной темы.</p></div><div class="mode-switch"><button v-for="mode in ['Light', 'Dark']" :key="mode" :class="{ active: appearanceMode === mode }" @click="appearanceMode = mode">{{ mode }}</button></div></header>
      <div class="semantic-grid" :class="{ dark: appearanceMode === 'Dark' }"><article v-for="token in appearanceTokens" :key="token.name"><i :style="{ background: token.values[appearanceMode].value }" /><div><code>{{ token.name }}</code><span v-if="token.values[appearanceMode].alias">→ {{ token.values[appearanceMode].alias }}</span></div><strong>{{ token.values[appearanceMode].value }}</strong></article></div>
    </section>

    <section class="color-card">
      <header><h2>Status</h2><p>Фоновые и foreground-цвета системной обратной связи.</p></header>
      <div class="semantic-grid"><article v-for="token in statusTokens" :key="token.name"><i :style="{ background: token.values.Light.value }" /><div><code>{{ token.name }}</code><span>→ {{ token.values.Light.alias }}</span></div><strong>{{ token.values.Light.value }}</strong></article></div>
    </section>

    <section class="color-card">
      <header><h2>Effect & Decorative</h2><p>Эффекты и дополнительные пары фон/текст.</p></header>
      <div class="semantic-grid compact"><article v-for="token in [...effectTokens, ...decorativeTokens]" :key="token.name"><i :style="{ background: Object.values(token.values)[0].value }" /><div><code>{{ token.name }}</code></div><strong>{{ Object.values(token.values)[0].value }}</strong></article></div>
    </section>

    <section class="color-card architecture">
      <header><h2>Архитектура токенов</h2><p>Компоненты связываются с семантическими переменными, а не с hex.</p></header>
      <div><span><strong>Primitives</strong><small>Сырые цвета</small></span><b>→</b><span><strong>Brand</strong><small>Client A / B</small></span><b>→</b><span><strong>Appearance</strong><small>Light / Dark</small></span><b>→</b><span><strong>Status</strong><small>Feedback</small></span><b>→</b><span><strong>Components</strong><small>Прямые bindings</small></span></div>
    </section>

    <section class="color-card css-card">
      <header><div><h2>CSS variables</h2><p>Полный источник: color primitives, spacing, radius, semantic aliases, brand и theme modes.</p></div><button type="button" @click="copyValue(fullCssVariables)"><Copy :size="14" /> {{ copied === fullCssVariables ? 'Скопировано' : 'Копировать' }}</button></header>
      <pre><code>{{ fullCssVariables }}</code></pre>
    </section>
  </div>
</template>

<style scoped>
.colors-docs { display: grid; gap: 24px; }
.color-hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; padding: 32px; color: var(--text-inverse); border-radius: 16px; background: var(--brand-primary); }
.color-hero p { margin: 0 0 8px; color: color-mix(in srgb, var(--text-inverse) 64%, transparent); font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.color-hero h1 { margin: 0 0 8px; color: var(--text-inverse); font: 700 32px/40px var(--tz-font-family); }
.color-hero span { display: block; max-width: 760px; color: color-mix(in srgb, var(--text-inverse) 82%, transparent); font: 400 14px/20px var(--tz-font-family); }
.color-hero small { display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 8px; background: color-mix(in srgb, var(--text-inverse) 12%, transparent); font: 500 11px/16px var(--tz-font-family); white-space: nowrap; }
.color-card { min-width: 0; padding: 24px; border: 1px solid var(--border-default); border-radius: 12px; background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.color-card > header { margin-bottom: 20px; }
.color-card h2, .color-card h3, .color-card p { margin-top: 0; }
.color-card h2 { margin-bottom: 4px; color: var(--text-default); font: 600 18px/24px var(--tz-font-family); }
.color-card h3 { margin-bottom: 10px; color: var(--text-default); font: 600 14px/20px var(--tz-font-family); text-transform: capitalize; }
.color-card header p { margin-bottom: 0; color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.primitive-groups { display: grid; gap: 28px; }
.swatch-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.swatch { position: relative; display: flex; width: 76px; padding: 0; flex-direction: column; align-items: flex-start; color: var(--text-default); border: 0; background: transparent; text-align: left; cursor: pointer; }
.swatch i { box-sizing: border-box; width: 64px; height: 64px; margin-bottom: 6px; border: 1px solid var(--border-default); border-radius: 6px; }
.swatch strong { overflow: hidden; max-width: 76px; font: 500 10px/14px var(--tz-font-family); text-overflow: ellipsis; white-space: nowrap; }
.swatch code { color: var(--text-muted); font: 400 9px/13px ui-monospace, SFMono-Regular, Consolas, monospace; }
.swatch > span { position: absolute; top: 42px; left: 4px; padding: 2px 4px; color: var(--text-inverse); border-radius: 3px; background: var(--bg-overlay); font: 500 8px/10px var(--tz-font-family); }
.section-header, .css-card > header { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.mode-switch { display: flex; padding: 2px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--bg-page); }
.mode-switch button { padding: 6px 10px; color: var(--text-muted); border: 0; border-radius: 6px; background: transparent; font: 500 11px/16px var(--tz-font-family); cursor: pointer; }
.mode-switch button.active { color: var(--brand-primary); background: var(--bg-surface); box-shadow: 0 1px 3px var(--bg-shadow); }
.semantic-grid { display: grid; overflow: hidden; grid-template-columns: repeat(2, minmax(0, 1fr)); border: 1px solid var(--border-default); border-radius: 8px; }
.semantic-grid article { display: grid; grid-template-columns: 40px minmax(0, 1fr) auto; min-height: 56px; align-items: center; gap: 12px; padding: 8px 12px; border-right: 1px solid var(--border-default); border-bottom: 1px solid var(--border-default); }
.semantic-grid article:nth-child(2n) { border-right: 0; }
.semantic-grid article:nth-last-child(-n + 2) { border-bottom: 0; }
.semantic-grid i { width: 40px; height: 40px; border: 1px solid var(--border-default); border-radius: 6px; }
.semantic-grid article > div { display: flex; min-width: 0; flex-direction: column; }
.semantic-grid code { overflow: hidden; color: var(--text-default); font: 500 11px/16px ui-monospace, SFMono-Regular, Consolas, monospace; text-overflow: ellipsis; }
.semantic-grid span { color: var(--text-muted); font: 400 10px/14px var(--tz-font-family); }
.semantic-grid strong { color: var(--text-muted); font: 500 10px/14px ui-monospace, SFMono-Regular, Consolas, monospace; }
.semantic-grid.dark { padding: 8px; border-color: var(--gray-700); background: var(--gray-900); }
.semantic-grid.dark article { border-color: var(--gray-700); }
.semantic-grid.dark code { color: var(--gray-50); }
.semantic-grid.dark span, .semantic-grid.dark strong { color: var(--gray-400); }
.architecture > div { display: flex; align-items: stretch; gap: 12px; }
.architecture span { display: flex; flex: 1; padding: 14px; flex-direction: column; border: 1px solid var(--border-default); border-radius: 8px; }
.architecture strong { color: var(--text-default); font: 500 12px/16px var(--tz-font-family); }
.architecture small { color: var(--text-muted); font: 400 10px/14px var(--tz-font-family); }
.architecture b { align-self: center; color: var(--brand-primary); }
.css-card > header button { display: flex; align-items: center; gap: 6px; padding: 7px 10px; color: var(--brand-primary); border: 1px solid var(--border-default); border-radius: 7px; background: var(--brand-bg-accent); font: 500 11px/16px var(--tz-font-family); cursor: pointer; }
.css-card pre { max-height: 620px; margin: 0; padding: 20px; overflow: auto; color: var(--green-100); border-radius: 8px; background: var(--gray-900); font: 400 11px/18px ui-monospace, SFMono-Regular, Consolas, monospace; }
@media (max-width: 900px) { .semantic-grid { grid-template-columns: 1fr; } .semantic-grid article { border-right: 0; } .semantic-grid article:nth-last-child(2) { border-bottom: 1px solid var(--border-default); } .architecture > div { flex-direction: column; } .architecture b { transform: rotate(90deg); } }
@media (max-width: 620px) { .color-hero, .section-header, .css-card > header { align-items: flex-start; flex-direction: column; } .color-card { padding: 16px; } .color-hero { padding: 24px; } .semantic-grid article { grid-template-columns: 36px minmax(0, 1fr); } .semantic-grid article > strong { grid-column: 2; } }
</style>
