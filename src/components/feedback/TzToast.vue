<script setup lang="ts">
import { CircleCheck, CircleHelp, FileWarning, Mail, Siren, X } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export type ToastType = 'neutral' | 'success' | 'info' | 'warning' | 'error'

const props = withDefaults(
  defineProps<{
    type?: ToastType
    title?: string
    description?: string
    icon?: boolean
    progress?: boolean
    showDescription?: boolean
    duration?: number
    autoClose?: boolean
  }>(),
  {
    type: 'neutral',
    title: 'Notification',
    description: 'Something happened.',
    icon: true,
    progress: true,
    showDescription: true,
    duration: 4000,
    autoClose: true,
  },
)

const emit = defineEmits<{
  close: []
}>()

const iconByType = {
  neutral: Mail,
  success: CircleCheck,
  info: CircleHelp,
  warning: FileWarning,
  error: Siren,
}

const statusIcon = computed(() => iconByType[props.type])
const liveRole = computed(() => (props.type === 'warning' || props.type === 'error' ? 'alert' : 'status'))
const toastStyle = computed(() => ({ '--toast-duration': props.duration + 'ms' }))

const closing = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | undefined
let exitTimer: ReturnType<typeof setTimeout> | undefined
let remainingTime = props.duration
let timerStartedAt = 0

function requestClose() {
  if (closing.value) return
  closing.value = true
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = undefined
  exitTimer = setTimeout(() => emit('close'), 180)
}

function startCloseTimer() {
  if (!props.autoClose || closing.value || remainingTime <= 0) return
  timerStartedAt = Date.now()
  closeTimer = setTimeout(requestClose, remainingTime)
}

function pauseCloseTimer() {
  if (!closeTimer) return
  clearTimeout(closeTimer)
  closeTimer = undefined
  remainingTime = Math.max(0, remainingTime - (Date.now() - timerStartedAt))
}

function resumeCloseTimer() {
  if (!closeTimer) startCloseTimer()
}

onMounted(startCloseTimer)

onBeforeUnmount(() => {
  if (closeTimer) clearTimeout(closeTimer)
  if (exitTimer) clearTimeout(exitTimer)
})
</script>

<template>
  <article
    class="tz-toast"
    :class="[`tz-toast--${type}`, { 'is-closing': closing }]"
    :role="liveRole"
    :style="toastStyle"
    @mouseenter="pauseCloseTimer"
    @mouseleave="resumeCloseTimer"
  >
    <span v-if="icon" class="tz-toast__icon-badge" aria-hidden="true">
      <component :is="statusIcon" :size="type === 'neutral' ? 16 : 18" :stroke-width="1.5" />
    </span>

    <div class="tz-toast__content">
      <strong>{{ title }}</strong>
      <p v-if="showDescription">{{ description }}</p>
    </div>

    <button class="tz-toast__close" type="button" aria-label="Закрыть уведомление" @click="requestClose">
      <X :size="16" :stroke-width="1.5" aria-hidden="true" />
    </button>

    <span v-if="progress && autoClose" class="tz-toast__progress" aria-hidden="true" />
  </article>
</template>

<style scoped>
.tz-toast {
  --toast-accent: var(--status-neutral-fg);
  --toast-icon-bg: var(--slate-bg);
  --toast-icon-fg: var(--slate-fg);

  position: relative;
  display: flex;
  align-items: center;
  gap: var(--tz-space-12);
  width: min(360px, 100%);
  min-height: 50px;
  padding: var(--tz-space-12) var(--tz-space-16);
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--bg-background-card);
  box-shadow: 0 10px 15px -3px var(--bg-shadow);
  animation: tz-toast-enter 220ms cubic-bezier(.2, .8, .2, 1) both;
}

.tz-toast--success {
  --toast-accent: var(--status-success-fg);
  --toast-icon-bg: var(--status-success-bg);
  --toast-icon-fg: var(--status-success-fg);
}

.tz-toast--info {
  --toast-accent: var(--status-info-fg);
  --toast-icon-bg: var(--status-info-bg);
  --toast-icon-fg: var(--status-info-fg);
}

.tz-toast--warning {
  --toast-accent: var(--status-warning-fg);
  --toast-icon-bg: var(--status-warning-bg);
  --toast-icon-fg: var(--status-warning-fg);
}

.tz-toast--error {
  --toast-accent: var(--status-error-fg);
  --toast-icon-bg: var(--status-error-bg);
  --toast-icon-fg: var(--status-error-fg);
}

.tz-toast__icon-badge {
  display: grid;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  place-items: center;
  color: var(--toast-icon-fg);
  border-radius: var(--radius-md);
  background: var(--toast-icon-bg);
}

.tz-toast__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--tz-space-4);
  min-width: 0;
}

.tz-toast__content strong {
  color: var(--text-default);
  font: 500 14px/20px var(--tz-font-family);
  overflow-wrap: anywhere;
}

.tz-toast__content p {
  margin: 0;
  color: var(--text-muted);
  font: 400 12px/16px var(--tz-font-family);
  overflow-wrap: anywhere;
}

.tz-toast__close {
  display: grid;
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  padding: 0;
  place-items: center;
  color: var(--icon-default);
  border: 0;
  background: transparent;
  cursor: pointer;
}

.tz-toast__progress {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 3px;
  border-radius: 2px;
  background: var(--toast-accent);
  transform-origin: left center;
  animation: tz-toast-progress var(--toast-duration) linear forwards;
}

.tz-toast:hover .tz-toast__progress {
  animation-play-state: paused;
}
@keyframes tz-toast-enter {
  from { opacity: 0; transform: translateX(20px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes tz-toast-exit {
  from { opacity: 1; transform: translateX(0) scale(1); }
  to { opacity: 0; transform: translateX(20px) scale(.98); }
}

.tz-toast.is-closing {
  pointer-events: none;
  animation: tz-toast-exit 180ms ease-in both;
}

.tz-toast.is-closing .tz-toast__progress {
  animation-play-state: paused;
}

@keyframes tz-toast-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

</style>
