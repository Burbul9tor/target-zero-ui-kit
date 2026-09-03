<script setup lang="ts">
import { Check, Info } from '@lucide/vue'
import { ref } from 'vue'
import TzButton from '../actions/TzButton.vue'
import TzModal, { type ModalPlacement, type ModalSize } from '../feedback/TzModal.vue'
import DashboardSettingsModalExample from './examples/DashboardSettingsModalExample.vue'
import ObjectPickerModalExample from './examples/ObjectPickerModalExample.vue'
import WideSideModalExample from './examples/WideSideModalExample.vue'

const open = ref(false)
const pickerOpen = ref(false)
const sideOpen = ref(false)
const wideSideOpen = ref(false)
const sidePlacement = ref<ModalPlacement>('right')
const activeSize = ref<ModalSize>('medium')
const ikodProps = [
  ['show', 'Boolean', 'false', 'Видимость; поддерживается v-model:show.'],
  ['teleportTo', 'String', "'body'", 'CSS-селектор контейнера Teleport.'],
  ['disabledScroll', 'Boolean', 'true', 'Блокирует прокрутку страницы; Target Zero включает это по умолчанию.'],
  ['isExpand / expandable', 'Boolean', 'false', 'Состояние и возможность разворачивания.'],
  ['withHeader / withFooter', 'Boolean', 'true', 'Показывает системные области окна.'],
  ['classNames', 'String[]', '[]', 'Дополнительные классы диалога.'],
  ['closeIcon / expandIcon', 'Object', 'undefined', 'Компоненты и размеры служебных иконок.'],
]

function showSide(placement: ModalPlacement) {
  sidePlacement.value = placement
  sideOpen.value = true
}

function show(size: ModalSize) {
  activeSize.value = size
  open.value = true
}
</script>

