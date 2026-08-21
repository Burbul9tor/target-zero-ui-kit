<script setup lang="ts">
import { Check } from '@lucide/vue'

type TextStyle = {
  group: string
  name: string
  token: string
  weight: number
  size: number
  lineHeight: number | 'Auto'
}

const textStyles: TextStyle[] = [
  { group: 'Heading', name: 'Page', token: '--tz-text-heading-page', weight: 700, size: 28, lineHeight: 36 },
  { group: 'Heading', name: 'H1', token: '--tz-text-heading-h1', weight: 700, size: 24, lineHeight: 32 },
  { group: 'Heading', name: 'H2', token: '--tz-text-heading-h2', weight: 700, size: 20, lineHeight: 28 },
  { group: 'Heading', name: 'H3', token: '--tz-text-heading-h3', weight: 700, size: 16, lineHeight: 24 },
  { group: 'Body', name: 'Large', token: '--tz-text-body-large', weight: 400, size: 16, lineHeight: 24 },
  { group: 'Body', name: 'Medium', token: '--tz-text-body-medium', weight: 400, size: 14, lineHeight: 20 },
  { group: 'Body', name: 'Strong', token: '--tz-text-body-strong', weight: 600, size: 14, lineHeight: 20 },
  { group: 'Body', name: 'Small', token: '--tz-text-body-small', weight: 400, size: 12, lineHeight: 16 },
  { group: 'Body', name: 'Mini', token: '--tz-text-body-mini', weight: 400, size: 10, lineHeight: 'Auto' },
  { group: 'Label', name: 'Large', token: '--tz-text-label-large', weight: 500, size: 14, lineHeight: 20 },
  { group: 'Label', name: 'Medium', token: '--tz-text-label-medium', weight: 500, size: 12, lineHeight: 16 },
  { group: 'Label', name: 'Small', token: '--tz-text-label-small', weight: 500, size: 10, lineHeight: 14 },
  { group: 'Button', name: 'Large', token: '--tz-text-button-large', weight: 600, size: 14, lineHeight: 20 },
  { group: 'Button', name: 'Medium', token: '--tz-text-button-medium', weight: 600, size: 12, lineHeight: 16 },
  { group: 'Button', name: 'Small', token: '--tz-text-button-small', weight: 600, size: 10, lineHeight: 14 },
  { group: 'Caption', name: 'Regular', token: '--tz-text-caption-regular', weight: 400, size: 10, lineHeight: 14 },
  { group: 'Table', name: 'Header', token: '--tz-text-table-header', weight: 600, size: 10, lineHeight: 14 },
  { group: 'Table', name: 'Cell', token: '--tz-text-table-cell', weight: 400, size: 12, lineHeight: 16 },
  { group: 'Sidebar', name: 'Parent', token: '--tz-text-sidebar-parent', weight: 600, size: 12, lineHeight: 15 },
  { group: 'Sidebar', name: 'Subitem', token: '--tz-text-sidebar-subitem', weight: 500, size: 11, lineHeight: 15 },
  { group: 'Sidebar', name: 'Action', token: '--tz-text-sidebar-action', weight: 500, size: 10, lineHeight: 14 },
]

const groups = [...new Set(textStyles.map(style => style.group))].map(name => ({
  name,
  styles: textStyles.filter(style => style.group === name),
}))
</script>

