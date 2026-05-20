import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import useStore from '../store/useStore';
import { publicFetch } from '../utils/api';
import Text from '../autoTranslation/AutoText';
import TextInput from '../autoTranslation/AutoTextInput';
import NariLogoIcon from '../components/NariLogoIcon';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const SHG_CATEGORIES = ['Food & Agriculture', 'Textiles & Weaving', 'Crafts & Handicrafts', 'Herbal & Wellness', 'Other'];

function cleanMobile(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 10);
}

function Field({
  label,
  placeholder,
  keyboardType,
  secure,
  show,
  onToggle,
  icon,
  value,
  onChangeText,
  error,
  maxLength,
  rightElement,
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error && styles.inputError]}>
        <Text style={styles.inputIcon}>{icon}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(200,208,228,0.35)"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || 'default'}
          autoCapitalize="none"
          maxLength={maxLength}
          secureTextEntry={secure && !show}
        />
        {rightElement}
        {secure && (
          <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
            <Text style={styles.eyeIcon}>{show ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

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

export default function SHGLoginScreen({ navigation }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    leaderName: '',
    shgName: '',
    email: '',
    phone: '',
    location: '',
    category: '',
    members: '',
    password: '',
    confirm: '',
    aadhaarNumber: '',
    panNumber: '',
    gstNumber: '',
    accountHolderName: '',
    bankAccountNumber: '',
    confirmAccountNumber: '',
    bankName: '',
    bankIfscCode: '',
    upiId: '',
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [kycImages, setKycImages] = useState({
    aadhaar: null,
    pan: null,
    gst: null,
  });
  const [showWebPicker, setShowWebPicker] = useState(false);
  const [activeKycType, setActiveKycType] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loginUser = useStore((s) => s.loginUser);
  const submitSHGRegistration = useStore((s) => s.submitSHGRegistration);

  // Request permissions for gallery and camera
  useEffect(() => {
    (async () => {
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (galleryStatus !== 'granted' || cameraStatus !== 'granted') {
        Alert.alert('Permission required', 'Please grant camera and gallery permissions in settings');
      }
    })();
  }, []);

  async function pickImageNative(source) {
    try {
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Needed', 'Camera access is required to take photos.');
          return null;
        }
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 0.8,
          base64: true,
        });
        if (!result.canceled && result.assets?.[0]) {
          return `data:image/jpeg;base64,${result.assets[0].base64}`;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Needed', 'Photo library access is required.');
          return null;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
          base64: true,
        });
        if (!result.canceled && result.assets?.[0]) {
          return `data:image/jpeg;base64,${result.assets[0].base64}`;
        }
      }
    } catch (error) {
      console.error('Image picking error:', error);
    }
    return null;
  }

  const pickImage = async (type) => {
    if (Platform.OS === 'web') {
      setActiveKycType(type);
      setShowWebPicker(true);
    } else {
      Alert.alert('Upload Document', 'Choose how to upload your document photo', [
        {
          text: '📷 Take Photo',
          onPress: async () => {
            const u = await pickImageNative('camera');
            if (u) setKycImages((prev) => ({ ...prev, [type]: u }));
          },
        },
        {
          text: '🖼️ Choose from Gallery',
          onPress: async () => {
            const u = await pickImageNative('gallery');
            if (u) setKycImages((prev) => ({ ...prev, [type]: u }));
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const handleWebFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (activeKycType) {
        setKycImages((prev) => ({ ...prev, [activeKycType]: ev.target.result }));
      }
      setShowWebPicker(false);
    };
    reader.readAsDataURL(file);
  };

  const resetOtp = () => {
    setOtpSent(false);
    setOtpInput('');
    setPhoneVerified(false);
    setOtpMessage('');
  };

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const setPhone = (value) => {
    const mobile = cleanMobile(value);
    setForm((f) => ({ ...f, phone: mobile }));
    setErrors((e) => ({ ...e, phone: null, otp: null }));
    resetOtp();
  };

  const switchMode = (next) => {
    setMode(next);
    setErrors({});
    setCatOpen(false);
    setForm({
      leaderName: '', shgName: '', email: '', phone: '', location: '', category: '', members: '', password: '', confirm: '',
      aadhaarNumber: '', panNumber: '', gstNumber: '', accountHolderName: '', bankAccountNumber: '', confirmAccountNumber: '',
      bankName: '', bankIfscCode: '', upiId: ''
    });
    resetOtp();
  };

  const sendForgotOtp = async () => {
    if (!form.email.trim()) {
       setErrors((e) => ({ ...e, email: 'Enter registered email' }));
       return;
    }
    try {
       const res = await publicFetch('/api/shg/forgot-password', {
         method: 'POST',
         body: JSON.stringify({ email: form.email })
       });
       const data = await res.json();
       if (res.status === 200) {
         setOtpSent(true);
         setPhoneVerified(false);
         setOtpInput('');
         setOtpMessage('Reset OTP sent to your email.');
       } else {
         Alert.alert('Error', data.message || 'Failed to send reset email');
       }
    } catch (error) {
       Alert.alert('Error', 'Network error details: ' + (error.message || error));
    }
  };

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(form.phone)) {
      setErrors((e) => ({ ...e, phone: 'Enter exactly 10 digit mobile number' }));
      return;
    }
    try {
      const res = await publicFetch('/api/consumer/send-otp', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: form.phone })
      });
      const data = await res.json();
      if (res.status === 200) {
        setOtpSent(true);
        setPhoneVerified(false);
        setOtpInput('');
        setErrors((e) => ({ ...e, phone: null, otp: null }));
        setOtpMessage(`OTP sent to +91 ${form.phone}`);
      } else {
        alert(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      alert('Network error details: ' + (error.message || error));
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await publicFetch('/api/consumer/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: form.phone, otp: otpInput })
      });
      const data = await res.json();
      if (res.status === 200) {
        setPhoneVerified(true);
        setErrors((e) => ({ ...e, otp: null, phone: null }));
        setOtpMessage('Mobile number verified successfully');
      } else {
        setPhoneVerified(false);
        setErrors((e) => ({ ...e, otp: data.message || 'Invalid OTP' }));
      }
    } catch (error) {
      alert('Network error details: ' + (error.message || error));
    }
  };

  const validate = () => {
    const e = {};
    if (mode === 'register') {
      if (!form.leaderName.trim()) {
        e.leaderName = 'Leader name is required';
      } else if (!/^[a-zA-Z\s]+$/.test(form.leaderName.trim())) {
        e.leaderName = 'Leader name must contain letters only';
      }
      if (!form.shgName.trim()) e.shgName = 'SHG name is required';
      if (!form.location.trim()) e.location = 'Location is required';
      if (!form.category) e.category = 'Category is required';
      if (!form.members || isNaN(form.members) || parseInt(form.members) <= 0) e.members = 'Valid members count required';
      if (!phoneVerified) e.otp = 'Please verify mobile number with OTP';
      
      // KYC images
      if (!kycImages.aadhaar) e.aadhaarImage = 'Aadhaar document photo is required';
      if (!kycImages.pan) e.panImage = 'PAN document photo is required';

      // Bank details validation
      if (!form.accountHolderName.trim()) e.accountHolderName = 'Account holder name is required';
      if (!form.bankAccountNumber || !/^\d{8,18}$/.test(form.bankAccountNumber)) {
        e.bankAccountNumber = 'Bank account number must be 8-18 digits';
      }
      if (form.bankAccountNumber !== form.confirmAccountNumber) {
        e.confirmAccountNumber = 'Bank account numbers do not match';
      }
      if (!form.bankName.trim()) e.bankName = 'Bank name is required';
      if (!form.bankIfscCode || form.bankIfscCode.trim().length < 4 || form.bankIfscCode.trim().length > 15) {
        e.bankIfscCode = 'IFSC code must be between 4 and 15 characters';
      }
    }
    if (mode !== 'forgot' && (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))) e.email = 'Valid email required';
    if (mode === 'forgot' && !form.email.trim()) e.email = 'Email required';
    if (mode !== 'forgot' && (!form.password || form.password.length < 8)) e.password = 'Password must be at least 8 characters';
    if (mode === 'forgot' && (!form.password || form.password.length < 8)) e.password = 'New password must be at least 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    if (mode === 'login') {
      try {
        const res = await publicFetch('/api/shg/login', {
          method: 'POST',
          body: JSON.stringify({ email: form.email, password: form.password })
        });
        const data = await res.json();
        setLoading(false);
        if (res.status === 200 && data.token) {
          loginUser('vendor', data, data.token);
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'VendorStack' }] }));
        } else {
          Alert.alert("Login Failed", data.message || "Invalid credentials");
        }
      } catch (error) {
        setLoading(false);
        Alert.alert("Network Error", "Could not connect to server: " + error.message);
      }
    } else if (mode === 'register') {
      try {
        const payload = {
          ...form,
          aadhaarImage: kycImages.aadhaar,
          panImage: kycImages.pan,
          gstImage: kycImages.gst,
          members: parseInt(form.members) || 0,
        };
        await submitSHGRegistration(payload);
        setLoading(false);
        Alert.alert(
          "Success",
          "Registration submitted successfully! Your account will be active once approved by Nari Samman admin.",
          [
            {
              text: "OK",
              onPress: () => {
                switchMode('login');
              }
            }
          ]
        );
      } catch (error) {
        setLoading(false);
        Alert.alert("Registration Failed", error.message || "Failed to submit registration");
      }
    } else if (mode === 'forgot') {
      if (phoneVerified) {
        try {
          const res = await publicFetch('/api/shg/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email: form.email, otp: otpInput, newPassword: form.password })
          });
          const data = await res.json();
          setLoading(false);
          if (res.status === 200) {
            Alert.alert("Success", "Password reset successfully. Please login with your new password.", [
              { text: "OK", onPress: () => switchMode('login') }
            ]);
          } else {
            Alert.alert("Error", data.message || 'Failed to reset password');
          }
        } catch (error) {
          setLoading(false);
          Alert.alert("Error", 'Network error details: ' + (error.message || error));
        }
      } else {
        setLoading(false);
        Alert.alert("Verification Required", "Please verify the reset OTP sent to your email first.");
      }
    }
  };

  const otpButton = phoneVerified ? (
    <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>✓ Verified</Text></View>
  ) : (
    <TouchableOpacity onPress={sendOtp} style={styles.otpSmallBtn}>
      <Text style={styles.otpSmallBtnText}>{otpSent ? 'Resend' : 'Send OTP'}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#0F1822', '#1A2635', '#0F1822']} style={styles.container}>
      <KeyboardAvoidingWrapper>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
          <View style={styles.header}>
            <LinearGradient colors={['#2A7A4A', '#3A9A5A']} style={styles.iconCircle}><Text style={styles.headerIcon}>🧵</Text></LinearGradient>
            <View style={styles.brandNameRow}><NariLogoIcon size={34} /><Text style={styles.appName}>Nari Samman – SHG Portal</Text></View>
            <Text style={styles.title}>{mode === 'forgot' ? 'Reset Password' : (mode === 'login' ? 'Artisan Login' : 'Join as SHG / Artisan')}</Text>
          </View>

          <View style={styles.tabContainer}>
            {['login', 'register'].map((m) => (
              <TouchableOpacity key={m} style={[styles.tab, mode === m && styles.tabActive]} onPress={() => switchMode(m)}>
                <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>{m === 'login' ? 'Sign In' : 'Register SHG'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            {mode === 'register' && (
              <>
                <View style={styles.kycInfo}>
                  <Text style={styles.kycTitle}>📋 Quick Checklist</Text>
                  <Text style={styles.kycStep}>1. Only KYC Images (Aadhaar & PAN) are required to upload.</Text>
                  <Text style={styles.kycStep}>2. Make sure images are clear and readable.</Text>
                </View>
                <Field label="Leader Name" placeholder="Full name of SHG leader" icon="👤" value={form.leaderName} onChangeText={(v) => setField('leaderName', v)} error={errors.leaderName} />
                <Field label="SHG Name" placeholder="e.g. Mahila Udyog SHG" icon="👥" value={form.shgName} onChangeText={(v) => setField('shgName', v)} error={errors.shgName} />
              </>
            )}

            <Field label="Email Address" placeholder="you@example.com" keyboardType="email-address" icon="✉️" value={form.email} onChangeText={(v) => setField('email', v)} error={errors.email} />

            {mode === 'register' && (
              <>
                <Field label="Mobile Number" placeholder="Enter 10 digit mobile number" keyboardType="numeric" icon="📱" value={form.phone} onChangeText={setPhone} maxLength={10} error={errors.phone} rightElement={otpButton} />

                {otpSent && !phoneVerified && (
                  <View style={styles.otpBox}>
                    <Text style={styles.otpHint}>{otpMessage}</Text>
                    <View style={styles.otpVerifyRow}>
                      <TextInput
                        style={styles.otpInput}
                        placeholder="Enter OTP"
                        placeholderTextColor="rgba(200,208,228,0.35)"
                        value={otpInput}
                        onChangeText={(v) => setOtpInput(String(v || '').replace(/\D/g, '').slice(0, 6))}
                        keyboardType="numeric"
                        maxLength={6}
                      />
                      <TouchableOpacity onPress={verifyOtp} style={styles.verifyBtn}><Text style={styles.verifyBtnText}>Verify</Text></TouchableOpacity>
                    </View>
                    {errors.otp ? <Text style={styles.errorText}>{errors.otp}</Text> : null}
                  </View>
                )}

                {phoneVerified && <Text style={styles.successText}>{otpMessage}</Text>}

                <Field label="Location / Town" placeholder="e.g. Bolpur, Birbhum" icon="📍" value={form.location} onChangeText={(v) => setField('location', v)} error={errors.location} />

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Primary Category</Text>
                  <TouchableOpacity style={styles.inputRow} onPress={() => setCatOpen(!catOpen)}>
                    <Text style={styles.inputIcon}>🏷️</Text>
                    <Text style={{ flex: 1, color: form.category ? '#FFF' : 'rgba(200,208,228,0.35)', fontSize: 15 }}>
                      {form.category || 'Select primary product category'}
                    </Text>
                    <Text style={{ color: 'rgba(200,208,228,0.4)' }}>{catOpen ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}

                  {catOpen && (
                    <View style={styles.dropdown}>
                      {SHG_CATEGORIES.map((c) => (
                        <TouchableOpacity
                          key={c}
                          style={[styles.dropdownItem, form.category === c && styles.dropdownItemActive]}
                          onPress={() => {
                            setField('category', c);
                            setCatOpen(false);
                          }}
                        >
                          <Text style={[styles.dropdownItemText, form.category === c && styles.dropdownItemTextActive]}>{c}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <Field label="Total Active Members" placeholder="e.g. 10" keyboardType="numeric" icon="👥" value={form.members} onChangeText={(v) => setField('members', v)} error={errors.members} />

                <View style={styles.sectionHeaderRow}><Text style={styles.sectionHeaderTitle}>🪪 KYC Verification Docs</Text></View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Aadhaar Card Photo</Text>
                  <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage('aadhaar')}>
                    {kycImages.aadhaar ? <Image source={{ uri: kycImages.aadhaar }} style={styles.thumb} /> : <Text style={styles.uploadText}>+ Upload Aadhaar Image</Text>}
                  </TouchableOpacity>
                  {errors.aadhaarImage ? <Text style={styles.errorText}>{errors.aadhaarImage}</Text> : null}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>PAN Card Photo</Text>
                  <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage('pan')}>
                    {kycImages.pan ? <Image source={{ uri: kycImages.pan }} style={styles.thumb} /> : <Text style={styles.uploadText}>+ Upload PAN Card Image</Text>}
                  </TouchableOpacity>
                  {errors.panImage ? <Text style={styles.errorText}>{errors.panImage}</Text> : null}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>GST Certificate Photo (Optional)</Text>
                  <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage('gst')}>
                    {kycImages.gst ? <Image source={{ uri: kycImages.gst }} style={styles.thumb} /> : <Text style={styles.uploadText}>+ Upload GST Certificate Image</Text>}
                  </TouchableOpacity>
                </View>

                <View style={styles.sectionHeaderRow}><Text style={styles.sectionHeaderTitle}>🏦 Bank Details</Text></View>
                <Field label="Account Holder Name" placeholder="As per passbook" icon="👤" value={form.accountHolderName} onChangeText={(v) => setField('accountHolderName', v)} error={errors.accountHolderName} />
                <Field label="Account Number" placeholder="8-18 digits" keyboardType="numeric" icon="🔢" value={form.bankAccountNumber} onChangeText={(v) => setField('bankAccountNumber', v)} error={errors.bankAccountNumber} />
                <Field label="Confirm Account Number" placeholder="Re-enter bank account number" keyboardType="numeric" icon="🔢" value={form.confirmAccountNumber} onChangeText={(v) => setField('confirmAccountNumber', v)} error={errors.confirmAccountNumber} />
                <Field label="Bank Name" placeholder="e.g. State Bank of India" icon="🏛️" value={form.bankName} onChangeText={(v) => setField('bankName', v)} error={errors.bankName} />
                <Field label="IFSC Code" placeholder="11 characters (e.g. SBIN0001234)" icon="🔤" value={form.bankIfscCode} onChangeText={(v) => setField('bankIfscCode', v.toUpperCase())} error={errors.bankIfscCode} maxLength={11} />
                <Field label="UPI ID (Optional)" placeholder="e.g. name@okhdfcbank" icon="📱" value={form.upiId} onChangeText={(v) => setField('upiId', v)} error={errors.upiId} />
              </>
            )}

            <Field label={mode === 'forgot' ? "New Password" : "Password"} placeholder="Min. 8 characters" icon="🔒" secure show={showPass} onToggle={() => setShowPass(!showPass)} value={form.password} onChangeText={(v) => setField('password', v)} error={errors.password} />
            
            {mode === 'login' && (
              <TouchableOpacity style={styles.forgotBtn} onPress={() => switchMode('forgot')}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            {mode === 'forgot' && (
              <View style={{marginBottom: 20}}>
                <TouchableOpacity onPress={sendForgotOtp} style={styles.otpSmallBtn}>
                  <Text style={styles.otpSmallBtnText}>{otpSent ? 'Resend Email OTP' : 'Send Reset OTP to Email'}</Text>
                </TouchableOpacity>
                {otpSent && (
                  <View style={[styles.otpBox, {marginTop: 15}]}>
                    <Text style={styles.otpHint}>{otpMessage}</Text>
                    <View style={styles.otpVerifyRow}>
                      <TextInput
                        style={styles.otpInput}
                        placeholder="Enter Email OTP"
                        placeholderTextColor="rgba(200,208,228,0.35)"
                        value={otpInput}
                        onChangeText={setOtpInput}
                        keyboardType="numeric"
                        maxLength={6}
                      />
                      <TouchableOpacity onPress={() => setPhoneVerified(true)} style={[styles.verifyBtn, phoneVerified && {backgroundColor: '#2A7A4A'}]}>
                        <Text style={styles.verifyBtnText}>{phoneVerified ? 'Verified' : 'Verify'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            <TouchableOpacity onPress={handleSubmit} disabled={loading} style={styles.submitBtn}>
              <LinearGradient colors={['#2A7A4A', '#3A9A5A']} style={{ width: '100%', paddingVertical: 16, alignItems: 'center', borderRadius: 14 }}>
                <Text style={styles.submitText}>{loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : mode === 'forgot' ? 'Reset Password' : 'Register SHG')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {mode === 'login' ? "Don't have an account? " : mode === 'forgot' ? "Back to " : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}>
              <Text style={styles.switchLink}>
                {mode === 'forgot' ? 'Sign In' : (mode === 'login' ? 'Register Now' : 'Sign In')}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>IS&SF Initiative · Empowering Rural West Bengal</Text>
        </ScrollView>
      </KeyboardAvoidingWrapper>

      {showWebPicker && Platform.OS === 'web' && (
        <View style={styles.overlay}>
          <div style={{ display: 'none' }}>
            <input id="cam-input" type="file" accept="image/*" capture="environment" onChange={handleWebFileChange} />
            <input id="gal-input" type="file" accept="image/*" onChange={handleWebFileChange} />
          </div>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Document Photo</Text>
            <Text style={styles.modalSub}>Choose how to upload your document image</Text>
            <label htmlFor="cam-input" style={{ width: '100%', cursor: 'pointer' }}>
              <View style={styles.pickerRow}>
                <Text style={styles.pickerRowIcon}>📷</Text>
                <View style={{ flex: 1, paddingLeft: 10 }}>
                  <Text style={styles.pickerRowTitle}>Take Photo</Text>
                  <Text style={styles.pickerRowSub}>Use device camera to capture the document</Text>
                </View>
                <Text style={styles.pickerArrow}>→</Text>
              </View>
            </label>
            <label htmlFor="gal-input" style={{ width: '100%', cursor: 'pointer', marginTop: 10 }}>
              <View style={styles.pickerRow}>
                <Text style={styles.pickerRowIcon}>🖼️</Text>
                <View style={{ flex: 1, paddingLeft: 10 }}>
                  <Text style={styles.pickerRowTitle}>Choose from Gallery</Text>
                  <Text style={styles.pickerRowSub}>Select an existing photo from library</Text>
                </View>
                <Text style={styles.pickerArrow}>→</Text>
              </View>
            </label>
            <TouchableOpacity onPress={() => setShowWebPicker(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>{'Cancel'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 90 },
  backBtn: { marginTop: 52, marginBottom: 8 },
  backText: { color: '#3A9A5A', fontSize: 15, fontWeight: '600' },
  header: { alignItems: 'center', paddingVertical: 20 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  headerIcon: { fontSize: 34 },
  brandNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 },
  appName: { fontSize: 11, color: '#3A9A5A', fontWeight: '700', letterSpacing: 1.2, marginBottom: 8, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(200,208,228,0.07)', borderRadius: 14, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: 'center' },
  tabActive: { backgroundColor: '#2A7A4A' },
  tabText: { fontSize: 14, fontWeight: '600', color: 'rgba(200,208,228,0.5)' },
  tabTextActive: { color: '#FFFFFF' },
  card: { backgroundColor: 'rgba(19,29,41,0.95)', borderRadius: 22, padding: 24, borderWidth: 1, borderColor: 'rgba(200,208,228,0.1)' },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: 'rgba(200,208,228,0.6)', marginBottom: 7 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 13, borderWidth: 1.5, borderColor: 'rgba(200,208,228,0.12)', paddingHorizontal: 14, minHeight: 52 },
  input: { flex: 1, fontSize: 15, color: '#FFF', height: 52 },
  uploadBtn: { height: 100, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(200,208,228,0.12)', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' },
  uploadText: { color: 'rgba(200,208,228,0.4)', fontSize: 13 },
  thumb: { width: '100%', height: '100%', borderRadius: 13 },
  sectionHeaderRow: { marginTop: 24, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(200,208,228,0.1)', paddingBottom: 6 },
  sectionHeaderTitle: { fontSize: 14, fontWeight: '800', color: '#3A9A5A' },
  errorText: { fontSize: 11, color: COLORS.error, marginTop: 5 },
  verifiedBadge: { backgroundColor: 'rgba(40,167,69,0.18)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, marginLeft: 8 },
  verifiedText: { color: COLORS.success, fontSize: 11, fontWeight: '800' },
  otpSmallBtn: { backgroundColor: '#3A9A5A', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, marginLeft: 8 },
  otpSmallBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  otpBox: { marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 13, padding: 12, borderWidth: 1, borderColor: 'rgba(200,208,228,0.1)' },
  otpInput: { flex: 1, height: 46, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFF', paddingHorizontal: 14 },
  verifyBtn: { height: 46, borderRadius: 12, backgroundColor: '#3A9A5A', paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  verifyBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  dropdown: { backgroundColor: '#131D29', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(200,208,228,0.15)', marginTop: 4, overflow: 'hidden' },
  dropdownItem: { paddingVertical: 13, paddingHorizontal: 16 },
  dropdownItemActive: { backgroundColor: 'rgba(42,122,74,0.3)' },
  dropdownItemText: { fontSize: 14, color: 'rgba(200,208,228,0.7)' },
  dropdownItemTextActive: { color: '#3A9A5A', fontWeight: '700' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 18, marginTop: -4 },
  forgotText: { fontSize: 13, color: '#3A9A5A', fontWeight: '600' },
  submitBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 6 },
  submitText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
  kycInfo: { backgroundColor: 'rgba(42,122,74,0.1)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(42,122,74,0.25)', padding: 18, marginBottom: 20, gap: 10 },
  kycTitle: { fontSize: 14, fontWeight: '700', color: '#3A9A5A', marginBottom: 6 },
  kycStep: { fontSize: 13, color: 'rgba(200,208,228,0.75)', lineHeight: 20 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' },
  switchLabel: { fontSize: 14, color: 'rgba(200,208,228,0.55)' },
  switchLink: { fontSize: 14, color: '#3A9A5A', fontWeight: '700' },
  footer: { textAlign: 'center', fontSize: 11, color: 'rgba(200,208,228,0.2)' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modalBox: { backgroundColor: '#131D29', borderRadius: 24, padding: 22, width: 330, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(200,208,228,0.1)' },
  modalTitle: { fontSize: 19, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  modalSub: { fontSize: 12, color: 'rgba(200,208,228,0.5)', marginBottom: 14, textAlign: 'center' },
  pickerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: 'rgba(200,208,228,0.12)' },
  pickerRowIcon: { fontSize: 26 },
  pickerRowTitle: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  pickerRowSub: { fontSize: 11, color: 'rgba(200,208,228,0.4)', marginTop: 2 },
  pickerArrow: { fontSize: 18, color: 'rgba(200,208,228,0.4)', marginLeft: 'auto' },
  cancelBtn: { marginTop: 14, width: '100%', paddingVertical: 12, borderRadius: 50, borderWidth: 1.5, borderColor: 'rgba(200,208,228,0.12)', alignItems: 'center' },
  cancelBtnText: { fontSize: 14, color: 'rgba(200,208,228,0.6)', fontWeight: '600' }
});
