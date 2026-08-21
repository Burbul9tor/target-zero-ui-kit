<script setup lang="ts">
import {
  Activity, ArrowDownUp, ArrowDownWideNarrow, ArrowLeft, ArrowLeftToLine, ArrowRight, ArrowRightToLine,
  ArrowUpRight, ArrowUpToLine, ArrowUpWideNarrow, Award, BarChart3, Bold, Book, BookOpen, BookOpenCheck,
  BriefcaseBusiness, Calculator, CalendarCheck2, CalendarClock, CalendarDays, Camera, ChartPie, Check,
  ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleCheck, CircleHelp, CircleX, ClipboardCheck,
  ClipboardList, CloudUpload, Coins, Container, Download, EllipsisVertical, ExternalLink, Factory, FileSpreadsheet,
  FileText, FileUser, FileWarning, Filter, FolderCheck, FolderCog, Glasses, GripVertical, Handshake, HardHat,
  Inbox, Info, Italic, KeyRound, LayoutDashboard, LayoutGrid, Leaf, List, ListChecks, ListOrdered, Loader,
  Mail, MapPin, MessageSquareShare, Minus, Moon, Network, Newspaper, PackageCheck, PackageX, Palette,
  PanelLeftClose, PanelLeftOpen, Pencil, Pin, PlugZap, Plus, RadioTower, Recycle, Scale, Search, Send,
  Settings, Shield, ShieldCheck, Siren, SlidersHorizontal, Smartphone, Stethoscope, Sun, Tags, TicketCheck,
  Trash2, Truck, Underline, User, UserCog, Users, Waves, Wind, Wrench, X, Zap,
} from '@lucide/vue'
import { computed, ref } from 'vue'
import type { Component } from 'vue'
import fillIcon from '../../assets/icons/figma/fill.svg'
import frameIcon from '../../assets/icons/figma/frame.svg'
import pekIcon from '../../assets/icons/figma/pek.svg'
import stoneIcon from '../../assets/icons/figma/stone.svg'
import TzSearch from '../forms/TzSearch.vue'

type IconEntry = {
  id: string
  name: string
  icon?: Component
  icons?: Component[]
  asset?: string
  source?: 'Lucide' | 'Target Zero'
}