<template>
  <div class="typography-docs">
    <header class="typography-hero">
      <div>
        <p>FOUNDATIONS · TYPOGRAPHY</p>
        <h1>Typography</h1>
        <span>Text Styles из Figma page 12:807. Единая шкала Roboto для интерфейса Target Zero.</span>
      </div>
      <strong><Check :size="14" /> {{ textStyles.length }} Text Styles</strong>
    </header>

    <section v-for="group in groups" :key="group.name" class="typography-card">
      <header>
        <div>
          <h2>{{ group.name }}</h2>
          <p>{{ group.styles.length }} стиля в группе</p>
        </div>
      </header>

      <div class="style-list">
        <article v-for="style in group.styles" :key="style.token" class="style-row">
          <div class="style-preview" :style="{ font: `var(${style.token})` }">
            {{ group.name }}/{{ style.name }} · Aa Бб 0123
          </div>
          <div class="style-name">
            <strong>{{ group.name }}/{{ style.name }}</strong>
            <code>{{ style.token }}</code>
          </div>
          <dl>
            <div><dt>Font</dt><dd>Roboto</dd></div>
            <div><dt>Weight</dt><dd>{{ style.weight }}</dd></div>
            <div><dt>Size</dt><dd>{{ style.size }}px</dd></div>
            <div><dt>Line height</dt><dd>{{ style.lineHeight === 'Auto' ? 'Auto' : `${style.lineHeight}px` }}</dd></div>
            <div><dt>Letter spacing</dt><dd>0%</dd></div>
          </dl>
        </article>
      </div>
    </section>

    <section class="typography-card usage-card">
      <header><div><h2>Использование</h2><p>Компоненты используют готовый Text Style через CSS token.</p></div></header>
      <pre><code>.page-title {
  font: var(--tz-text-heading-page);
}

.table-cell {
  font: var(--tz-text-table-cell);
}</code></pre>
    </section>
  </div>
</template>

<style scoped>
.typography-docs { display: grid; gap: var(--padding-spacing-24); }
.typography-hero { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--padding-spacing-32); }
.typography-hero p { margin: 0 0 var(--padding-spacing-8); color: var(--brand-primary); font: var(--tz-text-label-small); letter-spacing: .08em; }
.typography-hero h1 { margin: 0 0 var(--padding-spacing-8); color: var(--text-default); font: var(--tz-text-heading-page); }
.typography-hero span, .typography-card header p { color: var(--text-muted); font: var(--tz-text-body-medium); }
.typography-hero > strong { display: flex; align-items: center; gap: var(--padding-spacing-6); padding: 7px 10px; color: var(--status-success-fg); border-radius: var(--radius-md); background: var(--status-success-bg); font: var(--tz-text-label-small); white-space: nowrap; }
.typography-card { min-width: 0; padding: var(--padding-spacing-24); border: 1px solid var(--border-default); border-radius: var(--radius-lg); background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.typography-card > header { margin-bottom: var(--padding-spacing-20); }
.typography-card h2 { margin: 0 0 var(--padding-spacing-4); color: var(--text-default); font: var(--tz-text-heading-h2); }
.typography-card header p { margin: 0; }
.style-list { overflow: hidden; border: 1px solid var(--border-default); border-radius: var(--radius-md); }
.style-row { display: grid; grid-template-columns: minmax(260px, 1fr) 220px minmax(360px, 1fr); min-height: 88px; align-items: center; border-bottom: 1px solid var(--border-default); }
.style-row:last-child { border-bottom: 0; }
.style-row > * { min-width: 0; padding: var(--padding-spacing-16); }
.style-preview { overflow: hidden; color: var(--text-default); text-overflow: ellipsis; white-space: nowrap; }
.style-name { display: grid; gap: var(--padding-spacing-4); border-inline: 1px solid var(--border-default); }
.style-name strong { color: var(--text-default); font: var(--tz-text-label-medium); }
.style-name code { overflow: hidden; color: var(--brand-primary); font: var(--tz-text-caption-regular); text-overflow: ellipsis; }
dl { display: grid; grid-template-columns: repeat(5, minmax(54px, 1fr)); gap: var(--padding-spacing-12); margin: 0; }
dl div { display: grid; gap: var(--padding-spacing-4); }
dt { color: var(--text-muted); font: var(--tz-text-caption-regular); }
dd { margin: 0; color: var(--text-default); font: var(--tz-text-table-cell); }
.usage-card pre { margin: 0; padding: var(--padding-spacing-16); overflow: auto; color: var(--text-default); border-radius: var(--radius-md); background: var(--bg-page); }
.usage-card code { font: var(--tz-text-table-cell); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
@media (max-width: 1100px) { .style-row { grid-template-columns: 1fr; } .style-name { border: 0; border-block: 1px solid var(--border-default); } }
@media (max-width: 620px) { .typography-hero { flex-direction: column; } .typography-card { padding: var(--padding-spacing-16); } dl { grid-template-columns: repeat(2, 1fr); } }
</style>