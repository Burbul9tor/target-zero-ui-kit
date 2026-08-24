<script setup lang="ts">
import { Check } from '@lucide/vue'
import { ref } from 'vue'
import avatar32 from '../../assets/avatar/avatar-32.png'
import avatar40 from '../../assets/avatar/avatar-40.png'
import avatar64 from '../../assets/avatar/avatar-64.png'
import TzAvatar, { type AvatarSize } from '../data-display/TzAvatar.vue'

const sizes: AvatarSize[] = [64, 40, 32]
const images: Record<AvatarSize, string> = { 64: avatar64, 40: avatar40, 32: avatar32 }
const selectedFile = ref('Файл не выбран')

function onAvatarChange(file: File) {
  selectedFile.value = file.name
}

const api = [
  ['size', '32 | 40 | 64', '64'],
  ['src', 'string', "''"],
  ['alt', 'string', "''"],
  ['editable', 'boolean', 'false'],
  ['disabled', 'boolean', 'false'],
  ['accept', 'string', 'image/png,image/jpeg,image/webp'],
  ['@change', '(file: File)', '—'],
  ['@error', '(event: Event)', '—'],
]

const tokens = [
  ['--avatar-background', '--bg-surface', 'Фон пустого аватара'],
  ['--avatar-border-color', '--border-default', 'Цвет границы'],
  ['--avatar-icon-color', '--brand-primary', 'Цвет иконки User'],
  ['--avatar-radius', '--radius-md', 'Скругление 8px'],
  ['--avatar-radius-small', '--radius-sm', 'Скругление малого пустого аватара'],
  ['--avatar-edit-background', '--brand-primary', 'Фон кнопки смены'],
  ['--avatar-edit-icon-color', '--text-button-fill', 'Цвет иконки Camera'],
  ['--avatar-edit-radius', '--radius-md', 'Скругление кнопки смены'],
]
</script>

<template>
  <div class="avatar-docs">
    <header class="avatar-docs__header">
      <div>
        <p class="avatar-docs__eyebrow">COMPONENT · DATA DISPLAY</p>
        <h1>Avatar</h1>
        <p>Аватар пользователя из Target Zero Design System. Поддерживает пустое состояние, изображение и смену фотографии.</p>
      </div>
      <span><Check :size="14" /> Реализовано</span>
    </header>

    <section class="avatar-card">
      <header>
        <h2>Размеры и состояния</h2>
        <p>Три размера из Figma: 64×64, 40×40 и 32×32px.</p>
      </header>
      <div class="avatar-matrix">
        <div class="avatar-matrix__head"><span>Размер</span><span>Не заполнено</span><span>Заполнено</span></div>
        <div v-for="size in sizes" :key="size" class="avatar-matrix__row">
          <code>{{ size }}×{{ size }}</code>
          <TzAvatar :size="size" :alt="`Пустой аватар ${size}px`" />
          <TzAvatar :size="size" :src="images[size]" :alt="`Заполненный аватар ${size}px`" />
        </div>
      </div>
    </section>

    <section class="avatar-card">
      <header>
        <h2>Смена аватара</h2>
        <p>Нажмите на кнопку Camera. После выбора файла превью обновляется сразу, наружу отправляется событие <code>@change</code>.</p>
      </header>
      <div class="editable-example">
        <TzAvatar :src="avatar64" alt="Редактируемый аватар" editable @change="onAvatarChange" />
        <div>
          <strong>Редактируемый Avatar · 64px</strong>
          <span>{{ selectedFile }}</span>
          <small>PNG, JPG или WebP. Иконка Camera используется из Icon Pack UI Kit.</small>
        </div>
      </div>
    </section>

    <section class="avatar-card">
      <header><h2>Токены</h2><p>Цвета и скругления не хардкодятся внутри компонента и наследуют текущую тему.</p></header>
      <div class="token-grid">
        <article v-for="token in tokens" :key="token[0]">
          <code>{{ token[0] }}</code>
          <strong>var({{ token[1] }})</strong>
          <span>{{ token[2] }}</span>
        </article>
      </div>
    </section>

    <section class="avatar-card">
      <header><h2>API</h2><p>Контракт Vue-компонента и поведение выбора изображения.</p></header>
      <div class="api-table">
        <div class="api-table__row api-table__head"><span>Имя</span><span>Тип</span><span>По умолчанию</span></div>
        <div v-for="row in api" :key="row[0]" class="api-table__row"><code>{{ row[0] }}</code><span>{{ row[1] }}</span><span>{{ row[2] }}</span></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.avatar-docs { display: grid; gap: var(--padding-spacing-24); }
