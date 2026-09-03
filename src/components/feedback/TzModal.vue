<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import type { Component } from 'vue'
import closeDefault from '../../assets/icons/path/close-modal-default--620-1527.svg?no-inline'
import closeHover from '../../assets/icons/path/close-modal-hover--620-1533.svg?no-inline'

export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen'
export type ModalPlacement = 'center' | 'left' | 'right'
export type ModalIcon = { icon: Component; width?: string; height?: string }
export type ModalExpandIcon = { iconStretch: Component; iconCollapse: Component; width?: string; height?: string }

const props = withDefaults(defineProps<{
  modelValue?: boolean
  show?: boolean
  title?: string
  description?: string
  size?: ModalSize
  placement?: ModalPlacement
  width?: string
  height?: string
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  showClose?: boolean
  initialFocus?: string
  teleportTo?: string
  disabledScroll?: boolean
  isExpand?: boolean
  withHeader?: boolean
  withFooter?: boolean
  expandable?: boolean
  classNames?: string[]
  closeIcon?: ModalIcon
  expandIcon?: ModalExpandIcon
}>(), {
  modelValue: undefined, show: false, title: '', description: undefined, size: 'medium', placement: 'center',
  width: undefined, height: undefined, closeOnBackdrop: true, closeOnEscape: true, showClose: true,
  initialFocus: undefined, teleportTo: 'body', disabledScroll: false, isExpand: false, withHeader: true,
  withFooter: true, expandable: false, classNames: () => [], closeIcon: undefined, expandIcon: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:show': [value: boolean]
  'update:isExpand': [value: boolean]
  open: []
  close: []
}>()

const dialog = ref<HTMLElement | null>(null)
const visible = computed(() => props.modelValue ?? props.show)
const titleId = `tz-modal-title-${useId()}`
const descriptionId = `tz-modal-description-${useId()}`
let previousActiveElement: HTMLElement | null = null
let previousBodyOverflow = ''
let bodyLocked = false

const dialogStyle = computed(() => ({ '--tz-modal-width': props.width, '--tz-modal-height': props.height }))
const isExpanded = computed(() => props.isExpand)

function updateVisibility(value: boolean) { emit('update:modelValue', value); emit('update:show', value) }
function close() { updateVisibility(false); emit('close') }
function toggleExpand() { emit('update:isExpand', !isExpanded.value) }

function focusableElements() {
  if (!dialog.value) return []
  return Array.from(dialog.value.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )).filter(element => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true')
}

function focusInitialElement() {
  const requested = props.initialFocus ? dialog.value?.querySelector<HTMLElement>(props.initialFocus) : null
  ;(requested ?? focusableElements()[0] ?? dialog.value)?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEscape) { event.preventDefault(); close(); return }
  if (event.key !== 'Tab') return
  const elements = focusableElements()
  if (!elements.length) { event.preventDefault(); dialog.value?.focus(); return }
  const first = elements[0]
  const last = elements[elements.length - 1]
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
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

watch(visible, async open => {
  if (open) {
    previousActiveElement = document.activeElement as HTMLElement | null
    if (props.disabledScroll) lockBody()
    await nextTick()
    focusInitialElement()
    emit('open')
  } else {
    unlockBody()
    previousActiveElement?.focus()
    previousActiveElement = null
  }
}, { immediate: true })

watch(() => props.disabledScroll, enabled => {
  if (!visible.value) return
  if (enabled) lockBody()
  else unlockBody()
})

onBeforeUnmount(() => { unlockBody(); previousActiveElement?.focus() })
defineExpose({ close, focus: focusInitialElement, toggleExpand })
</script>

<template>
  <Teleport :to="teleportTo">
    <Transition name="tz-modal">
      <div v-if="visible" class="tz-modal" :class="`tz-modal--${placement}`" role="presentation" @mousedown.self="closeOnBackdrop && close()">
        <section
          ref="dialog" class="tz-modal__dialog"
          :class="[`tz-modal__dialog--${size}`, { 'is-expanded': isExpanded }, classNames]"
          :style="dialogStyle" role="dialog" aria-modal="true"
          :aria-labelledby="withHeader && title ? titleId : undefined"
          :aria-label="!withHeader && title ? title : undefined"
          :aria-describedby="description ? descriptionId : undefined"
          tabindex="-1" @keydown="onKeydown"
        >
          <header v-if="withHeader" class="tz-modal__header">
            <slot name="header">
              <span v-if="$slots.icon" class="tz-modal__header-icon" aria-hidden="true"><slot name="icon" /></span>
              <div class="tz-modal__heading">
                <h2 :id="titleId">{{ title }}</h2>
                <p v-if="description" :id="descriptionId">{{ description }}</p>
              </div>
            </slot>
            <span v-if="$slots['header-action'] || expandable || showClose" class="tz-modal__header-actions">
              <slot name="header-action" />
              <button v-if="expandable" type="button" class="tz-modal__expand" :aria-label="isExpanded ? 'Свернуть окно' : 'Развернуть окно'" @click="toggleExpand">
                <component v-if="expandIcon" :is="isExpanded ? expandIcon.iconCollapse : expandIcon.iconStretch" :style="{ width: expandIcon.width, height: expandIcon.height }" />
                <span v-else class="tz-modal__expand-glyph" aria-hidden="true" />
              </button>
              <button v-if="showClose" type="button" class="tz-modal__close" aria-label="Закрыть окно" @click="close">
                <component v-if="closeIcon" :is="closeIcon.icon" :style="{ width: closeIcon.width, height: closeIcon.height }" />
                <template v-else>
                  <img class="tz-modal__close-default" :src="closeDefault" alt="" />
                  <img class="tz-modal__close-hover" :src="closeHover" alt="" />
                </template>
              </button>
            </span>
          </header>
          <div class="tz-modal__body"><slot /></div>
          <footer v-if="withFooter && $slots.footer" class="tz-modal__footer"><slot name="footer" /></footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tz-modal{position:fixed;z-index:1000;inset:0;display:grid;padding:var(--padding-spacing-16);place-items:center;background:var(--bg-overlay)}
.tz-modal--left{place-items:center start}.tz-modal--right{place-items:center end}
.tz-modal__dialog{display:grid;width:min(var(--tz-modal-width,600px),100%);height:var(--tz-modal-height,auto);max-height:calc(100dvh - 32px);grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;color:var(--text-default);border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-surface);box-shadow:0 20px 48px var(--bg-shadow);outline:0}
.tz-modal__dialog.is-expanded{width:calc(100vw - 32px);height:calc(100dvh - 32px)}
.tz-modal--left .tz-modal__dialog,.tz-modal--right .tz-modal__dialog{height:calc(100dvh - 32px)}
.tz-modal__dialog--small{--tz-modal-width:400px}.tz-modal__dialog--medium{--tz-modal-width:600px}.tz-modal__dialog--large{--tz-modal-width:880px}.tz-modal__dialog--fullscreen{width:calc(100vw - 32px);height:calc(100dvh - 32px)}
.tz-modal__header{display:flex;min-height:55px;padding:var(--padding-spacing-12) var(--padding-spacing-16);align-items:center;justify-content:space-between;gap:var(--padding-spacing-12);border-bottom:1px solid var(--border-default);background:var(--bg-surface)}
.tz-modal__header-icon{display:grid;flex:0 0 36px;width:36px;height:36px;place-items:center;color:var(--brand-primary);border-radius:var(--radius-md);background:var(--brand-bg-active)}.tz-modal__heading{min-width:0;flex:1}.tz-modal__heading h2{margin:0;color:var(--text-default);font:var(--tz-text-heading-h3)}.tz-modal__heading p{margin:var(--padding-spacing-4) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}
.tz-modal__header-actions{display:flex;flex:0 0 auto;align-items:center;gap:var(--padding-spacing-4)}.tz-modal__close,.tz-modal__expand{position:relative;display:grid;flex:0 0 32px;width:32px;height:32px;padding:var(--padding-spacing-4);place-items:center;color:var(--icon-default);border:0;border-radius:var(--radius-xs);background:transparent;cursor:pointer}.tz-modal__close img{position:absolute;width:24px;height:24px}.tz-modal__close-hover{opacity:0}.tz-modal__close:hover .tz-modal__close-default{opacity:0}.tz-modal__close:hover .tz-modal__close-hover{opacity:1}.tz-modal__close:focus-visible,.tz-modal__expand:focus-visible{outline:2px solid var(--brand-primary);outline-offset:1px}.tz-modal__expand-glyph{width:15px;height:15px;border:1.5px solid currentColor;border-radius:2px;box-shadow:4px -4px 0 -2px var(--bg-surface),4px -4px 0 -1px currentColor}
.tz-modal__body{min-height:0;overflow:auto;background:var(--bg-surface)}.tz-modal__footer{display:flex;min-height:49px;padding:var(--padding-spacing-8);align-items:center;justify-content:flex-end;gap:var(--padding-spacing-8);border-top:1px solid var(--border-default);background:var(--bg-surface)}
.tz-modal-enter-active,.tz-modal-leave-active{transition:opacity 140ms ease}.tz-modal-enter-active .tz-modal__dialog,.tz-modal-leave-active .tz-modal__dialog{transition:transform 140ms ease,opacity 140ms ease}.tz-modal-enter-from,.tz-modal-leave-to{opacity:0}.tz-modal-enter-from .tz-modal__dialog,.tz-modal-leave-to .tz-modal__dialog{opacity:0;transform:translateY(4px) scale(.99)}
.tz-modal-enter-from.tz-modal--left .tz-modal__dialog,.tz-modal-leave-to.tz-modal--left .tz-modal__dialog{transform:translateX(-8px)}.tz-modal-enter-from.tz-modal--right .tz-modal__dialog,.tz-modal-leave-to.tz-modal--right .tz-modal__dialog{transform:translateX(8px)}
@media(max-width:620px){.tz-modal{padding:0}.tz-modal__dialog,.tz-modal__dialog--fullscreen,.tz-modal__dialog.is-expanded{width:100%;height:100dvh;max-height:none;border:0;border-radius:0}.tz-modal__header{padding-inline:var(--padding-spacing-16)}}
@media(prefers-reduced-motion:reduce){.tz-modal-enter-active,.tz-modal-leave-active,.tz-modal-enter-active .tz-modal__dialog,.tz-modal-leave-active .tz-modal__dialog{transition:none}}
</style>
