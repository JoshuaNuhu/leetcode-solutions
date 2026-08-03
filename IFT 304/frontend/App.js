import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';

// Import your screens
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import UploadScreen from './UploadScreen';
import QuestionsScreen from './QuestionsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for a saved token on application launch
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setInitialRoute('Upload');
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        setInitialRoute('Login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkToken();
  }, []);

  // Show a dark loading spinner while checking local storage
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB86FC" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShadowVisible: false, // Removes the bottom border for a cleaner dark look
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Sign Up', headerBackTitleVisible: false }} 
        />
        <Stack.Screen 
          name="Upload" 
          component={UploadScreen} 
          // Prevent user from clicking the back arrow to return to login without logging out
          options={{ title: 'Study Planner', headerBackVisible: false }} 
        />
        <Stack.Screen 
          name="Questions" 
          component={QuestionsScreen} 
          options={{ title: 'Review', headerBackTitleVisible: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
});