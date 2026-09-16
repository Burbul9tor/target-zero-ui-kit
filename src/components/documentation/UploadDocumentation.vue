<script setup lang="ts">
import { Check } from '@lucide/vue'
import { ref } from 'vue'
import targetLogo from '../../assets/figma/target-zero-logo.png'
import TzUpload from '../forms/TzUpload.vue'
import type { UploadAspectRatio } from '../forms/TzUpload.vue'

const uploadedFile = ref<File | null>(null)
const uploadError = ref('')
const ratios: Array<{ value: UploadAspectRatio; label: string; usage: string; width: number }> = [
  { value: '1:1', label: 'Квадрат · 1:1', usage: 'Аватары, логотипы, карточки', width: 120 },
  { value: '4:3', label: 'Стандарт · 4:3', usage: 'Документы и фотографии', width: 160 },
  { value: '3:2', label: 'Фото · 3:2', usage: 'Фотографии с камер', width: 180 },
  { value: '16:9', label: 'Широкий · 16:9', usage: 'Обложки и медиа', width: 200 },
  { value: '3:4', label: 'Портрет · 3:4', usage: 'Фото сотрудников', width: 120 },
  { value: '9:16', label: 'Вертикальный · 9:16', usage: 'Мобильные материалы', width: 90 },
]

const api = [
  ['modelValue', 'File | null', 'Выбранный файл через v-model'],
  ['previewUrl', 'string', 'Готовое изображение с API или CDN'],
  ['aspectRatio', "'1:1' | '4:3' | '3:2' | '16:9' | '3:4' | '9:16'", 'Соотношение сторон области'],
  ['width', 'number | string', 'Ширина в px или CSS-значение'],
  ['accept', 'string', 'Разрешённые MIME-типы и расширения'],
  ['maxSizeMb', 'number', 'Максимальный размер файла'],
  ['objectFit', "'cover' | 'contain'", 'Обрезка изображения или вписывание целиком'],
  ['removable', 'boolean', 'Показывает удаление заполненного файла'],
  ['disabled', 'boolean', 'Отключает выбор, drag-and-drop и удаление'],
]
</script>

