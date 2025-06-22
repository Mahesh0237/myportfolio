import { create } from 'zustand'

let store = (set, get) => ({
    company_info: null,
    updateCompanyInfo: (data) => {
        set({
            company_info: data,
        })
    },
})

export const useCompanyinfo = create(store)