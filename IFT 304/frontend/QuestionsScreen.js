import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function QuestionsScreen({ route, navigation }) {
  const { handoutId } = route.params; // Get the ID passed from UploadScreen
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // REPLACE THIS with your computer's IPv4 address
  const BACKEND_URL = 'http://10.20.12.183';

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      
      // Assumes you have a GET endpoint configured on your Flask server 
      // to retrieve handout details/questions by ID
      const response = await fetch(`${BACKEND_URL}/handouts/${handoutId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Adjust this depending on your exact JSON response structure
        setQuestions(data.questions || []); 
      } else {
        Alert.alert('Error', data.error || 'Failed to load questions.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not connect to the server.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB86FC" />
        <Text style={styles.loadingText}>Loading your study materials...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Practice Questions</Text>
      
      {questions.length === 0 ? (
        <Text style={styles.emptyText}>No questions found for this handout.</Text>
      ) : (
        questions.map((q, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{q.topic_tag}</Text>
            </View>
            <Text style={styles.questionText}>{index + 1}. {q.question_text}</Text>
            
            <View style={styles.answerBox}>
              <Text style={styles.answerLabel}>Answer:</Text>
              <Text style={styles.answerText}>{q.correct_answer}</Text>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity 
        style={styles.doneButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Upload Another</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#A0A0A0',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  emptyText: {
    color: '#A0A0A0',
    fontSize: 16,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  tagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(187, 134, 252, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  tagText: {
    color: '#BB86FC',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 24,
  },
  answerBox: {
    backgroundColor: '#2C2C2C',
    padding: 12,
    borderRadius: 8,
  },
  answerLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 4,
  },
  answerText: {
    color: '#4CAF50', // Green text to indicate the correct answer
    fontSize: 15,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#333333',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});