<template>
  <div class="upload-docs">
    <header class="page-header">
      <div><p class="eyebrow">COMPONENT · FORMS</p><h1>Upload</h1><p>Загрузка изображения нажатием или перетаскиванием. После выбора область показывает превью и действие удаления.</p></div>
      <span class="ready"><Check :size="14" /> Готово</span>
    </header>

    <section class="card">
      <header><h2>Состояния из макета</h2><p>Базовый размер — 100×100 px, радиус 12 px. Пустое состояние имеет пунктирную brand-рамку, заполненное — нейтральную сплошную.</p></header>
      <div class="state-row">
        <article><span>Default</span><TzUpload /></article>
        <article><span>Filled · contain</span><TzUpload :preview-url="targetLogo" object-fit="contain" /></article>
        <article><span>Without delete</span><TzUpload :preview-url="targetLogo" object-fit="contain" :removable="false" /></article>
        <article><span>Disabled</span><TzUpload disabled /></article>
      </div>
    </section>

    <section class="card">
      <header><h2>Интерактивный пример</h2><p>Поддерживает клик, клавиатуру и drag-and-drop. По умолчанию разрешены PNG, JPG, WebP и SVG до 5 МБ.</p></header>
      <div class="interactive-row">
        <TzUpload v-model="uploadedFile" aspect-ratio="16:9" :width="280" @error="uploadError = $event" @change="uploadError = ''" />
        <div><strong>{{ uploadedFile?.name || 'Файл не выбран' }}</strong><p>{{ uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} КБ` : 'Нажмите на область или перетащите изображение' }}</p><p v-if="uploadError" class="error">{{ uploadError }}</p></div>
      </div>
    </section>

    <section class="card">
      <header><h2>Соотношения сторон</h2><p>Размер задаётся шириной и пропорцией. Высота рассчитывается автоматически через CSS <code>aspect-ratio</code>.</p></header>
      <div class="ratio-grid">
        <article v-for="ratio in ratios" :key="ratio.value"><div><strong>{{ ratio.label }}</strong><span>{{ ratio.usage }}</span></div><TzUpload :aspect-ratio="ratio.value" :width="ratio.width" /></article>
      </div>
    </section>

    <section class="card guidance">
      <header><h2>Правила использования</h2></header>
      <div class="guidance-grid">
        <article><strong>1:1</strong><p>Для логотипов, аватаров и небольших изображений в справочниках.</p></article>
        <article><strong>4:3 и 3:2</strong><p>Для обычных фотографий, сканов и материалов проверок.</p></article>
        <article><strong>16:9</strong><p>Для обложек, баннеров и широких изображений в карточках.</p></article>
        <article><strong>3:4 и 9:16</strong><p>Для портретных фотографий и контента мобильной ориентации.</p></article>
      </div>
    </section>

    <section class="card">
      <header><h2>API</h2><p>Валидация выполняется до обновления <code>v-model</code>; ошибка возвращается событием <code>error</code>.</p></header>
      <div class="api"><div v-for="item in api" :key="item[0]"><code>{{ item[0] }}</code><code>{{ item[1] }}</code><span>{{ item[2] }}</span></div></div>
      <p class="api-note"><strong>Emits:</strong> <code>update:modelValue</code>, <code>change</code>, <code>remove</code>, <code>error</code>.</p>
    </section>
  </div>
</template>

<style scoped>
.upload-docs{display:grid;gap:var(--padding-spacing-24)}.page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--padding-spacing-24)}.eyebrow{margin:0 0 var(--padding-spacing-8);color:var(--brand-primary);font:var(--tz-text-label-small);letter-spacing:.08em}.page-header h1{margin:0 0 var(--padding-spacing-8);color:var(--text-default);font:var(--tz-text-heading-display)}.page-header p,.card header p{max-width:840px;margin:0;color:var(--text-muted);font:var(--tz-text-body-medium)}.ready{display:flex;padding:7px 10px;align-items:center;gap:var(--padding-spacing-6);color:var(--status-success-fg);border-radius:var(--radius-md);background:var(--status-success-bg);font:var(--tz-text-label-small);white-space:nowrap}.card{min-width:0;padding:var(--padding-spacing-24);border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-surface);box-shadow:0 10px 15px -3px var(--bg-shadow)}.card>header{margin-bottom:var(--padding-spacing-20)}.card h2{margin:0 0 var(--padding-spacing-4);color:var(--text-default);font:600 18px/24px var(--tz-font-family)}.state-row{display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--padding-spacing-32)}.state-row article{display:grid;gap:var(--padding-spacing-8)}.state-row article>span,.ratio-grid article span{color:var(--text-muted);font:var(--tz-text-label-small)}.interactive-row{display:flex;align-items:center;gap:var(--padding-spacing-24)}.interactive-row strong{color:var(--text-default);font:var(--tz-text-body-strong)}.interactive-row p{margin:var(--padding-spacing-4) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}.interactive-row .error{color:var(--status-error-fg)}.ratio-grid{display:grid;grid-template-columns:repeat(3,minmax(220px,1fr));gap:var(--padding-spacing-16)}.ratio-grid article{display:flex;min-height:230px;padding:var(--padding-spacing-16);flex-direction:column;align-items:flex-start;justify-content:space-between;gap:var(--padding-spacing-16);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.ratio-grid article>div{display:grid;gap:var(--padding-spacing-4)}.ratio-grid strong{color:var(--text-default);font:var(--tz-text-body-strong)}.guidance-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--padding-spacing-12)}.guidance-grid article{padding:var(--padding-spacing-16);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-page)}.guidance-grid strong{color:var(--brand-primary);font:var(--tz-text-body-strong)}.guidance-grid p{margin:var(--padding-spacing-6) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}code{color:var(--brand-primary);font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.api{overflow:hidden;border:1px solid var(--border-default);border-radius:var(--radius-md)}.api>div{display:grid;grid-template-columns:1fr 1.4fr 2.2fr;gap:var(--padding-spacing-12);padding:var(--padding-spacing-12);border-top:1px solid var(--border-default);font:var(--tz-text-body-small)}.api>div:first-child{border-top:0}.api-note{margin:var(--padding-spacing-12) 0 0;color:var(--text-muted);font:var(--tz-text-body-small)}@media(max-width:900px){.ratio-grid{grid-template-columns:repeat(2,minmax(200px,1fr))}}@media(max-width:640px){.page-header,.interactive-row{flex-direction:column;align-items:flex-start}.ratio-grid,.guidance-grid{grid-template-columns:1fr}.card{padding:var(--padding-spacing-16)}}
</style>
