<script setup lang="ts">
import lottie, { type AnimationItem } from 'lottie-web/build/player/lottie_light'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import blueAnimation from '../../assets/preloaders/target-zero-preloader-blue.json'
import brandAnimation from '../../assets/preloaders/target-zero-preloader-brand.json'

export type PreloaderVariant = 'blue' | 'brand'

const props = withDefaults(
  defineProps<{
    variant?: PreloaderVariant
    size?: number | string
    autoplay?: boolean
    loop?: boolean
    speed?: number
    label?: string
  }>(),
  {
    variant: 'brand',
    size: 96,
    autoplay: true,
    loop: true,
    speed: 1,
    label: 'Загрузка',
  },
)

const emit = defineEmits<{
  ready: []
  complete: []
  loopComplete: []
}>()

const container = ref<HTMLElement | null>(null)
let animation: AnimationItem | null = null

const preloaderStyle = computed(() => ({
  width: typeof props.size === 'number' ? `${props.size}px` : props.size,
}))

function createAnimation() {
  if (!container.value) return
  animation?.destroy()

  const source = props.variant === 'blue' ? blueAnimation : brandAnimation
  animation = lottie.loadAnimation({
    container: container.value,
    renderer: 'svg',
    loop: props.loop,
    autoplay: props.autoplay,
    animationData: structuredClone(source),
    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
  })
  animation.setSpeed(props.speed)
  animation.addEventListener('DOMLoaded', () => emit('ready'))
  animation.addEventListener('complete', () => emit('complete'))
  animation.addEventListener('loopComplete', () => emit('loopComplete'))
}

function play() {
  animation?.play()
}

function pause() {
  animation?.pause()
}

function stop() {
  animation?.stop()
}

function restart() {
  animation?.goToAndPlay(0, true)
}

defineExpose({ play, pause, stop, restart })

onMounted(createAnimation)
watch(() => [props.variant, props.autoplay, props.loop] as const, createAnimation)
watch(() => props.speed, (speed) => animation?.setSpeed(speed))
onBeforeUnmount(() => animation?.destroy())
</script>

<template>
  <div class="tz-preloader" :style="preloaderStyle" role="status" aria-live="polite" :aria-label="label">
    <div ref="container" class="tz-preloader__animation" aria-hidden="true" />
    <span class="tz-preloader__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.tz-preloader {
  display: inline-grid;
  aspect-ratio: 1300 / 1874;
  place-items: center;
}

.tz-preloader__animation {
  width: 100%;
  height: 100%;
}

.tz-preloader__animation :deep(svg) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

.tz-preloader__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
