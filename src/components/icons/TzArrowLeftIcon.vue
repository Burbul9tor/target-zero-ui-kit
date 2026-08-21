<script setup lang="ts">
import { computed } from 'vue'
import arrowLeftUrl from '../../assets/icons/ArrowLeft.svg'

const props = withDefaults(
  defineProps<{
    size?: number
    label?: string
  }>(),
  {
    size: 12,
    label: '',
  },
)

const iconStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  maskImage: `url(${arrowLeftUrl})`,
  WebkitMaskImage: `url(${arrowLeftUrl})`,
}))
</script>

<template>
  <span
    class="tz-arrow-left-icon"
    :style="iconStyle"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  />
</template>

<style scoped>
.tz-arrow-left-icon {
  display: block;
  flex: 0 0 auto;
  background-color: var(--icon-default);
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: contain;
  -webkit-mask-position: center;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: contain;
}
</style>
