import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";


const STATUS_COLORS = {
  confirmed: { bg: COLORS.info + '25', text: COLORS.info },
  packed: { bg: COLORS.teal + '25', text: COLORS.teal },
  shipped: { bg: COLORS.greenLight + '30', text: COLORS.greenLight },
  delivered: { bg: COLORS.success + '25', text: COLORS.success }
};

export default function VendorDashboard({ navigation }) {
  const { vendorProfile, vendorOrders, vendorProducts, shgGroups, vendorNotifications, fetchVendorProducts } = useStore();const lang = useAppLanguage();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (vendorProfile && vendorProfile.id) {
        fetchVendorProducts(vendorProfile.id);
      }
    });
    if (vendorProfile && vendorProfile.id) {
      fetchVendorProducts(vendorProfile.id);
    }
    return unsubscribe;
  }, [navigation, vendorProfile]);


  // Find this vendor's SHG group to get employees
  const myShgGroup = shgGroups?.find((s) => s.name === vendorProfile.name) || null;

  const totalEarnings = vendorOrders.
  filter((o) => o.status === 'delivered' && o.paymentStatus === 'paid').
  reduce((sum, o) => sum + o.amount, 0);
  const pendingPayout = vendorOrders.
  filter((o) => o.status === 'delivered' && ['pending_payment', 'payout_requested'].includes(o.paymentStatus)).
  reduce((sum, o) => sum + o.amount, 0);
  const unreadVendorNotifications = (vendorNotifications || []).filter((n) => !n.read).length;

  // ── 4 stat cards — each taps to the matching detail screen ──────────────────
  const statCards = [
  {
    label: "Total Earnings",
    value: `₹${(totalEarnings / 1000).toFixed(1)}K`,
    emoji: '💰',
    color: COLORS.gold,
    onPress: () => navigation.navigate('TotalEarnings')
  },
  {
    label: "Pending Payout",
    value: `₹${pendingPayout.toLocaleString()}`,
    emoji: '⏳',
    color: COLORS.warning,
    onPress: () => navigation.navigate('PendingPayout')
  },
  {
    label: "My Orders",
    value: vendorOrders.length,
    emoji: '📦',
    color: COLORS.greenLight,
    onPress: () => navigation.navigate('VendorOrders')
  },
  {
    label: "My Products",
    value: vendorProducts.length,
    emoji: '🛍️',
    color: COLORS.saffron,
    onPress: () => navigation.navigate('ManageProducts')
  }];




  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <LinearGradient colors={COLORS.gradientHero} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Namaste, {vendorProfile.name.split(' ')[0]} 🙏</Text>
            <Text style={styles.shgName}>{vendorProfile.shgName}</Text>
            <Text style={styles.location}>📍 {vendorProfile.location}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications', { role: 'vendor' })}
              style={styles.iconBtn}>
              <Text style={styles.iconText}>🔔</Text>
              {unreadVendorNotifications > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{unreadVendorNotifications > 9 ? '9+' : unreadVendorNotifications}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusChip, { backgroundColor: COLORS.success + '25' }]}>
            <Text style={[styles.statusChipText, { color: COLORS.mint }]}>✓ KYC {"Verified"}</Text>
          </View>
          <View style={[styles.statusChip, { backgroundColor: COLORS.info + '25' }]}>
            <Text style={[styles.statusChipText, { color: '#60B0F0' }]}>{"✓ Bank Linked"}</Text>
          </View>
          <View style={[styles.statusChip, { backgroundColor: COLORS.gold + '25' }]}>
            <Text style={[styles.statusChipText, { color: COLORS.gold }]}>⭐ {vendorProfile.rating}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* ── Live Stats Grid — tappable, link to detail screens ─────────────── */}
      <View style={styles.statsGrid}>
        {statCards.map((s, i) =>
        <TouchableOpacity
          key={i}
          onPress={s.onPress}
          style={[styles.statCard, { borderTopColor: s.color }]}
          activeOpacity={0.75}>
          
            <Text style={styles.statEmoji}>{s.emoji}</Text>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={styles.statTap}>{"Tap to view →"}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Recent Orders ───────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{"Recent Orders"}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('VendorOrders')}>
            <Text style={styles.seeAll}>See All ({vendorOrders.length}) →</Text>
          </TouchableOpacity>
        </View>
        {/* Show only 4 most recent — sorted by date descending */}
        {[...vendorOrders].
        sort((a, b) => new Date(b.date) - new Date(a.date)).
        slice(0, 4).
        map((order) => {
          const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.confirmed;
          return (
            <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderLeft}>
                  <Text style={styles.orderBuyer}>{order.buyer}</Text>
                  <Text style={styles.orderItem} numberOfLines={1}>{order.item}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={styles.orderRight}>
                  <Text style={styles.orderAmount}>₹{order.amount.toLocaleString()}</Text>
                  <View style={[styles.orderStatus, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.orderStatusText, { color: statusStyle.text }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>
              </View>);

        })}
      </View>

      {/* ── Live Products Preview ───────────────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{"My Products"}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ManageProducts')}>
            <Text style={styles.seeAll}>{"Manage All →"}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {vendorProducts.slice(0, 5).map((p) =>
          <View key={p.id} style={styles.productCard}>
              <Image
              source={imgSrc(p.image)}
              style={styles.productImg}
              resizeMode="cover" />
            
              <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
              <Text style={styles.productPrice}>₹{p.price}</Text>
              <View style={styles.productMeta}>
                <Text style={styles.productRating}>⭐ {p.rating || 0}</Text>
                <Text style={styles.productStock}>{p.stock} left</Text>
              </View>
              <View style={styles.badgeContainer}>
                {(!p.status || p.status.toUpperCase() === 'APPROVED' || p.status.toUpperCase() === 'ACCEPTED') ? (
                  <View style={styles.liveBadge}><Text style={styles.liveText}>{"✓ Accepted"}</Text></View>
                ) : p.status.toUpperCase() === 'PENDING' ? (
                  <View style={styles.pendingBadge}><Text style={styles.pendingText}>{"⏳ Pending"}</Text></View>
                ) : (
                  <View style={styles.rejectedBadge}><Text style={styles.rejectedText}>{"✗ Rejected"}</Text></View>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* ── SHG Team Members ───────────────────────────────────────────────── */}
      {myShgGroup?.employees?.length > 0 &&
      <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👥 SHG Team {"members"}</Text>
            <View style={styles.teamBadge}>
              <Text style={styles.teamBadgeText}>{myShgGroup.employees.length} members</Text>
            </View>
          </View>
          {myShgGroup.employees.map((emp) =>
        <View key={emp.id} style={styles.empCard}>
              <View style={styles.empAvatar}>
                <Text style={styles.empAvatarText}>{emp.name.charAt(0)}</Text>
              </View>
              <View style={styles.empInfo}>
                <Text style={styles.empName}>{emp.name}</Text>
                <Text style={styles.empRole}>{emp.role}</Text>
              </View>
              <Text style={styles.empPhone}>{emp.phone}</Text>
            </View>
        )}
        </View>
      }

      {/* ── IS&SF Warehouse Support Banner ─────────────────────────────────── */}
      <LinearGradient
        colors={[COLORS.green + '25', COLORS.greenLight + '12']}
        style={styles.supportBanner}>
        
        <Text style={styles.supportEmoji}>🤝</Text>
        <View style={styles.supportInfo}>
          <Text style={styles.supportTitle}>{"IS&SF Warehouse Support"}</Text>
          <Text style={styles.supportText}>
            Your products are quality-checked, packaged, and dispatched from
            Sandeshkhali warehouse. No {"Logistics"} hassle for you!
          </Text>
        </View>
      </LinearGradient>

      <View style={{ height: 30 }} />
    </ScrollView>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollContent: { flexGrow: 1 },

  // Header
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(200,208,228,0.12)', alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 1, borderColor: COLORS.saffron + '30' },
  iconText: { fontSize: 18 },
  notifBadge: { position: 'absolute', top: 3, right: 3, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 3, backgroundColor: COLORS.bengalRed, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { color: '#fff', fontSize: 8, fontWeight: '800' },
  greeting: { fontSize: 12, color: 'rgba(245,240,232,0.65)', marginBottom: 4 },
  shgName: { fontSize: 20, fontWeight: '800', color: '#fff' },
  location: { fontSize: 12, color: 'rgba(245,240,232,0.65)', marginTop: 4 },
  statusRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  statusChip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statusChipText: { fontSize: 11, fontWeight: '700' },

  // Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16 },
  statCard: {
    width: '47%', backgroundColor: COLORS.darkCard, borderRadius: 16,
    padding: 16, borderTopWidth: 3, ...SHADOWS.small,
    alignItems: 'center', minHeight: 110, justifyContent: 'center'
  },
  statEmoji: { fontSize: 26, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },
  statTap: { fontSize: 10, color: COLORS.saffron, marginTop: 6, opacity: 0.8 },

  // Sections
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAll: { fontSize: 13, color: COLORS.saffron, fontWeight: '600' },

  // Order cards
  orderCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 14, marginBottom: 8, ...SHADOWS.small },
  orderLeft: { flex: 1 },
  orderBuyer: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  orderItem: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  orderDate: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  orderRight: { alignItems: 'flex-end', gap: 6 },
  orderAmount: { fontSize: 16, fontWeight: '800', color: COLORS.green },
  orderStatus: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  orderStatusText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },

  // Product cards
  productCard: { width: 140, backgroundColor: COLORS.darkCard, borderRadius: 16, overflow: 'hidden', ...SHADOWS.small },
  productImg: { width: 140, height: 110 },
  productName: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary, padding: 8, paddingBottom: 2, lineHeight: 16 },
  productPrice: { fontSize: 14, fontWeight: '800', color: COLORS.saffron, paddingHorizontal: 8 },
  productMeta: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 6 },
  productRating: { fontSize: 11, color: COLORS.textSecondary },
  productStock: { fontSize: 11, color: COLORS.textMuted },
  badgeContainer: { paddingHorizontal: 8, paddingBottom: 8, flexDirection: 'row' },
  liveBadge: { backgroundColor: COLORS.success + '20', borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2 },
  liveText: { fontSize: 9, color: COLORS.success, fontWeight: '700' },
  pendingBadge: { backgroundColor: COLORS.warning + '20', borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2 },
  pendingText: { fontSize: 9, color: COLORS.warning, fontWeight: '700' },
  rejectedBadge: { backgroundColor: COLORS.error + '20', borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2 },
  rejectedText: { fontSize: 9, color: COLORS.error, fontWeight: '700' },

  // Support banner
  supportBanner: { marginHorizontal: 16, borderRadius: 20, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start', borderWidth: 1, borderColor: COLORS.green + '30' },
  supportEmoji: { fontSize: 32, marginTop: 4 },
  supportInfo: { flex: 1 },
  supportTitle: { fontSize: 14, fontWeight: '700', color: COLORS.green },
  supportText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, marginTop: 4 },

  // Team members
  teamBadge: { backgroundColor: COLORS.saffron + '20', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  teamBadgeText: { fontSize: 11, color: COLORS.saffron, fontWeight: '700' },
  empCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.darkCard, borderRadius: 12, padding: 12, marginBottom: 8, gap: 12, ...SHADOWS.small },
  empAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.saffron + '30', alignItems: 'center', justifyContent: 'center' },
  empAvatarText: { fontSize: 16, fontWeight: '800', color: COLORS.saffron },
  empInfo: { flex: 1 },
  empName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  empRole: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  empPhone: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' }
});