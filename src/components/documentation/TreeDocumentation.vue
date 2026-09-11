<script setup lang="ts">
import { Building2, Check, HardHat, LayoutDashboard, Network, Recycle, Search, User, X } from '@lucide/vue'
import { computed, ref } from 'vue'
import TzButton from '../actions/TzButton.vue'
import TzTree from '../data/TzTree.vue'
import type { TreeDropPayload, TreeKey, TreeNodeBase, TreeNodeItem } from '../data/TzTree.vue'
import TzModal from '../feedback/TzModal.vue'
import TzInput from '../forms/TzInput.vue'

const treeItems: TreeNodeBase[] = [
  { id: 'besafe', title: 'BeSafe', icon: Building2, code: 'Головная организация' },
  {
    id: 'ikod-contractor', title: 'IKOD', icon: HardHat, code: 'Подрядная организация', children: [
      {
        id: 'tac', title: 'TAC', icon: Network, code: 'Подразделение', children: [
          { id: 'support', title: 'Support', icon: Network, code: 'Подразделение' },
          {
            id: 'ikod-department', title: 'IKOD', icon: Network, code: 'Подразделение', children: [
              { id: 'lead-ecologist', title: 'Ведущий эколог', icon: User, code: 'Должность' },
              { id: 'accountant', title: 'Бухгалтер', icon: User, code: 'Должность' },
            ],
          },
        ],
      },
    ],
  },
  { id: 'target-zero', title: 'ТОО Target Zero', icon: LayoutDashboard, code: 'Дочерняя зависимая организация' },
  { id: 'hse', title: 'HSE', icon: Recycle, code: 'Структурное подразделение' },
]
const checkedItems = ref<TreeKey[]>(['lead-ecologist'])
const expandedItems = ref<TreeKey[]>(['ikod-contractor', 'tac', 'ikod-department'])
const searchableExpanded = ref<TreeKey[]>(['ikod-contractor'])
const draggableItems = ref<TreeNodeItem[]>(JSON.parse(JSON.stringify(treeItems)) as TreeNodeItem[])
const draggableExpanded = ref<TreeKey[]>(['ikod-contractor', 'tac', 'ikod-department'])
const lastDrop = ref('Перетащите узел на новую родительскую ветку')
const lastAction = ref('Нажмите меню у любого узла')
const pageSearch = ref('')
const treeModalOpen = ref(false)
const modalCheckedItems = ref<TreeKey[]>(['lead-ecologist'])
const modalExpandedItems = ref<TreeKey[]>(['ikod-contractor', 'tac', 'ikod-department'])

function filterTree(nodes: TreeNodeBase[], query: string): TreeNodeBase[] {
  const normalized = query.trim().toLocaleLowerCase()
  if (!normalized) return nodes
  return nodes.flatMap(node => {
    const children = filterTree(node.children ?? [], normalized)
    const haystack = `${node.title ?? ''} ${node.code ?? ''}`.toLocaleLowerCase()
    return haystack.includes(normalized) || children.length
      ? [{ ...node, ...(children.length ? { children } : {}) }]
      : []
  })
}
function collectBranchKeys(nodes: TreeNodeBase[]): TreeKey[] {
  return nodes.flatMap(node => [
    ...(node.children?.length ? [node.id] : []),
    ...collectBranchKeys(node.children ?? []),
  ])
}
const pageItems = computed(() => filterTree(treeItems, pageSearch.value))
const pageExpandedItems = computed(() => pageSearch.value ? collectBranchKeys(pageItems.value) : expandedItems.value)

function describeDrop(payload: TreeDropPayload) {
  lastDrop.value = payload.parent
    ? `Новый родитель: ${String(payload.parent.title)} · элементов: ${payload.items.length}`
    : `Корневой уровень · элементов: ${payload.items.length}`
}

