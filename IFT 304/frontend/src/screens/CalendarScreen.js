import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { apiFetch } from '../api/client';

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('class'); // class, test, exam
  const [pushToken, setPushToken] = useState('');

  useEffect(() => {
    registerForPushNotifications();
    fetchEvents();
  }, []);

  const registerForPushNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setPushToken(token);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await apiFetch('/events');
      setEvents(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const addEvent = async () => {
    if (!title.trim()) return;

    // Default scheduled time: 1 hour from now for testing
    const scheduledDate = new Date(Date.now() + 3600 * 1000).toISOString();

    try {
      await apiFetch('/events', {
        method: 'POST',
        body: JSON.stringify({
          title,
          type: eventType,
          event_date: scheduledDate,
          notify_before: 30,
          expo_push_token: pushToken,
        }),
      });
      setTitle('');
      fetchEvents();
      Alert.alert('Scheduled', 'Calendar event created.');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Study Calendar</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Event Title (e.g. Midterm Exam)"
          value={title}
          onChangeText={setTitle}
        />
        <View style={styles.typeRow}>
          {['class', 'test', 'exam'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typeChip, eventType === type && styles.typeChipActive]}
              onPress={() => setEventType(type)}
            >
              <Text style={[styles.typeText, eventType === type && styles.typeTextActive]}>{type.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={addEvent}>
          <Text style={styles.addBtnText}>Schedule Event</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDate}>{new Date(item.event_date).toLocaleString()}</Text>
            </View>
            <Text style={styles.badge}>{item.type}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  form: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', padding: 12, borderRadius: 6, marginBottom: 12 },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  typeChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16, backgroundColor: '#f1f5f9' },
  typeChipActive: { backgroundColor: '#2563eb' },
  typeText: { fontSize: 12, color: '#64748b', fontWeight: 'bold' },
  typeTextActive: { color: '#fff' },
  addBtn: { backgroundColor: '#10b981', padding: 12, borderRadius: 6, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  eventCard: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventTitle: { fontSize: 15, fontWeight: 'bold' },
  eventDate: { fontSize: 12, color: '#64748b' },
  badge: { backgroundColor: '#e2e8f0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontWeight: 'bold' },
});