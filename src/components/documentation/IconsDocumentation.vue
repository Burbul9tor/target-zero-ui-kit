<script setup lang="ts">
import { Check, Download, Search } from '@lucide/vue'
import { computed, ref } from 'vue'
import icon000 from '../../assets/icons/path/activity--1-2331.svg?no-inline'
import icon001 from '../../assets/icons/path/award--1-2335.svg?no-inline'
import icon002 from '../../assets/icons/path/barchart3--1-2340.svg?no-inline'
import icon003 from '../../assets/icons/path/bookopen--1-2347.svg?no-inline'
import icon004 from '../../assets/icons/path/bookopencheck--1-2352.svg?no-inline'
import icon005 from '../../assets/icons/path/briefcasebusiness--1-2358.svg?no-inline'
import icon006 from '../../assets/icons/path/calculator--1-2365.svg?no-inline'
import icon007 from '../../assets/icons/path/calendarcheck2--1-2378.svg?no-inline'
import icon008 from '../../assets/icons/path/calendarclock--1-2386.svg?no-inline'
import icon009 from '../../assets/icons/path/calendardays--1-2395.svg?no-inline'
import icon010 from '../../assets/icons/path/chevrondown--1-2408.svg?no-inline'
import icon011 from '../../assets/icons/path/chevronleft--474-24096.svg?no-inline'
import icon012 from '../../assets/icons/path/chevronright--1-2412.svg?no-inline'
import icon013 from '../../assets/icons/path/chevronup--1-2416.svg?no-inline'
import icon014 from '../../assets/icons/path/circlehelp--1-2424.svg?no-inline'
import icon015 from '../../assets/icons/path/clipboardcheck--1-2430.svg?no-inline'
import icon016 from '../../assets/icons/path/clipboardlist--1-2436.svg?no-inline'
import icon017 from '../../assets/icons/path/coins--1-2445.svg?no-inline'
import icon018 from '../../assets/icons/path/factory--1-2452.svg?no-inline'
import icon019 from '../../assets/icons/path/filespreadsheet--1-2459.svg?no-inline'
import icon020 from '../../assets/icons/path/filetext--1-2468.svg?no-inline'
import icon021 from '../../assets/icons/path/filewarning--1-2476.svg?no-inline'
import icon022 from '../../assets/icons/path/foldercheck--1-2482.svg?no-inline'
import icon023 from '../../assets/icons/path/foldercog--1-2487.svg?no-inline'
import icon024 from '../../assets/icons/path/glasses--1-2500.svg?no-inline'
import icon025 from '../../assets/icons/path/handshake--1-2508.svg?no-inline'
import icon026 from '../../assets/icons/path/hardhat--1-2516.svg?no-inline'
import icon027 from '../../assets/icons/path/keyround--1-2523.svg?no-inline'
import icon028 from '../../assets/icons/path/layoutdashboard--1-2529.svg?no-inline'
import icon029 from '../../assets/icons/path/layoutgrid--1-2536.svg?no-inline'
import icon030 from '../../assets/icons/path/leaf--1-2543.svg?no-inline'
import icon031 from '../../assets/icons/path/listchecks--1-2548.svg?no-inline'
import icon032 from '../../assets/icons/path/mail--1-2556.svg?no-inline'
import icon033 from '../../assets/icons/path/mappin--1-2561.svg?no-inline'
import icon034 from '../../assets/icons/path/network--1-2566.svg?no-inline'
import icon035 from '../../assets/icons/path/newspaper--1-2574.svg?no-inline'
import icon036 from '../../assets/icons/path/packagecheck--1-2581.svg?no-inline'
import icon037 from '../../assets/icons/path/packagex--1-2589.svg?no-inline'
import icon038 from '../../assets/icons/path/palette--1-2598.svg?no-inline'
import icon039 from '../../assets/icons/path/pin--1-2610.svg?no-inline'
import icon040 from '../../assets/icons/path/plugzap--1-2615.svg?no-inline'
import icon041 from '../../assets/icons/path/radiotower--1-2623.svg?no-inline'
import icon042 from '../../assets/icons/path/recycle--1-2633.svg?no-inline'
import icon043 from '../../assets/icons/path/scale--1-2642.svg?no-inline'
import icon044 from '../../assets/icons/path/send--1-2650.svg?no-inline'
import icon045 from '../../assets/icons/path/settings--1-2655.svg?no-inline'
import icon046 from '../../assets/icons/path/shield--1-2660.svg?no-inline'
import icon047 from '../../assets/icons/path/shieldcheck--1-2664.svg?no-inline'
import icon048 from '../../assets/icons/path/siren--1-2669.svg?no-inline'
import icon049 from '../../assets/icons/path/slidershorizontal--1-2680.svg?no-inline'
import icon050 from '../../assets/icons/path/smartphone--1-2692.svg?no-inline'
import icon051 from '../../assets/icons/path/stethoscope--1-2697.svg?no-inline'
import icon052 from '../../assets/icons/path/tags--1-2705.svg?no-inline'
import icon053 from '../../assets/icons/path/ticketcheck--1-2712.svg?no-inline'
import icon054 from '../../assets/icons/path/truck--1-2717.svg?no-inline'
import icon055 from '../../assets/icons/path/usercog--1-2725.svg?no-inline'
import icon056 from '../../assets/icons/path/users--1-2739.svg?no-inline'
import icon057 from '../../assets/icons/path/wrench--1-2746.svg?no-inline'
import icon058 from '../../assets/icons/path/zap--1-2750.svg?no-inline'
import icon059 from '../../assets/icons/path/book--1-2754.svg?no-inline'
import icon060 from '../../assets/icons/path/user--1-2758.svg?no-inline'
import icon061 from '../../assets/icons/path/messagesquareshare--1-2762.svg?no-inline'
import icon062 from '../../assets/icons/path/pek--1-2766.svg?no-inline'
import icon063 from '../../assets/icons/path/container--1-2773.svg?no-inline'
import icon064 from '../../assets/icons/path/chartpie--1-2777.svg?no-inline'
import icon065 from '../../assets/icons/path/pencil--1-2781.svg?no-inline'
import icon066 from '../../assets/icons/path/close--1-2785.svg?no-inline'
import icon067 from '../../assets/icons/path/wind--1-2789.svg?no-inline'
import icon068 from '../../assets/icons/path/waveshorizontal--1-2793.svg?no-inline'
import icon069 from '../../assets/icons/path/camera--1-2797.svg?no-inline'
import icon070 from '../../assets/icons/path/arrowupright--1-2801.svg?no-inline'
import icon071 from '../../assets/icons/path/gripvertical--1-2805.svg?no-inline'
import icon072 from '../../assets/icons/path/cloudupload--1-2809.svg?no-inline'
import icon073 from '../../assets/icons/path/fileuser--1-2813.svg?no-inline'
import icon074 from '../../assets/icons/path/arrowleft--1-2817.svg?no-inline'
import icon075 from '../../assets/icons/path/search--1-2821.svg?no-inline'
import icon076 from '../../assets/icons/path/menu--1-2825.svg?no-inline'
import icon077 from '../../assets/icons/path/circlecheck--1-2829.svg?no-inline'
import icon078 from '../../assets/icons/path/camera--1-2833.svg?no-inline'
import icon079 from '../../assets/icons/path/arrowuptoline--62-23116.svg?no-inline'
import icon080 from '../../assets/icons/path/check--62-23117.svg?no-inline'
import icon081 from '../../assets/icons/path/frame--62-23126.svg?no-inline'
import icon082 from '../../assets/icons/path/circlex--89-4303.svg?no-inline'
import icon083 from '../../assets/icons/path/sun--182-3183.svg?no-inline'
import icon084 from '../../assets/icons/path/moon--182-3181.svg?no-inline'
import icon085 from '../../assets/icons/path/panel-left-close--182-3998.svg?no-inline'
import icon086 from '../../assets/icons/path/panel-left-open--182-4004.svg?no-inline'
import icon087 from '../../assets/icons/path/minus--240-3890.svg?no-inline'
import icon088 from '../../assets/icons/path/plus--455-79.svg?no-inline'
import icon089 from '../../assets/icons/path/download--374-7947.svg?no-inline'
import icon090 from '../../assets/icons/path/fill--396-7839.svg?no-inline'
import icon091 from '../../assets/icons/path/italic--396-7884.svg?no-inline'
import icon092 from '../../assets/icons/path/underline--396-7828.svg?no-inline'
import icon093 from '../../assets/icons/path/bold--396-7843.svg?no-inline'
import icon094 from '../../assets/icons/path/bullet-list--396-7852.svg?no-inline'
import icon095 from '../../assets/icons/path/bullet-nimber--396-7867.svg?no-inline'
import icon096 from '../../assets/icons/path/frame--424-30253.svg?no-inline'
import icon097 from '../../assets/icons/path/info--435-226.svg?no-inline'
import icon098 from '../../assets/icons/path/filter--444-23856.svg?no-inline'
import icon099 from '../../assets/icons/path/loader--463-562.svg?no-inline'
import icon100 from '../../assets/icons/path/external-link--468-23878.svg?no-inline'
import icon101 from '../../assets/icons/path/arrow-down-up--470-23932.svg?no-inline'
import icon102 from '../../assets/icons/path/arrow-down-wide-narrow--470-23931.svg?no-inline'
import icon103 from '../../assets/icons/path/arrow-up-wide-narrow--470-23930.svg?no-inline'
import icon104 from '../../assets/icons/path/arrow-left--474-25975.svg?no-inline'
import icon105 from '../../assets/icons/path/arrow-right--474-25976.svg?no-inline'
import icon106 from '../../assets/icons/path/arrow-right-to-line--474-25978.svg?no-inline'
import icon107 from '../../assets/icons/path/arrow-left-to-line--474-25977.svg?no-inline'
import icon108 from '../../assets/icons/path/trash--493-24768.svg?no-inline'
import icon109 from '../../assets/icons/path/inbox--505-24793.svg?no-inline'
import icon110 from '../../assets/icons/path/lock--533-272.svg?no-inline'
import TzSearch from '../forms/TzSearch.vue'