<template>
  <div class="modal-docs">
    <header class="page-header">
      <div>
        <p class="eyebrow">OVERLAY · DIALOG</p>
        <h1>Modal</h1>
        <p>Фокусирует пользователя на коротком самостоятельном действии, не покидая текущую страницу.</p>
      </div>
      <span class="ready"><Check :size="14" /> Figma 2318:71244</span>
    </header>

    <section class="state-card">
      <header>
        <div>
          <span>Preview</span>
          <h2>Размеры модального окна</h2>
          <p>Medium соответствует исходному макету шириной 600 px.</p>
        </div>
      </header>
      <div class="state-stage">
        <TzButton size="medium" @click="show('small')">Small · 400 px</TzButton>
        <TzButton size="medium" @click="show('medium')">Medium · 600 px</TzButton>
        <TzButton size="medium" @click="show('large')">Large · 880 px</TzButton>
      </div>
    </section>

    <section class="state-card">
      <header>
        <div>
          <span>Data list</span>
          <h2>Выбор объекта</h2>
          <p>Пример с поиском, множественным выбором и длинным прокручиваемым списком.</p>
        </div>
      </header>
      <div class="state-stage"><TzButton size="medium" @click="pickerOpen = true">Открыть список объектов</TzButton></div>
    </section>

    <section class="state-card">
      <header>
        <div>
          <span>Side modal</span>
          <h2>Настройка дашборда</h2>
          <p>Плавающее окно почти на всю высоту с отступом 16 px от краёв экрана.</p>
        </div>
      </header>
      <div class="state-stage">
        <TzButton size="medium" @click="showSide('left')">Открыть слева</TzButton>
        <TzButton size="medium" @click="showSide('right')">Открыть справа</TzButton>
      </div>
    </section>

    <section class="state-card">
      <header>
        <div>
          <span>Wide side modal</span>
          <h2>Карточка с табами и таблицей</h2>
          <p>Ширина clamp(720px, 58vw, 1120px): окно занимает чуть больше половины экрана, а таблица прокручивается внутри.</p>
        </div>
      </header>
      <div class="state-stage"><TzButton size="medium" @click="wideSideOpen = true">Открыть широкий вариант</TzButton></div>
      <div class="wide-specs">
        <article><strong>Ширина</strong><p><code>clamp(720px, 58vw, 1120px)</code>: адаптивные 58% viewport с безопасными границами.</p></article>
        <article><strong>Высота</strong><p><code>calc(100dvh − 32px)</code>: фиксированные отступы по 16 px сверху и снизу.</p></article>
        <article><strong>Структура</strong><p>Шапка остаётся сверху, под ней два таба. Контент активного таба занимает рабочую область.</p></article>
        <article><strong>Таблица</strong><p>Колонки: №, дата, отход, объём, источник и опасность. «Чек места» намеренно исключён.</p></article>
        <article><strong>Прокрутка</strong><p>Вертикальная прокрутка находится внутри body модалки, горизонтальная — внутри таблицы.</p></article>
        <article><strong>Адаптивность</strong><p>При ширине до 620 px окно становится полноэкранным, а таблица сохраняет горизонтальный скролл.</p></article>
      </div>
    </section>

    <section class="state-card anatomy">
      <header><div><span>Анатомия</span><h2>Структура</h2></div></header>
      <div class="anatomy-preview">
        <div class="anatomy-preview__header"><strong>Заголовок</strong><i>Закрыть</i></div>
        <div class="anatomy-preview__body">Контент прокручивается независимо</div>
        <div class="anatomy-preview__footer"><i>Отмена</i><strong>Основное действие</strong></div>
      </div>
    </section>

    <section class="state-card api-card">
      <header>
        <div>
          <span>IKOD UI KIT · v0.3.0</span>
          <h2>Совместимый технический контракт</h2>
          <p>Компонент поддерживает API UiModal, а размеры, placement, accessibility и визуальные токены расширены в Target Zero.</p>
        </div>
      </header>
      <div class="api-table">
        <div class="api-row api-head"><strong>Prop</strong><strong>Type</strong><strong>Default</strong><strong>Назначение</strong></div>
        <div v-for="item in ikodProps" :key="item[0]" class="api-row">
          <code>{{ item[0] }}</code><code>{{ item[1] }}</code><code>{{ item[2] }}</code><span>{{ item[3] }}</span>
        </div>
      </div>
      <p class="api-source">Emits: <code>update:show</code>, <code>update:isExpand</code>. Slots: <code>default</code>, <code>header</code>, <code>header-action</code>, <code>footer</code>. Источник: <a href="https://ui-kit.ikod.kz/components/modal" target="_blank" rel="noreferrer">IKOD UiModal</a>.</p>
    </section>

    <section class="state-card guidance">
      <header><div><span>Поведение</span><h2>Правила использования</h2></div></header>
      <div class="guidance-grid">
        <article><strong>Фокус</strong><p>При открытии фокус перемещается внутрь окна и удерживается там.</p></article>
        <article><strong>Закрытие</strong><p>Поддерживаются Escape, кнопка-крестик и нажатие на фон.</p></article>
        <article><strong>Максимальная высота</strong><p>На desktop — min(760px, 100dvh − 32px). Прокручивается только список.</p></article>
        <article><strong>Адаптивность</strong><p>До 620 px модальное окно занимает весь экран.</p></article>
      </div>
    </section>

    <ObjectPickerModalExample v-model="pickerOpen" />
    <DashboardSettingsModalExample v-model="sideOpen" :placement="sidePlacement" />
    <WideSideModalExample v-model="wideSideOpen" />

    <TzModal
      v-model="open"
      :size="activeSize"
      title="Заголовок модального окна"
      description="Коротко объясните пользователю, что требуется сделать."
    >
      <div class="example-content">
        <div class="info-box"><Info :size="18" /><p>Размещайте здесь форму, подтверждение или другой короткий сценарий.</p></div>
        <label>
          <span>Название объекта</span>
          <input type="text" placeholder="Введите название" />
        </label>
      </div>
      <template #footer>
        <TzButton size="medium" color="text" @click="open = false">Отмена</TzButton>
        <TzButton size="medium" @click="open = false">Применить</TzButton>
      </template>
    </TzModal>
  </div>
</template>