const propsApi = [
  ['items', 'T[]', 'Массив узлов дерева'],
  ['itemKey', 'keyof T', "Ключ идентификатора, по умолчанию 'id'"],
  ['displayKey', 'keyof T', "Ключ подписи, по умолчанию 'title'"],
  ['childrenKey', 'keyof T', "Ключ дочерних узлов, по умолчанию 'children'"],
  ['descriptionKey', 'keyof T', 'Ключ вторичной подписи узла'],
  ['showLines', 'boolean', 'Показывает связи между уровнями'],
  ['showActions', 'boolean', 'Показывает меню действий справа'],
  ['selectable', 'boolean', 'Показывает checkbox и включает выбор ветки'],
  ['checkedItems', 'TreeKey[]', 'Управляемый список выбранных идентификаторов'],
  ['expandedItems', 'TreeKey[]', 'Управляемый список раскрытых веток'],
  ['searchable', 'boolean', 'Добавляет поиск по дереву'],
  ['multipleSearch', 'boolean', 'Разделяет запросы запятой, точкой с запятой или переносом'],
  ['onSearch', '(query) => Promise<T[]>', 'Асинхронный клиентский или серверный поиск'],
  ['getItems / isServer', 'function / boolean', 'Загрузка дерева с API'],
  ['draggable', 'boolean', 'Разрешает перемещение узлов'],
  ['dropScope', 'tree | siblings', 'Новое дерево либо только общий родитель'],
  ['refreshData', 'boolean', 'Повторно вызывает getItems при изменении'],
]

const implementationCode = `<script setup lang="ts">
const items = ref<TreeNodeBase[]>(organizationTree)
const expandedItems = ref<TreeKey[]>(['ikod', 'tac', 'ikod-department'])
<\/script>

<template>
  <TzTree
    v-model:expanded-items="expandedItems"
    :items="items"
    description-key="code"
    show-lines
    show-actions
    @action="openNodeMenu"
  />
</template>

/* Горизонтальная линия: от вертикальной оси к карточке узла */
.tz-tree-node__row.has-parent.has-lines::before {
  position: absolute;
  top: 50%;
  left: -17px;
  width: 17px;
  border-top: 1px solid var(--border-default);
  content: '';
}

/* Вертикаль рисует каждый прямой дочерний узел */
.tz-tree-node__children.has-lines > .tz-tree-node::before {
  position: absolute;
  top: -8px;
  bottom: 0;
  left: var(--tree-parent-indent);
  border-left: 1px solid var(--border-default);
  content: '';
}

/* У последнего узла линия заканчивается на середине строки */
.tz-tree-node__children.has-lines > .tz-tree-node:last-child::before {
  bottom: auto;
  height: 28px; /* gap 8px + половина строки 20px */
}`
</script>

