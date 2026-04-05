import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  onRequestPermission: () => void;
  onCancel: () => void;
}

export function PrePermissionScreen({ onRequestPermission, onCancel }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headline}>Let Bé Ghế Nhựa translate for you!</Text>
        <Text style={styles.copy}>
          We need your camera to scan menus and street signs. No photos are stored, only translated.
        </Text>
        
        <TouchableOpacity style={styles.primaryBtn} onPress={onRequestPermission}>
          <Text style={styles.primaryBtnText}>ENABLE CAMERA</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.ghostBtn} onPress={onCancel}>
          <Text style={styles.ghostBtnText}>Maybe later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  headline: {
    fontFamily: 'BeVietnamPro-ExtraBold',
    fontSize: 28,
    color: '#DA251D',
    marginBottom: 16,
    lineHeight: 34,
  },
  copy: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 32,
    lineHeight: 24,
  },
  primaryBtn: {
    backgroundColor: '#DA251D',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  primaryBtnText: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  ghostBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    alignItems: 'center',
  },
  ghostBtnText: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 16,
    color: '#1A1A1A',
  }
});
