import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { supabase } from '../../../lib/supabase';
import { setCurrentFolder } from '../redux/slices/folderSlice';

export default function FolderListScreen() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('User not logged in');
        setLoading(false);
        return;
      }

      const userEmail = user.email.toLowerCase();

      const { data, error } = await supabase
        .from('shared_files')
        .select('*')
        .or(`owner_id.eq.${user.id},shared_with.cs.{${userEmail}}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading folders:', error.message);
      } else {
        setFolders(data);
      }

      setLoading(false);
    };

    fetchFolders();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.folder}
      onPress={() => {
  dispatch(setCurrentFolder(item));  // item burada shared_files nesnesi
        
  router.push('(tabs)/home/folderDetails');

}}
    >
      <Text style={styles.folderTitle}>{item.file_name}</Text>
      <Text style={styles.folderType}>{item.file_type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Shared Folders</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={folders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>No folders yet</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  folder: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  folderTitle: { fontSize: 18, fontWeight: '600' },
  folderType: { fontSize: 14, color: '#777' },
  empty: { textAlign: 'center', marginTop: 30, color: '#999' },
});