<template>
  <div class="tree-docs">
    <header class="page-header">
      <div><p class="eyebrow">COMPONENT · DATA DISPLAY</p><h1>Tree</h1><p>Иерархическое отображение объектов с раскрытием, поиском, выбором и перемещением узлов.</p></div>
      <span class="ready"><Check :size="14" /> Готово</span>
    </header>

    <section class="card">
      <header><h2>Базовое дерево</h2><p>Нажмите на ветку или стрелку, чтобы раскрыть следующий уровень. Через default slot можно дополнить подпись узла.</p></header>
      <div class="example-grid">
        <div class="stage">
          <TzTree
            v-model:expanded-items="expandedItems"
            :items="treeItems"
            description-key="code"
            show-lines
            show-actions
            aria-label="Структура организации"
            @action="lastAction = `Действия: ${String($event.title)}`"
          />
          <p class="result">{{ lastAction }}</p>
        </div>
        <div class="notes"><strong>Когда использовать</strong><p>Для организационной структуры, вложенных объектов, категорий и других данных, где важно видеть отношение «родитель — потомок».</p><p>Для обычного короткого списка используйте Select или List.</p></div>
      </div>
    </section>

    <section class="card">
      <header><h2>Выбор элементов</h2><p>Выбор родителя применяется ко всей ветке. Частично выбранный родитель получает состояние indeterminate.</p></header>
      <div class="stage">
        <TzTree v-model:checked-items="checkedItems" v-model:expanded-items="expandedItems" :items="treeItems" description-key="code" show-lines selectable aria-label="Выбор объектов" />
        <p class="result">Выбрано: <code>{{ checkedItems.join(', ') || 'ничего' }}</code></p>
      </div>
    </section>

    <section class="card">
      <header><h2>Поиск</h2><p>Локальный поиск сохраняет подходящие ветки и автоматически раскрывает найденный путь. Для API передайте <code>onSearch</code>.</p></header>
      <div class="stage narrow">
        <TzTree v-model:expanded-items="searchableExpanded" :items="treeItems" description-key="code" show-lines searchable search-placeholder="Поиск объекта" />
      </div>
    </section>

    <section class="card">
      <header><h2>Дерево в модальном окне</h2><p>Поиск, выбор веток и соединительные линии работают внутри стандартного <code>TzModal</code>. Контент прокручивается внутри окна, страница под ним блокируется.</p></header>
      <div class="modal-demo">
        <TzButton @click="treeModalOpen = true">Открыть дерево</TzButton>
        <p>После применения выбрано: <strong>{{ modalCheckedItems.length }}</strong></p>
      </div>
    </section>

    <section class="card">
      <header><h2>Перетаскивание</h2><p><code>dropScope="tree"</code> переносит узел внутрь выбранной ветки. Режим <code>siblings</code> разрешает изменение порядка только внутри одного родителя.</p></header>
      <div class="stage narrow">
        <TzTree
          v-model:items="draggableItems"
          v-model:expanded-items="draggableExpanded"
          draggable
          :invalid-scope-icon="X"
          @handle:drop="describeDrop"
        />
        <p class="result">{{ lastDrop }}</p>
      </div>
    </section>

    <section class="card">
      <header><h2>API IKOD UI Kit</h2><p>Контракт совместим по ключевым props, событиям и слотам; визуальный слой построен на токенах Target Zero.</p></header>
      <div class="api">
        <div v-for="item in propsApi" :key="item[0]"><code>{{ item[0] }}</code><code>{{ item[1] }}</code><span>{{ item[2] }}</span></div>
      </div>
      <p class="api-note"><strong>Emits:</strong> <code>update:checkedItems</code>, <code>update:expandedItems</code>, <code>update:items</code>, <code>handle:drop</code>, <code>action</code>. <strong>Slots:</strong> <code>#default</code>, <code>#actions</code>, <code>#no-results</code>.</p>
    </section>

    <section class="card">
      <header><h2>Пример страницы</h2><p>Рабочий сценарий справочника: заголовок, поиск, основное действие и организационное дерево.</p></header>
      <div class="organization-page">
        <nav class="breadcrumbs" aria-label="Хлебные крошки"><span>Справочники</span><i>/</i><strong>Организационная структура</strong></nav>
        <h3>Организационная структура</h3>
        <div class="organization-toolbar">
          <TzInput v-model="pageSearch" :icon-left="Search" placeholder="Поиск" clearable size="large" :show-label="false" />
          <TzButton size="large">Создать организацию</TzButton>
        </div>
        <TzTree
          :expanded-items="pageExpandedItems"
          :items="pageItems"
          description-key="code"
          show-lines
          show-actions
          aria-label="Организационная структура"
          @update:expanded-items="expandedItems = $event"
          @action="lastAction = `Действия: ${String($event.title)}`"
        />
        <p v-if="!pageItems.length" class="page-empty">По запросу ничего не найдено</p>
      </div>
    </section>

    <section class="card">
      <header><h2>Как реализовано для фронтенда</h2><p>Страница хранит раскрытые узлы через <code>v-model:expanded-items</code>, а данные передаёт единым рекурсивным массивом. Внешний поиск возвращает найденные узлы вместе с их родительской цепочкой.</p></header>
      <div class="implementation-grid">
        <div class="implementation-notes">
          <article><span>1</span><div><h3>Рекурсивный узел</h3><p><code>TzTreeNode</code> отрисовывает себя и повторно вызывает компонент для каждого элемента в <code>children</code>. Уровень передаётся как <code>level + 1</code>.</p></div></article>
          <article><span>2</span><div><h3>Отступ уровня</h3><p>Для строки вычисляется <code>--tree-indent: (level − 1) × 16px</code>. Поэтому глубина дерева меняет только одну CSS-переменную.</p></div></article>
          <article class="lines-note"><span>3</span><div><h3>Как сделаны «палочки»</h3><p>Это не SVG и не отдельные DOM-элементы. Вертикаль рисует <code>::before</code> каждого прямого дочернего узла, горизонталь — <code>::before</code> строки. Обе линии имеют толщину 1 px и используют <code>--border-default</code>, поэтому автоматически поддерживают тему.</p><div class="line-diagram" aria-label="Схема соединительных линий"><i /><b /><span>дочерний узел</span></div></div></article>
          <article><span>4</span><div><h3>Где заканчивается вертикаль</h3><p>Для последнего прямого потомка задаётся <code>height: 28px</code>: 8 px межстрочного отступа плюс 20 px до центра строки. Поэтому ось закрывается горизонтальной линией и не продолжается вдоль вложенных потомков.</p></div></article>
          <article><span>5</span><div><h3>Доступность</h3><p>Контейнер использует <code>role="tree"</code>, узлы — <code>role="treeitem"</code> и <code>aria-level</code>. Ветки управляются Enter и стрелками влево/вправо.</p></div></article>
        </div>
        <pre class="code-block"><code>{{ implementationCode }}</code></pre>
      </div>
    </section>

    <TzModal v-model="treeModalOpen" title="Выберите элементы структуры" description="Используйте поиск или выберите всю ветку" size="large" height="min(760px, calc(100dvh - 32px))">
      <div class="tree-modal-body">
        <TzTree
          v-model:checked-items="modalCheckedItems"
          v-model:expanded-items="modalExpandedItems"
          :items="treeItems"
          description-key="code"
          show-lines
          searchable
          selectable
          search-placeholder="Поиск по структуре"
          aria-label="Выбор элементов организационной структуры"
        />
      </div>
      <template #footer>
        <span class="modal-selection-count">Выбрано: {{ modalCheckedItems.length }}</span>
        <TzButton color="text" size="medium" :disabled="!modalCheckedItems.length" @click="modalCheckedItems = []">Сбросить</TzButton>
        <TzButton color="secondary" size="medium" @click="treeModalOpen = false">Отмена</TzButton>
        <TzButton size="medium" @click="treeModalOpen = false">Применить</TzButton>
      </template>
    </TzModal>
  </div>
