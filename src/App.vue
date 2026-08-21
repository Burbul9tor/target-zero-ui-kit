<script setup lang="ts">
import { Check, ChevronRight, Component, Layers3 } from '@lucide/vue'
import { ref } from 'vue'
import BreadcrumbDocumentation from './components/documentation/BreadcrumbDocumentation.vue'
import ButtonDocumentation from './components/documentation/ButtonDocumentation.vue'
import ColorsDocumentation from './components/documentation/ColorsDocumentation.vue'
import IconsDocumentation from './components/documentation/IconsDocumentation.vue'
import PreloaderDocumentation from './components/documentation/PreloaderDocumentation.vue'
import SearchDocumentation from './components/documentation/SearchDocumentation.vue'
import SelectDocumentation from './components/documentation/SelectDocumentation.vue'
import TableDocumentation from './components/documentation/TableDocumentationTechnical.vue'
import ToggleDocumentation from './components/documentation/ToggleDocumentation.vue'
import ToastDocumentation from './components/documentation/ToastDocumentation.vue'
import VariablesDocumentation from './components/documentation/VariablesDocumentation.vue'
import TzBreadcrumbs from './components/navigation/TzBreadcrumbs.vue'
import TzFooter from './components/navigation/TzFooter.vue'
import TzHeader from './components/navigation/TzHeader.vue'
import TzSidebar from './components/navigation/TzSidebar.vue'

const activeSection = ref('Navigation')
const catalogCollapsed = ref(false)
const sidebarCollapsed = ref(false)
const readyItems = ['Colors', 'Variables', 'Navigation', 'Breadcrumbs', 'Button', 'Toast', 'Select', 'Preloader', 'Toggle', 'Icon', 'Search', 'Table']

const catalog = [
  { group: 'Основы', items: ['Colors', 'Typography', 'Variables'] },
  {
    group: 'Компоненты',
    items: [
      'Navigation',
      'Breadcrumbs',
      'Input',
      'Select',
      'Icon',
      'Button',
      'Toast',
      'Preloader',
      'Toggle',
      'Search',
      'Chip',
      'Status',
      'Radio Button',
      'Checkbox',
      'Uploader',
      'Avatar',
      'Table',
    ],
  },
]

const breadcrumbItems = [
  { label: 'Главная', href: '#home' },
  { label: 'Экология', href: '#ecology' },
  { label: 'Отходы', href: '#waste' },
  { label: 'Информационное табло' },
]
</script>

<template>
  <div class="showcase" :class="{ 'showcase--catalog-collapsed': catalogCollapsed }">
    <TzHeader class="showcase__header" @toggle-sidebar="catalogCollapsed = !catalogCollapsed" />
    <aside class="catalog">
      <div class="catalog__brand">
        <span><Layers3 :size="20" /></span>
        <div><strong>Target Zero</strong><small>UI Kit · Vue 3</small></div>
      </div>

      <nav aria-label="Каталог компонентов">
        <section v-for="section in catalog" :key="section.group">
          <p>{{ section.group }}</p>
          <button
            v-for="item in section.items"
            :key="item"
            type="button"
            :class="{ 'is-active': item === activeSection }"
            :disabled="!readyItems.includes(item)"
            :aria-label="catalogCollapsed ? item : undefined"
            :title="catalogCollapsed ? item : undefined"
            @click="activeSection = item"
          >
            <Component :size="16" :stroke-width="1.5" />
            <span>{{ item }}</span>
            <Check v-if="readyItems.includes(item)" :size="14" />
            <ChevronRight v-else :size="14" />
          </button>
        </section>
      </nav>
    </aside>

    <main class="showcase__main">
      <ColorsDocumentation v-if="activeSection === 'Colors'" />
      <VariablesDocumentation v-else-if="activeSection === 'Variables'" />
      <IconsDocumentation v-else-if="activeSection === 'Icon'" />
      <BreadcrumbDocumentation v-else-if="activeSection === 'Breadcrumbs'" />
      <ButtonDocumentation v-else-if="activeSection === 'Button'" />
      <ToastDocumentation v-else-if="activeSection === 'Toast'" />
      <PreloaderDocumentation v-else-if="activeSection === 'Preloader'" />
      <SelectDocumentation v-else-if="activeSection === 'Select'" />
      <SearchDocumentation v-else-if="activeSection === 'Search'" />
      <TableDocumentation v-else-if="activeSection === 'Table'" />
      <ToggleDocumentation v-else-if="activeSection === 'Toggle'" />

      <template v-else>
        <header class="page-header">
          <div>
            <p class="eyebrow">COMPONENT LIBRARY</p>
            <h1>Navigation</h1>
            <p>Локальный стенд для проверки Header, Sidebar, Footer и Breadcrumbs из Target Zero Design System.</p>
          </div>
          <span class="ready-badge"><Check :size="14" /> Готово к проверке</span>
        </header>

        <section class="review-card">
          <div class="review-card__header">
            <div>
              <h2>App Shell</h2>
              <p>Header переключает Sidebar между состояниями Open и Compact.</p>
            </div>
            <div class="segmented">
              <button type="button" :class="{ 'is-active': !sidebarCollapsed }" @click="sidebarCollapsed = false">Open</button>
              <button type="button" :class="{ 'is-active': sidebarCollapsed }" @click="sidebarCollapsed = true">Compact</button>
            </div>
          </div>

          <div class="app-preview">
            <TzHeader @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
            <div class="app-preview__body">
              <TzSidebar :collapsed="sidebarCollapsed" />
              <div class="app-preview__content">
                <TzBreadcrumbs :items="breadcrumbItems" variant="secondary" />
                <div class="placeholder">
                  <span>Content area</span>
                  <small>Остальные компоненты будут добавлены на следующих этапах.</small>
                </div>
              </div>
            </div>
            <TzFooter />
          </div>
        </section>

        <section class="review-card">
          <div class="review-card__header">
            <div>
              <h2>Breadcrumbs</h2>
              <p>Краткий preview. Полная спецификация вынесена в отдельный пункт слева.</p>
            </div>
            <button class="open-docs" type="button" @click="activeSection = 'Breadcrumbs'">Открыть документацию</button>
          </div>
          <div class="breadcrumb-examples">
            <article><span>PRIMARY</span><TzBreadcrumbs :items="breadcrumbItems" variant="primary" /></article>
            <article><span>SECONDARY</span><TzBreadcrumbs :items="breadcrumbItems" variant="secondary" /></article>
          </div>
        </section>

        <section class="review-card strips">
          <div class="review-card__header">
            <div><h2>Header & Footer</h2><p>Отдельная проверка элементов на полной ширине.</p></div>
          </div>
          <div class="strip"><TzHeader @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" /></div>
          <div class="strip"><TzFooter /></div>
        </section>
      </template>
    </main>

    <TzFooter class="showcase__footer" />
  </div>
