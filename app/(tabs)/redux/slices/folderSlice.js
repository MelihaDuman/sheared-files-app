import { createSlice } from '@reduxjs/toolkit';

const folderSlice = createSlice({
  name: 'folder',
  initialState: {
    currentFolder: null,
  },
  reducers: {
    setCurrentFolder(state, action) {
      state.currentFolder = action.payload;
    },
    clearCurrentFolder(state) {
      state.currentFolder = null;
    },
  },
});

export const { setCurrentFolder, clearCurrentFolder } = folderSlice.actions;
export default folderSlice.reducer;