<style scoped>
.modal-docs{display:grid;gap:var(--padding-spacing-24)}
.page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--padding-spacing-32)}
.eyebrow{margin:0 0 var(--padding-spacing-8);color:var(--brand-primary);font:500 10px/14px var(--tz-font-family);letter-spacing:.08em}
.page-header h1{margin:0 0 var(--padding-spacing-8);color:var(--text-default);font:700 32px/40px var(--tz-font-family)}
.page-header p,.state-card header p{margin:0;color:var(--text-muted);font:var(--tz-text-body-medium)}
.ready{display:flex;align-items:center;gap:var(--padding-spacing-6);padding:7px 10px;color:var(--status-success-fg);border-radius:var(--radius-md);background:var(--status-success-bg);font:500 11px/16px var(--tz-font-family);white-space:nowrap}
.state-card{min-width:0;padding:var(--padding-spacing-24);border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-surface);box-shadow:0 10px 15px -3px var(--bg-shadow)}
.state-card>header{margin-bottom:var(--padding-spacing-20)}.state-card>header span{display:inline-block;margin-bottom:var(--padding-spacing-4);color:var(--brand-primary);font:500 10px/14px var(--tz-font-family);letter-spacing:.05em;text-transform:uppercase}
.state-card h2{margin:0 0 var(--padding-spacing-4);color:var(--text-default);font:600 18px/24px var(--tz-font-family)}
.state-stage{display:flex;min-height:120px;align-items:center;justify-content:center;flex-wrap:wrap;gap:var(--padding-spacing-12);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}
.anatomy-preview{display:grid;max-width:600px;min-height:280px;margin:auto;grid-template-rows:auto 1fr auto;overflow:hidden;border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-surface);box-shadow:0 20px 48px var(--bg-shadow)}
.anatomy-preview>div{display:flex;padding:var(--padding-spacing-12) var(--padding-spacing-16);align-items:center;gap:var(--padding-spacing-8);font:var(--tz-text-body-small)}.anatomy-preview__header{justify-content:space-between;border-bottom:1px solid var(--border-default)}.anatomy-preview__body{color:var(--text-muted)}.anatomy-preview__footer{justify-content:flex-end;border-top:1px solid var(--border-default)}.anatomy-preview i{padding:var(--padding-spacing-8) var(--padding-spacing-12);color:var(--text-muted);border-radius:var(--radius-sm);font-style:normal}.anatomy-preview__footer strong{padding:var(--padding-spacing-8) var(--padding-spacing-12);color:var(--text-button-fill);border-radius:var(--radius-sm);background:var(--brand-primary)}
.guidance-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--padding-spacing-12)}.guidance-grid article{padding:var(--padding-spacing-16);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.guidance-grid strong{color:var(--text-default);font:var(--tz-text-body-strong)}.guidance-grid p{margin:var(--padding-spacing-6) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}
 .wide-specs{display:grid;margin-top:var(--padding-spacing-16);grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--padding-spacing-8)}.wide-specs article{padding:var(--padding-spacing-12);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.wide-specs strong{color:var(--text-default);font:var(--tz-text-body-strong)}.wide-specs p{margin:var(--padding-spacing-4) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}.wide-specs code{color:var(--brand-primary)}
.api-table{overflow:hidden;border:1px solid var(--border-default);border-radius:var(--radius-md)}.api-row{display:grid;grid-template-columns:1.2fr .8fr .8fr 2fr;gap:var(--padding-spacing-12);padding:var(--padding-spacing-10) var(--padding-spacing-12);align-items:center;border-top:1px solid var(--border-default);font:var(--tz-text-body-small)}.api-row:first-child{border-top:0}.api-head{background:var(--bg-row-hover)}.api-row code{color:var(--brand-primary)}.api-source{margin:var(--padding-spacing-12) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}.api-source code,.api-source a{color:var(--brand-primary)}
.example-content{display:grid;gap:var(--padding-spacing-20);min-height:220px;padding:var(--padding-spacing-16)}.info-box{display:flex;padding:var(--padding-spacing-12);align-items:flex-start;gap:var(--padding-spacing-8);color:var(--status-info-fg);border-radius:var(--radius-md);background:var(--status-info-bg)}.info-box p{margin:0;font:var(--tz-text-body-small)}.example-content label{display:grid;align-content:start;gap:var(--padding-spacing-6);color:var(--text-default);font:var(--tz-text-label-medium)}.example-content input{height:36px;padding:0 var(--padding-spacing-12);color:var(--text-default);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface);font:var(--tz-text-body-medium);outline:0}.example-content input:focus{border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--effect-shadow)}
@media(max-width:900px){.wide-specs{grid-template-columns:1fr 1fr}}@media(max-width:760px){.page-header{flex-direction:column}.state-card{padding:var(--padding-spacing-16)}.guidance-grid,.wide-specs{grid-template-columns:1fr}.api-table{overflow-x:auto}.api-row{min-width:680px}}
</style>
