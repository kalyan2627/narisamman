import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

import VendorDashboard from '../screens/vendor/VendorDashboard';
import AddProductScreen from '../screens/vendor/AddProductScreen';
import ManageProductsScreen from '../screens/vendor/ManageProductsScreen';
import VendorOrdersScreen from '../screens/vendor/VendorOrdersScreen';
import VendorProfileScreen from '../screens/vendor/VendorProfileScreen';
import useStore from '../store/useStore';
import Text from '../autoTranslation/AutoText';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, label, focused, badgeCount }) {
  return (
    <View style={styles.tabItem}>
      <Text style={styles.emoji}>{emoji}</Text>
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount > 9 ? '9+' : badgeCount}</Text>
        </View>
      )}
      <Text style={[styles.label, focused && styles.labelFocused]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export default function VendorTabs() {
  const { vendorOrders, vendorNotifications } = useStore();
  const pendingOrders = (vendorOrders || []).filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;
  const unreadVendorNotifications = (vendorNotifications || []).filter((n) => !n.read).length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: COLORS.creamDark,
          height: 70,
          paddingBottom: 10,
        },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="VendorDashboard"
        component={VendorDashboard}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} /> }}
      />
      <Tab.Screen
        name="ManageProducts"
        component={ManageProductsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🛍️" label="Products" focused={focused} /> }}
      />
      <Tab.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="➕" label="Add" focused={focused} /> }}
      />
      <Tab.Screen
        name="VendorOrders"
        component={VendorOrdersScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📦" label="Orders" focused={focused} badgeCount={pendingOrders} /> }}
      />
      <Tab.Screen
        name="VendorProfile"
        component={VendorProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Settings" focused={focused} badgeCount={unreadVendorNotifications} /> }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', justifyContent: 'center', paddingTop: 6, width: 64, position: 'relative' },
  emoji: { fontSize: 22 },
  label: { fontSize: 10, fontWeight: '500', color: COLORS.textMuted, marginTop: 2 },
  labelFocused: { color: COLORS.saffron, fontWeight: '700' },
  badge: { position: 'absolute', top: 2, right: 4, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 3, backgroundColor: COLORS.bengalRed, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});
