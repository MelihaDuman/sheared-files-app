import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { supabase } from '../../../lib/supabase';
import { addItem } from '../redux/slices/itemsSlice';

export default function AddItemScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { folderId, folderName } = useLocalSearchParams();
  const [itemName, setItemName] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState(null);

 useFocusEffect(
  useCallback(() => {
    // reset fields every time screen is focused
    setItemName('');
    setContent('');
  }, [])
);


  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  const handleAddItem = async () => {
  if (!itemName.trim()) {
    Toast.show({ type: 'error', text1: 'Please enter an item name' });
    return;
  }

  const { data, error } = await supabase.from('file_items')
    .insert([
      {
        file_id: folderId,
        item_name: itemName,
        content: content || '',
        done: false,
        added_by: userId,
      },
    ])
    .select()
    .single();

  if (error) {
    Toast.show({ type: 'error', text1: 'Error adding item', text2: error.message });
    console.log(error.message)
  } else if (data) {
     dispatch(addItem(data));
  Toast.show({ type: 'success', text1: 'New task added!' });
  router.replace('/folderDetails');
  }
};


   return (


      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Add Item to {folderName}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item name..."
            placeholderTextColor="#888"
            value={itemName}
            onChangeText={setItemName}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add details (optional)..."
            placeholderTextColor="#888"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={4}
          />
          <Button title="Add Item" onPress={handleAddItem} />
        </View>
      </TouchableWithoutFeedback>
  
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    color: 'white',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
});
