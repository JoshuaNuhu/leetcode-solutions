import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { apiFetch } from '../api/client';

export default function HandoutScreen({ navigation }) {
  const [handouts, setHandouts] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  useEffect(() => {
    fetchHandouts();
  }, []);

  const fetchHandouts = async () => {
    try {
      const data = await apiFetch('/handouts');
      setHandouts(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const pickAndUploadDocument = async () => {
    if (!courseName.trim()) {
      Alert.alert('Missing Course Name', 'Please enter a course name before picking a file.');
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: 'application/pdf',
    });
    formData.append('course_name', courseName);

    setUploading(true);
    try {
      await apiFetch('/handouts', {
        method: 'POST',
        body: formData,
      });
      setCourseName('');
      fetchHandouts();
      Alert.alert('Success', 'Handout uploaded and processed!');
    } catch (err) {
      Alert.alert('Upload Failed', err.message);
    } finally {
      setUploading(false);
    }
  };

  const startQuiz = async (handoutId) => {
    setLoadingQuiz(true);
    try {
      const questions = await apiFetch('/questions/generate', {
        method: 'POST',
        body: JSON.stringify({ handout_id: handoutId }),
      });
      navigation.navigate('Quiz', { questions, handoutId });
    } catch (err) {
      Alert.alert('Quiz Generation Error', err.message);
    } finally {
      setLoadingQuiz(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Handout PDF</Text>
      <TextInput
        style={styles.input}
        placeholder="Course Name (e.g., Biology 101)"
        value={courseName}
        onChangeText={setCourseName}
      />
      <TouchableOpacity style={styles.uploadBtn} onPress={pickAndUploadDocument} disabled={uploading}>
        {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadBtnText}>Select & Upload PDF</Text>}
      </TouchableOpacity>

      <Text style={styles.subtitle}>Your Handouts</Text>
      {loadingQuiz && <ActivityIndicator size="large" color="#2563eb" style={{ marginVertical: 12 }} />}
      <FlatList
        data={handouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.course_name}</Text>
            <TouchableOpacity style={styles.quizBtn} onPress={() => startQuiz(item.id)}>
              <Text style={styles.quizBtnText}>Start AI Quiz</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 10 },
  uploadBtn: { backgroundColor: '#10b981', padding: 14, borderRadius: 8, alignItems: 'center' },
  uploadBtnText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  quizBtn: { backgroundColor: '#2563eb', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  quizBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});