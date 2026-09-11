import type { Component } from 'vue'

export type TreeKey = string | number
export type TreeDropScope = 'tree' | 'siblings'

export interface TreeNodeBase {
  id: TreeKey
  title: string
  children?: TreeNodeBase[]
  disabled?: boolean
  icon?: Component
  [key: string]: unknown
}

export type TreeNodeItem = Record<string, unknown>

export interface TreeDropPayload {
  parent: TreeNodeItem | null
  items: TreeNodeItem[]
}
