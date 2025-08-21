import { createSlice } from '@reduxjs/toolkit';

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    itemsByFolder: {},
  },
  reducers: {
    setItems(state, action) {
      const { folderId, items } = action.payload;
      state.itemsByFolder[folderId] = items;
    },
    addItem(state, action) {
      const item = action.payload;
      if (!state.itemsByFolder[item.file_id]) {
        state.itemsByFolder[item.file_id] = [];
      }
      state.itemsByFolder[item.file_id].unshift(item);
    },
    updateItem(state, action) {
  const updated = action.payload;
  const list = state.itemsByFolder[updated.file_id];
  if (list) {
    const idx = list.findIndex(i => i.id === updated.id);
    if (idx !== -1) list[idx] = updated;
  }
},

    deleteItem(state, action) {
      const { itemId, folderId } = action.payload;
      console.log('helllloooo')
      state.itemsByFolder[folderId] = state.itemsByFolder[folderId].filter(
        (i) => i.id !== itemId
      );
    },
  },
});

export const { setItems, addItem, updateItem, deleteItem } = itemsSlice.actions;
export default itemsSlice.reducer;
