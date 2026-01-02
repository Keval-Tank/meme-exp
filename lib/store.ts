import { configureStore } from '@reduxjs/toolkit'
import memeTemplatesReducers from "./features/memes-templates-store/memesSlice"
import visualSliceReducers from './features/meme-generation-store/visualsSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      fetchTemplates : memeTemplatesReducers,
      generateMeme : visualSliceReducers
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']