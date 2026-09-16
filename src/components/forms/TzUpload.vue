<script setup lang="ts">
import { Download } from '@lucide/vue'
import circleXIcon from '../../assets/icons/path/circlex--89-4303.svg?no-inline'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

export type UploadAspectRatio = '1:1' | '4:3' | '3:2' | '16:9' | '3:4' | '9:16'

const props = withDefaults(defineProps<{
  modelValue?: File | null
  previewUrl?: string
  aspectRatio?: UploadAspectRatio
  width?: number | string
  accept?: string
  maxSizeMb?: number
  removable?: boolean
  disabled?: boolean
  objectFit?: 'cover' | 'contain'
  alt?: string
}>(), {
  modelValue: null,
  previewUrl: '',
  aspectRatio: '1:1',
  width: 100,
  accept: 'image/png,image/jpeg,image/webp,image/svg+xml',
  maxSizeMb: 5,
  removable: true,
  disabled: false,
  objectFit: 'cover',
  alt: 'Загруженное изображение',
})

const emit = defineEmits<{
  'update:modelValue': [file: File | null]
  change: [file: File]
  remove: []
  error: [message: string]
}>()

const input = ref<HTMLInputElement | null>(null)
const generatedUrl = ref('')
const dragActive = ref(false)
const ratioMap: Record<UploadAspectRatio, string> = { '1:1': '1 / 1', '4:3': '4 / 3', '3:2': '3 / 2', '16:9': '16 / 9', '3:4': '3 / 4', '9:16': '9 / 16' }
const source = computed(() => props.previewUrl || generatedUrl.value)
const hasFile = computed(() => Boolean(source.value))
const rootStyle = computed(() => ({
  '--tz-upload-width': typeof props.width === 'number' ? `${props.width}px` : props.width,
  '--tz-upload-ratio': ratioMap[props.aspectRatio],
  '--tz-upload-fit': props.objectFit,
}))

function revokeGeneratedUrl() {
  if (!generatedUrl.value) return
  URL.revokeObjectURL(generatedUrl.value)
  generatedUrl.value = ''
}

watch(() => props.modelValue, file => {
  revokeGeneratedUrl()
  if (file) generatedUrl.value = URL.createObjectURL(file)
}, { immediate: true })

onBeforeUnmount(revokeGeneratedUrl)

function accepts(file: File) {
  return props.accept.split(',').map(value => value.trim()).filter(Boolean).some(rule => {
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule.toLowerCase())
    if (rule.endsWith('/*')) return file.type.startsWith(rule.slice(0, -1))
    return file.type === rule
  })
}

function selectFile(file?: File) {
  if (!file || props.disabled) return
  if (!accepts(file)) { emit('error', 'Неподдерживаемый формат файла'); return }
  if (file.size > props.maxSizeMb * 1024 * 1024) { emit('error', `Размер файла не должен превышать ${props.maxSizeMb} МБ`); return }
  emit('update:modelValue', file)
  emit('change', file)
}

function openPicker() { if (!props.disabled) input.value?.click() }
function onInput(event: Event) { selectFile((event.target as HTMLInputElement).files?.[0]) }
function onDrop(event: DragEvent) { dragActive.value = false; selectFile(event.dataTransfer?.files?.[0]) }
function remove(event: Event) {
  event.stopPropagation()
  if (props.disabled) return
  if (input.value) input.value.value = ''
  emit('update:modelValue', null)
  emit('remove')
}
</script>

<template>
  <div
    class="tz-upload"
    :class="{ 'is-filled': hasFile, 'is-dragging': dragActive, 'is-disabled': disabled }"
    :style="rootStyle"
    role="button"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled || undefined"
    aria-label="Загрузить изображение"
    @click="openPicker"
    @keydown.enter.prevent="openPicker"
    @keydown.space.prevent="openPicker"
    @dragenter.prevent="dragActive = true"
    @dragover.prevent="dragActive = true"
    @dragleave.prevent="dragActive = false"
    @drop.prevent="onDrop"
  >
    <input ref="input" class="tz-upload__input" type="file" :accept="accept" :disabled="disabled" @change="onInput">
    <img v-if="hasFile" class="tz-upload__preview" :src="source" :alt="alt">
    <Download v-else class="tz-upload__placeholder" :size="30" :stroke-width="1.5" aria-hidden="true" />
    <button v-if="hasFile && removable" class="tz-upload__remove" type="button" aria-label="Удалить файл" :disabled="disabled" @click="remove"><span :style="{ '--tz-upload-remove-icon': `url('${circleXIcon}')` }" aria-hidden="true" /></button>
  </div>
</template>

<style scoped>
.tz-upload{position:relative;display:flex;box-sizing:border-box;width:var(--tz-upload-width);aspect-ratio:var(--tz-upload-ratio);align-items:center;justify-content:center;overflow:hidden;color:var(--brand-primary);border:1px dashed var(--brand-primary);border-radius:var(--radius-lg);background:var(--bg-page);outline:0;cursor:pointer;transition:border-color 140ms ease,background-color 140ms ease,box-shadow 140ms ease}.tz-upload:hover,.tz-upload.is-dragging{background:var(--brand-bg-hover);box-shadow:0 0 0 2px var(--effect-shadow)}.tz-upload:focus-visible{box-shadow:0 0 0 2px var(--effect-shadow)}.tz-upload.is-filled{border-style:solid;border-color:var(--border-default);background:var(--bg-surface);box-shadow:none}.tz-upload.is-disabled{opacity:.45;cursor:not-allowed}.tz-upload__input{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}.tz-upload__preview{display:block;width:100%;height:100%;object-fit:var(--tz-upload-fit);background:var(--bg-surface)}.tz-upload__placeholder{flex:0 0 auto}.tz-upload__remove{position:absolute;z-index:1;top:3px;right:5px;display:grid;width:24px;height:24px;padding:0;place-items:center;color:var(--gray-700);border:0;border-radius:var(--radius-full);background:var(--bg-surface);cursor:pointer}.tz-upload__remove span{display:block;width:24px;height:24px;background:currentColor;mask:var(--tz-upload-remove-icon) center/contain no-repeat;-webkit-mask:var(--tz-upload-remove-icon) center/contain no-repeat}.tz-upload__remove:hover{color:var(--status-error-fg)}.tz-upload__remove:focus-visible{outline:2px solid var(--brand-primary);outline-offset:1px}.tz-upload__remove:disabled{cursor:not-allowed}
</style>
