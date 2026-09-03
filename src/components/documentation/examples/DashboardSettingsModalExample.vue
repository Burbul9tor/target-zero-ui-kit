<script setup lang="ts">
import { CalendarDays, CheckSquare2, CircleHelp, GripVertical, SlidersHorizontal } from '@lucide/vue'
import { ref, type Component } from 'vue'
import TzButton from '../../actions/TzButton.vue'
import TzModal, { type ModalPlacement } from '../../feedback/TzModal.vue'
import TzToggle from '../../forms/TzToggle.vue'

const props = defineProps<{ modelValue: boolean; placement: ModalPlacement }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

type Widget = { title: string; description: string; icon: Component; enabled: boolean }

const widgets = ref<Widget[]>([
  { title: 'Мои проверки', description: 'Текущие и просроченные проверки', icon: CheckSquare2, enabled: true },
  { title: 'Мои мероприятия', description: 'Текущие и просроченные мероприятия', icon: CalendarDays, enabled: true },
  { title: 'Календарь', description: 'Запланированные события', icon: CalendarDays, enabled: true },
  { title: 'Мои опросы', description: 'Активные и завершённые опросы', icon: CircleHelp, enabled: true },
])

function reset() { widgets.value.forEach(widget => { widget.enabled = true }) }
function close() { emit('update:modelValue', false) }
</script>

<template>
  <TzModal
    :model-value="modelValue"
    :placement="placement"
    width="440px"
    title="Настройка дашборда"
    description="Выберите виджеты и задайте их порядок."
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #icon><SlidersHorizontal :size="18" /></template>

    <div class="dashboard-settings">
      <div class="dashboard-settings__summary">
        <span>Включено {{ widgets.filter(widget => widget.enabled).length }} из {{ widgets.length }}</span>
        <button type="button" @click="reset">Сбросить</button>
      </div>
      <div class="dashboard-settings__list">
        <article v-for="widget in widgets" :key="widget.title">
          <GripVertical class="dashboard-settings__grip" :size="16" aria-hidden="true" />
          <span class="dashboard-settings__icon"><component :is="widget.icon" :size="18" /></span>
          <div><strong>{{ widget.title }}</strong><p>{{ widget.description }}</p></div>
          <TzToggle v-model="widget.enabled" size="medium" :show-label="false" :label="widget.title" />
        </article>
      </div>
    </div>

    <template #footer><TzButton size="medium" @click="close">Сохранить настройки</TzButton></template>
  </TzModal>
</template>

<style scoped>
.dashboard-settings{display:grid;height:100%;min-height:0;grid-template-rows:auto minmax(0,1fr)}
.dashboard-settings__summary{display:flex;min-height:44px;padding:0 var(--padding-spacing-16);align-items:center;justify-content:space-between;color:var(--text-muted);border-bottom:1px solid var(--border-default);font:var(--tz-text-body-small)}
.dashboard-settings__summary button{padding:var(--padding-spacing-4) var(--padding-spacing-8);color:var(--brand-primary);border:0;border-radius:var(--radius-xs);background:transparent;font:var(--tz-text-button-medium);cursor:pointer}.dashboard-settings__summary button:hover{background:var(--brand-bg-hover)}
.dashboard-settings__list{display:grid;min-height:0;padding:var(--padding-spacing-8);align-content:start;gap:var(--padding-spacing-8);overflow:auto}
.dashboard-settings__list article{display:grid;min-height:64px;padding:var(--padding-spacing-8) var(--padding-spacing-12);grid-template-columns:16px 36px minmax(0,1fr) auto;align-items:center;gap:var(--padding-spacing-8);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface)}
.dashboard-settings__grip{color:var(--icon-default);cursor:grab}.dashboard-settings__icon{display:grid;width:36px;height:36px;place-items:center;color:var(--brand-primary);border-radius:var(--radius-md);background:var(--brand-bg-active)}
.dashboard-settings__list article>div{min-width:0}.dashboard-settings__list strong{display:block;overflow:hidden;color:var(--text-default);font:var(--tz-text-body-strong);text-overflow:ellipsis;white-space:nowrap}.dashboard-settings__list p{margin:0;overflow:hidden;color:var(--text-muted);font:var(--tz-text-body-small);text-overflow:ellipsis;white-space:nowrap}
@media(max-width:620px){.dashboard-settings__list article{grid-template-columns:16px 32px minmax(0,1fr) auto}.dashboard-settings__icon{width:32px;height:32px}}
</style>
