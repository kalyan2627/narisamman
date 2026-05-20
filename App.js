// App.js – Root component with web‑specific fixed positioning
import 'react-native-gesture-handler';
import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationRef } from './src/navigation/NavigationService';
import { setupAutoTranslation } from './src/autoTranslation/setupAutoTranslation';

setupAutoTranslation();

// Inline style applied only on web – avoids StyleSheet validation stripping.
const WEB_ROOT_STYLE = Platform.OS === 'web' ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 } : {};

export default function App() {
  return (
    <View style={[styles.root, WEB_ROOT_STYLE]}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D1117', // dark background for the app
  },
});
