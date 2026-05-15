import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";

export default function ManageProductsScreen({ navigation }) {const lang = useAppLanguage();

  const { vendorProducts, removeVendorProduct } = useStore();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"My Products"}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddProduct')} style={styles.addBtn}>
          <Text style={styles.addBtnText}>{"+ Add"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}>
        
        {vendorProducts.length === 0 ?
        <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🛍️</Text>
            <Text style={styles.emptyText}>{"No listed yet"}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddProduct')} style={styles.addFirstBtn}>
              <Text style={styles.addFirstText}>{"+ Add Your First Product"}</Text>
            </TouchableOpacity>
          </View> :

        vendorProducts.map((item, i) =>
        <View key={item.id} style={[styles.card, i > 0 && { marginTop: 12 }]}>
              <Image
            source={imgSrc(item.image) || { uri: 'https://via.placeholder.com/200' }}
            style={styles.imgBox}
            resizeMode="cover" />
          
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.unit}>{item.unit}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
                <View style={styles.statsRow}>
                  <Text style={styles.stat}>⭐ {item.rating}</Text>
                  <Text style={styles.stat}>📦 {item.stock} left</Text>
                  <View style={styles.liveBadge}><Text style={styles.liveText}>{"✓ Live"}</Text></View>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => navigation.navigate('EditProduct', { product: item })}>
                  <Text style={styles.editText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => setDeleteConfirm(item)}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
        )
        }
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Web-safe Delete Confirm */}
      {deleteConfirm &&
      <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmEmoji}>🗑️</Text>
            <Text style={styles.confirmTitle}>{"Remove Product?"}</Text>
            <Text style={styles.confirmMsg}>Remove "{deleteConfirm.name}" from your listing?</Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity onPress={() => setDeleteConfirm(null)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>{"Keep It"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => {removeVendorProduct(deleteConfirm.id);setDeleteConfirm(null);}}
              style={styles.doBtn}>
              
                <Text style={styles.doBtnText}>{"Remove"}</Text>
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
  back: { fontSize: 15, color: COLORS.green, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  addBtn: { backgroundColor: COLORS.green, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  list: { padding: 16, flexGrow: 1 },
  card: { flexDirection: 'row', backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 12, gap: 12, ...SHADOWS.small },
  imgBox: { width: 80, height: 80, borderRadius: 12, overflow: 'hidden', backgroundColor: COLORS.darkCard },
  img: { fontSize: 36 },
  info: { flex: 1, justifyContent: 'space-between' },
  name: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, lineHeight: 18 },
  unit: { fontSize: 11, color: COLORS.textMuted },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.green },
  statsRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 },
  stat: { fontSize: 11, color: COLORS.textSecondary },
  liveBadge: { backgroundColor: COLORS.success + '20', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  liveText: { fontSize: 10, color: COLORS.success, fontWeight: '700' },
  actions: { justifyContent: 'center', gap: 8 },
  editBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.info + '15', alignItems: 'center', justifyContent: 'center' },
  editText: { fontSize: 16 },
  deleteBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.error + '15', alignItems: 'center', justifyContent: 'center' },
  deleteText: { fontSize: 16 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 16, color: COLORS.textMuted, marginBottom: 20 },
  addFirstBtn: { backgroundColor: COLORS.green, borderRadius: 50, paddingHorizontal: 24, paddingVertical: 12 },
  addFirstText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  confirmBox: { backgroundColor: COLORS.darkCard, borderRadius: 24, padding: 28, alignItems: 'center', width: 300, ...SHADOWS.large },
  confirmEmoji: { fontSize: 44, marginBottom: 12 },
  confirmTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  confirmMsg: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  confirmBtns: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: COLORS.darkBorder, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  doBtn: { flex: 1, backgroundColor: COLORS.error, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  doBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' }
});