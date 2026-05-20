import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity } from

'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import { navigate, resetToScreen } from '../../navigation/NavigationService';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";


const AVATAR_OPTIONS = ['👤', '👩‍🌾', '🌺', '🦋', '🌻', '🌼', '💫', '🌙', '⭐', '🎋', '🏵️', '🍀'];

export default function ProfileScreen({ navigation }) {
  const { user, orders, wishlist, logout, updateUserProfile } = useStore();const lang = useAppLanguage();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    avatar: user.avatar || '👤'
  });
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: user.avatar || '👤'
    });
  }, [user]);

  const stats = [
  { label: "My Orders", value: orders.length, emoji: '📦' },
  { label: "Wishlist", value: wishlist.length, emoji: '❤️' },
  { label: "Points", value: '240', emoji: '⭐' }];


  const menuItems = [
  { icon: '📦', label: "My Orders", sublabel: `${orders.length} orders placed`, onPress: () => navigate('OrderHistory') },
  { icon: '❤️', label: "Wishlist", sublabel: `${wishlist.length} saved items`, onPress: () => navigation.navigate('Wishlist') },
  { icon: '📍', label: "Saved Addresses", sublabel: `${user.addresses?.length || 0} saved addresses`, onPress: () => navigate('DeliveryAddress') },
  { icon: '🔔', label: "Notifications", sublabel: 'Manage your alerts', onPress: () => navigate('Notifications') },
  { icon: '🌐', label: "Select Language", sublabel: 'English · বাংলা · हिन्दी', onPress: () => navigation.navigate('LanguageSelect') },
  { icon: '💳', label: "Payment Methods", sublabel: 'UPI, Cards & more', onPress: () => navigate('PaymentMethods') },
  { icon: '🌱', label: "Impact Stories", sublabel: 'Your contribution to artisans', onPress: () => navigate('ImpactStory') },
  { icon: '❓', label: "Help & Support", sublabel: 'support@narisamman.in', onPress: () => navigate('HelpSupport') },
  { icon: '📄', label: 'Terms & Privacy', sublabel: 'Policies & conditions', onPress: () => {} }];


  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';else
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';else
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid 10-digit number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    updateUserProfile({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), avatar: form.avatar });
    setEditMode(false);
    setShowAvatarPicker(false);
  };

  const handleCancel = () => {
    setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', avatar: user.avatar || '👤' });
    setErrors({});
    setEditMode(false);
    setShowAvatarPicker(false);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#0F1822', '#1C2437', '#243050']} style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View style={{ width: 70 }} />
            <Text style={styles.heroTitle}>{"My Profile"}</Text>
            {!editMode ?
            <TouchableOpacity onPress={() => setEditMode(true)} style={styles.editBtn}>
                <Text style={styles.editBtnText}>✏️ {"Edit"}</Text>
              </TouchableOpacity> :

            <TouchableOpacity onPress={handleCancel} style={styles.cancelTopBtn}>
                <Text style={styles.cancelTopText}>✕ {"Cancel"}</Text>
              </TouchableOpacity>
            }
          </View>

          <TouchableOpacity
            onPress={() => editMode && setShowAvatarPicker((v) => !v)}
            style={[styles.avatarCircle, editMode && styles.avatarEditable]}
            activeOpacity={editMode ? 0.7 : 1}>
            
            <Text style={styles.avatarEmoji}>{editMode ? form.avatar : user.avatar}</Text>
            {editMode && <View style={styles.avatarBadge}><Text style={{ fontSize: 10, color: '#fff' }}>✏️</Text></View>}
          </TouchableOpacity>

          {editMode && showAvatarPicker &&
          <View style={styles.avatarPicker}>
              <Text style={styles.avatarPickerTitle}>{"Choose Avatar"}</Text>
              <View style={styles.avatarGrid}>
                {AVATAR_OPTIONS.map((em) =>
              <TouchableOpacity key={em} onPress={() => {setForm((f) => ({ ...f, avatar: em }));setShowAvatarPicker(false);}}
              style={[styles.avatarOption, form.avatar === em && styles.avatarOptionActive]}>
                    <Text style={{ fontSize: 22 }}>{em}</Text>
                  </TouchableOpacity>
              )}
              </View>
            </View>
          }

          {editMode ?
          <View style={styles.editForm}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{"Full Name Required"}</Text>
                <TextInput style={[styles.input, errors.name && styles.inputError]} value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} placeholder={"Enter your full name"}
              placeholderTextColor="rgba(200,208,228,0.35)" autoCapitalize="words" />
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{"Email Address *"}</Text>
                <TextInput style={[styles.input, errors.email && styles.inputError]} value={form.email}
              onChangeText={(v) => setForm((f) => ({ ...f, email: v }))} placeholder={"Enter your email"}
              placeholderTextColor="rgba(200,208,228,0.35)" keyboardType="email-address" autoCapitalize="none" />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{"Phone Number *"}</Text>
                <TextInput style={[styles.input, errors.phone && styles.inputError]} value={form.phone}
              onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="+91 XXXXX XXXXX"
              placeholderTextColor="rgba(200,208,228,0.35)" keyboardType="phone-pad" />
                {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
              </View>
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>💾 {"💾 Save Changes"}</Text>
              </TouchableOpacity>
            </View> :

          <>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userPhone}>{user.phone}</Text>
              <View style={styles.statsRow}>
                {stats.map((s) =>
              <TouchableOpacity key={s.label} style={styles.statItem}
              onPress={() => {if (s.label === 'Orders') navigate('OrderHistory');if (s.label === 'Wishlist') navigation.navigate('Wishlist');}}>
                    <Text style={styles.statEmoji}>{s.emoji}</Text>
                    <Text style={styles.statValue}>{s.value}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </TouchableOpacity>
              )}
              </View>
            </>
          }
        </LinearGradient>

        {!editMode &&
        <LinearGradient colors={[COLORS.gold + '30', COLORS.saffron + '15']} style={styles.loyaltyCard}>
            <Text style={styles.loyaltyEmoji}>🌟</Text>
            <View style={styles.loyaltyInfo}>
              <Text style={styles.loyaltyTitle}>{"Nari Samman Patron"}</Text>
              <Text style={styles.loyaltySubtitle}>{"Silver Member"}</Text>
            </View>
            <TouchableOpacity style={styles.loyaltyBtn}>
              <Text style={styles.loyaltyBtnText}>{"View Benefits"}</Text>
            </TouchableOpacity>
          </LinearGradient>
        }

        {!editMode &&
        <View style={styles.menuSection}>
            {menuItems.map((item, i) =>
          <TouchableOpacity key={i} onPress={item.onPress}
          style={[styles.menuItem, i === menuItems.length - 1 && styles.menuItemLast]} activeOpacity={0.7}>
                <View style={styles.menuIconBox}><Text style={styles.menuIcon}>{item.icon}</Text></View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.sublabel ? <Text style={styles.menuSublabel}>{item.sublabel}</Text> : null}
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
          )}
          </View>
        }

        {!editMode &&
        <TouchableOpacity onPress={() => setShowLogoutConfirm(true)} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>🚪 {"Logout"}</Text>
          </TouchableOpacity>
        }

        <Text style={styles.footer}>{"Nari Samman v1.0 · IS&SF Initiative"}</Text>
        <View style={{ height: 30 }} />
      </ScrollView>

      {showLogoutConfirm &&
      <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmEmoji}>🚪</Text>
            <Text style={styles.confirmTitle}>{"Logout"}</Text>
            <Text style={styles.confirmMsg}>{"Are You Sure Logout"}</Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity onPress={() => setShowLogoutConfirm(false)} style={styles.modalCancelBtn}>
                <Text style={styles.modalCancelText}>{"Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {setShowLogoutConfirm(false);logout();resetToScreen('RoleSelect');}} style={styles.confirmLogoutBtn}>
                <Text style={styles.confirmLogoutText}>{"Logout"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    </View>);

}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.dark },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  hero: { paddingTop: 52, paddingBottom: 30, alignItems: 'center', paddingHorizontal: 24 },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 16 },
  heroTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  editBtn: { backgroundColor: 'rgba(245,166,35,0.15)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.gold + '50' },
  editBtnText: { fontSize: 13, color: COLORS.gold, fontWeight: '700' },
  cancelTopBtn: { backgroundColor: 'rgba(200,208,228,0.1)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(200,208,228,0.2)' },
  cancelTopText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(245,166,35,0.2)', borderWidth: 3, borderColor: COLORS.gold, alignItems: 'center', justifyContent: 'center', marginBottom: 14, position: 'relative' },
  avatarEditable: { borderColor: COLORS.saffron },
  avatarBadge: { position: 'absolute', bottom: 2, right: 2, width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.saffron, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 42 },
  avatarPicker: { width: '100%', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: 14, marginBottom: 12 },
  avatarPickerTitle: { fontSize: 12, color: COLORS.textMuted, marginBottom: 10, textAlign: 'center' },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  avatarOption: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  avatarOptionActive: { backgroundColor: COLORS.gold + '30', borderWidth: 2, borderColor: COLORS.gold },
  editForm: { width: '100%' },
  fieldGroup: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, color: 'rgba(200,208,228,0.65)', marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(200,208,228,0.2)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: '#fff' },
  inputError: { borderColor: COLORS.bengalRed },
  errorText: { fontSize: 11, color: COLORS.bengalRed, marginTop: 4 },
  saveBtn: { marginTop: 8, backgroundColor: COLORS.saffron, borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  saveBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  userName: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  userEmail: { fontSize: 13, color: 'rgba(200,208,228,0.6)' },
  userPhone: { fontSize: 13, color: 'rgba(200,208,228,0.5)', marginTop: 2 },
  statsRow: { flexDirection: 'row', marginTop: 24, width: '100%', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 4, paddingVertical: 8, paddingHorizontal: 16 },
  statEmoji: { fontSize: 22 },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.gold },
  statLabel: { fontSize: 11, color: 'rgba(200,208,228,0.6)' },
  loyaltyCard: { margin: 16, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  loyaltyEmoji: { fontSize: 32 },
  loyaltyInfo: { flex: 1 },
  loyaltyTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  loyaltySubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  loyaltyBtn: { backgroundColor: COLORS.saffron + '30', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  loyaltyBtnText: { fontSize: 12, color: COLORS.saffronDark, fontWeight: '700' },
  menuSection: { marginHorizontal: 16, backgroundColor: COLORS.darkCard, borderRadius: 20, ...SHADOWS.small, overflow: 'hidden', marginBottom: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: COLORS.darkBorder },
  menuItemLast: { borderBottomWidth: 0 },
  menuIconBox: { width: 40, height: 40, borderRadius: 13, backgroundColor: COLORS.darkCard, alignItems: 'center', justifyContent: 'center' },
  menuIcon: { fontSize: 18 },
  menuTextCol: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  menuSublabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  menuArrow: { fontSize: 22, color: COLORS.textMuted },
  logoutBtn: { margin: 16, backgroundColor: COLORS.bengalRed + '15', borderRadius: 20, borderWidth: 1, borderColor: COLORS.bengalRed + '40', paddingVertical: 14, alignItems: 'center' },
  logoutText: { fontSize: 15, fontWeight: '700', color: COLORS.bengalRed },
  footer: { textAlign: 'center', fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  confirmBox: { backgroundColor: COLORS.darkCard, borderRadius: 24, padding: 28, alignItems: 'center', width: 300, ...SHADOWS.large },
  confirmEmoji: { fontSize: 40, marginBottom: 12 },
  confirmTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  confirmMsg: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  confirmBtns: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
  modalCancelBtn: { flex: 1, borderWidth: 1.5, borderColor: COLORS.darkBorder, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  confirmLogoutBtn: { flex: 1, backgroundColor: COLORS.bengalRed, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  confirmLogoutText: { fontSize: 14, fontWeight: '700', color: '#fff' }
});