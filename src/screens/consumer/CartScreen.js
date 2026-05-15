import React, { useState } from 'react';
import {
  View, StyleSheet, FlatList, TouchableOpacity, Platform, Image } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";


function CartItem({ item, onUpdate, onRemove }) {const lang = useAppLanguage();

  return (
    <View style={styles.cartItem}>
      <View style={styles.itemImgBox}>
        {item.image ?
        <Image source={imgSrc(item.image)} style={styles.itemImg} resizeMode="cover" /> :

        <Text style={styles.itemEmoji}>{item.emoji}</Text>
        }
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemUnit}>{item.unit}</Text>
        <Text style={styles.itemPrice}>₹{item.price} each</Text>
      </View>
      <View style={styles.itemRight}>
        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => onUpdate(item.id, item.qty - 1)} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNum}>{item.qty}</Text>
          <TouchableOpacity onPress={() => onUpdate(item.id, item.qty + 1)} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemTotal}>₹{item.price * item.qty}</Text>
        <TouchableOpacity onPress={() => onRemove(item.id)}>
          <Text style={styles.removeText}>{"Remove"}</Text>
        </TouchableOpacity>
      </View>
    </View>);

}

export default function CartScreen({ navigation }) {
  const { cart, updateCartQty, removeFromCart, clearCart, getCartTotal } = useStore();const lang = useAppLanguage();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const total = getCartTotal();
  const delivery = total > 0 ? total > 500 ? 0 : 60 : 0;
  const grandTotal = total + delivery;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigation.navigate('Checkout');
  };

  const handleClearAll = () => {
    if (Platform.OS === 'web') {
      setShowClearConfirm(true);
    } else {
      const { Alert } = require('react-native');
      Alert.alert('Clear Cart', 'Remove all items?', [
      { text: 'Cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCart }]
      );
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>{"Your cart is empty"}</Text>
        <Text style={styles.emptySubtitle}>{"Explore hundreds of authentic rural products"}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Explore')} style={styles.exploreBtn}>
          <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.exploreBtnGrad}>
            <Text style={styles.exploreBtnText}>{"Start Shopping"}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>);

  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{"My Cart"} 🛒</Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text style={styles.clearText}>{"Clear All"}</Text>
        </TouchableOpacity>
      </View>

      {/* Delivery Banner */}
      {delivery === 0 && total > 0 &&
      <View style={styles.freeBanner}>
          <Text style={styles.freeText}>{"🎉 You've unlocked FREE delivery!"}</Text>
        </View>
      }
      {delivery > 0 &&
      <View style={styles.deliveryBanner}>
          <Text style={styles.deliveryText}>Add ₹{500 - total} more for FREE delivery</Text>
        </View>
      }

      <FlatList
        style={styles.flatList}
        data={cart}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) =>
        <CartItem
          item={item}
          onUpdate={updateCartQty}
          onRemove={removeFromCart} />

        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
        <View style={styles.summary}>
            <Text style={styles.summaryTitle}>{"Order Total"}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({cart.length} items)</Text>
              <Text style={styles.summaryValue}>₹{total}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{"Delivery"}</Text>
              <Text style={[styles.summaryValue, delivery === 0 && { color: COLORS.success }]}>
                {delivery === 0 ? 'FREE' : `₹${delivery}`}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>{"Grand Total"}</Text>
              <Text style={styles.totalValue}>₹{grandTotal}</Text>
            </View>
            <View style={styles.impactNote}>
              <Text style={styles.impactText}>🌱 Your order supports {cart.length} SHG artisan group(s) in West Bengal</Text>
            </View>
          </View>
        } />
      

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>{"Total Payable"}</Text>
          <Text style={styles.footerTotal}>₹{grandTotal}</Text>
        </View>
        <TouchableOpacity onPress={handleCheckout} style={styles.checkoutBtn}>
          <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.checkoutGrad}>
            <Text style={styles.checkoutText}>{"Checkout"} →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Web-safe Clear Cart Confirm */}
      {showClearConfirm &&
      <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmEmoji}>🛒</Text>
            <Text style={styles.confirmTitle}>{"Clear Cart?"}</Text>
            <Text style={styles.confirmMsg}>Remove all {cart.length} items from your cart?</Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity
              onPress={() => setShowClearConfirm(false)}
              style={styles.keepBtn}>
              
                <Text style={styles.keepBtnText}>{"Keep Items"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => {clearCart();setShowClearConfirm(false);}}
              style={styles.clearConfirmBtn}>
              
                <Text style={styles.clearConfirmText}>{"Clear All"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  flatList: { flex: 1 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.dark, padding: 32 },
  emptyEmoji: { fontSize: 72, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  emptySubtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 8, textAlign: 'center' },
  exploreBtn: { marginTop: 24, borderRadius: 50, overflow: 'hidden' },
  exploreBtnGrad: { paddingHorizontal: 32, paddingVertical: 14 },
  exploreBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  clearText: { fontSize: 13, color: COLORS.bengalRed, fontWeight: '600' },
  freeBanner: { marginHorizontal: 16, marginBottom: 10, backgroundColor: COLORS.success + '20', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: COLORS.success + '40' },
  freeText: { fontSize: 13, color: COLORS.success, fontWeight: '600', textAlign: 'center' },
  deliveryBanner: { marginHorizontal: 16, marginBottom: 10, backgroundColor: COLORS.gold + '20', borderRadius: 12, padding: 10 },
  deliveryText: { fontSize: 13, color: COLORS.goldDark, fontWeight: '500', textAlign: 'center' },
  list: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16, flexGrow: 1 },
  cartItem: {
    flexDirection: 'row', backgroundColor: COLORS.darkCard, borderRadius: 16,
    padding: 14, gap: 12, ...SHADOWS.small
  },
  itemImgBox: { width: 70, height: 70, borderRadius: 12, backgroundColor: COLORS.darkCard, alignItems: 'center', justifyContent: 'center' },
  itemEmoji: { fontSize: 36 },
  itemInfo: { flex: 1, justifyContent: 'space-between' },
  itemName: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, lineHeight: 18 },
  itemUnit: { fontSize: 11, color: COLORS.textMuted },
  itemPrice: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  itemRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.darkCard, borderRadius: 10, padding: 4 },
  qtyBtn: { width: 26, height: 26, borderRadius: 7, backgroundColor: COLORS.darkCard, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.saffron },
  qtyNum: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, minWidth: 20, textAlign: 'center' },
  itemTotal: { fontSize: 15, fontWeight: '700', color: COLORS.saffron },
  removeText: { fontSize: 11, color: COLORS.bengalRed, fontWeight: '600' },
  separator: { height: 10 },
  summary: { marginTop: 16, backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 20, ...SHADOWS.small },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: COLORS.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  totalRow: { borderTopWidth: 1, borderColor: COLORS.darkBorder, paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  totalValue: { fontSize: 20, fontWeight: '800', color: COLORS.saffron },
  impactNote: { marginTop: 14, backgroundColor: COLORS.green + '15', borderRadius: 12, padding: 12 },
  impactText: { fontSize: 12, color: COLORS.green, fontWeight: '500', textAlign: 'center' },
  footer: {
    backgroundColor: COLORS.darkCard, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    paddingTop: 14, paddingBottom: 30, borderTopWidth: 1, borderColor: COLORS.darkBorder,
    ...SHADOWS.medium
  },
  footerLabel: { fontSize: 11, color: COLORS.textMuted },
  footerTotal: { fontSize: 22, fontWeight: '800', color: COLORS.saffron },
  checkoutBtn: { borderRadius: 50, overflow: 'hidden' },
  checkoutGrad: { paddingHorizontal: 24, paddingVertical: 14 },
  checkoutText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Clear Confirm Overlay
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center', zIndex: 999
  },
  confirmBox: {
    backgroundColor: COLORS.darkCard, borderRadius: 24, padding: 28,
    alignItems: 'center', width: 300, ...SHADOWS.medium
  },
  confirmEmoji: { fontSize: 38, marginBottom: 10 },
  confirmTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  confirmMsg: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  confirmBtns: { flexDirection: 'row', gap: 12, marginTop: 20, width: '100%' },
  keepBtn: {
    flex: 1, borderWidth: 1.5, borderColor: COLORS.darkBorder,
    borderRadius: 12, paddingVertical: 12, alignItems: 'center'
  },
  keepBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  clearConfirmBtn: {
    flex: 1, backgroundColor: COLORS.bengalRed,
    borderRadius: 12, paddingVertical: 12, alignItems: 'center'
  },
  clearConfirmText: { fontSize: 14, fontWeight: '700', color: '#fff' }
});