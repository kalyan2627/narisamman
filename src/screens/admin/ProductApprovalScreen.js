import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";

export default function ProductApprovalScreen({ navigation }) {const lang = useAppLanguage();

  const { pendingProducts, approveProduct, rejectProduct } = useStore();
  const [confirm, setConfirm] = useState(null); // { type: 'approve'|'reject', product }

  const handleAction = (type, product) => setConfirm({ type, product });

  const doAction = () => {
    if (!confirm) return;
    if (confirm.type === 'approve') approveProduct(confirm.product.id);else
    rejectProduct(confirm.product.id);
    setConfirm(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Product Approval"}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{pendingProducts.length}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}>
        
        {pendingProducts.length === 0 ?
        <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>✅</Text>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>No products pending review</Text>
          </View> :

        pendingProducts.map((item, i) =>
        <View key={item.id} style={[styles.card, i > 0 && { marginTop: 12 }]}>
              <View style={styles.cardTop}>
                <View style={styles.imgBox}>
                  {imgSrc(item.image) ?
              <Image source={imgSrc(item.image)} style={styles.productImg} resizeMode="cover" /> :

              <Text style={styles.img}>{item.emoji}</Text>
              }
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.cat}>{item.category} • {item.unit}</Text>
                  <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{item.price}</Text>
                    <Text style={styles.mrp}>MRP ₹{item.mrp}</Text>
                  </View>
                  <View style={styles.tagsRow}>
                    {(item.tags || []).map((t) =>
                <View key={t} style={styles.tag}>
                        <Text style={styles.tagText}>{t}</Text>
                      </View>
                )}
                  </View>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleAction('reject', item)} style={styles.rejectBtn}>
                  <Text style={styles.rejectText}>✗ {"Reject"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAction('approve', item)} style={styles.approveBtn}>
                  <LinearGradient colors={[COLORS.success, COLORS.green]} style={styles.approveGrad}>
                    <Text style={styles.approveText}>✓ {"Approve & Go Live"}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
        )
        }
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Web-safe Confirm Modal */}
      {confirm &&
      <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmEmoji}>
              {confirm.type === 'approve' ? '✅' : '❌'}
            </Text>
            <Text style={styles.confirmTitle}>
              {confirm.type === 'approve' ? "Approve Product?" : "Reject Product?"}
            </Text>
            <Text style={styles.confirmMsg}>
              {confirm.type === 'approve' ?
            `Approve "${confirm.product.name}" and make it live on the platform?` :
            `Reject "${confirm.product.name}"? The vendor will be notified.`}
            </Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity onPress={() => setConfirm(null)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>{"Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={doAction}
              style={[styles.doBtn, { backgroundColor: confirm.type === 'approve' ? COLORS.success : COLORS.error }]}>
              
                <Text style={styles.doBtnText}>
                  {confirm.type === 'approve' ? 'Approve ✓' : 'Reject ✗'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scroll: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: COLORS.darkCard, ...SHADOWS.small },
  back: { fontSize: 15, color: COLORS.purple, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  countBadge: { backgroundColor: COLORS.warning, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  countText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  emptySubtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 8 },
  list: { padding: 16, flexGrow: 1 },
  card: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, ...SHADOWS.medium },
  cardTop: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  imgBox: { width: 80, height: 80, borderRadius: 14, backgroundColor: COLORS.darkCard, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  productImg: { width: 80, height: 80, borderRadius: 14 },
  img: { fontSize: 44 },
  cardInfo: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  cat: { fontSize: 11, color: COLORS.textMuted, marginTop: 2, textTransform: 'capitalize' },
  description: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 17 },
  priceRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 8 },
  price: { fontSize: 16, fontWeight: '800', color: COLORS.saffron },
  mrp: { fontSize: 12, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  tag: { backgroundColor: COLORS.purple + '15', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 10, color: COLORS.purple, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10 },
  rejectBtn: { flex: 1, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.error, paddingVertical: 12, alignItems: 'center' },
  rejectText: { color: COLORS.error, fontWeight: '700', fontSize: 14 },
  approveBtn: { flex: 1.5, borderRadius: 14, overflow: 'hidden' },
  approveGrad: { paddingVertical: 12, alignItems: 'center' },
  approveText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  // Overlay
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  confirmBox: { backgroundColor: COLORS.darkCard, borderRadius: 24, padding: 28, alignItems: 'center', width: 320, ...SHADOWS.large },
  confirmEmoji: { fontSize: 44, marginBottom: 12 },
  confirmTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  confirmMsg: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
  confirmBtns: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: COLORS.darkBorder, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  doBtn: { flex: 1, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  doBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' }
});