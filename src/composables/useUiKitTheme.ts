import { computed, ref, watch } from 'vue'

export type UiKitTheme = 'light' | 'dark'

const storageKey = 'target-zero-ui-kit-theme'

function getInitialTheme(): UiKitTheme {
  if (typeof window === 'undefined') return 'light'

  try {
    const savedTheme = window.localStorage.getItem(storageKey)
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  } catch {
    // Storage may be unavailable in private browsing; system preference still works.
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<UiKitTheme>(getInitialTheme())

function applyTheme(value: UiKitTheme) {
  if (typeof document !== 'undefined') document.documentElement.dataset.theme = value

  try {
    window.localStorage.setItem(storageKey, value)
  } catch {
    // Theme remains active for the current page even when storage is unavailable.
  }
}

applyTheme(theme.value)
watch(theme, applyTheme)

const dark = computed({
  get: () => theme.value === 'dark',
  set: (value: boolean) => { theme.value = value ? 'dark' : 'light' },
})

export function useUiKitTheme() {
  function toggleTheme() {
    dark.value = !dark.value
  }

  return { theme, dark, toggleTheme }
}