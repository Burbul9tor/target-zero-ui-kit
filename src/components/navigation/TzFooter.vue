<script setup lang="ts">
import { Bug, Moon, Sun } from '@lucide/vue'
import { ref } from 'vue'

const dark = ref(false)
</script>

<template>
  <footer class="tz-footer">
    <div class="tz-footer__brand">
      <img src="../../assets/figma/target-zero-mark.png" alt="" />
      <span>Target Zero</span>
      <i aria-hidden="true" />
      <span>Copyright © IKOD 2026</span>
    </div>

    <button class="tz-footer__error" type="button">
      <Bug :size="14" :stroke-width="1.5" />
      Сообщить об ошибке
    </button>

    <button class="tz-footer__theme" type="button" :aria-pressed="dark" @click="dark = !dark">
      <span :class="{ 'is-active': dark }" />
      <Moon v-if="dark" :size="12" />
      <Sun v-else :size="12" />
    </button>
  </footer>
</template>

<style scoped>
.tz-footer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 30px;
  padding: 6px 16px;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-default);
  color: var(--text-default);
  font: 500 10px/14px var(--tz-font-family);
  letter-spacing: 0.2px;
}

.tz-footer__brand,
.tz-footer__error {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tz-footer__brand img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.tz-footer__brand i {
  width: 3px;
  height: 3px;
  margin-inline: 2px;
  border-radius: 50%;
  background: currentColor;
}

.tz-footer__error {
  position: absolute;
  right: 64px;
  padding: 0;
  border: 0;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.tz-footer__theme {
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 2px;
  height: 18px;
  padding: 2px;
  border: 0;
  border-radius: 10px;
  background: var(--bg-track-off);
  cursor: pointer;
}

.tz-footer__theme span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--bg-surface);
  box-shadow: 0 1px 3px var(--bg-shadow);
}

.tz-footer__theme span.is-active {
  order: 2;
}

@media (max-width: 760px) {
  .tz-footer__error {
    display: none;
  }
}
</style>