</template>

<style scoped>
.tree-docs{display:grid;gap:var(--padding-spacing-24)}.page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--padding-spacing-32)}.eyebrow{margin:0 0 var(--padding-spacing-8);color:var(--brand-primary);font:var(--tz-text-label-small);letter-spacing:.08em}.page-header h1{margin:0 0 var(--padding-spacing-8);color:var(--text-default);font:var(--tz-text-heading-display)}.page-header p,.card header p{margin:0;color:var(--text-muted);font:var(--tz-text-body-medium)}.ready{display:flex;align-items:center;gap:var(--padding-spacing-6);padding:7px 10px;color:var(--status-success-fg);border-radius:var(--radius-md);background:var(--status-success-bg);font:var(--tz-text-label-small);white-space:nowrap}
.card{min-width:0;padding:var(--padding-spacing-24);border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-surface);box-shadow:0 10px 15px -3px var(--bg-shadow)}.card>header{margin-bottom:var(--padding-spacing-20)}.card h2{margin:0 0 var(--padding-spacing-4);color:var(--text-default);font:600 18px/24px var(--tz-font-family)}.example-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(240px,1fr);gap:var(--padding-spacing-16)}.stage,.notes{min-width:0;padding:var(--padding-spacing-20);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.stage.narrow{max-width:680px}.notes strong{color:var(--text-default);font:var(--tz-text-body-strong)}.notes p{margin:var(--padding-spacing-8) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}.custom-node{display:flex;min-width:0;flex-direction:column}.custom-node strong{overflow:hidden;font:var(--tz-text-body-medium);text-overflow:ellipsis}.custom-node small{color:var(--text-muted);font:var(--tz-text-label-small)}.result{margin:var(--padding-spacing-12) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}code{color:var(--brand-primary);font-family:ui-monospace,SFMono-Regular,Consolas,monospace}
.api{overflow:hidden;border:1px solid var(--border-default);border-radius:var(--radius-md)}.api>div{display:grid;grid-template-columns:1fr 1.35fr 2.2fr;gap:var(--padding-spacing-12);padding:var(--padding-spacing-12);border-top:1px solid var(--border-default);font:var(--tz-text-body-small)}.api>div:first-child{border-top:0}.api-note{margin:var(--padding-spacing-12) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}.api-note code{margin-right:var(--padding-spacing-4)}
.modal-demo{display:flex;align-items:center;gap:var(--padding-spacing-16)}.modal-demo p{margin:0;color:var(--text-muted);font:var(--tz-text-body-small)}.modal-demo strong{color:var(--text-default)}.tree-modal-body{box-sizing:border-box;min-height:100%;padding:var(--padding-spacing-20)}.modal-selection-count{margin-right:auto;color:var(--text-muted);font:var(--tz-text-body-small)}
.organization-page{min-width:0;padding:var(--padding-spacing-24);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.breadcrumbs{display:flex;align-items:center;gap:var(--padding-spacing-8);color:var(--text-muted);font:var(--tz-text-body-small)}.breadcrumbs i{font-style:normal}.breadcrumbs strong{color:var(--text-default);font-weight:600}.organization-page>h3{margin:var(--padding-spacing-20) 0 var(--padding-spacing-32);color:var(--text-default);font:var(--tz-text-heading-display)}.organization-toolbar{display:flex;align-items:center;justify-content:space-between;gap:var(--padding-spacing-16);margin-bottom:var(--padding-spacing-24)}.organization-toolbar :deep(.tz-input){max-width:480px}.page-empty{margin:var(--padding-spacing-24) 0;text-align:center;color:var(--text-muted);font:var(--tz-text-body-medium)}
.implementation-grid{display:grid;grid-template-columns:minmax(300px,.85fr) minmax(0,1.15fr);gap:var(--padding-spacing-20);align-items:start}.implementation-notes{display:grid;gap:var(--padding-spacing-12)}.implementation-notes article{display:flex;gap:var(--padding-spacing-12);padding:var(--padding-spacing-12);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.implementation-notes article>span{display:grid;flex:0 0 24px;width:24px;height:24px;place-items:center;color:var(--brand-primary);border-radius:var(--radius-full);background:var(--brand-bg-active);font:var(--tz-text-label-small)}.implementation-notes h3{margin:0 0 var(--padding-spacing-4);color:var(--text-default);font:var(--tz-text-body-strong)}.implementation-notes p{margin:0;color:var(--text-muted);font:var(--tz-text-body-small)}.lines-note{border-color:color-mix(in srgb,var(--brand-primary) 28%,var(--border-default))!important}.line-diagram{position:relative;height:48px;margin-top:var(--padding-spacing-12);padding-left:32px;color:var(--text-muted);font:var(--tz-text-label-small)}.line-diagram i{position:absolute;top:0;bottom:8px;left:8px;border-left:1px solid var(--brand-primary)}.line-diagram b{position:absolute;top:22px;left:8px;width:16px;border-top:1px solid var(--brand-primary)}.line-diagram span{display:inline-flex;margin-top:11px;padding:6px 10px;border:1px solid var(--border-default);border-radius:var(--radius-xs);background:var(--bg-surface)}.code-block{box-sizing:border-box;max-height:680px;margin:0;padding:var(--padding-spacing-20);overflow:auto;color:var(--gray-100);border:1px solid var(--gray-800);border-radius:var(--radius-md);background:var(--gray-950);font:12px/1.65 ui-monospace,SFMono-Regular,Consolas,monospace;tab-size:2}.code-block code{color:inherit}
@media(max-width:1000px){.implementation-grid{grid-template-columns:1fr}.code-block{max-height:520px}}@media(max-width:800px){.example-grid{grid-template-columns:1fr}.api{overflow-x:auto}.api>div{min-width:660px}.organization-toolbar{align-items:stretch;flex-direction:column}.organization-toolbar :deep(.tz-input){max-width:none}.organization-toolbar :deep(.tz-button){align-self:flex-start}}@media(max-width:620px){.page-header{flex-direction:column}.card{padding:var(--padding-spacing-16)}.stage,.notes,.organization-page{padding:var(--padding-spacing-12)}.organization-page>h3{margin-bottom:var(--padding-spacing-20);font-size:24px;line-height:32px}.organization-toolbar :deep(.tz-button){width:100%}}
</style>