type IconEntry = {
  id: string
  name: string
  asset: string
}

const icons: IconEntry[] = [
  { id: "1:2331", name: "Activity", asset: icon000 },
  { id: "1:2335", name: "Award", asset: icon001 },
  { id: "1:2340", name: "BarChart3", asset: icon002 },
  { id: "1:2347", name: "BookOpen", asset: icon003 },
  { id: "1:2352", name: "BookOpenCheck", asset: icon004 },
  { id: "1:2358", name: "BriefcaseBusiness", asset: icon005 },
  { id: "1:2365", name: "Calculator", asset: icon006 },
  { id: "1:2378", name: "CalendarCheck2", asset: icon007 },
  { id: "1:2386", name: "CalendarClock", asset: icon008 },
  { id: "1:2395", name: "CalendarDays", asset: icon009 },
  { id: "1:2408", name: "ChevronDown", asset: icon010 },
  { id: "474:24096", name: "Property 1=ChevronLeft", asset: icon011 },
  { id: "1:2412", name: "Property 1=ChevronRight", asset: icon012 },
  { id: "1:2416", name: "ChevronUp", asset: icon013 },
  { id: "1:2424", name: "CircleHelp", asset: icon014 },
  { id: "1:2430", name: "ClipboardCheck", asset: icon015 },
  { id: "1:2436", name: "ClipboardList", asset: icon016 },
  { id: "1:2445", name: "Coins", asset: icon017 },
  { id: "1:2452", name: "Factory", asset: icon018 },
  { id: "1:2459", name: "FileSpreadsheet", asset: icon019 },
  { id: "1:2468", name: "FileText", asset: icon020 },
  { id: "1:2476", name: "FileWarning", asset: icon021 },
  { id: "1:2482", name: "FolderCheck", asset: icon022 },
  { id: "1:2487", name: "FolderCog", asset: icon023 },
  { id: "1:2500", name: "Glasses", asset: icon024 },
  { id: "1:2508", name: "Handshake", asset: icon025 },
  { id: "1:2516", name: "HardHat", asset: icon026 },
  { id: "1:2523", name: "KeyRound", asset: icon027 },
  { id: "1:2529", name: "LayoutDashboard", asset: icon028 },
  { id: "1:2536", name: "LayoutGrid", asset: icon029 },
  { id: "1:2543", name: "Leaf", asset: icon030 },
  { id: "1:2548", name: "ListChecks", asset: icon031 },
  { id: "1:2556", name: "Mail", asset: icon032 },
  { id: "1:2561", name: "MapPin", asset: icon033 },
  { id: "1:2566", name: "Network", asset: icon034 },
  { id: "1:2574", name: "Newspaper", asset: icon035 },
  { id: "1:2581", name: "PackageCheck", asset: icon036 },
  { id: "1:2589", name: "PackageX", asset: icon037 },
  { id: "1:2598", name: "Palette", asset: icon038 },
  { id: "1:2610", name: "Pin", asset: icon039 },
  { id: "1:2615", name: "PlugZap", asset: icon040 },
  { id: "1:2623", name: "RadioTower", asset: icon041 },
  { id: "1:2633", name: "Recycle", asset: icon042 },
  { id: "1:2642", name: "Scale", asset: icon043 },
  { id: "1:2650", name: "Send", asset: icon044 },
  { id: "1:2655", name: "Settings", asset: icon045 },
  { id: "1:2660", name: "Shield", asset: icon046 },
  { id: "1:2664", name: "ShieldCheck", asset: icon047 },
  { id: "1:2669", name: "Siren", asset: icon048 },
  { id: "1:2680", name: "SlidersHorizontal", asset: icon049 },
  { id: "1:2692", name: "Smartphone", asset: icon050 },
  { id: "1:2697", name: "Stethoscope", asset: icon051 },
  { id: "1:2705", name: "Tags", asset: icon052 },
  { id: "1:2712", name: "TicketCheck", asset: icon053 },
  { id: "1:2717", name: "Truck", asset: icon054 },
  { id: "1:2725", name: "UserCog", asset: icon055 },
  { id: "1:2739", name: "Users", asset: icon056 },
  { id: "1:2746", name: "Wrench", asset: icon057 },
  { id: "1:2750", name: "Zap", asset: icon058 },
  { id: "1:2754", name: "Book", asset: icon059 },
  { id: "1:2758", name: "User", asset: icon060 },
  { id: "1:2762", name: "MessageSquareShare", asset: icon061 },
  { id: "1:2766", name: "PEK", asset: icon062 },
  { id: "1:2773", name: "Container", asset: icon063 },
  { id: "1:2777", name: "ChartPie", asset: icon064 },
  { id: "1:2781", name: "Pencil", asset: icon065 },
  { id: "1:2785", name: "Close", asset: icon066 },
  { id: "1:2789", name: "Wind", asset: icon067 },
  { id: "1:2793", name: "WavesHorizontal", asset: icon068 },
  { id: "1:2797", name: "Camera", asset: icon069 },
  { id: "1:2801", name: "ArrowUpRight", asset: icon070 },
  { id: "1:2805", name: "GripVertical", asset: icon071 },
  { id: "1:2809", name: "CloudUpload", asset: icon072 },
  { id: "1:2813", name: "FileUser", asset: icon073 },
  { id: "1:2817", name: "ArrowLeft", asset: icon074 },
  { id: "1:2821", name: "Search", asset: icon075 },
  { id: "1:2825", name: "Menu", asset: icon076 },
  { id: "1:2829", name: "CircleCheck", asset: icon077 },
  { id: "1:2833", name: "Camera", asset: icon078 },
  { id: "62:23116", name: "ArrowUpToLine", asset: icon079 },
  { id: "62:23117", name: "Check", asset: icon080 },
  { id: "62:23126", name: "Frame", asset: icon081 },
  { id: "89:4303", name: "CircleX", asset: icon082 },
  { id: "182:3183", name: "sun", asset: icon083 },
  { id: "182:3181", name: "moon", asset: icon084 },
  { id: "182:3998", name: "panel-left-close", asset: icon085 },
  { id: "182:4004", name: "panel-left-open", asset: icon086 },
  { id: "240:3890", name: "minus", asset: icon087 },
  { id: "455:79", name: "Plus", asset: icon088 },
  { id: "374:7947", name: "download", asset: icon089 },
  { id: "396:7839", name: "Fill", asset: icon090 },
  { id: "396:7884", name: "Italic", asset: icon091 },
  { id: "396:7828", name: "Underline", asset: icon092 },
  { id: "396:7843", name: "Bold", asset: icon093 },
  { id: "396:7852", name: "Bullet List", asset: icon094 },
  { id: "396:7867", name: "Bullet nimber", asset: icon095 },
  { id: "424:30253", name: "Frame", asset: icon096 },
  { id: "435:226", name: "Info", asset: icon097 },
  { id: "444:23856", name: "filter", asset: icon098 },
  { id: "463:562", name: "Loader", asset: icon099 },
  { id: "468:23878", name: "external-link", asset: icon100 },
  { id: "470:23932", name: "Property 1=arrow-down-up", asset: icon101 },
  { id: "470:23931", name: "Property 1=arrow-down-wide-narrow", asset: icon102 },
  { id: "470:23930", name: "Property 1=arrow-up-wide-narrow", asset: icon103 },
  { id: "474:25975", name: "arrow-left", asset: icon104 },
  { id: "474:25976", name: "arrow-right", asset: icon105 },
  { id: "474:25978", name: "arrow-right-to-line", asset: icon106 },
  { id: "474:25977", name: "arrow-left-to-line", asset: icon107 },
  { id: "493:24768", name: "trash", asset: icon108 },
  { id: "505:24793", name: "inbox", asset: icon109 },
  { id: "533:272", name: "Lock", asset: icon110 },
]

