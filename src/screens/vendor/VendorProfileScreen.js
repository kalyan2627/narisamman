import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Platform, Switch } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import { resetToScreen } from '../../navigation/NavigationService';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";


/* ─── tiny SVG-free icon helpers ─────────────────────────────────────────── */
const ROW_ICONS = {
  name: '👤', phone: '📞', email: '✉️', location: '📍',
  shg: '🤝', members: '👥', category: '🏷️', rating: '⭐',
  bank: '🏦', account: '🔢', ifsc: '🔤', upi: '📱',
  kyc: '🪪', gstin: '📋', fssai: '🍃', aadhaar: '🆔'
};

/* ─── editable field component ──────────────────────────────────────────── */
function EditableField({ icon, label, value, editable, onChangeText, keyboardType = 'default', placeholder }) {const lang = useAppLanguage();

  return (
    <View style={fieldStyles.row}>
      <Text style={fieldStyles.icon}>{icon}</Text>
      <View style={fieldStyles.body}>
        <Text style={fieldStyles.label}>{label}</Text>
        {editable ?
        <TextInput
          style={fieldStyles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          placeholderTextColor={COLORS.textMuted} /> :


        <Text style={fieldStyles.value}>{value || '—'}</Text>
        }
      </View>
    </View>);

}

const fieldStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 12 },
  icon: { fontSize: 20, marginTop: 2, width: 24, textAlign: 'center' },
  body: { flex: 1 },
  label: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500', marginBottom: 3 },
  value: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  input: {
    fontSize: 14, color: COLORS.textPrimary, fontWeight: '500',
    borderBottomWidth: 1.5, borderBottomColor: COLORS.primary,
    paddingBottom: 4, paddingTop: 2
  }
});

