import { createSlice } from '@reduxjs/toolkit'
import en from '../../public/locales/en/common.json'
import ar from '../../public/locales/ar/common.json'

const initialState = {
  en: en,
  ar: ar
}

export const iconslice = createSlice({
  name: 'aboutAPP',
  initialState,
  reducers: {
    setEnglishTrans: (state, action) => {
      state.en = action.payload
    },
    setArabicTrans: (state, action) => {
      state.ar = action.payload
    }
  }
})

export const { setEnglishTrans, setArabicTrans } = iconslice.actions
