<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import cameraIconUrl from '../../assets/icons/path/camera--1-2797.svg?url&no-inline'
import userIconUrl from '../../assets/icons/path/user--1-2758.svg?url&no-inline'

export type AvatarSize = 32 | 40 | 64

const props = withDefaults(defineProps<{
  size?: AvatarSize
  src?: string
  alt?: string
  editable?: boolean
  disabled?: boolean
  accept?: string
}>(), {
  size: 64,
  src: '',
  alt: '',
  editable: false,
  disabled: false,
  accept: 'image/png,image/jpeg,image/webp',
})

const emit = defineEmits<{
  change: [file: File]
  error: [event: Event]
}>()

const input = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')
const imageSrc = computed(() => previewUrl.value || props.src)
const kind = computed(() => imageSrc.value ? 'image' : 'icon')
const accessibleName = computed(() => props.alt || 'User avatar')

function releasePreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
}

function openPicker() {
  if (!props.disabled) input.value?.click()
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  releasePreview()
  previewUrl.value = URL.createObjectURL(file)
  emit('change', file)
  target.value = ''
}

watch(() => props.src, releasePreview)
onBeforeUnmount(releasePreview)
</script>

<template>
  <div
    class="tz-avatar"
    :class="[
      `tz-avatar--${size}`,
      `tz-avatar--${kind}`,
      { 'tz-avatar--editable': editable, 'is-disabled': disabled },
    ]"
    :style="{ '--avatar-size': `${size}px` }"
  >
    <span class="tz-avatar__media" role="img" :aria-label="accessibleName">
      <img v-if="imageSrc" class="tz-avatar__image" :src="imageSrc" alt="" @error="emit('error', $event)" />
      <span v-else class="tz-avatar__fallback" :style="{ '--avatar-icon-url': `url('${userIconUrl}')` }" aria-hidden="true" />
    </span>

    <template v-if="editable">
      <input ref="input" class="tz-avatar__input" type="file" :accept="accept" :disabled="disabled" @change="onFileChange" />
      <button class="tz-avatar__edit" type="button" :disabled="disabled" aria-label="Change avatar" @click="openPicker">
        <span :style="{ '--avatar-camera-url': `url('${cameraIconUrl}')` }" aria-hidden="true" />
      </button>
    </template>
  </div>
</template>

<style scoped>
.tz-avatar {
  position: relative;
  display: inline-grid;
  width: var(--avatar-size);
  height: var(--avatar-size);
  flex: 0 0 var(--avatar-size);
}

.tz-avatar__media {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: var(--avatar-text-color);
  border: 1px solid var(--avatar-border-color);
  border-radius: var(--avatar-radius);
  background: var(--avatar-background);
}
.tz-avatar--32.tz-avatar--icon .tz-avatar__media { border-radius: var(--avatar-radius-small); }
.tz-avatar__image { display: block; width: 100%; height: 100%; border-radius: inherit; object-fit: cover; }
.tz-avatar__fallback { width: 24px; height: 24px; background: var(--avatar-icon-color); -webkit-mask: var(--avatar-icon-url) center / contain no-repeat; mask: var(--avatar-icon-url) center / contain no-repeat; }
.tz-avatar--32 .tz-avatar__fallback { width: 20px; height: 20px; }
.tz-avatar__input { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }
.tz-avatar__edit {
  position: absolute;
  right: -4px;
  bottom: -4px;
  display: grid;
  width: 24px;
  height: 24px;
  padding: 0;
  place-items: center;
  border: 2px solid var(--avatar-background);
  border-radius: var(--avatar-edit-radius);
  background: var(--avatar-edit-background);
  cursor: pointer;
  transition: background-color 140ms ease, box-shadow 140ms ease;
}
.tz-avatar__edit:hover:not(:disabled) { background: var(--brand-primary-hover); }
.tz-avatar__edit:focus-visible { outline: 2px solid var(--brand-primary); outline-offset: 2px; }
.tz-avatar__edit:disabled { cursor: not-allowed; opacity: .5; }
.tz-avatar__edit span { width: 16px; height: 16px; background: var(--avatar-edit-icon-color); -webkit-mask: var(--avatar-camera-url) center / contain no-repeat; mask: var(--avatar-camera-url) center / contain no-repeat; }
.tz-avatar--40 .tz-avatar__edit { right: -5px; bottom: -5px; width: 20px; height: 20px; }
.tz-avatar--40 .tz-avatar__edit span, .tz-avatar--32 .tz-avatar__edit span { width: 12px; height: 12px; }
.tz-avatar--32 .tz-avatar__edit { right: -5px; bottom: -5px; width: 18px; height: 18px; }
.tz-avatar.is-disabled { opacity: .5; }
</style>