</template>

<style src="./styles/navigation.css"></style>

<style scoped>
.showcase {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  grid-template-rows: 54px minmax(0, 1fr) auto;
  grid-template-areas:
    'header header'
    'catalog main'
    'footer footer';
  min-height: 100dvh;
  padding-bottom: 30px;
  background: var(--showcase-canvas);
  transition: grid-template-columns 240ms cubic-bezier(.2, 0, 0, 1);
}

.showcase--catalog-collapsed {
  grid-template-columns: 56px minmax(0, 1fr);
}

.showcase__header {
  position: sticky;
  z-index: 40;
  top: 0;
  grid-area: header;
}

.catalog {
  position: sticky;
  top: 54px;
  grid-area: catalog;
  height: calc(100dvh - 84px);
  padding: var(--padding-spacing-20) var(--padding-spacing-12);
  min-width: 0;
  overflow: auto;
  background: var(--bg-surface);
  border-right: 1px solid var(--showcase-border);
  transition: padding 240ms cubic-bezier(.2, 0, 0, 1);
}

.showcase--catalog-collapsed .catalog {
  padding-inline: 10px;
}

.catalog__brand {
  display: flex;
  align-items: center;
  gap: var(--padding-spacing-12);
  padding: 0 var(--padding-spacing-8) var(--padding-spacing-20);
  border-bottom: 1px solid var(--showcase-border);
}

.catalog__brand > span {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  color: var(--text-inverse);
  border-radius: var(--radius-md);
  background: var(--brand-primary);
  flex: 0 0 36px;
}


.catalog__brand div {
  display: flex;
  max-width: 150px;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  opacity: 1;
  transition: max-width 200ms ease, opacity 140ms ease;
}

.catalog__brand strong {
  font: 600 14px/20px var(--tz-font-family);
}

.catalog__brand small {
  color: var(--text-muted);
  font: 400 11px/16px var(--tz-font-family);
}

.catalog nav section {
  margin-top: var(--padding-spacing-20);
}

