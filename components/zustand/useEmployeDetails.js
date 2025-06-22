import { create } from 'zustand'
import { persist, createJSONStorage } from "zustand/middleware"
import { enc, AES } from 'crypto-js'

const encryptKey = process.env.NEXT_PUBLIC_ENCRYPT_KEY;

// Custom storage object for localStorage with encryption
const storage = {
    getItem: (name) => {
        const encryptedData = localStorage.getItem(name);
        if (encryptedData) {
            const decryptedData = AES.decrypt(encryptedData, encryptKey).toString(enc.Utf8);
            return JSON.parse(decryptedData);
        }
        return null;
    },
    setItem: (name, value) => {
        const encryptedData = AES.encrypt(JSON.stringify(value), encryptKey).toString();
        localStorage.setItem(name, encryptedData);
    },
    removeItem: (name) => {
        localStorage.removeItem(name);
    },
};

let store = (set, get) => ({
    employe_info: null,
    isLogged: false,
    access_token: null,
    updateAuthDetails: (data, access_token) => {
        set({
            employe_info: data,
            isLogged: true,
            access_token: access_token
        })
    },
    resetAuthDetails: () => {
        set({
            employe_info: null,
            isLogged: false,
            access_token: null
        })
    }
})

store = persist(store, {
    name: "employeAuthDetails",
    storage: createJSONStorage(() => storage),
})

export const useEmployeDetails = create(store)