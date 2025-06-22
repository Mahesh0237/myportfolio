import { create } from 'zustand'

let store = (set, get) => ({
    navToggle: true,
    updateNavToggle: () => {
        set({
            navToggle: !get().navToggle,
        })
    },
})

export const useNavtoggle = create(store)