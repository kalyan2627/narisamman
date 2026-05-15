import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  Platform } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";

export default function CheckoutScreen({ navigation }) {const lang = useAppLanguage();

  const { cart, getCartTotal, placeOrder, user } = useStore();
  const [selectedAddress, setSelectedAddress] = useState(user.addresses[0]);
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [upiId, setUpiId] = useState('');

  const PAYMENT_METHODS = [
  { id: 'upi', label: "UPI / GPay / PhonePe", emoji: '📱' },
  { id: 'card', label: "Credit / Debit Card", emoji: '💳' },
  { id: 'netbanking', label: "Net Banking", emoji: '🏦' },
  { id: 'cod', label: "Cash on Delivery", emoji: '💵' }];


  const subtotal = getCartTotal();
  const delivery = subtotal > 500 ? 0 : 60;
  const grandTotal = subtotal + delivery;

  const handlePlaceOrder = () => {
    placeOrder(selectedAddress.line);
    navigation.replace('OrderSuccess');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Checkout"}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 {"Delivery Address"}</Text>
          {user.addresses.map((addr) =>
          <TouchableOpacity
            key={addr.id}
            onPress={() => setSelectedAddress(addr)}
            style={[styles.addressCard, selectedAddress.id === addr.id && styles.addressCardActive]}>
            
              <View style={styles.addressRadio}>
                <View style={[styles.radio, selectedAddress.id === addr.id && styles.radioActive]} />
              </View>
              <View style={styles.addressInfo}>
                <View style={styles.addressLabelRow}>
                  <View style={styles.addressLabelBadge}>
                    <Text style={styles.addressLabelText}>{addr.label}</Text>
                  </View>
                  {addr.default && <Text style={styles.defaultTag}>{"Default"}</Text>}
                </View>
                <Text style={styles.addressLine}>{addr.line}</Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.addAddrBtn}>
            <Text style={styles.addAddrText}>+ {"Add New Address"}</Text>
          </TouchableOpacity>
        </View>

        {/* Order Items Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛒 {"Order Items"} ({cart.length})</Text>
          {cart.map((item) =>
          <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemEmoji}>{item.emoji}</Text>
              <Text style={styles.orderItemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.orderItemQty}>x{item.qty}</Text>
              <Text style={styles.orderItemPrice}>₹{item.price * item.qty}</Text>
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 {"Payment Method"}</Text>
          {PAYMENT_METHODS.map((pm) =>
          <TouchableOpacity
            key={pm.id}
            onPress={() => setSelectedPayment(pm.id)}
            style={[styles.paymentCard, selectedPayment === pm.id && styles.paymentCardActive]}>
            
              <View style={[styles.radio, selectedPayment === pm.id && styles.radioActive]} />
              <Text style={styles.paymentEmoji}>{pm.emoji}</Text>
              <Text style={styles.paymentLabel}>{pm.label}</Text>
            </TouchableOpacity>
          )}
          {selectedPayment === 'upi' &&
          <View style={styles.upiInput}>
              <TextInput
              placeholder={"Enter UPI ID (e.g. name@upi)"}
              placeholderTextColor={COLORS.textMuted}
              style={styles.upiTextInput}
              value={upiId}
              onChangeText={setUpiId} />
            
            </View>
          }
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 {"Price Details"}</Text>
          <View style={styles.priceSummary}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{"Items Total"}</Text>
              <Text style={styles.priceVal}>₹{subtotal}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{"Delivery Charges"}</Text>
              <Text style={[styles.priceVal, delivery === 0 && { color: COLORS.success }]}>
                {delivery === 0 ? "FREE" : `₹${delivery}`}
              </Text>
            </View>
            <View style={[styles.priceRow, styles.grandRow]}>
              <Text style={styles.grandLabel}>{"Amount Payable"}</Text>
              <Text style={styles.grandVal}>₹{grandTotal}</Text>
            </View>
          </View>
        </View>

        {/* Impact Note */}
        <LinearGradient colors={[COLORS.green + '20', COLORS.greenLight + '10']} style={styles.impactCard}>
          <Text style={styles.impactTitle}>🌱 {"Your Impact"}</Text>
          <Text style={styles.impactText}>{"This order directly supports SHG women and artisan families in West Bengal. Every rupee you spend creates dignified livelihoods."}</Text>
        </LinearGradient>

        <View style={{ height: 20 }} />

        {/* Place Order CTA */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerLabel}>{"Amount Payable"}</Text>
            <Text style={styles.footerTotal}>₹{grandTotal}</Text>
          </View>
          <TouchableOpacity onPress={handlePlaceOrder} style={styles.placeOrderBtn}>
            <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.placeOrderGrad}>
              <Text style={styles.placeOrderText}>{"Place Order"} 🎉</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: COLORS.darkCard, ...SHADOWS.small
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 15, color: COLORS.saffron, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, flexGrow: 1 },
  section: { marginBottom: 16, backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, ...SHADOWS.small },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  addressCard: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.darkBorder, marginBottom: 10 },
  addressCardActive: { borderColor: COLORS.saffron, backgroundColor: COLORS.saffron + '08' },
  addressRadio: { paddingTop: 2 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: COLORS.textMuted },
  radioActive: { borderColor: COLORS.saffron, backgroundColor: COLORS.saffron },
  addressInfo: { flex: 1 },
  addressLabelRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 6 },
  addressLabelBadge: { backgroundColor: COLORS.saffron + '20', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  addressLabelText: { fontSize: 11, fontWeight: '700', color: COLORS.saffron },
  defaultTag: { fontSize: 11, color: COLORS.success, fontWeight: '600' },
  addressLine: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  addAddrBtn: { paddingTop: 4 },
  addAddrText: { fontSize: 13, color: COLORS.saffron, fontWeight: '600' },
  orderItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  orderItemEmoji: { fontSize: 22 },
  orderItemName: { flex: 1, fontSize: 13, color: COLORS.textPrimary, fontWeight: '500' },
  orderItemQty: { fontSize: 13, color: COLORS.textMuted },
  orderItemPrice: { fontSize: 14, fontWeight: '700', color: COLORS.saffron },
  paymentCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.darkBorder, marginBottom: 8 },
  paymentCardActive: { borderColor: COLORS.saffron, backgroundColor: COLORS.saffron + '08' },
  paymentEmoji: { fontSize: 20 },
  paymentLabel: { flex: 1, fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  upiInput: { backgroundColor: COLORS.darkCard, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginTop: 4 },
  upiTextInput: { fontSize: 14, color: COLORS.textPrimary },
  priceSummary: { gap: 12 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priceLabel: { fontSize: 14, color: COLORS.textSecondary },
  priceVal: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  grandRow: { borderTopWidth: 1, borderColor: COLORS.darkBorder, paddingTop: 12, marginTop: 4 },
  grandLabel: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  grandVal: { fontSize: 20, fontWeight: '800', color: COLORS.saffron },
  impactCard: { borderRadius: 20, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: COLORS.greenLight + '40' },
  impactTitle: { fontSize: 14, fontWeight: '700', color: COLORS.green, marginBottom: 6 },
  impactText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  footer: {
    backgroundColor: COLORS.darkCard, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    paddingTop: 14, paddingBottom: Platform.OS === 'web' ? 14 : 30,
    borderTopWidth: 1, borderColor: COLORS.darkBorder, ...SHADOWS.medium
  },
  footerLabel: { fontSize: 11, color: COLORS.textMuted },
  footerTotal: { fontSize: 22, fontWeight: '800', color: COLORS.saffron },
  placeOrderBtn: { borderRadius: 50, overflow: 'hidden' },
  placeOrderGrad: { paddingHorizontal: 28, paddingVertical: 14 },
  placeOrderText: { color: '#fff', fontWeight: '700', fontSize: 14 }
});