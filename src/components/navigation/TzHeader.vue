<script setup lang="ts">
import { ChevronDown, PanelLeftOpen, UserRound } from '@lucide/vue'

defineEmits<{ toggleSidebar: [] }>()
</script>

<template>
  <header class="tz-header">
    <button class="tz-header__menu" type="button" aria-label="Переключить боковую панель" @click="$emit('toggleSidebar')">
      <PanelLeftOpen :size="20" :stroke-width="1.5" />
    </button>

    <div class="tz-header__logo-zone">
      <img src="../../assets/figma/target-zero-logo.png" alt="Target Zero" />
    </div>

    <div class="tz-header__profile-zone">
      <button class="tz-header__language" type="button">
        RU
        <ChevronDown :size="16" :stroke-width="1.5" />
      </button>

      <button class="tz-header__profile" type="button">
        <span class="tz-header__avatar"><UserRound :size="19" :stroke-width="1.5" /></span>
        <span class="tz-header__profile-copy">
          <strong>Нурбаев Арман Сариевич</strong>
          <small>Администратор системы</small>
        </span>
        <ChevronDown :size="16" :stroke-width="1.5" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.tz-header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 54px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
}

button {
  color: var(--text-default);
}

.tz-header__menu {
  display: grid;
  width: 56px;
  height: 100%;
  padding: 0;
  place-items: center;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.tz-header__menu:hover {
  background: var(--bg-row-hover);
}

.tz-header__logo-zone {
  display: flex;
  align-items: center;
  width: 110px;
  height: 100%;
  padding: 8px;
}

.tz-header__logo-zone img {
  display: block;
  width: 94px;
  height: 35px;
  object-fit: contain;
}

.tz-header__profile-zone {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex: 1;
  height: 100%;
  padding-left: 16px;
}

.tz-header__language,
.tz-header__profile {
  display: flex;
  align-items: center;
  border: 0;
  background: var(--bg-surface);
  cursor: pointer;
}

.tz-header__language {
  gap: 10px;
  min-width: 52px;
  margin-right: 4px;
  padding: 8px 4px;
  border: 1px solid var(--border-default);
  border-radius: var(--tz-radius-control);
  font: 400 14px/20px var(--tz-font-family);
}

.tz-header__profile {
  gap: 8px;
  height: 100%;
  padding: 4px 12px 4px 8px;
  border-left: 1px solid var(--border-default);
}

.tz-header__avatar {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  color: var(--brand-primary);
  border: 1px solid var(--border-default);
  border-radius: 6px;
}

.tz-header__profile-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 200px;
  gap: 2px;
  text-align: left;
}

.tz-header__profile-copy strong {
  overflow: hidden;
  width: 100%;
  font: 400 14px/16px var(--tz-font-family);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tz-header__profile-copy small {
  color: var(--text-muted);
  font: 400 12px/14px var(--tz-font-family);
}

@media (max-width: 760px) {
  .tz-header__profile-copy,
  .tz-header__language {
    display: none;
  }
}
</style>
