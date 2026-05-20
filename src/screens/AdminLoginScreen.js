import React, { useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import useStore from '../store/useStore';
import { publicFetch } from '../utils/api';
import Text from "../autoTranslation/AutoText";
import TextInput from "../autoTranslation/AutoTextInput";
import useAppLanguage from "../autoTranslation/useAppLanguage";
import NariLogoIcon from '../components/NariLogoIcon';

const KeyboardAvoidingWrapper = ({ children }) => {
  if (Platform.OS === 'web') {
    return <View style={{ flex: 1 }}>{children}</View>;
  }
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const loginUser = useStore((s) => s.loginUser);
  const lang = useAppLanguage();

  const validate = () => {
    const e = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required';
    if (!password || password.length < 6) e.password = 'Password required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    setLoginError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await publicFetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      setLoading(false);
      
      if (res.status === 200 && data.token) {
        loginUser('admin', { email: data.email }, data.token);
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'AdminStack' }] }));
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setLoginError('Failed to connect to server');
    }
  };

  return (
    <LinearGradient colors={['#0A0F1A', '#0F1822', '#1C2437']} style={styles.container}>
      <KeyboardAvoidingWrapper>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always" keyboardDismissMode="none">

          {/* Back */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>{"← Back"}</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <LinearGradient colors={[COLORS.purple + 'CC', COLORS.primary]} style={styles.iconCircle}>
              <Text style={styles.headerIcon}>⚙️</Text>
            </LinearGradient>
            <View style={styles.brandNameRow}>
              <NariLogoIcon size={35} />
              <Text style={{...styles.appName, marginBottom: 0}}>{"Nari Samman".toUpperCase()}</Text>
            </View>
            <Text style={styles.title}>{"Admin Portal"}</Text>
            <Text style={styles.subtitle}>{"Restricted access — authorized personnel only"}</Text>
          </View>

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <Text style={styles.securityIcon}>🔐</Text>
            <Text style={styles.securityText}>{"Secure Admin Access · IS&SF Initiative"}</Text>
          </View>

          {/* Login Form */}
          <View style={styles.card}>
            {/* Global error */}
            {loginError ?
            <View style={styles.globalError}>
                <Text style={styles.globalErrorText}>⚠️  {loginError}</Text>
              </View> :
            null}

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{"ADMIN EMAIL"}</Text>
              <View style={[styles.inputRow, errors.email && styles.inputError]}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="admin@narisamman.in"
                  placeholderTextColor="rgba(200,208,228,0.3)"
                  value={email}
                  onChangeText={(v) => {setEmail(v);setErrors((e) => ({ ...e, email: null }));setLoginError('');}}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false} />
                
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{"Password".toUpperCase()}</Text>
              <View style={[styles.inputRow, errors.password && styles.inputError]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder={"Enter admin password"}
                  placeholderTextColor="rgba(200,208,228,0.3)"
                  value={password}
                  onChangeText={(v) => {setPassword(v);setErrors((e) => ({ ...e, password: null }));setLoginError('');}}
                  secureTextEntry={!showPass}
                  autoCapitalize="none" />
                
                <TouchableOpacity onPress={() => setShowPass((v) => !v)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showPass ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Submit */}
            <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85} style={{ marginTop: 8 }}>
              <LinearGradient
                colors={[COLORS.primaryDark, COLORS.primary]}
                style={styles.submitBtn}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                
                <Text style={styles.submitText}>{loading ? "Verifying..." : "Access Admin Portal  →"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Warning strip */}
          <View style={styles.warningStrip}>
            <Text style={styles.warningText}>
              ⚠️  {"Unauthorized access is strictly prohibited.\nAll login attempts are monitored and logged."}
            </Text>
          </View>

          {/* Admin capabilities */}
          <View style={styles.capabilitiesCard}>
            <Text style={styles.capTitle}>{"🏛️ Admin Capabilities"}</Text>
            {[
            '✅ Approve / reject SHG registrations & products',
            '💸 Manage vendor payout requests',
            '🚚 Monitor logistics & dispatches',
            '📊 View Revenue & NABARD Reports',
            '👩 Manage 200+ SHG groups & artisans',
            '📣 Send announcements to all users'].
            map((c, i) =>
            <Text key={i} style={styles.capItem}>{c}</Text>
            )}
          </View>

          <Text style={styles.footer}>{"IS&SF Initiative · Empowering Rural West Bengal"}</Text>
        </ScrollView>
      </KeyboardAvoidingWrapper>
    </LinearGradient>);
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 70 },

  backBtn: { marginTop: 52, marginBottom: 8 },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },

  header: { alignItems: 'center', paddingVertical: 24 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16
  },
  headerIcon: { fontSize: 38 },
  brandNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 },
  appName: { fontSize: 11, color: COLORS.primary, fontWeight: '800', letterSpacing: 2, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 13, color: 'rgba(200,208,228,0.45)', textAlign: 'center', marginTop: 6, lineHeight: 20 },

  securityBadge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginBottom: 20,
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.25)',
    alignSelf: 'center'
  },
  securityIcon: { fontSize: 16 },
  securityText: { fontSize: 12, color: COLORS.purple, fontWeight: '600' },

  card: {
    backgroundColor: 'rgba(19,29,41,0.98)',
    borderRadius: 22, padding: 24,
    borderWidth: 1, borderColor: 'rgba(200,208,228,0.1)', marginBottom: 20
  },

  globalError: {
    backgroundColor: COLORS.error + '18', borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.error + '40',
    padding: 12, marginBottom: 16
  },
  globalErrorText: { fontSize: 13, color: COLORS.error, fontWeight: '600', lineHeight: 18 },

  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 11, fontWeight: '700', color: 'rgba(200,208,228,0.5)', marginBottom: 8, letterSpacing: 1 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 13, borderWidth: 1.5,
    borderColor: 'rgba(200,208,228,0.12)',
    paddingHorizontal: 14, height: 54
  },
  inputError: { borderColor: COLORS.error },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary, height: 54 },
  eyeBtn: { paddingLeft: 8 },
  eyeIcon: { fontSize: 18 },
  errorText: { fontSize: 11, color: COLORS.error, marginTop: 5 },

  submitBtn: {
    borderRadius: 14, paddingVertical: 17,
    alignItems: 'center'
  },
  submitText: { fontSize: 16, fontWeight: '800', color: '#0F1822', letterSpacing: 0.3 },

  warningStrip: {
    backgroundColor: 'rgba(231,76,60,0.08)',
    borderRadius: 14, borderWidth: 1,
    borderColor: 'rgba(231,76,60,0.2)',
    padding: 14, marginBottom: 20
  },
  warningText: { fontSize: 12, color: 'rgba(231,76,60,0.7)', textAlign: 'center', lineHeight: 18, fontWeight: '500' },

  capabilitiesCard: {
    backgroundColor: 'rgba(157,205,67,0.06)',
    borderRadius: 18, borderWidth: 1,
    borderColor: 'rgba(157,205,67,0.18)',
    padding: 18, marginBottom: 28, gap: 10
  },
  capTitle: { fontSize: 14, fontWeight: '800', color: COLORS.primary, marginBottom: 6 },
  capItem: { fontSize: 13, color: 'rgba(200,208,228,0.75)', lineHeight: 20 },

  footer: { textAlign: 'center', fontSize: 11, color: 'rgba(200,208,228,0.2)' }
});
