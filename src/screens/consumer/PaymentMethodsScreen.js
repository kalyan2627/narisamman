import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const SAVED_METHODS = [
{ id: 'm1', type: 'upi', label: 'aarav@oksbi', name: 'SBI UPI', emoji: '📱', color: COLORS.purple },
{ id: 'm2', type: 'card', label: '**** **** **** 4242', name: 'HDFC Visa', emoji: '💳', color: COLORS.info }];


const ADD_OPTIONS = [
{ id: 'upi', emoji: '📱', label: "UPI ID", desc: "Pay instantly using any UPI app" },
{ id: 'card', emoji: '💳', label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
{ id: 'netbanking', emoji: '🏦', label: "Net Banking", desc: "All major Indian banks" },
{ id: 'wallet', emoji: '👛', label: "Wallet", desc: "Paytm, PhonePe, Amazon Pay" }];




export default function PaymentMethodsScreen({ navigation }) {const lang = useAppLanguage();

  const [selected, setSelected] = useState('m1');
  const [addUpi, setAddUpi] = useState('');
  const [showUpiForm, setShowUpiForm] = useState(false);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Payment Methods"} 💳</Text>
        <Text style={styles.headerSub}>{"Manage Payment"}</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Saved Methods */}
        <Text style={styles.sectionTitle}>{"Saved Methods"}</Text>
        {SAVED_METHODS.map((m) =>
        <TouchableOpacity key={m.id} onPress={() => setSelected(m.id)}
        style={[styles.methodCard, selected === m.id && styles.methodCardActive]}>
            <View style={[styles.methodIconBox, { backgroundColor: m.color + '20' }]}>
              <Text style={styles.methodEmoji}>{m.emoji}</Text>
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>{m.name}</Text>
              <Text style={styles.methodLabel}>{m.label}</Text>
            </View>
            <View style={[styles.radio, selected === m.id && styles.radioActive]} />
          </TouchableOpacity>
        )}

        {/* UPI Form */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>{"Add Upi Id"}</Text>
        <View style={styles.upiForm}>
          <TextInput
            style={styles.input}
            placeholder={"Enter UPI ID (e.g. name@upi)"}
            placeholderTextColor={COLORS.textMuted}
            value={addUpi}
            onChangeText={setAddUpi} />
          
          <TouchableOpacity style={styles.verifyBtn}
          onPress={() => {setAddUpi('');setShowUpiForm(false);}}>
            <Text style={styles.verifyBtnText}>{"Verify"} & {"Save"}</Text>
          </TouchableOpacity>
        </View>

        {/* Other Payment Options */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>{"More Payment Options"}</Text>
        {ADD_OPTIONS.map((opt) =>
        <View key={opt.id} style={styles.optionCard}>
            <Text style={styles.optionEmoji}>{opt.emoji}</Text>
            <View style={styles.optionInfo}>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Text style={styles.optionDesc}>{opt.desc}</Text>
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </View>
        )}

        <View style={styles.secureBox}>
          <Text style={styles.secureTitle}>🔒 {"Secure Payments"}</Text>
          <Text style={styles.secureText}>{"Secure Text"}</Text>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 24 },
  backBtn: { marginBottom: 16 },
  backText: { fontSize: 14, color: 'rgba(200,208,228,0.7)', fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(200,208,228,0.5)', marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  methodCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: COLORS.darkBorder, ...SHADOWS.small },
  methodCardActive: { borderColor: COLORS.purple, backgroundColor: COLORS.purple + '06' },
  methodIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  methodEmoji: { fontSize: 22 },
  methodInfo: { flex: 1 },
  methodName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  methodLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 3 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.textMuted },
  radioActive: { borderColor: COLORS.purple, backgroundColor: COLORS.purple },
  upiForm: { backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, ...SHADOWS.small, marginBottom: 8 },
  input: { backgroundColor: COLORS.darkCard, borderRadius: 12, padding: 14, fontSize: 14, color: COLORS.textPrimary, marginBottom: 12 },
  verifyBtn: { backgroundColor: COLORS.saffron, borderRadius: 50, paddingVertical: 12, alignItems: 'center' },
  verifyBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, marginBottom: 8, ...SHADOWS.small },
  optionEmoji: { fontSize: 24 },
  optionInfo: { flex: 1 },
  optionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  optionDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  optionArrow: { fontSize: 22, color: COLORS.textMuted },
  secureBox: { marginTop: 16, backgroundColor: COLORS.success + '15', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.success + '30' },
  secureTitle: { fontSize: 14, fontWeight: '700', color: COLORS.success, marginBottom: 8 },
  secureText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 }
});