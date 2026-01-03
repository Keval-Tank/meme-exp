import { configureStore } from '@reduxjs/toolkit'
import memeTemplatesReducers from "./features/memes-templates-store/memesSlice"
import visualSliceReducers from './features/meme-generation-store/visualsSlice'
import queryReducers from './features/query-store/querySlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      fetchTemplates : memeTemplatesReducers,
      generateMeme : visualSliceReducers,
      generateQuery : queryReducers
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']