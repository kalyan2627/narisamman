import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationRef } from './src/navigation/NavigationService';
import { setupAutoTranslation } from './src/autoTranslation/setupAutoTranslation';
import useStore from './src/store/useStore';

setupAutoTranslation();

// Inject global CSS for web to make all screens scrollable
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    html, body, #root {
      height: 100%;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch;
    }
    /* Allow all RN View containers on web to overflow and scroll */
    div[data-testid], .css-view-175oi2r {
      overflow: visible;
    }
    /* Fix for react-native-web screens locking scroll */
    #root > div {
      overflow-y: auto !important;
      height: auto !important;
      min-height: 100%;
    }
    /* Make ScrollView work properly on web */
    .r-overflow-1udh08x {
      overflow-y: auto !important;
    }
  `;
  document.head.appendChild(style);
}

export default function App() {
  useEffect(() => {
    // Restore session securely on app load
    useStore.getState().restoreSession();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="light" />
      <RootNavigator />
    </NavigationContainer>
  );
}