.catalog nav section > p,
.eyebrow {
  margin: 0 var(--padding-spacing-8) var(--padding-spacing-8);
  color: var(--text-muted);
  font: 500 10px/14px var(--tz-font-family);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.catalog nav button {
  display: flex;
  align-items: center;
  gap: var(--padding-spacing-8);
  width: 100%;
  min-height: 36px;
  padding: var(--padding-spacing-8);
  color: var(--text-muted);
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  font: 400 12px/16px var(--tz-font-family);
  text-align: left;
}

.catalog nav button span {
  max-width: 150px;
  flex: 1;
  overflow: hidden;
  opacity: 1;
  transition: max-width 200ms ease, opacity 140ms ease;
}

.catalog nav button > svg:last-child {
  max-width: 14px;
  overflow: hidden;
  opacity: 1;
  transition: max-width 160ms ease, opacity 120ms ease;
}

.showcase--catalog-collapsed .catalog__brand {
  gap: 0;
  padding-inline: 0;
  justify-content: center;
}

.showcase--catalog-collapsed .catalog__brand div,
.showcase--catalog-collapsed .catalog nav button span,
.showcase--catalog-collapsed .catalog nav button > svg:last-child {
  max-width: 0;
  flex: 0 0 0;
  opacity: 0;
  pointer-events: none;
}

.showcase--catalog-collapsed .catalog nav section > p {
  max-height: 0;
  margin: 0;
  overflow: hidden;
  opacity: 0;
}

.showcase--catalog-collapsed .catalog nav button {
  gap: 0;
  justify-content: center;
}

.catalog nav button:not(:disabled) {
  color: var(--text-default);
  cursor: pointer;
}

.catalog nav button.is-active {
  color: var(--brand-primary);
  background: var(--brand-bg-active);
  font-weight: 500;
}

.catalog nav button:disabled {
  opacity: 0.42;
}

.showcase__main {
  grid-area: main;
  width: min(100%, 1440px);
  margin-inline: auto;
  padding: var(--padding-spacing-40);
}

.page-header,
.review-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.page-header {
  margin-bottom: 28px;
}

.eyebrow {
  margin-inline: 0;
  color: var(--brand-primary);
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 8px;
  color: var(--text-default);
  font: 700 32px/40px var(--tz-font-family);
  letter-spacing: -0.4px;
}

.page-header p,
.review-card__header p {
  margin-bottom: 0;
  color: var(--text-muted);
  font: 400 14px/20px var(--tz-font-family);
}

.ready-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  color: var(--status-success-fg);
  border-radius: 8px;
  background: var(--status-success-bg);
  font: 500 11px/16px var(--tz-font-family);
  white-space: nowrap;
}

.review-card {
  margin-bottom: 24px;
  padding: var(--padding-spacing-24);
  border: 1px solid var(--showcase-border);
  border-radius: 12px;
  background: var(--bg-surface);
  box-shadow: 0 10px 15px -3px var(--bg-shadow);
}

.review-card__header {
  align-items: center;
  padding-bottom: 20px;
}

.review-card__header h2 {
  margin-bottom: 4px;
  color: var(--text-default);
  font: 600 18px/24px var(--tz-font-family);
}

.segmented {
  display: flex;
  padding: 2px;
  border: 1px solid var(--border-default);
  border-radius: 7px;
  background: var(--showcase-canvas);
  transition: grid-template-columns 240ms cubic-bezier(.2, 0, 0, 1);
}

.segmented button,
.open-docs {
  padding: 6px 10px;
  color: var(--text-muted);
  border: 0;
  border-radius: 5px;
  background: transparent;
  font: 500 11px/16px var(--tz-font-family);
  cursor: pointer;
}

.segmented button.is-active {
  color: var(--brand-primary);
  background: var(--bg-surface);
  box-shadow: 0 1px 3px var(--bg-shadow);
}

.open-docs {
  color: var(--brand-primary);
  border: 1px solid var(--border-default);
  background: var(--brand-bg-accent);
}

.app-preview {
  overflow: hidden;
  border: 1px solid var(--border-default);
  border-radius: 8px;
  background: var(--showcase-canvas);
  transition: grid-template-columns 240ms cubic-bezier(.2, 0, 0, 1);
}

.app-preview__body {
  display: flex;
  min-height: 690px;
}

.app-preview__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  padding: var(--padding-spacing-24);
}

.placeholder {
  display: grid;
  flex: 1;
  place-content: center;
  color: var(--text-muted);
  border: 1px dashed var(--border-default);
  border-radius: 8px;
  text-align: center;
}

.placeholder span {
  font: 500 12px/18px var(--tz-font-family);
}

.placeholder small {
  font: 400 11px/16px var(--tz-font-family);
}

.breadcrumb-examples {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.breadcrumb-examples article {
  min-height: 94px;
  padding: 20px;
  border: 1px solid var(--showcase-border);
  border-radius: 8px;
  background: var(--showcase-canvas);
  transition: grid-template-columns 240ms cubic-bezier(.2, 0, 0, 1);
}

.breadcrumb-examples article > span {
  display: block;
  margin-bottom: 18px;
  color: var(--text-muted);
  font: 500 10px/14px var(--tz-font-family);
  letter-spacing: 0.08em;
}

.strips {
  display: grid;
  gap: 16px;
}

.strip {
  overflow: hidden;
  border: 1px solid var(--showcase-border);
  border-radius: var(--radius-sm);
}

.showcase__footer {
  position: fixed;
  z-index: 50;
  right: 0;
  bottom: 0;
  left: 0;
  grid-area: footer;
}

@media (max-width: 1000px) {
  .showcase {
    grid-template-columns: 1fr;
    grid-template-areas:
      'header'
      'main'
      'footer';
  }

  .catalog {
    position: static;
    display: none;
  }

  .showcase__main {
    padding: var(--padding-spacing-24);
  }
}

@media (max-width: 700px) {
  .showcase__main {
    padding: var(--padding-spacing-16);
  }

  .page-header,
  .review-card__header {
    flex-direction: column;
  }

  .breadcrumb-examples {
    grid-template-columns: 1fr;
  }

  .review-card {
    padding: var(--padding-spacing-16);
  }
}
</style>

