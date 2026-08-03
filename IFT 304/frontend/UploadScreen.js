import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  Alert 
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as SecureStore from 'expo-secure-store';

export default function UploadScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  // Your computer's IPv4 address
  const BACKEND_URL = 'http://10.20.12.183';
  
  const pickAndUploadDocument = async () => {
    try {
      // 1. Open the phone's file picker
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setLoading(true);

      // 2. Prepare the file for upload (multipart/form-data)
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: 'application/pdf',
      });
      formData.append('course_name', 'Mobile Upload Test');

      // 3. Retrieve the secure token from the device
      const token = await SecureStore.getItemAsync('userToken');

      if (!token) {
        Alert.alert('Authentication Error', 'You must be logged in to upload files.');
        setLoading(false);
        return;
      }

      // 4. Send to your Flask Backend
      const response = await fetch(`${BACKEND_URL}/handouts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // fetch automatically sets the correct boundary for multipart data
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('Questions', { handoutId: data.handout_id });
      } else {
        Alert.alert('Upload Failed', data.error || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Network Error', error.message);
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Planner</Text>
        <Text style={styles.subtitle}>Upload a handout to generate practice questions.</Text>
      </View>

      <TouchableOpacity 
        style={styles.uploadButton} 
        onPress={pickAndUploadDocument}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#121212" size="small" />
        ) : (
          <Text style={styles.buttonText}>Select PDF Document</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    lineHeight: 24,
  },
  uploadButton: {
    backgroundColor: '#BB86FC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
});