/* ─── section card ──────────────────────────────────────────────────────── */
function Section({ title, emoji, onEdit, editMode, onSave, onCancel, children }) {const lang = useAppLanguage();

  return (
    <View style={sectionStyles.card}>
      <View style={sectionStyles.header}>
        <Text style={sectionStyles.title}>{emoji} {title}</Text>
        {onEdit && !editMode &&
        <TouchableOpacity onPress={onEdit} style={sectionStyles.editBtn}>
            <Text style={sectionStyles.editText}>✏️ {"Edit"}</Text>
          </TouchableOpacity>
        }
        {editMode &&
        <View style={sectionStyles.editActions}>
            <TouchableOpacity onPress={onCancel} style={sectionStyles.cancelBtn}>
              <Text style={sectionStyles.cancelText}>{"Cancel"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={sectionStyles.saveBtn}>
              <Text style={sectionStyles.saveText}>{"Save ✓"}</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
      {children}
    </View>);

}

const sectionStyles = StyleSheet.create({
  card: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 18, marginBottom: 14, ...SHADOWS.small },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  editBtn: { backgroundColor: COLORS.primary + '20', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  editText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  editActions: { flexDirection: 'row', gap: 8 },
  cancelBtn: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: COLORS.darkBorder },
  cancelText: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  saveText: { fontSize: 12, fontWeight: '700', color: '#1C2437' }
});

/* ─── main screen ────────────────────────────────────────────────────────── */
export default function VendorProfileScreen({ navigation }) {
  const { vendorProfile, vendorOrders, vendorNotifications, logout, markVendorNotifRead } = useStore();const lang = useAppLanguage();


  /* live stats */
  const totalEarnings = vendorOrders.filter((o) => o.status === 'delivered' && o.paymentStatus === 'paid').reduce((s, o) => s + o.amount, 0);
  const pendingPayout = vendorOrders.filter((o) => o.status === 'delivered' && ['pending_payment', 'payout_requested'].includes(o.paymentStatus)).reduce((s, o) => s + o.amount, 0);
  const activeOrders = vendorOrders.filter((o) => ['confirmed', 'packed', 'shipped'].includes(o.status)).length;

  /* unread vendor notifs */
  const unreadNotifs = (vendorNotifications || []).filter((n) => !n.read);

  /* ── edit states ── */
  const [personalEdit, setPersonalEdit] = useState(false);
  const [bankEdit, setBankEdit] = useState(false);
  const [kycEdit, setKycEdit] = useState(false);
  const [notifPanel, setNotifPanel] = useState(false);

  /* personal form */
  const [pForm, setPForm] = useState({
    name: vendorProfile.name,
    phone: vendorProfile.phone,
    email: vendorProfile.email || '',
    location: vendorProfile.location,
    shgName: vendorProfile.shgName,
    members: vendorProfile.members?.toString() || '16',
    category: vendorProfile.category || 'Handloom & Textiles',
    bio: vendorProfile.bio || 'Handwoven textiles by women artisans of Bengal.'
  });

  /* bank form */
  const [bForm, setBForm] = useState({
    accountHolder: vendorProfile.name,
    accountNumber: '••••••••3821',
    bankName: 'State Bank of India',
    ifsc: 'SBIN0001234',
    branch: 'Nadia Main Branch',
    upi: vendorProfile.upi || ''
  });

  /* kyc form */
  const [kForm, setKForm] = useState({
    aadhaar: vendorProfile.aadhaar || 'XXXX-XXXX-3456',
    gstin: vendorProfile.gstin || '',
    fssai: vendorProfile.fssai || '',
    kycStatus: vendorProfile.kycStatus || 'verified'
  });

  /* notification preferences */
  const [notifPrefs, setNotifPrefs] = useState({
    orderUpdates: true,
    payoutAlerts: true,
    promotions: false,
    smsAlerts: true
  });

  const savePersonal = () => {setPersonalEdit(false);};
  const saveBank = () => {setBankEdit(false);};
  const saveKyc = () => {setKycEdit(false);};

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      logout();resetToScreen('RoleSelect');
    } else {
      Alert.alert('Logout', 'Log out from vendor portal?', [
      { text: 'Cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => {logout();resetToScreen('RoleSelect');} }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── hero ── */}
        <LinearGradient colors={['#0F1822', '#1C2437', '#243050']} style={styles.hero}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>{"← Back"}</Text>
          </TouchableOpacity>

          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>{vendorProfile.avatar}</Text>
              <View style={styles.kycBadge}>
                <Text style={styles.kycBadgeText}>✓</Text>
              </View>
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>{pForm.name}</Text>
              <Text style={styles.heroShg}>{pForm.shgName}</Text>
              <Text style={styles.heroLoc}>📍 {pForm.location}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingText}>⭐ {vendorProfile.rating}</Text>
                <Text style={styles.ratingDot}>·</Text>
                <Text style={styles.ratingText}>{vendorProducts_count()} products live</Text>
              </View>
            </View>
          </View>

          {/* stat pills */}
          <View style={styles.statRow}>
            <TouchableOpacity style={styles.statPill} onPress={() => navigation.navigate('TotalEarnings')}>
              <Text style={styles.statPillVal}>₹{(totalEarnings / 1000).toFixed(1)}K</Text>
              <Text style={styles.statPillLabel}>{"Earned ↗"}</Text>
            </TouchableOpacity>
            <View style={styles.statPillDivider} />
            <TouchableOpacity style={styles.statPill} onPress={() => navigation.navigate('PendingPayout')}>
              <Text style={[styles.statPillVal, { color: COLORS.warning }]}>₹{pendingPayout.toLocaleString()}</Text>
              <Text style={styles.statPillLabel}>{"Pending ↗"}</Text>
            </TouchableOpacity>
            <View style={styles.statPillDivider} />
            <TouchableOpacity style={styles.statPill} onPress={() => navigation.navigate('VendorOrders')}>
              <Text style={styles.statPillVal}>{activeOrders}</Text>
              <Text style={styles.statPillLabel}>{"Active Orders"}</Text>
            </TouchableOpacity>
            <View style={styles.statPillDivider} />
            <View style={styles.statPill}>
              <Text style={styles.statPillVal}>{vendorOrders.length}</Text>
              <Text style={styles.statPillLabel}>{"Total Orders"}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── KYC + bank status chips ── */}
        <View style={styles.chipsRow}>
          <View style={[styles.statusChip, { borderColor: COLORS.success }]}>
            <Text style={styles.statusChipEmoji}>🪪</Text>
            <View>
              <Text style={styles.statusChipLabel}>{"KYC Status"}</Text>
              <Text style={[styles.statusChipVal, { color: COLORS.success }]}>{"Verified ✓"}</Text>
            </View>
          </View>
          <View style={[styles.statusChip, { borderColor: COLORS.info }]}>
            <Text style={styles.statusChipEmoji}>🏦</Text>
            <View>
              <Text style={styles.statusChipLabel}>{"Bank Account"}</Text>
              <Text style={[styles.statusChipVal, { color: COLORS.info }]}>{"Linked ✓"}</Text>
            </View>
          </View>
          {unreadNotifs.length > 0 &&
          <TouchableOpacity
            style={[styles.statusChip, { borderColor: COLORS.warning }]}
            onPress={() => setNotifPanel(true)}>
            
              <Text style={styles.statusChipEmoji}>🔔</Text>
              <View>
                <Text style={styles.statusChipLabel}>{"Notifications"}</Text>
                <Text style={[styles.statusChipVal, { color: COLORS.warning }]}>{unreadNotifs.length} new</Text>
              </View>
            </TouchableOpacity>
          }
        </View>

        {/* ── notifications panel ── */}
        {notifPanel && unreadNotifs.length > 0 &&
        <View style={styles.notifPanel}>
            <View style={styles.notifPanelHeader}>
              <Text style={styles.notifPanelTitle}>{"🔔 Notifications"}</Text>
              <TouchableOpacity onPress={() => setNotifPanel(false)}>
                <Text style={styles.notifClose}>✕ {"Close"}</Text>
              </TouchableOpacity>
            </View>
            {unreadNotifs.map((n) =>
          <TouchableOpacity
            key={n.id}
            style={styles.notifItem}
            onPress={() => markVendorNotifRead(n.id)}>
            
                <View style={[
            styles.notifDot,
            { backgroundColor: n.type === 'payment' ? COLORS.success : COLORS.warning }]
            } />
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifMsg}>{n.message}</Text>
                  <Text style={styles.notifTime}>{n.time}  ·  Tap to mark read</Text>
                </View>
              </TouchableOpacity>
          )}
          </View>
        }

        {/* ── quick actions ── */}
        <View style={styles.quickActions}>
          {[
          { emoji: '📦', label: "My Orders", onPress: () => navigation.navigate('VendorOrders') },
          { emoji: '💸', label: "Pending Payout", onPress: () => navigation.navigate('PendingPayout') },
          { emoji: '🛍️', label: "My Products", onPress: () => navigation.navigate('ManageProducts') },
          { emoji: '🌐', label: "Select Language", onPress: () => navigation.navigate('LanguageSelect') }].
          map((a, i) =>
          <TouchableOpacity key={i} onPress={a.onPress} style={styles.quickBtn}>
              <Text style={styles.quickEmoji}>{a.emoji}</Text>
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── personal details ── */}
        <Section
          title="Personal Details" emoji="👤"
          onEdit={() => setPersonalEdit(true)}
          editMode={personalEdit}
          onSave={savePersonal}
          onCancel={() => setPersonalEdit(false)}>
          
          <EditableField icon={ROW_ICONS.name} label="Full Name" value={pForm.name} editable={personalEdit} onChangeText={(v) => setPForm((f) => ({ ...f, name: v }))} />
          <EditableField icon={ROW_ICONS.phone} label="Phone" value={pForm.phone} editable={personalEdit} onChangeText={(v) => setPForm((f) => ({ ...f, phone: v }))} keyboardType="phone-pad" />
          <EditableField icon={ROW_ICONS.email} label="Email" value={pForm.email} editable={personalEdit} onChangeText={(v) => setPForm((f) => ({ ...f, email: v }))} keyboardType="email-address" placeholder={"Enter email (optional)"} />
          <EditableField icon={ROW_ICONS.location} label="Location" value={pForm.location} editable={personalEdit} onChangeText={(v) => setPForm((f) => ({ ...f, location: v }))} />
          <EditableField icon={ROW_ICONS.shg} label="SHG Name" value={pForm.shgName} editable={personalEdit} onChangeText={(v) => setPForm((f) => ({ ...f, shgName: v }))} />
          <EditableField icon={ROW_ICONS.members} label="SHG Members" value={pForm.members} editable={personalEdit} onChangeText={(v) => setPForm((f) => ({ ...f, members: v }))} keyboardType="numeric" />
          <EditableField icon={ROW_ICONS.category} label="Product Category" value={pForm.category} editable={personalEdit} onChangeText={(v) => setPForm((f) => ({ ...f, category: v }))} />
          {personalEdit &&
          <View style={fieldStyles.row}>
              <Text style={fieldStyles.icon}>📝</Text>
              <View style={{ flex: 1 }}>
                <Text style={fieldStyles.label}>{"Short Bio"}</Text>
                <TextInput
                style={[fieldStyles.input, { minHeight: 60 }]}
                value={pForm.bio}
                onChangeText={(v) => setPForm((f) => ({ ...f, bio: v }))}
                multiline
                placeholder={"Tell your artisan story..."}
                placeholderTextColor={COLORS.textMuted} />
              
              </View>
            </View>
          }
          {!personalEdit && pForm.bio ?
          <View style={styles.bioBox}>
              <Text style={styles.bioText}>📝 {pForm.bio}</Text>
            </View> :
          null}
        </Section>

        {/* ── bank details ── */}
        <Section
          title="Bank & Payment Details" emoji="🏦"
          onEdit={() => setBankEdit(true)}
          editMode={bankEdit}
          onSave={saveBank}
          onCancel={() => setBankEdit(false)}>
          
          <View style={styles.bankWarning}>
            <Text style={styles.bankWarningText}>{"🔒 Bank details are encrypted and used only for payouts"}</Text>
          </View>
          <EditableField icon={ROW_ICONS.name} label="Account Holder" value={bForm.accountHolder} editable={bankEdit} onChangeText={(v) => setBForm((f) => ({ ...f, accountHolder: v }))} />
          <EditableField icon={ROW_ICONS.account} label="Account Number" value={bForm.accountNumber} editable={bankEdit} onChangeText={(v) => setBForm((f) => ({ ...f, accountNumber: v }))} keyboardType="numeric" />
          <EditableField icon={ROW_ICONS.bank} label="Bank Name" value={bForm.bankName} editable={bankEdit} onChangeText={(v) => setBForm((f) => ({ ...f, bankName: v }))} />
          <EditableField icon={ROW_ICONS.ifsc} label="IFSC Code" value={bForm.ifsc} editable={bankEdit} onChangeText={(v) => setBForm((f) => ({ ...f, ifsc: v.toUpperCase() }))} placeholder="e.g. SBIN0001234" />
          <EditableField icon="🏢" label="Branch" value={bForm.branch} editable={bankEdit} onChangeText={(v) => setBForm((f) => ({ ...f, branch: v }))} />
          <EditableField icon={ROW_ICONS.upi} label="UPI ID (optional)" value={bForm.upi} editable={bankEdit} onChangeText={(v) => setBForm((f) => ({ ...f, upi: v }))} placeholder="yourname@upi (optional)" />
          {!bankEdit &&
          <View style={styles.verifiedRow}>
              <View style={styles.verifiedChip}>
                <Text style={styles.verifiedText}>{"✓ Bank Verified by IS&SF"}</Text>
              </View>
            </View>
          }
        </Section>

        {/* ── KYC & Compliance ── */}
        <Section
          title="KYC & Compliance" emoji="🪪"
          onEdit={() => setKycEdit(true)}
          editMode={kycEdit}
          onSave={saveKyc}
          onCancel={() => setKycEdit(false)}>
          
          <View style={styles.kycStatusBanner}>
            <Text style={styles.kycStatusEmoji}>✅</Text>
            <View>
              <Text style={styles.kycStatusTitle}>KYC {"Verified"}</Text>
              <Text style={styles.kycStatusSub}>{"Your identity has been verified by IS&SF"}</Text>
            </View>
          </View>
          <EditableField icon={ROW_ICONS.aadhaar} label="Aadhaar Number" value={kForm.aadhaar} editable={kycEdit} onChangeText={(v) => setKForm((f) => ({ ...f, aadhaar: v }))} keyboardType="numeric" />
          <EditableField icon={ROW_ICONS.gstin} label="GSTIN (if any)" value={kForm.gstin} editable={kycEdit} onChangeText={(v) => setKForm((f) => ({ ...f, gstin: v.toUpperCase() }))} placeholder={"Enter GSTIN if registered"} />
          <EditableField icon={ROW_ICONS.fssai} label="FSSAI Lic. (food)" value={kForm.fssai} editable={kycEdit} onChangeText={(v) => setKForm((f) => ({ ...f, fssai: v }))} placeholder={"Required if selling food products"} />
          {!kycEdit &&
          <View style={styles.kycDocs}>
              <Text style={styles.kycDocsTitle}>{"📎 Uploaded Documents"}</Text>
              {['Aadhaar Card ✓', 'Bank Passbook ✓', 'SHG Registration ✓'].map((d, i) =>
            <Text key={i} style={styles.kycDocItem}>• {d}</Text>
            )}
              <TouchableOpacity style={styles.uploadMoreBtn}>
                <Text style={styles.uploadMoreText}>{"+ Upload More Documents"}</Text>
              </TouchableOpacity>
            </View>
          }
        </Section>

        {/* ── notification preferences ── */}
        <View style={sectionStyles.card}>
          <View style={sectionStyles.header}>
            <Text style={sectionStyles.title}>{"🔔 Notification Preferences"}</Text>
          </View>
          {[
          { key: 'orderUpdates', label: 'Order Updates', desc: 'New orders, status changes' },
          { key: 'payoutAlerts', label: 'Payout Alerts', desc: 'Payment received, payout status' },
          { key: 'promotions', label: 'Platform News', desc: 'Nari Samman Announcements' },
          { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Critical alerts via SMS' }].
          map((item) =>
          <View key={item.key} style={styles.prefRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.prefLabel}>{item.label}</Text>
                <Text style={styles.prefDesc}>{item.desc}</Text>
              </View>
              <Switch
              value={notifPrefs[item.key]}
              onValueChange={(v) => setNotifPrefs((p) => ({ ...p, [item.key]: v }))}
              trackColor={{ false: COLORS.darkBorder, true: COLORS.primary + '80' }}
              thumbColor={notifPrefs[item.key] ? COLORS.primary : COLORS.textMuted} />
            
            </View>
          )}
        </View>

        {/* ── IS&SF support info ── */}
        <LinearGradient colors={[COLORS.primary + '15', COLORS.primary + '05']} style={styles.supportCard}>
          <Text style={styles.supportEmoji}>🤝</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.supportTitle}>{"IS&SF Nari Samman Support"}</Text>
            <Text style={styles.supportText}>{"For account issues, KYC re-verification, or payout disputes, contact your IS&SF coordinator or call the helpline."}</Text>
            <TouchableOpacity style={styles.supportBtn}>
              <Text style={styles.supportBtnText}>{"📞 Contact Support"}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* ── logout ── */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>{"🚪 Logout from Vendor Portal"}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>);

}

/* tiny helper — vendorProducts count without hook */
function vendorProducts_count() {
  try {return useStore.getState().vendorProducts?.length ?? 0;} catch {return 0;}
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scroll: { flexGrow: 1 },

  /* hero */
  hero: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 24 },
  backBtn: { marginBottom: 18 },
  backText: { color: 'rgba(200,208,228,0.7)', fontSize: 15, fontWeight: '600' },

  avatarRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start', marginBottom: 20 },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(157,205,67,0.15)',
    borderWidth: 3, borderColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative'
  },
  avatarEmoji: { fontSize: 36 },
  kycBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: COLORS.success, alignItems: 'center', justifyContent: 'center'
  },
  kycBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  heroInfo: { flex: 1, paddingTop: 4 },
  heroName: { fontSize: 20, fontWeight: '800', color: '#fff' },
  heroShg: { fontSize: 13, color: 'rgba(200,208,228,0.7)', marginTop: 3 },
  heroLoc: { fontSize: 12, color: 'rgba(200,208,228,0.5)', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  ratingText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  ratingDot: { color: COLORS.textMuted },

  statRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: 14 },
  statPill: { flex: 1, alignItems: 'center' },
  statPillVal: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  statPillLabel: { fontSize: 10, color: 'rgba(200,208,228,0.6)', marginTop: 3 },
  statPillDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.12)' },

  /* chips */
  chipsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4, flexWrap: 'wrap' },
  statusChip: { flex: 1, minWidth: 100, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 12, borderWidth: 1.5, ...SHADOWS.small },
  statusChipEmoji: { fontSize: 22 },
  statusChipLabel: { fontSize: 10, color: COLORS.textMuted },
  statusChipVal: { fontSize: 12, fontWeight: '700', marginTop: 1 },

  /* notification panel */
  notifPanel: { marginHorizontal: 16, marginBottom: 10, backgroundColor: COLORS.darkCard, borderRadius: 16, overflow: 'hidden', ...SHADOWS.small },
  notifPanelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  notifPanelTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  notifClose: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  notifItem: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  notifDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  notifMsg: { fontSize: 13, color: COLORS.textPrimary, lineHeight: 19 },
  notifTime: { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },

  /* quick actions */
  quickActions: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  quickBtn: { flex: 1, backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 12, alignItems: 'center', gap: 6, ...SHADOWS.small },
  quickEmoji: { fontSize: 22 },
  quickLabel: { fontSize: 10, fontWeight: '600', color: COLORS.textSecondary, textAlign: 'center' },

  /* bio */
  bioBox: { backgroundColor: COLORS.dark, borderRadius: 10, padding: 10, marginTop: -8 },
  bioText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, fontStyle: 'italic' },

  /* bank */
  bankWarning: { backgroundColor: COLORS.info + '12', borderRadius: 10, padding: 10, marginBottom: 14, flexDirection: 'row', alignItems: 'center' },
  bankWarningText: { fontSize: 12, color: COLORS.info, flex: 1, lineHeight: 17 },
  verifiedRow: { marginTop: -4 },
  verifiedChip: { alignSelf: 'flex-start', backgroundColor: COLORS.success + '15', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  verifiedText: { fontSize: 12, fontWeight: '700', color: COLORS.success },

  /* kyc */
  kycStatusBanner: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: COLORS.success + '12', borderRadius: 12, padding: 12, marginBottom: 14 },
  kycStatusEmoji: { fontSize: 28 },
  kycStatusTitle: { fontSize: 14, fontWeight: '700', color: COLORS.success },
  kycStatusSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  kycDocs: { marginTop: 4, backgroundColor: COLORS.dark, borderRadius: 10, padding: 12 },
  kycDocsTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  kycDocItem: { fontSize: 13, color: COLORS.success, marginBottom: 4 },
  uploadMoreBtn: { marginTop: 10, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 10, paddingVertical: 8, alignItems: 'center', borderStyle: 'dashed' },
  uploadMoreText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },

  /* notif prefs */
  prefRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  prefLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  prefDesc: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  /* support */
  supportCard: { marginHorizontal: 16, borderRadius: 20, padding: 18, marginBottom: 14, flexDirection: 'row', gap: 14, alignItems: 'flex-start', borderWidth: 1, borderColor: COLORS.primary + '30' },
  supportEmoji: { fontSize: 32, marginTop: 4 },
  supportTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginBottom: 6 },
  supportText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 10 },
  supportBtn: { backgroundColor: COLORS.primary + '20', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start' },
  supportBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

  /* logout */
  logoutBtn: { marginHorizontal: 16, marginBottom: 10, backgroundColor: COLORS.error + '12', borderRadius: 16, borderWidth: 1.5, borderColor: COLORS.error + '40', paddingVertical: 16, alignItems: 'center' },
  logoutText: { fontSize: 15, fontWeight: '700', color: COLORS.error }
});