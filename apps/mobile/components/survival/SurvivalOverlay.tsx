import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export function SurvivalOverlay({ isError }: { isError?: boolean }) {
  return (
    <View style={StyleSheet.absoluteFill}>
       {/* Darkened outer region, clear center */}
       <View style={styles.topMask} />
       <View style={styles.centerRow}>
          <View style={styles.sideMask} />
          <View style={[styles.viewfinder, isError && styles.viewfinderError]}>
            {/* The clear box where user puts the text */}
          </View>
          <View style={styles.sideMask} />
       </View>
       <View style={styles.bottomMask}>
           <Text style={styles.hint}>Point at a menu or sign</Text>
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topMask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  centerRow: {
    flexDirection: 'row',
    height: 300,
  },
  sideMask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  viewfinder: {
    width: 250,
    borderWidth: 2,
    borderColor: '#FFC62F',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewfinderError: {
    borderColor: '#DA251D',
  },
  bottomMask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 16,
  },
  hint: {
    fontFamily: 'BeVietnamPro-Bold',
    color: '#FFFFFF',
    fontSize: 16,
  }
});
