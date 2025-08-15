"use client"

import { create } from "zustand"

type GlobalState = {
  globalSearch: string
  setGlobalSearch: (q: string) => void
}

export const useGlobalStore = create<GlobalState>((set) => ({
  globalSearch: "",
  setGlobalSearch: (globalSearch) => set({ globalSearch }),
}))
