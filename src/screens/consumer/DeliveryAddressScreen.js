import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";

export default function DeliveryAddressScreen({ navigation }) {const lang = useAppLanguage();

  const { user } = useStore();
  const [addresses, setAddresses] = useState(user.addresses);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(user.addresses[0]?.id);
  const [newLabel, setNewLabel] = useState('');
  const [newLine, setNewLine] = useState('');

  const addAddress = () => {
    if (!newLabel.trim() || !newLine.trim()) {
      if (Platform.OS === 'web') alert("Please fill in both fields");else
      Alert.alert("Error", "Please fill in both fields");
      return;
    }
    const addr = { id: `addr${Date.now()}`, label: newLabel, line: newLine, default: false };
    setAddresses((prev) => [...prev, addr]);
    setNewLabel('');
    setNewLine('');
    setShowForm(false);
  };

  const removeAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Delivery Address"} 📍</Text>
        <Text style={styles.headerSub}>{addresses.length} {"saved address(es)"}</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {addresses.map((addr) =>
        <View key={addr.id} style={[styles.addrCard, selected === addr.id && styles.addrCardActive]}>
            <TouchableOpacity style={styles.addrMain} onPress={() => setSelected(addr.id)}>
              <View style={[styles.radio, selected === addr.id && styles.radioActive]} />
              <View style={styles.addrBody}>
                <View style={styles.addrLabelRow}>
                  <View style={styles.labelBadge}>
                    <Text style={styles.labelBadgeText}>{addr.label}</Text>
                  </View>
                  {addr.default && <Text style={styles.defaultTag}>{"Default"}</Text>}
                </View>
                <Text style={styles.addrLine}>{addr.line}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.addrActions}>
              <TouchableOpacity onPress={() => removeAddress(addr.id)}>
                <Text style={styles.removeText}>{"Remove"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {showForm ?
        <View style={styles.formCard}>
            <Text style={styles.formTitle}>➕ {"Add New Address"}</Text>
            <TextInput
            style={styles.input}
            placeholder={"Label (e.g. Home, Office)"}
            placeholderTextColor={COLORS.textMuted}
            value={newLabel}
            onChangeText={setNewLabel} />
          
            <TextInput
            style={[styles.input, styles.inputMulti]}
            placeholder={"Full address with city and PIN"}
            placeholderTextColor={COLORS.textMuted}
            value={newLine}
            onChangeText={setNewLine}
            multiline
            numberOfLines={3} />
          
            <View style={styles.formBtns}>
              <TouchableOpacity onPress={() => setShowForm(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>{"Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addAddress} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>{"Save Address"}</Text>
              </TouchableOpacity>
            </View>
          </View> :

        <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ {"Add New Address"}</Text>
          </TouchableOpacity>
        }

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📦 {"Delivery Info"}</Text>
          <Text style={styles.infoText}>{"• Free delivery on orders above ₹500\n• Standard delivery: 5–7 business days\n• Dispatched from Sandeshkhali Warehouse, N24PGS"}</Text>
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
  addrCard: { backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: COLORS.darkBorder, ...SHADOWS.small },
  addrCardActive: { borderColor: COLORS.saffron, backgroundColor: COLORS.saffron + '06' },
  addrMain: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.textMuted, marginTop: 2, flexShrink: 0 },
  radioActive: { borderColor: COLORS.saffron, backgroundColor: COLORS.saffron },
  addrBody: { flex: 1 },
  addrLabelRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 },
  labelBadge: { backgroundColor: COLORS.saffron + '20', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  labelBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.saffron },
  defaultTag: { fontSize: 11, color: COLORS.success, fontWeight: '600' },
  addrLine: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  addrActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderColor: COLORS.darkBorder },
  removeText: { fontSize: 13, color: COLORS.bengalRed, fontWeight: '600' },
  formCard: { backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 20, marginBottom: 12, ...SHADOWS.small },
  formTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  input: { backgroundColor: COLORS.darkCard, borderRadius: 12, padding: 14, fontSize: 14, color: COLORS.textPrimary, marginBottom: 12 },
  inputMulti: { height: 80, textAlignVertical: 'top' },
  formBtns: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 50, borderWidth: 1.5, borderColor: COLORS.darkBorder, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },
  saveBtn: { flex: 2, paddingVertical: 12, borderRadius: 50, backgroundColor: COLORS.saffron, alignItems: 'center' },
  saveBtnText: { fontSize: 14, color: '#fff', fontWeight: '700' },
  addBtn: { borderWidth: 1.5, borderColor: COLORS.saffron, borderStyle: 'dashed', borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginBottom: 16 },
  addBtnText: { fontSize: 14, color: COLORS.saffron, fontWeight: '600' },
  infoBox: { backgroundColor: COLORS.green + '15', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: COLORS.greenLight + '30' },
  infoTitle: { fontSize: 14, fontWeight: '700', color: COLORS.green, marginBottom: 10 },
  infoText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22 }
});