const query = ref('')
const copied = ref('')
const downloaded = ref('')
const filteredIcons = computed(() => {
  const value = query.value.trim().toLocaleLowerCase()
  return value ? icons.filter(icon => icon.name.toLocaleLowerCase().includes(value)) : icons
})

async function copyName(name: string) {
  await navigator.clipboard?.writeText(name)
  copied.value = name
  window.setTimeout(() => { if (copied.value === name) copied.value = '' }, 1200)
}

function fileName(name: string) {
  const slug = name.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'icon'
  return `${slug}.svg`
}

function triggerDownload(data: Blob, name: string) {
  const url = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

async function downloadIcon(item: IconEntry) {
  const response = await fetch(item.asset)
  triggerDownload(await response.blob(), fileName(item.name))
  downloaded.value = item.id
  window.setTimeout(() => { if (downloaded.value === item.id) downloaded.value = '' }, 1200)
}
</script>

<template>
  <div class="icons-docs">
    <header class="icons-header">
      <div><p>FOUNDATIONS · ICONS</p><h1>Icons</h1><span>Полный набор из Figma node 1:2326. Все иконки экспортированы как локальные SVG path после Outline Stroke и Flatten.</span></div>
      <strong>{{ icons.length }} иконок</strong>
    </header>

    <section class="icons-card">
      <header>
        <div><h2>Icon pack</h2><p>Размер в макете — 24×24px. Нажмите на карточку, чтобы скопировать имя.</p></div>
        <TzSearch v-model="query" class="icons-search" placeholder="Найти иконку" label="Поиск иконки" />
      </header>

      <div v-if="filteredIcons.length" class="icon-grid">
        <article v-for="item in filteredIcons" :key="item.id" class="icon-item">
          <button type="button" class="icon-copy" :aria-label="`Copy ${item.name}`" @click="copyName(item.name)">
            <span class="icon-preview">
              <span class="path-icon" :style="{ '--icon-url': `url('${item.asset}')` }" aria-hidden="true" />
            </span>
            <span>{{ item.name }}</span>
            <small>Path · Target Zero</small>
          </button>
          <button type="button" class="icon-download" :aria-label="`Download ${item.name} as SVG`" :title="`Download ${item.name}.svg`" @click="downloadIcon(item)">
            <Check v-if="downloaded === item.id" :size="14" />
            <Download v-else :size="14" />
          </button>
          <b v-if="copied === item.name">Copied</b>
        </article>
      </div>
      <div v-else class="icons-empty"><Search :size="24" /><strong>Ничего не найдено</strong><span>Попробуйте изменить запрос.</span></div>
    </section>

    <section class="icons-card icon-rules">
      <header><div><h2>Использование</h2><p>Общие параметры icon pack.</p></div></header>
      <div>
        <article><strong>Размер</strong><p>Базовый размер — 24×24px. В компонентах допускаются 16px и 20px.</p></article>
        <article><strong>Цвет</strong><p>По умолчанию используется <code>--icon-default</code>, состояния используют семантические токены Colors.</p></article>
        <article><strong>Path</strong><p>Контуры преобразованы через Outline Stroke и Flatten. Каждая иконка хранится как SVG ровно с одним составным path и без stroke.</p></article>
        <article><strong>Источник</strong><p>Target Zero Design System, Figma node 1:2326. Локальные SVG совпадают с компонентами в макете.</p></article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.icons-docs { display: grid; gap: 24px; }
.icons-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; }
.icons-header p { margin: 0 0 8px; color: var(--brand-primary); font: 500 10px/14px var(--tz-font-family); letter-spacing: .08em; }
.icons-header h1 { margin: 0 0 8px; color: var(--text-default); font: 700 32px/40px var(--tz-font-family); }
.icons-header span { color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.icons-header > strong { padding: 7px 10px; color: var(--status-info-fg); border-radius: 8px; background: var(--status-info-bg); font: 500 11px/16px var(--tz-font-family); white-space: nowrap; }
.icons-card { min-width: 0; padding: 24px; border: 1px solid var(--border-default); border-radius: 12px; background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
.icons-card > header { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
.icons-card h2 { margin: 0 0 4px; color: var(--text-default); font: 600 18px/24px var(--tz-font-family); }
.icons-card header p { margin: 0; color: var(--text-muted); font: 400 14px/20px var(--tz-font-family); }
.icons-search { width: min(320px, 100%); }
.icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: 8px; }
.icon-item { position: relative; display: grid; min-width: 0; min-height: 100px; color: var(--icon-default); border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--bg-surface); transition: border-color 140ms ease, background-color 140ms ease; }
.icon-item:hover { border-color: var(--brand-primary); background: var(--brand-bg-hover); }
.icon-copy { display: flex; min-width: 0; min-height: 98px; padding: var(--padding-spacing-12) var(--padding-spacing-8); flex-direction: column; align-items: center; justify-content: center; gap: var(--padding-spacing-4); color: inherit; border: 0; border-radius: inherit; background: transparent; cursor: pointer; }
.icon-download { position: absolute; top: var(--padding-spacing-6); right: var(--padding-spacing-6); display: grid; width: 26px; height: 26px; padding: 0; place-items: center; color: var(--brand-primary); border: 1px solid var(--border-default); border-radius: var(--radius-sm); background: var(--bg-surface); cursor: pointer; transition: background-color 140ms ease, border-color 140ms ease; }
.icon-download:hover { border-color: var(--brand-primary); background: var(--brand-bg-active); }
.icon-copy:focus-visible, .icon-download:focus-visible { outline: 2px solid var(--brand-primary); outline-offset: 2px; }
.icon-preview { display: flex; min-height: 24px; align-items: center; justify-content: center; gap: 4px; }
.path-icon { display: block; width: 24px; height: 24px; color: inherit; background: currentColor; -webkit-mask: var(--icon-url) center / contain no-repeat; mask: var(--icon-url) center / contain no-repeat; }
.icon-copy > span:nth-child(2) { overflow: hidden; max-width: 100%; color: var(--text-default); font: 400 10px/14px var(--tz-font-family); text-overflow: ellipsis; white-space: nowrap; }
.icon-item small { color: var(--text-muted); font: 400 9px/13px var(--tz-font-family); }
.icon-item b { position: absolute; right: 4px; bottom: 4px; left: 4px; padding: 3px; color: var(--text-button-fill); border-radius: 4px; background: var(--brand-primary); font: 500 9px/12px var(--tz-font-family); pointer-events: none; }
.icons-empty { display: grid; min-height: 220px; place-items: center; align-content: center; gap: 6px; color: var(--text-muted); }
.icons-empty strong { color: var(--text-default); font: 500 14px/20px var(--tz-font-family); }
.icons-empty span { font: 400 12px/16px var(--tz-font-family); }
.icon-rules > div { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.icon-rules article { padding: 16px; border: 1px solid var(--border-default); border-radius: 8px; background: var(--bg-page); }
.icon-rules strong { color: var(--text-default); font: 500 12px/16px var(--tz-font-family); }
.icon-rules p { margin: 6px 0 0; color: var(--text-muted); font: 400 12px/18px var(--tz-font-family); }
code { color: var(--brand-primary); font: 400 11px/16px ui-monospace, SFMono-Regular, Consolas, monospace; }
@media (max-width: 900px) { .icon-rules > div { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 620px) { .icons-header, .icons-card > header { align-items: flex-start; flex-direction: column; } .icons-card { padding: 16px; } .icons-search { width: 100%; } .icon-rules > div { grid-template-columns: 1fr; } }
</style>
