import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../../lib/supabase';
import { deleteItem, setItems, updateItem } from '../redux/slices/itemsSlice';


export default function FolderDetailScreen() {
  const dispatch = useDispatch();
  const flatListRef = useRef();

  const router = useRouter();
  

  // 1️⃣ Get current folder from Redux
  const folderObj = useSelector((state) => state.folder.currentFolder);
  if (!folderObj) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No folder selected. Please go back and choose one.</Text>
      </View>
    );
  }

  // 2️⃣ Get this folder's items from the per-folder slice
  const itemsByFolder = useSelector((state) => state.items.itemsByFolder) || {};
  const folderItems = itemsByFolder[folderObj.id] || [];

  // 3️⃣ Fetch items once on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const prevLength = useRef(0);

  //scroll every time new item added
  useEffect(() => {
    if (folderItems.length > prevLength.current && flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
    prevLength.current = folderItems.length;
  }, [folderItems]);


  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('file_items')
      .select('*')
      .eq('file_id', folderObj.id)
      .order('created_at', { ascending: false });
    if (!error) {
      dispatch(setItems({ folderId: folderObj.id, items: data }));
    }
  };

  const toggleDone = async (itemId, currentStatus) => {
    const { data, error } = await supabase
      .from('file_items')
      .update({ done: !currentStatus })
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling done:', error.message);
      return;
    }
    // dispatch the updated row into your slice
    dispatch(updateItem(data));
  };


  const handleDeleteItem = async (itemId) => {
    const { data, error } = await supabase
      .from('file_items')
      .delete()
      .eq('id', itemId)
      .select()  // <- this makes Supabase return the deleted rows
    //  console.log('🧪 Deleting item ID:', itemId);
    if (error) {
      // console.error('❌ Supabase delete error:', error.message);
      return;
    }
    if (!data) {
      // console.warn('⚠️ Delete ran but no data returned');
      return;
    }
    // console.log('✅ Deleted from Supabase:', data);
    dispatch(deleteItem({ itemId, folderId: folderObj.id }));
  };



  const renderItem = ({ item }) => {
    const renderRightActions = () => (
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
    return (
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.itemContainer}>
          <View style={styles.itemRow}>
            <TouchableOpacity
              style={[styles.checkbox, item.done && styles.checkboxDone]}
              onPress={() => toggleDone(item.id, item.done)}
            >
              {item.done && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <Text style={styles.itemText}>{item.item_name}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/home/editItemPage',
                  params: {
                    itemId: item.id,
                    itemName: item.item_name,
                    itemContent: item.content,
                  },
                })
              }
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.contentRow}>
            <Text style={styles.contentText}>{item.content || '(no content)'}</Text>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{folderObj.file_name}</Text>
      <FlatList
        ref={flatListRef}
        data={folderItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No items yet</Text>}
      />
      <View style={styles.addItemContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            router.push({
              pathname: '/(tabs)/home/addItem',
              params: { folderId: folderObj.id, folderName: folderObj.file_name },
            })
          }
        >
          <Text style={styles.addButtonText}> Add Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#555' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: 'white' },
  itemContainer: { marginBottom: 15, borderBottomWidth: 1, borderColor: '#ddd', paddingBottom: 5 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: 'white', marginRight: 10, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  checkboxDone: { backgroundColor: '#4caf50', borderColor: '#4caf50' },
  checkmark: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  itemText: { fontSize: 16, fontWeight: '500', color: 'red' },
  contentRow: { paddingLeft: 34, marginTop: 3 },
  contentText: { fontSize: 14, color: '#555' },
  deleteButton: { backgroundColor: 'red', justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 20, flex: 1 },
  deleteText: { color: 'white', fontWeight: 'bold' },
  addItemContainer: { alignItems: 'center', marginTop: 20 },
  addButton: { backgroundColor: '#4caf50', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginBottom: 40 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 30, color: '#999' },
   itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  editButton: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  editText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
