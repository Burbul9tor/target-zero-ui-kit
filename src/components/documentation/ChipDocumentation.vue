<script setup lang="ts">
import { Check, Factory, User } from '@lucide/vue'
import { ref } from 'vue'
import TzChip from '../data/TzChip.vue'

const filters = ref(['Экология', 'Активные', 'Павлодар'])
const api = [
  ['label', 'string', 'Текст чипа'],
  ['variant', "'default' | 'icon'", 'Текстовый вариант или вариант с иконками'],
  ['showLeftIcon', 'boolean', 'Показывает левую иконку в icon-варианте'],
  ['showRightIcon', 'boolean', 'Показывает правую иконку в icon-варианте'],
  ['removable', 'boolean', 'Делает правую Close-кнопку действием удаления'],
  ['disabled', 'boolean', 'Отключает удаление и приглушает компонент'],
]
</script>

<template>
  <div class="chip-docs">
    <header class="page-header">
      <div><p class="eyebrow">COMPONENT · DATA DISPLAY</p><h1>Chip</h1><p>Компактная метка для выбранного значения, фильтра или короткой категории. Может содержать иконку и действие удаления.</p></div>
      <span class="ready"><Check :size="14" /> Готово</span>
    </header>

    <section class="card">
      <header><h2>Варианты из макета</h2><p>Фон, рамка, радиус и размеры привязаны к brand-токенам Target Zero.</p></header>
      <div class="examples">
        <article><span>Default</span><TzChip /></article>
        <article><span>Icon · обе иконки</span><TzChip variant="icon" /></article>
        <article><span>Только слева</span><TzChip variant="icon" :show-right-icon="false" /></article>
        <article><span>Только удаление</span><TzChip variant="icon" :show-left-icon="false" /></article>
        <article><span>Disabled</span><TzChip variant="icon" disabled /></article>
      </div>
    </section>

    <section class="card">
      <header><h2>Пользовательские иконки</h2><p>Слоты позволяют использовать предметные иконки, сохраняя размеры и отступы компонента.</p></header>
      <div class="chip-row">
        <TzChip variant="icon" label="Карьер Костанай"><template #icon-left><Factory :size="16" /></template></TzChip>
        <TzChip variant="icon" label="Ответственный"><template #icon-left><User :size="16" /></template></TzChip>
        <TzChip variant="icon" label="Без удаления" :removable="false" />
      </div>
    </section>

    <section class="card">
      <header><h2>Применённые фильтры</h2><p>При удалении компонент отправляет событие <code>remove</code>; список и бизнес-состояние изменяет родитель.</p></header>
      <div class="filter-example">
        <div v-if="filters.length" class="chip-row"><TzChip v-for="filter in filters" :key="filter" variant="icon" :label="filter" :show-left-icon="false" @remove="filters = filters.filter(item => item !== filter)" /></div>
        <span v-else>Фильтры не выбраны</span>
        <button v-if="filters.length < 3" type="button" @click="filters = ['Экология', 'Активные', 'Павлодар']">Восстановить пример</button>
      </div>
    </section>

    <section class="card usage-card">
      <header><h2>Когда использовать</h2></header>
      <div class="usage-grid">
        <article><strong>Выбранные значения</strong><p>Показывайте элементы множественного Select или активные параметры фильтра.</p></article>
        <article><strong>Короткий текст</strong><p>Подпись должна помещаться в одну строку. Для статуса используйте Status, для действия — Button.</p></article>
        <article><strong>Удаление</strong><p>Close удаляет значение из набора, но не закрывает экран и не отменяет другие изменения.</p></article>
        <article><strong>Доступность</strong><p>Кнопка удаления получает подпись с названием значения и доступна с клавиатуры.</p></article>
      </div>
    </section>

    <section class="card">
      <header><h2>API</h2><p>Иконки по умолчанию берутся из раздела Icon: ArrowUpRight и Close.</p></header>
      <div class="api"><div v-for="item in api" :key="item[0]"><code>{{ item[0] }}</code><code>{{ item[1] }}</code><span>{{ item[2] }}</span></div></div>
      <p class="api-note"><strong>Slots:</strong> <code>#default</code>, <code>#icon-left</code>, <code>#icon-right</code>. <strong>Emits:</strong> <code>remove</code>, <code>click</code>.</p>
    </section>
  </div>
</template>

<style scoped>
.chip-docs{display:grid;gap:var(--padding-spacing-24)}.page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--padding-spacing-24)}.eyebrow{margin:0 0 var(--padding-spacing-8);color:var(--brand-primary);font:var(--tz-text-label-small);letter-spacing:.08em}.page-header h1{margin:0 0 var(--padding-spacing-8);color:var(--text-default);font:var(--tz-text-heading-display)}.page-header p,.card header p{max-width:840px;margin:0;color:var(--text-muted);font:var(--tz-text-body-medium)}.ready{display:flex;padding:7px 10px;align-items:center;gap:var(--padding-spacing-6);color:var(--status-success-fg);border-radius:var(--radius-md);background:var(--status-success-bg);font:var(--tz-text-label-small);white-space:nowrap}.card{min-width:0;padding:var(--padding-spacing-24);border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-surface);box-shadow:0 10px 15px -3px var(--bg-shadow)}.card>header{margin-bottom:var(--padding-spacing-20)}.card h2{margin:0 0 var(--padding-spacing-4);color:var(--text-default);font:600 18px/24px var(--tz-font-family)}.examples{display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--padding-spacing-24)}.examples article{display:grid;gap:var(--padding-spacing-8)}.examples article>span{color:var(--text-muted);font:var(--tz-text-label-small)}.chip-row{display:flex;flex-wrap:wrap;align-items:center;gap:var(--padding-spacing-8)}.filter-example{display:flex;min-height:52px;padding:var(--padding-spacing-12);align-items:center;justify-content:space-between;gap:var(--padding-spacing-16);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.filter-example>span{color:var(--text-muted);font:var(--tz-text-body-small)}.filter-example>button{padding:var(--padding-spacing-6) var(--padding-spacing-12);color:var(--brand-primary);border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--bg-surface);font:var(--tz-text-label-small);cursor:pointer}.usage-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--padding-spacing-12)}.usage-grid article{padding:var(--padding-spacing-16);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.usage-grid strong{color:var(--text-default);font:var(--tz-text-body-strong)}.usage-grid p{margin:var(--padding-spacing-6) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}code{color:var(--brand-primary);font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.api{overflow:hidden;border:1px solid var(--border-default);border-radius:var(--radius-md)}.api>div{display:grid;grid-template-columns:1fr 1.4fr 2.2fr;gap:var(--padding-spacing-12);padding:var(--padding-spacing-12);border-top:1px solid var(--border-default);font:var(--tz-text-body-small)}.api>div:first-child{border-top:0}.api-note{margin:var(--padding-spacing-12) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}@media(max-width:700px){.page-header{flex-direction:column}.usage-grid{grid-template-columns:1fr}.card{padding:var(--padding-spacing-16)}.filter-example{align-items:flex-start;flex-direction:column}.api{overflow-x:auto}.api>div{min-width:600px}}
</style>
