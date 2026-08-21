<script setup lang="ts">
import { ref } from 'vue'
import TzToast, { type ToastType } from './components/TzToast.vue'

const variants: Array<{ type: ToastType; label: string }> = [
  { type: 'neutral', label: 'Neutral' },
  { type: 'error', label: 'Error' },
  { type: 'info', label: 'Info' },
  { type: 'warning', label: 'Warning' },
  { type: 'success', label: 'Success' },
]

type LiveToast = { id: number; type: ToastType; showDescription: boolean }

const showSubtitle = ref(true)
const liveToasts = ref<LiveToast[]>([])
let nextToastId = 0

function playToast(type: ToastType) {
  liveToasts.value.push({ id: ++nextToastId, type, showDescription: showSubtitle.value })
}

function closeToast(id: number) {
  liveToasts.value = liveToasts.value.filter((toast) => toast.id !== id)
}
</script>

<template>
  <main class="page">
    <header class="page__header">
      <p>COMPONENT · FEEDBACK</p>
      <h1>Toasts</h1>
      <span>Интерактивный пример Target Zero: запустите несколько вариантов и проверьте таймер, hover-паузу и закрытие.</span>
    </header>

    <section class="card">
      <header class="card__header">
        <div>
          <h2>Типы</h2>
          <p>Подзаголовок можно отключить перед воспроизведением.</p>
        </div>
        <label class="toggle">
          <span>Подзаголовок</span>
          <input v-model="showSubtitle" type="checkbox" />
          <i aria-hidden="true" />
        </label>
      </header>

      <div class="stage">
        <article v-for="variant in variants" :key="variant.type" class="example">
          <small>{{ variant.label }}</small>
          <TzToast :type="variant.type" :show-description="showSubtitle" :auto-close="false" />
          <button type="button" @click="playToast(variant.type)">Воспроизвести</button>
        </article>
      </div>
    </section>

    <section class="hint">
      <strong>Как проверить</strong>
      <p>Нажмите «Воспроизвести». Toast появится справа сверху и закроется через 4000 ms. Наведите курсор — progress и таймер остановятся; уберите курсор — продолжатся.</p>
    </section>

    <Teleport to="body">
      <div class="toast-viewport" aria-live="polite" aria-label="Уведомления">
        <TzToast
          v-for="toast in liveToasts"
          :key="toast.id"
          :type="toast.type"
          :show-description="toast.showDescription"
          @close="closeToast(toast.id)"
        />
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.page { width: min(100% - 32px, 1160px); margin: 0 auto; padding: 48px 0; }
.page__header { margin-bottom: 28px; }
.page__header > p { margin: 0 0 8px; color: var(--brand-primary); font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.page__header h1 { margin: 0 0 8px; font: 700 32px/40px var(--tz-font-family); }
.page__header > span, .card__header p, .hint p { color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.card { padding: 24px; border: 1px solid var(--showcase-border); border-radius: 12px; background: var(--bg-surface); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 5%); }
.card__header { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
.card__header h2 { margin: 0 0 4px; font: 600 18px/24px var(--tz-font-family); }
.card__header p { margin: 0; }
.toggle { display: flex; align-items: center; gap: 10px; font: 500 12px/16px var(--tz-font-family); cursor: pointer; }
.toggle input { position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0; }
.toggle i { position: relative; width: 32px; height: 18px; border-radius: 999px; background: var(--bg-track-off); transition: background-color 160ms ease; }
.toggle i::after { position: absolute; top: 3px; left: 3px; width: 12px; height: 12px; border-radius: 50%; background: white; box-shadow: 0 1px 3px rgb(0 0 0 / 18%); content: ''; transition: transform 160ms ease; }
.toggle input:checked + i { background: var(--brand-primary); }
.toggle input:checked + i::after { transform: translateX(14px); }
.toggle input:focus-visible + i { outline: 2px solid var(--brand-primary); outline-offset: 2px; }
.stage { display: grid; gap: 16px; padding: 24px; border-radius: 8px; background: #f1f1f1; }
.example { display: grid; grid-template-columns: 72px minmax(0, 360px) auto; align-items: center; gap: 16px; }
.example small { color: var(--text-muted); font: 500 10px/14px var(--tz-font-family); letter-spacing: .06em; text-transform: uppercase; }
.example button { width: fit-content; padding: 8px 12px; color: var(--brand-primary); border: 1px solid var(--border-default); border-radius: 6px; background: var(--brand-bg-accent); font: 500 12px/16px var(--tz-font-family); cursor: pointer; }
.hint { margin-top: 20px; padding: 16px 20px; border-left: 3px solid var(--brand-primary); border-radius: 0 8px 8px 0; background: var(--brand-bg-accent); }
.hint strong { font: 600 14px/20px var(--tz-font-family); }
.hint p { margin: 4px 0 0; }
.toast-viewport { position: fixed; z-index: 2000; top: 24px; right: 24px; display: flex; width: min(360px, calc(100vw - 32px)); flex-direction: column; align-items: flex-end; gap: 12px; pointer-events: none; }
.toast-viewport :deep(.tz-toast) { pointer-events: auto; }

@media (max-width: 700px) {
  .page { padding: 24px 0; }
  .card { padding: 16px; }
  .card__header, .example { grid-template-columns: 1fr; flex-direction: column; align-items: flex-start; }
  .stage { padding: 16px; }
}
</style>
