import { Stack } from 'expo-router';

export default function HomeStack() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#af1b1bff' },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
     
      <Stack.Screen name="folderDetails" options={{ title: 'Folder Details' }} />
      <Stack.Screen name="addItem" options={{ title: 'Add Item' }} />
      <Stack.Screen name="editItemPage" options={{ title: 'Edit Item' }} />
      <Stack.Screen name="createFolder" options={{ title: 'Create Folder' }} />
      <Stack.Screen name="allFolders" options={{ title: 'Folders', headerBackTitle: 'Back' }} />
    </Stack>
  );
}
