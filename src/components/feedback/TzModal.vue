<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import closeDefault from '../../assets/icons/path/close-modal-default--620-1527.svg?no-inline'
import closeHover from '../../assets/icons/path/close-modal-hover--620-1533.svg?no-inline'

export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen'
export type ModalPlacement = 'center' | 'left' | 'right'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  description?: string
  size?: ModalSize
  placement?: ModalPlacement
  width?: string
  height?: string
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  showClose?: boolean
  initialFocus?: string
}>(), {
  description: undefined,
  size: 'medium',
  placement: 'center',
  width: undefined,
  height: undefined,
  closeOnBackdrop: true,
  closeOnEscape: true,
  showClose: true,
  initialFocus: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
}>()

const dialog = ref<HTMLElement | null>(null)
const titleId = `tz-modal-title-${useId()}`
const descriptionId = `tz-modal-description-${useId()}`
let previousActiveElement: HTMLElement | null = null
let previousBodyOverflow = ''
let bodyLocked = false

const dialogStyle = computed(() => ({
  '--tz-modal-width': props.width,
  '--tz-modal-height': props.height,
}))

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function focusableElements() {
  if (!dialog.value) return []
  return Array.from(dialog.value.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )).filter(element => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true')
}

function focusInitialElement() {
  const requested = props.initialFocus
    ? dialog.value?.querySelector<HTMLElement>(props.initialFocus)
    : null
  ;(requested ?? focusableElements()[0] ?? dialog.value)?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEscape) {
    event.preventDefault()
    close()
    return
  }
  if (event.key !== 'Tab') return

  const elements = focusableElements()
  if (!elements.length) {
    event.preventDefault()
    dialog.value?.focus()
    return
  }

  const first = elements[0]
  const last = elements[elements.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function lockBody() {
  if (bodyLocked) return
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  bodyLocked = true
}

function unlockBody() {
  if (!bodyLocked) return
  document.body.style.overflow = previousBodyOverflow
  bodyLocked = false
}

watch(() => props.modelValue, async open => {
  if (open) {
    previousActiveElement = document.activeElement as HTMLElement | null
    lockBody()
    await nextTick()
    focusInitialElement()
    emit('open')
  } else {
    unlockBody()
    previousActiveElement?.focus()
    previousActiveElement = null
  }
}, { immediate: true })

onBeforeUnmount(() => {
  unlockBody()
  previousActiveElement?.focus()
})

defineExpose({ close, focus: focusInitialElement })
</script>

<template>
  <Teleport to="body">
    <Transition name="tz-modal">
      <div v-if="modelValue" class="tz-modal" :class="`tz-modal--${placement}`" role="presentation" @mousedown.self="closeOnBackdrop && close()">
        <section
          ref="dialog"
          class="tz-modal__dialog"
          :class="`tz-modal__dialog--${size}`"
          :style="dialogStyle"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="description ? descriptionId : undefined"
          tabindex="-1"
          @keydown="onKeydown"
        >
          <header class="tz-modal__header">
            <span v-if="$slots.icon" class="tz-modal__header-icon" aria-hidden="true">
              <slot name="icon" />
            </span>
            <div class="tz-modal__heading">
              <h2 :id="titleId">{{ title }}</h2>
              <p v-if="description" :id="descriptionId">{{ description }}</p>
            </div>
            <button v-if="showClose" type="button" class="tz-modal__close" aria-label="Закрыть окно" @click="close">
              <img class="tz-modal__close-default" :src="closeDefault" alt="" />
              <img class="tz-modal__close-hover" :src="closeHover" alt="" />
            </button>
          </header>
          <div class="tz-modal__body"><slot /></div>
          <footer v-if="$slots.footer" class="tz-modal__footer"><slot name="footer" /></footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tz-modal{position:fixed;z-index:1000;inset:0;display:grid;padding:var(--padding-spacing-16);place-items:center;background:var(--bg-overlay)}
.tz-modal--left{place-items:center start}.tz-modal--right{place-items:center end}
.tz-modal__dialog{display:grid;width:min(var(--tz-modal-width,600px),100%);height:var(--tz-modal-height,auto);max-height:calc(100dvh - 32px);grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;color:var(--text-default);border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-surface);box-shadow:0 20px 48px var(--bg-shadow);outline:0}
.tz-modal--left .tz-modal__dialog,.tz-modal--right .tz-modal__dialog{height:calc(100dvh - 32px)}
.tz-modal__dialog--small{--tz-modal-width:400px}.tz-modal__dialog--medium{--tz-modal-width:600px}.tz-modal__dialog--large{--tz-modal-width:880px}.tz-modal__dialog--fullscreen{width:calc(100vw - 32px);height:calc(100dvh - 32px)}
.tz-modal__header{display:flex;min-height:55px;padding:var(--padding-spacing-12) var(--padding-spacing-16);align-items:center;justify-content:space-between;gap:var(--padding-spacing-12);border-bottom:1px solid var(--border-default);background:var(--bg-surface)}
.tz-modal__header-icon{display:grid;flex:0 0 36px;width:36px;height:36px;place-items:center;color:var(--brand-primary);border-radius:var(--radius-md);background:var(--brand-bg-active)}.tz-modal__heading{min-width:0;flex:1}.tz-modal__heading h2{margin:0;color:var(--text-default);font:var(--tz-text-heading-h3)}.tz-modal__heading p{margin:var(--padding-spacing-4) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}
.tz-modal__close{position:relative;display:grid;flex:0 0 32px;width:32px;height:32px;padding:var(--padding-spacing-4);place-items:center;border:0;border-radius:var(--radius-xs);background:transparent;cursor:pointer}.tz-modal__close img{position:absolute;width:24px;height:24px}.tz-modal__close-hover{opacity:0}.tz-modal__close:hover .tz-modal__close-default{opacity:0}.tz-modal__close:hover .tz-modal__close-hover{opacity:1}.tz-modal__close:focus-visible{outline:2px solid var(--brand-primary);outline-offset:1px}
.tz-modal__body{min-height:0;overflow:auto;background:var(--bg-surface)}.tz-modal__footer{display:flex;min-height:49px;padding:var(--padding-spacing-8);align-items:center;justify-content:flex-end;gap:var(--padding-spacing-8);border-top:1px solid var(--border-default);background:var(--bg-surface)}
.tz-modal-enter-active,.tz-modal-leave-active{transition:opacity 140ms ease}.tz-modal-enter-active .tz-modal__dialog,.tz-modal-leave-active .tz-modal__dialog{transition:transform 140ms ease,opacity 140ms ease}.tz-modal-enter-from,.tz-modal-leave-to{opacity:0}.tz-modal-enter-from .tz-modal__dialog,.tz-modal-leave-to .tz-modal__dialog{opacity:0;transform:translateY(4px) scale(.99)}
.tz-modal-enter-from.tz-modal--left .tz-modal__dialog,.tz-modal-leave-to.tz-modal--left .tz-modal__dialog{transform:translateX(-8px)}.tz-modal-enter-from.tz-modal--right .tz-modal__dialog,.tz-modal-leave-to.tz-modal--right .tz-modal__dialog{transform:translateX(8px)}
@media(max-width:620px){.tz-modal{padding:0}.tz-modal__dialog,.tz-modal__dialog--fullscreen{width:100%;height:100dvh;max-height:none;border:0;border-radius:0}.tz-modal__header{padding-inline:var(--padding-spacing-16)}}
@media(prefers-reduced-motion:reduce){.tz-modal-enter-active,.tz-modal-leave-active,.tz-modal-enter-active .tz-modal__dialog,.tz-modal-leave-active .tz-modal__dialog{transition:none}}
</style>
