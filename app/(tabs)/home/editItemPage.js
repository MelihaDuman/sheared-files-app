import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { supabase } from '../../../lib/supabase';
import { updateItem } from '../redux/slices/itemsSlice';

export default function EditItemScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { itemId, itemName, itemContent } = useLocalSearchParams();
  const [name, setName] = useState(typeof itemName === 'string' ? itemName : '');
  const [content, setContent] = useState(typeof itemContent === 'string' ? itemContent : '');
  const [loading, setLoading] = useState(false);

  // If we navigated here with only itemId (no name/content), fetch the item once.
  useEffect(() => {
    const needFetch = (!itemName || !itemContent) && itemId;
    if (!needFetch) return;

    (async () => {
      const { data, error } = await supabase
        .from('file_items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (!error && data) {
        setName(data.item_name || '');
        setContent(data.content || '');
      }
    })();
  }, [itemId, itemName, itemContent]);

  const handleUpdateItem = async () => {
    if (!name.trim()) {
      // very simple guard; make fancier if you like
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('file_items')
      .update({
        item_name: name,
        content: content || '',
      })
      .eq('id', itemId)
      .select()    // return updated row
      .single();   // exactly one

    setLoading(false);

    if (error) {
      console.log('Update error:', error.message);
      return;
    }

    // Update redux (your reducer expects the full row; includes file_id)
    dispatch(updateItem(data));
    router.replace("/folderDetails")
  };

  useEffect(() => {
  if (typeof itemName === 'string') {
    setName(itemName);
  }
  if (typeof itemContent === 'string') {
    setContent(itemContent);
  }
}, [itemId, itemName, itemContent]);


  return (
      <>
      {/* Native-style header with back arrow */}
      <Stack.Screen
        options={{
         headerTintColor: 'white',        // color of arrow and text
    headerStyle: { backgroundColor: '#af1b1bff' }, // header background
    headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitle: 'Back', // Text under arrow in iOS
        }}
      />
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Text style={styles.title}>Edit Item</Text>
      <TextInput
        style={styles.input}
        placeholder="Item name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={4}
      />
      <Button title={loading ? 'Updating…' : 'Update Item'} onPress={handleUpdateItem} disabled={loading} />
    </View>
    </TouchableWithoutFeedback>
     </>
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color:'white' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 15,color:'white' },
  textArea: { height: 100, textAlignVertical: 'top' },
});
