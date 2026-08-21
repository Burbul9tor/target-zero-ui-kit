<script setup lang="ts">
import TzArrowLeftIcon from '../icons/TzArrowLeftIcon.vue'
</script>

<template>
  <section class="arrow-doc">
    <header>
      <div>
        <h2>Иконка ArrowLeft</h2>
        <p>Оригинальный SVG используется в одноуровневом варианте Breadcrumbs Primary.</p>
      </div>
      <code>ArrowLeft.svg</code>
    </header>

    <div class="arrow-doc__content">
      <div class="arrow-doc__preview">
        <TzArrowLeftIcon />
      </div>
      <dl>
        <div><dt>Размер</dt><dd>12 × 12px</dd></div>
        <div><dt>ViewBox</dt><dd>0 0 12 12</dd></div>
        <div><dt>Color token</dt><dd><i /> --icon-default</dd></div>
        <div><dt>Primitive</dt><dd>Gray-700 · #404040</dd></div>
        <div><dt>Формат</dt><dd>SVG</dd></div>
        <div><dt>Компонент</dt><dd>TzArrowLeftIcon</dd></div>
        <div><dt>Применение</dt><dd>Primary · 1 level</dd></div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.arrow-doc {
  padding: 24px;
  border: 1px solid var(--showcase-border);
  border-radius: 12px;
  background: var(--bg-surface);
  box-shadow: 0 10px 15px -3px var(--bg-shadow);
}

.arrow-doc header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.arrow-doc h2 {
  margin: 0 0 4px;
  color: var(--text-default);
  font: 600 18px/24px var(--tz-font-family);
}

.arrow-doc p {
  margin: 0;
  color: var(--text-muted);
  font: 400 14px/20px var(--tz-font-family);
}

.arrow-doc code {
  color: var(--brand-primary);
  font: 400 12px/16px ui-monospace, SFMono-Regular, Consolas, monospace;
}

.arrow-doc__content {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 20px;
}

.arrow-doc__preview {
  display: grid;
  place-items: center;
  min-height: 120px;
  border: 1px solid var(--showcase-border);
  border-radius: 8px;
  background: var(--showcase-canvas);
}

.arrow-doc__preview :deep(.tz-arrow-left-icon) {
  width: 12px;
  height: 12px;
}

.arrow-doc dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--showcase-border);
  border-radius: 8px;
  background: var(--showcase-border);
}

.arrow-doc dl div {
  padding: 12px;
  background: var(--bg-surface);
}

.arrow-doc dt {
  margin-bottom: 4px;
  color: var(--text-muted);
  font: 500 10px/14px var(--tz-font-family);
  text-transform: uppercase;
  letter-spacing: .06em;
}

.arrow-doc dd {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: var(--text-default);
  font: 400 12px/16px var(--tz-font-family);
}

.arrow-doc dd i {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: var(--icon-default);
}

@media (max-width: 620px) {
  .arrow-doc__content,
  .arrow-doc dl {
    grid-template-columns: 1fr;
  }
}
</style>


