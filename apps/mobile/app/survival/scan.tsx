import { CameraView } from 'expo-camera';
import { Stack, useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PrePermissionScreen } from '../../components/survival/PrePermissionScreen';
import { ScanAnalyzeSkeleton, ScanResultCard } from '../../components/survival/ScanResultCard';
import { SurvivalOverlay } from '../../components/survival/SurvivalOverlay';
import { useSurvivalScan } from '../../hooks/useSurvivalScan';

export default function ScanScreen() {
  const router = useRouter();
  const { 
    permission, 
    requestPermission, 
    cameraRef, 
    isLoading, 
    result, 
    error, 
    scanImage, 
    clearResult 
  } = useSurvivalScan();

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <PrePermissionScreen 
        onRequestPermission={requestPermission} 
        onCancel={() => router.back()} 
      />
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'SurvivalScan', headerStyle: { backgroundColor: '#FFC62F' } }} />
      
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="back" ref={cameraRef} />
        <SurvivalOverlay isError={!!error} />

        {isLoading && !result ? <ScanAnalyzeSkeleton /> : null}
        
        {/* Capture Button */}
        {!result && (
          <View style={styles.captureContainer}>
             <TouchableOpacity 
                style={[styles.captureBtn, isLoading && styles.captureBtnBusy]} 
                onPress={scanImage}
                disabled={isLoading}
             >
               <Camera color="#FFFFFF" strokeWidth={2.5} size={32} />
             </TouchableOpacity>
          </View>
        )}

        {/* Error State */}
        {error && !result && (
            <View style={styles.errorCard}>
                 <Text style={styles.errorText}>{error}</Text>
                 <TouchableOpacity style={styles.closeErrorBtn} onPress={clearResult}>
                    <Text style={styles.closeErrorText}>Try Again</Text>
                 </TouchableOpacity>
            </View>
        )}

        {/* Result Card */}
        {result && (
            <ScanResultCard result={result} onClose={clearResult} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  captureContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 48,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DA251D',
    borderWidth: 3,
    borderColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  captureBtnBusy: {
    opacity: 0.55,
  },
  errorCard: {
    position: 'absolute',
    top: 48,
    left: 24,
    right: 24,
    backgroundColor: '#DA251D', // Đỏ Cờ
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  errorText: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 24,
  },
  closeErrorBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    alignItems: 'center',
  },
  closeErrorText: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 16,
    color: '#1A1A1A',
  }
});
