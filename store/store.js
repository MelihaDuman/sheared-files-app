import { configureStore } from '@reduxjs/toolkit';
import folderReducer from '../app/(tabs)/redux/slices/folderSlice';
import itemsReducer from '../app/(tabs)/redux/slices/itemsSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    folder: folderReducer,
  },
});
