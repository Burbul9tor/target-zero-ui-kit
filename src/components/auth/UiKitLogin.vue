<script setup lang="ts">
import { AlertCircle, LockKeyhole, UserRound } from '@lucide/vue'
import { ref } from 'vue'
import TzButton from '../actions/TzButton.vue'

const emit = defineEmits<{ authenticated: [] }>()
const login = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

function submit() {
  error.value = ''
  submitting.value = true

  window.setTimeout(() => {
    submitting.value = false
    if (login.value === 'Admin' && password.value === 'Admin?') {
      emit('authenticated')
      return
    }
    error.value = 'Неверный логин или пароль'
  }, 300)
}
</script>

<template>
  <main class="login-page">
    <form class="login-card" @submit.prevent="submit">
      <header>
        <img src="../../assets/figma/target-zero-logo.png" alt="Target Zero" />
        <p>DESIGN SYSTEM</p>
        <h1>Вход в UI Kit</h1>
        <span>Авторизуйтесь для визуальной проверки компонентов.</span>
      </header>

      <label>
        <span>Логин</span>
        <span class="field" :class="{ 'is-error': error }">
          <UserRound :size="16" aria-hidden="true" />
          <input v-model="login" name="username" autocomplete="username" autofocus placeholder="Введите логин" />
        </span>
      </label>

      <label>
        <span>Пароль</span>
        <span class="field" :class="{ 'is-error': error }">
          <LockKeyhole :size="16" aria-hidden="true" />
          <input v-model="password" name="password" type="password" autocomplete="current-password" placeholder="Введите пароль" />
        </span>
      </label>

      <p v-if="error" class="error" role="alert"><AlertCircle :size="16" /> {{ error }}</p>
      <TzButton type="submit" expanded :loading="submitting" label="Войти" />
      <small>Демонстрационная авторизация · Target Zero UI Kit</small>
    </form>
  </main>
</template>

<style scoped>
.login-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  min-height: 100dvh;
  padding: var(--padding-spacing-24);
  place-items: center;
  color: var(--text-default);
  background:
    radial-gradient(circle at 20% 10%, var(--brand-bg-active), transparent 34%),
    var(--bg-page);
  font-family: var(--tz-font-family);
}

.login-card {
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
  max-width: 400px;
  gap: var(--padding-spacing-16);
  padding: var(--padding-spacing-32);
  align-self: center;
  justify-self: center;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  background: var(--bg-surface);
  box-shadow: 0 20px 40px var(--bg-shadow);
}

.login-card > * {
  grid-column: 1;
  width: 100%;
  min-width: 0;
}

.login-card header { margin-bottom: var(--padding-spacing-8); text-align: center; }
.login-card header img { width: 132px; height: 48px; margin-bottom: var(--padding-spacing-16); object-fit: contain; }
.login-card header p { margin: 0 0 var(--padding-spacing-4); color: var(--brand-primary); font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.login-card header h1 { margin: 0 0 var(--padding-spacing-8); font: 700 28px/36px var(--tz-font-family); }
.login-card header span { color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.login-card label { display: grid; gap: var(--padding-spacing-4); font: 400 12px/16px var(--tz-font-family); }
.field { display: flex; height: 44px; align-items: center; gap: var(--padding-spacing-8); padding: 0 var(--padding-spacing-12); color: var(--icon-default); border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--bg-surface); transition: border-color 140ms ease, box-shadow 140ms ease; }
.field:focus-within { border-color: var(--brand-primary); box-shadow: 0 0 0 2px var(--effect-shadow); }
.field.is-error { border-color: var(--status-error-fg); }
.field input { min-width: 0; flex: 1; padding: 0; color: var(--text-default); border: 0; outline: 0; background: transparent; font: 400 14px/20px var(--tz-font-family); }
.field input::placeholder { color: var(--text-muted); }
.error { display: flex; align-items: center; gap: var(--padding-spacing-6); margin: calc(var(--padding-spacing-8) * -1) 0 0; color: var(--status-error-fg); font: 400 12px/16px var(--tz-font-family); }
.login-card > small { color: var(--text-muted); font: 400 10px/14px var(--tz-font-family); text-align: center; }

@media (max-width: 480px) {
  .login-page { padding: var(--padding-spacing-16); }
  .login-card { padding: var(--padding-spacing-24); }
}
</style>
