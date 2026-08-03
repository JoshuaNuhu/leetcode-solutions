import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native';
import { apiFetch } from '../api/client';

export default function QuizScreen({ route, navigation }) {
  const { questions } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const currentQuestion = questions[currentIndex];

  const handleAnswerSubmit = async () => {
    if (!studentAnswer.trim()) return;

    setEvaluating(true);
    try {
      const result = await apiFetch('/questions/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          question_id: currentQuestion.id,
          student_answer: studentAnswer,
        }),
      });
      setFeedback(result);
    } catch (err) {
      Alert.alert('Evaluation Error', err.message);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    setStudentAnswer('');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert('Quiz Finished!', 'You completed all questions.', [
        { text: 'Back to Handouts', onPress: () => navigation.goBack() }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>Question {currentIndex + 1} of {questions.length}</Text>
      <Text style={styles.tag}>Topic: {currentQuestion.topic_tag || 'General'}</Text>
      
      <Text style={styles.questionText}>{currentQuestion.question_text}</Text>

      <TextInput
        style={styles.textArea}
        placeholder="Write your answer here..."
        multiline
        numberOfLines={4}
        value={studentAnswer}
        onChangeText={setStudentAnswer}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleAnswerSubmit} disabled={evaluating}>
        {evaluating ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Submit Answer</Text>}
      </TouchableOpacity>

      {/* Evaluation Result Modal */}
      {feedback && (
        <Modal transparent animationType="fade" visible={!!feedback}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[styles.resultHeader, { color: feedback.is_correct ? '#16a34a' : '#dc2626' }]}>
                {feedback.is_correct ? 'Correct!' : 'Needs Improvement'}
              </Text>

              {/* Conceptual Misunderstanding Flag Warning */}
              {feedback.conceptual_flag && (
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>⚠️ Conceptual Misunderstanding Detected</Text>
                </View>
              )}

              <Text style={styles.explanationText}>{feedback.explanation}</Text>

              <View style={styles.statsContainer}>
                <Text style={styles.statText}>Mastery: {feedback.current_mastery}%</Text>
                <Text style={styles.statText}>Total XP: {feedback.xp_total}</Text>
                <Text style={styles.statText}>Streak: {feedback.streak_count} 🔥</Text>
              </View>

              <TouchableOpacity style={styles.nextBtn} onPress={handleNextQuestion}>
                <Text style={styles.nextBtnText}>Next Question</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  progress: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  tag: { fontSize: 12, fontWeight: 'bold', color: '#2563eb', marginBottom: 16 },
  questionText: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#1e293b' },
  textArea: { borderBottomWidth: 1, borderColor: '#cbd5e1', padding: 12, borderRadius: 8, backgroundColor: '#f8fafc', height: 100, textAlignVertical: 'top', marginBottom: 20 },
  submitBtn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', width: '85%', padding: 24, borderRadius: 12, alignItems: 'center' },
  resultHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  warningBox: { backgroundColor: '#fef2f2', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#fca5a5', marginBottom: 12 },
  warningText: { color: '#991b1b', fontSize: 13, fontWeight: 'bold' },
  explanationText: { fontSize: 14, color: '#334155', textAlign: 'center', marginBottom: 16 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  statText: { fontSize: 13, fontWeight: 'bold', color: '#475569' },
  nextBtn: { backgroundColor: '#10b981', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  nextBtnText: { color: '#fff', fontWeight: 'bold' },
});