.avatar-docs__header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--padding-spacing-32); }
.avatar-docs__eyebrow { margin: 0 0 var(--padding-spacing-8); color: var(--brand-primary); font: var(--tz-text-label-small); letter-spacing: .08em; }
.avatar-docs__header h1 { margin: 0 0 var(--padding-spacing-8); color: var(--text-default); font: var(--tz-text-heading-display); }
.avatar-docs__header p, .avatar-card header p { margin: 0; color: var(--text-muted); font: var(--tz-text-body-medium); }
.avatar-docs__header > span { display: flex; align-items: center; gap: var(--padding-spacing-6); padding: 7px 10px; color: var(--status-success-fg); border-radius: var(--radius-md); background: var(--status-success-bg); font: var(--tz-text-label-small); white-space: nowrap; }
.avatar-card { padding: var(--padding-spacing-24); border: 1px solid var(--border-default); border-radius: var(--radius-lg); background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.avatar-card > header { margin-bottom: var(--padding-spacing-20); }
.avatar-card h2 { margin: 0 0 var(--padding-spacing-4); color: var(--text-default); font: var(--tz-text-heading-h2); }
.avatar-matrix { overflow: hidden; border: 1px solid var(--border-default); border-radius: var(--radius-md); }
.avatar-matrix__head, .avatar-matrix__row { display: grid; grid-template-columns: 120px repeat(2, minmax(160px, 1fr)); align-items: center; min-height: 96px; border-top: 1px solid var(--border-default); }
.avatar-matrix__head { min-height: 44px; border-top: 0; background: var(--bg-page); }
.avatar-matrix__head > *, .avatar-matrix__row > * { justify-self: center; }
.avatar-matrix__head span { color: var(--text-muted); font: var(--tz-text-table-header); text-transform: uppercase; }
.avatar-matrix__row code { color: var(--brand-primary); font: var(--tz-text-label-medium); }
.editable-example { display: flex; min-height: 120px; align-items: center; gap: var(--padding-spacing-24); padding: var(--padding-spacing-24); border-radius: var(--radius-md); background: var(--bg-page); }
.editable-example > div { display: grid; gap: var(--padding-spacing-4); }
.editable-example strong { color: var(--text-default); font: var(--tz-text-body-strong); }
.editable-example span { color: var(--brand-primary); font: var(--tz-text-body-small); }
.editable-example small { color: var(--text-muted); font: var(--tz-text-caption-regular); }
.token-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--padding-spacing-12); }
.token-grid article { display: grid; gap: var(--padding-spacing-4); padding: var(--padding-spacing-12); border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--bg-page); }
.token-grid code { color: var(--brand-primary); font: var(--tz-text-label-medium); }
.token-grid strong { color: var(--text-default); font: var(--tz-text-body-small); }
.token-grid span { color: var(--text-muted); font: var(--tz-text-caption-regular); }
.api-table { overflow: hidden; border: 1px solid var(--border-default); border-radius: var(--radius-md); }
.api-table__row { display: grid; grid-template-columns: .7fr 1.4fr 1fr; border-top: 1px solid var(--border-default); }
.api-table__row:first-child { border-top: 0; }
.api-table__row > * { padding: 10px 12px; color: var(--text-muted); font: var(--tz-text-body-small); }
.api-table__row > * + * { border-left: 1px solid var(--border-default); }
.api-table__head { background: var(--bg-page); }
.api-table__head > * { color: var(--text-default); font: var(--tz-text-table-header); }
.api-table code { color: var(--brand-primary); }
@media (max-width: 820px) { .token-grid { grid-template-columns: 1fr; } .avatar-matrix { overflow-x: auto; } .avatar-matrix__head, .avatar-matrix__row { min-width: 620px; } }
@media (max-width: 620px) { .avatar-docs__header { flex-direction: column; } .avatar-card { padding: var(--padding-spacing-16); } }
</style>
