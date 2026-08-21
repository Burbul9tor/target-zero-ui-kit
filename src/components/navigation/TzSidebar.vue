<script setup lang="ts">
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  HardHat,
  LayoutGrid,
  Leaf,
  Mail,
  MapPin,
  Recycle,
  Settings,
  Shield,
} from '@lucide/vue'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{ collapsed?: boolean }>(), { collapsed: false })
const emit = defineEmits<{
  select: [item: { label: string; level: 1 | 2; parent?: string }]
}>()

const wasteOpen = ref(true)
const activeTopItem = ref<string | null>(null)
const activeSubitem = ref('Информационное табло')

const topItems = [
  { label: 'Мои задачи', icon: BriefcaseBusiness },
  { label: 'Экология', icon: Leaf },
]

const wasteItems = [
  { label: 'Информационное табло', icon: LayoutGrid },
  { label: 'Справочник отходов', icon: Recycle },
  { label: 'Методики расчета отходов', icon: ClipboardCheck },
  { label: 'Параметры расчета отходов', icon: Settings },
  { label: 'Места обращения с отходами', icon: MapPin },
]

const safetyItems = [
  { label: 'ПЭК', icon: Recycle },
  { label: 'Техника безопасности', icon: HardHat },
  { label: 'Аудит', icon: ClipboardCheck },
  { label: 'СИЗ', icon: Shield },
  { label: 'Наряды допуски', icon: BookOpen },
  { label: 'Уведомления по БиОТ', icon: Mail },
  { label: 'Чек-листы самоконтроля', icon: ClipboardCheck },
]

const utilityItems = [
  { label: 'Отчёты', icon: BarChart3 },
  { label: 'Справочники', icon: BookOpen },
  { label: 'Настройки', icon: Settings },
]

const sidebarLabel = computed(() => (props.collapsed ? 'Компактная навигация' : 'Открытая навигация'))

function selectTopItem(label: string) {
  activeTopItem.value = label
  activeSubitem.value = ''
  emit('select', { label, level: 1 })
}

function selectSubitem(label: string) {
  activeTopItem.value = null
  activeSubitem.value = label
  emit('select', { label, level: 2, parent: 'Отходы' })
}
</script>

<template>
  <aside class="tz-sidebar" :class="{ 'tz-sidebar--collapsed': collapsed }" :aria-label="sidebarLabel">
    <button v-for="item in topItems" :key="item.label" class="tz-sidebar__item" :class="{ 'tz-sidebar__item--active': activeTopItem === item.label }" type="button" :title="collapsed ? item.label : undefined" @click="selectTopItem(item.label)">
      <component :is="item.icon" :size="20" :stroke-width="1.5" />
      <span>{{ item.label }}</span>
    </button>

    <div class="tz-sidebar__branch" :class="{ 'is-open': wasteOpen }">
      <button class="tz-sidebar__item" :class="{ 'tz-sidebar__item--active': Boolean(activeSubitem) }" type="button" title="Отходы" @click="wasteOpen = !wasteOpen">
        <Recycle :size="20" :stroke-width="1.5" />
        <span>Отходы</span>
        <ChevronUp v-if="wasteOpen" class="tz-sidebar__chevron" :size="20" />
        <ChevronDown v-else class="tz-sidebar__chevron" :size="20" />
      </button>

      <div v-if="wasteOpen || collapsed" class="tz-sidebar__subitems">
        <button
          v-for="item in wasteItems"
          :key="item.label"
          class="tz-sidebar__subitem"
          :class="{ 'is-active': activeSubitem === item.label }"
          type="button"
          :title="collapsed ? item.label : undefined"
          @click="selectSubitem(item.label)"
        >
          <component :is="item.icon" :size="16" :stroke-width="1.5" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>

    <div class="tz-sidebar__separator" />

    <button v-for="item in safetyItems" :key="item.label" class="tz-sidebar__item" :class="{ 'tz-sidebar__item--active': activeTopItem === item.label }" type="button" :title="collapsed ? item.label : undefined" @click="selectTopItem(item.label)">
      <component :is="item.icon" :size="20" :stroke-width="1.5" />
      <span>{{ item.label }}</span>
    </button>

    <div class="tz-sidebar__separator" />

    <button v-for="item in utilityItems" :key="item.label" class="tz-sidebar__item" :class="{ 'tz-sidebar__item--active': activeTopItem === item.label }" type="button" :title="collapsed ? item.label : undefined" @click="selectTopItem(item.label)">
      <component :is="item.icon" :size="20" :stroke-width="1.5" />
      <span>{{ item.label }}</span>
    </button>
  </aside>
</template>

<style scoped>
.tz-sidebar {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 256px;
  min-height: 690px;
  padding: 8px;
  overflow: hidden;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-left: 0;
  transition: width 180ms ease;
}

.tz-sidebar--collapsed {
  width: 56px;
}

.tz-sidebar__item,
.tz-sidebar__subitem {
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  width: 100%;
  color: var(--text-default);
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.tz-sidebar__item {
  min-height: 40px;
  gap: 10px;
  padding: 10px;
  border-radius: var(--tz-radius-control);
  font: 600 12px/15px var(--tz-font-family);
}

.tz-sidebar__item:hover,
.tz-sidebar__subitem:hover {
  background: var(--bg-row-hover);
}

.tz-sidebar__item span {
  width: 176px;
}

.tz-sidebar__chevron {
  margin-left: auto;
}

.tz-sidebar__branch {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: var(--tz-radius-control);
}

.tz-sidebar__branch.is-open {
  background: var(--bg-row-hover);
}

.tz-sidebar__item--active {
  color: var(--brand-primary);
  background: var(--brand-bg-active);
}

.tz-sidebar__subitems {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 12px;
}

.tz-sidebar__subitem {
  gap: 10px;
  min-height: 38px;
  padding: 8px 10px;
  border-radius: var(--tz-radius-control);
  font: 500 11px/15px var(--tz-font-family);
}

.tz-sidebar__subitem span {
  flex: 1;
}

.tz-sidebar__subitem.is-active {
  color: var(--brand-primary);
  background: var(--brand-bg-active);
}

.tz-sidebar__subitem.is-active::before {
  position: absolute;
  left: 0;
  width: 3px;
  height: 21px;
  border-radius: 0 2px 2px 0;
  background: var(--brand-primary);
  content: '';
}

.tz-sidebar__separator {
  width: 100%;
  height: 1px;
  background: var(--border-default);
}

.tz-sidebar--collapsed .tz-sidebar__item {
  justify-content: center;
  width: 40px;
  padding: 10px;
}

.tz-sidebar--collapsed .tz-sidebar__item span,
.tz-sidebar--collapsed .tz-sidebar__chevron,
.tz-sidebar--collapsed .tz-sidebar__subitem span {
  display: none;
}

.tz-sidebar--collapsed .tz-sidebar__subitems {
  padding-left: 2px;
}

.tz-sidebar--collapsed .tz-sidebar__subitem {
  justify-content: center;
  width: 36px;
  padding: 8px 10px;
}
</style>