const icons: IconEntry[] = [
  { id: '1:2330', name: 'Activity', icon: Activity },
  { id: '1:2334', name: 'Award', icon: Award },
  { id: '1:2339', name: 'BarChart3', icon: BarChart3 },
  { id: '1:2346', name: 'BookOpen', icon: BookOpen },
  { id: '1:2351', name: 'BookOpenCheck', icon: BookOpenCheck },
  { id: '1:2357', name: 'BriefcaseBusiness', icon: BriefcaseBusiness },
  { id: '1:2364', name: 'Calculator', icon: Calculator },
  { id: '1:2377', name: 'CalendarCheck2', icon: CalendarCheck2 },
  { id: '1:2385', name: 'CalendarClock', icon: CalendarClock },
  { id: '1:2394', name: 'CalendarDays', icon: CalendarDays },
  { id: '1:2407', name: 'ChevronDown', icon: ChevronDown },
  { id: '1:2411', name: 'ChevronRight', icons: [ChevronLeft, ChevronRight] },
  { id: '1:2415', name: 'ChevronUp', icon: ChevronUp },
  { id: '1:2423', name: 'CircleHelp', icon: CircleHelp },
  { id: '1:2429', name: 'ClipboardCheck', icon: ClipboardCheck },
  { id: '1:2435', name: 'ClipboardList', icon: ClipboardList },
  { id: '1:2444', name: 'Coins', icon: Coins },
  { id: '1:2451', name: 'Factory', icon: Factory },
  { id: '1:2458', name: 'FileSpreadsheet', icon: FileSpreadsheet },
  { id: '1:2467', name: 'FileText', icon: FileText },
  { id: '1:2475', name: 'FileWarning', icon: FileWarning },
  { id: '1:2481', name: 'FolderCheck', icon: FolderCheck },
  { id: '1:2486', name: 'FolderCog', icon: FolderCog },
  { id: '1:2499', name: 'Glasses', icon: Glasses },
  { id: '1:2507', name: 'Handshake', icon: Handshake },
  { id: '1:2515', name: 'HardHat', icon: HardHat },
  { id: '1:2522', name: 'KeyRound', icon: KeyRound },
  { id: '1:2528', name: 'LayoutDashboard', icon: LayoutDashboard },
  { id: '1:2535', name: 'LayoutGrid', icon: LayoutGrid },
  { id: '1:2542', name: 'Leaf', icon: Leaf },
  { id: '1:2547', name: 'ListChecks', icon: ListChecks },
  { id: '1:2555', name: 'Mail', icon: Mail },
  { id: '1:2560', name: 'MapPin', icon: MapPin },
  { id: '1:2565', name: 'Network', icon: Network },
  { id: '1:2573', name: 'Newspaper', icon: Newspaper },
  { id: '1:2580', name: 'PackageCheck', icon: PackageCheck },
  { id: '1:2588', name: 'PackageX', icon: PackageX },
  { id: '1:2597', name: 'Palette', icon: Palette },
  { id: '1:2609', name: 'Pin', icon: Pin },
  { id: '1:2614', name: 'PlugZap', icon: PlugZap },
  { id: '1:2622', name: 'RadioTower', icon: RadioTower },
  { id: '1:2632', name: 'Recycle', icon: Recycle },
  { id: '1:2641', name: 'Scale', icon: Scale },
  { id: '1:2649', name: 'Send', icon: Send },
  { id: '1:2654', name: 'Settings', icon: Settings },
  { id: '1:2659', name: 'Shield', icon: Shield },
  { id: '1:2663', name: 'ShieldCheck', icon: ShieldCheck },
  { id: '1:2668', name: 'Siren', icon: Siren },
  { id: '1:2679', name: 'SlidersHorizontal', icon: SlidersHorizontal },
  { id: '1:2691', name: 'Smartphone', icon: Smartphone },
  { id: '1:2696', name: 'Stethoscope', icon: Stethoscope },
  { id: '1:2704', name: 'Tags', icon: Tags },
  { id: '1:2711', name: 'TicketCheck', icon: TicketCheck },
  { id: '1:2716', name: 'Truck', icon: Truck },
  { id: '1:2724', name: 'UserCog', icon: UserCog },
  { id: '1:2738', name: 'Users', icon: Users },
  { id: '1:2745', name: 'Wrench', icon: Wrench },
  { id: '1:2749', name: 'Zap', icon: Zap },
  { id: '1:2753', name: 'Book', icon: Book },
  { id: '1:2757', name: 'User', icon: User },
  { id: '1:2761', name: 'MessageSquareShare', icon: MessageSquareShare },
  { id: '1:2765', name: 'PEK', asset: pekIcon, source: 'Target Zero' },
  { id: '1:2772', name: 'Container', icon: Container },
  { id: '1:2776', name: 'ChartPie', icon: ChartPie },
  { id: '1:2780', name: 'Pencil', icon: Pencil },
  { id: '1:2784', name: 'Close', icon: X },
  { id: '1:2788', name: 'Wind', icon: Wind },
  { id: '1:2792', name: 'WavesHorizontal', icon: Waves },
  { id: '1:2796', name: 'Camera', icon: Camera },
  { id: '1:2800', name: 'ArrowUpRight', icon: ArrowUpRight },
  { id: '1:2804', name: 'GripVertical', icon: GripVertical },
  { id: '1:2808', name: 'CloudUpload', icon: CloudUpload },
  { id: '1:2812', name: 'FileUser', icon: FileUser },
  { id: '1:2816', name: 'Arrow-left', icon: ArrowLeft },
  { id: '1:2820', name: 'Search', icon: Search },
  { id: '1:2824', name: 'Menu', icon: EllipsisVertical },
  { id: '1:2828', name: 'Check · Circle', icon: CircleCheck },
  { id: '1:2832', name: 'Check · Camera', icon: Camera },
  { id: '19:1951', name: 'Upload', icon: ArrowUpToLine },
  { id: '26:24886', name: 'Check', icon: Check },
  { id: '62:23118', name: 'Frame', asset: frameIcon, source: 'Target Zero' },
  { id: '89:4197', name: 'CloseFill', icon: CircleX },
  { id: '182:3172', name: 'Sun', icon: Sun },
  { id: '182:3177', name: 'Moon', icon: Moon },
  { id: '182:3993', name: 'panel-left-close', icon: PanelLeftClose },
  { id: '182:3999', name: 'panel-left-open', icon: PanelLeftOpen },
  { id: '240:3883', name: 'Minus', icon: Minus },
  { id: '455:68', name: 'Plus', icon: Plus },
  { id: '374:7942', name: 'Download', icon: Download },
  { id: '394:7797', name: 'Fill', asset: fillIcon, source: 'Target Zero' },
  { id: '394:7787', name: 'Italic', icon: Italic },
  { id: '394:7792', name: 'Underline', icon: Underline },
  { id: '394:7802', name: 'Bold', icon: Bold },
  { id: '394:7807', name: 'Bullet list', icon: List },
  { id: '394:7812', name: 'Bullet number', icon: ListOrdered },
  { id: '424:30235', name: 'Stone', asset: stoneIcon, source: 'Target Zero' },
  { id: '435:211', name: 'Info', icon: Info },
  { id: '444:23847', name: 'Filter', icon: Filter },
  { id: '463:129', name: 'Loader', icon: Loader },
  { id: '468:23873', name: 'external-link', icon: ExternalLink },
  { id: '470:23924-1', name: 'ArrowDownUp', icon: ArrowDownUp },
  { id: '470:23924-2', name: 'ArrowDownWideNarrow', icon: ArrowDownWideNarrow },
  { id: '470:23924-3', name: 'ArrowUpWideNarrow', icon: ArrowUpWideNarrow },
  { id: '474:25979', name: 'arrow-left', icon: ArrowLeft },
  { id: '474:25989', name: 'arrow-right', icon: ArrowRight },
  { id: '474:25994', name: 'arrow-right-to-line', icon: ArrowRightToLine },
  { id: '474:25999', name: 'arrow-left-to-line', icon: ArrowLeftToLine },
  { id: '493:1447', name: 'arrow-left-to-line · instance', icon: ArrowLeftToLine },
  { id: '493:24754', name: 'Delete', icon: Trash2 },
  { id: '502:24785', name: 'inbox', icon: Inbox },
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

function fileName(name: string, index?: number) {
  const slug = name.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'icon'
  return `${slug}${index == null ? '' : `-${index + 1}`}.svg`
}

function triggerDownload(data: Blob | string, name: string) {
  const blob = typeof data === 'string' ? new Blob([data], { type: 'image/svg+xml;charset=utf-8' }) : data
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

async function downloadIcon(item: IconEntry, event: MouseEvent) {
  if (item.asset) {
    const response = await fetch(item.asset)
    triggerDownload(await response.blob(), fileName(item.name))
  } else {
    const card = (event.currentTarget as HTMLElement).closest('.icon-item')
    const svgNodes = [...(card?.querySelectorAll('.icon-preview svg') ?? [])]
    svgNodes.forEach((node, index) => {
      const svg = node.cloneNode(true) as SVGElement
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      svg.setAttribute('width', '24')
      svg.setAttribute('height', '24')
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(svg)}`.replace(/currentColor/g, '#404040')
      triggerDownload(xml, fileName(item.name, svgNodes.length > 1 ? index : undefined))
    })
  }

  downloaded.value = item.id
  window.setTimeout(() => { if (downloaded.value === item.id) downloaded.value = '' }, 1200)
}
</script>

<template>
  <div class="icons-docs">
    <header class="icons-header">
      <div><p>FOUNDATIONS · ICONS</p><h1>Icons</h1><span>Полный набор из Figma node 1:2211. Стандартные glyph подключены из Lucide, уникальные — сохранены локальными SVG.</span></div>
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
              <img v-if="item.asset" :src="item.asset" alt="" width="24" height="24">
              <template v-else-if="item.icons">
                <component :is="icon" v-for="(icon, index) in item.icons" :key="index" :size="24" :stroke-width="1.5" />
              </template>
              <component :is="item.icon" v-else :size="24" :stroke-width="1.5" />
            </span>
            <span>{{ item.name }}</span>
            <small>{{ item.source ?? 'Lucide' }}</small>
          </button>
          <button type="button" class="icon-download" :aria-label="`Download ${item.name} as SVG`" :title="`Download ${item.name}.svg`" @click="downloadIcon(item, $event)">
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
        <article><strong>Stroke</strong><p>Базовая толщина линии в стенде — 1.5px.</p></article>
        <article><strong>Источник</strong><p>Lucide Vue плюс четыре уникальных SVG Target Zero: PEK, Fill, Frame и Stone.</p></article>
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
.icons-card { min-width: 0; padding: 24px; border: 1px solid var(--showcase-border); border-radius: 12px; background: var(--bg-surface); box-shadow: 0 10px 15px -3px var(--bg-shadow); }
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
.icon-preview img { display: block; width: 24px; height: 24px; object-fit: contain; }
.icon-copy > span:nth-child(2) { overflow: hidden; max-width: 100%; color: var(--text-default); font: 400 10px/14px var(--tz-font-family); text-overflow: ellipsis; white-space: nowrap; }
.icon-item small { color: var(--text-muted); font: 400 9px/13px var(--tz-font-family); }
.icon-item b { position: absolute; right: 4px; bottom: 4px; left: 4px; padding: 3px; color: var(--text-button-fill); border-radius: 4px; background: var(--brand-primary); font: 500 9px/12px var(--tz-font-family); pointer-events: none; }
.icons-empty { display: grid; min-height: 220px; place-items: center; align-content: center; gap: 6px; color: var(--text-muted); }
.icons-empty strong { color: var(--text-default); font: 500 14px/20px var(--tz-font-family); }
.icons-empty span { font: 400 12px/16px var(--tz-font-family); }
.icon-rules > div { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.icon-rules article { padding: 16px; border: 1px solid var(--showcase-border); border-radius: 8px; background: var(--showcase-canvas); }
.icon-rules strong { color: var(--text-default); font: 500 12px/16px var(--tz-font-family); }
.icon-rules p { margin: 6px 0 0; color: var(--text-muted); font: 400 12px/18px var(--tz-font-family); }
code { color: var(--brand-primary); font: 400 11px/16px ui-monospace, SFMono-Regular, Consolas, monospace; }
@media (max-width: 900px) { .icon-rules > div { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 620px) { .icons-header, .icons-card > header { align-items: flex-start; flex-direction: column; } .icons-card { padding: 16px; } .icons-search { width: 100%; } .icon-rules > div { grid-template-columns: 1fr; } }
</style>
