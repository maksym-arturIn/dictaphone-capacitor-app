import { toast } from 'vue-sonner'
import type { Component } from 'vue'

export const toaster = {
  success(message: string | Component, options: any = {}) {
    toast.success(message, { style: { color: '#22c55e' }, ...options })
  },
  warn(message: string | Component, options: any = {}) {
    toast.warning(message, { style: { color: '#eab308' }, ...options })
  },
  error(message: string | Component, options: any = {}) {
    toast.error(message, { style: { color: '#ef4444' }, ...options })
  },
  info(message: string | Component, options: any = {}) {
    toast.info(message, { style: { color: '#3b82f6' }, ...options })
  }
}
