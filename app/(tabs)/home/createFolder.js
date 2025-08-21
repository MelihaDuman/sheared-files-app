import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../../../lib/supabase'; // adjust import based on your project

export default function CreateFolderScreen({ navigation }) {
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('shopping'); // default type
  const [sharedEmails, setSharedEmails] = useState('');
  const [userId, setUserId] = useState(null);

    const router = useRouter();

  // Get the logged-in user ID
  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        Alert.alert('Not signed in');
        return;
      }
      setUserId(user.id);
    };
    getUser();
  }, []);

    const goToFolders = () => {
    router.replace('/(tabs)/home/allFolders')
    }

  const handleCreateFolder = async () => {
    if (!fileName.trim()) {
      Alert.alert('Please enter a folder name.');
      return;
    }



    const emails = sharedEmails
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(email => email.length > 0);

    const { error } = await supabase.from('shared_files').insert([
      {
        file_name: fileName,
        owner_id: userId,
        shared_with: emails,
      },
    ]);

    if (error) {
      console.error(error);
      Alert.alert('Error creating folder', error.message);
    } else {
      Alert.alert('Folder created!');
      setFileName('');
      setSharedEmails('');
      navigation.goBack(); // or navigate to folder list
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create a Shared Folder</Text>
      <TextInput
        style={styles.input}
        placeholder="Folder Name"
        value={fileName}
        onChangeText={setFileName}
      />
      <TextInput
        style={styles.input}
        placeholder="Type (e.g., shopping, chores)"
        value={fileType}
        onChangeText={setFileType}
      />
      <TextInput
        style={styles.input}
        placeholder="Shared With (emails, comma-separated)"
        value={sharedEmails}
        onChangeText={setSharedEmails}
      />
      <Button title="Create Folder" onPress={handleCreateFolder} />

       <Button title="Folders" onPress={goToFolders} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20, flex: 1, justifyContent: 'center'
  },
  heading: {
    fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color:'white'
  },
  input: {
    borderColor: '#ccc', borderWidth: 1,
    padding: 10, borderRadius: 5, marginBottom: 15, color: 'white'
  },
});
