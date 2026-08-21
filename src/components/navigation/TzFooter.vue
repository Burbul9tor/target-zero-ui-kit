<script setup lang="ts">
import { Bug, Moon, Sun } from '@lucide/vue'
import { useUiKitTheme } from '../../composables/useUiKitTheme'

const { dark, toggleTheme } = useUiKitTheme()
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

    <button
      class="tz-footer__theme"
      :class="{ 'is-dark': dark }"
      type="button"
      role="switch"
      aria-label="Switch color theme"
      :aria-checked="dark"
      @click="toggleTheme"
    >
      <span class="tz-footer__theme-thumb" aria-hidden="true" />
      <Moon class="tz-footer__theme-icon tz-footer__theme-icon--moon" :size="12" aria-hidden="true" />
      <Sun class="tz-footer__theme-icon tz-footer__theme-icon--sun" :size="12" aria-hidden="true" />
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
  width: 42px;
  height: 22px;
  padding: 0;
  color: var(--icon-default);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  background: var(--bg-track-off);
  cursor: pointer;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.tz-footer__theme:hover {
  border-color: var(--brand-primary);
  background: var(--brand-bg-hover);
}

.tz-footer__theme:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}

.tz-footer__theme-thumb {
  position: absolute;
  z-index: 1;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border: 1px solid var(--border-default);
  border-radius: 50%;
  background: var(--bg-surface);
  box-shadow: 0 1px 3px var(--bg-shadow);
  transition:
    transform 220ms cubic-bezier(.2, .8, .2, 1),
    background-color 180ms ease,
    border-color 180ms ease;
}

.tz-footer__theme.is-dark .tz-footer__theme-thumb {
  transform: translateX(20px);
}

.tz-footer__theme-icon {
  position: absolute;
  top: 4px;
  transition: opacity 140ms ease, transform 220ms cubic-bezier(.2, .8, .2, 1);
}

.tz-footer__theme-icon--moon {
  left: 4px;
  opacity: 0;
  transform: scale(.7) rotate(-25deg);
}

.tz-footer__theme-icon--sun {
  right: 4px;
}

.tz-footer__theme.is-dark .tz-footer__theme-icon--moon {
  opacity: 1;
  transform: scale(1) rotate(0);
}

.tz-footer__theme.is-dark .tz-footer__theme-icon--sun {
  opacity: 0;
  transform: scale(.7) rotate(25deg);
}

@media (prefers-reduced-motion: reduce) {
  .tz-footer__theme,
  .tz-footer__theme-thumb,
  .tz-footer__theme-icon {
    transition: none;
  }
}

@media (max-width: 760px) {
  .tz-footer__error {
    display: none;
  }
}
</style>
