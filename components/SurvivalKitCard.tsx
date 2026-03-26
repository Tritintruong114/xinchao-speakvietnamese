import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { Trash2 } from 'lucide-react-native';

interface SurvivalKitCardProps {
  title: string;
  backgroundColor: string;
  textColor?: string;
  onDelete?: () => void;
}

/**
 * SurvivalKitCard - A horizontal card for downloaded lesson kits.
 * Matches Pencil design node 3ftLA/RbePn (9Qcaz).
 */
export function SurvivalKitCard({ 
  title, 
  backgroundColor, 
  textColor = '#1A1A1A', 
  onDelete 
}: SurvivalKitCardProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ThemedText style={[styles.title, { color: textColor }]}>
        {title.toUpperCase()}
      </ThemedText>
      
      <View style={styles.footer}>
        {onDelete && (
          <Pressable 
            onPress={onDelete}
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.pressed
            ]}
          >
            <Trash2 size={16} color="#1A1A1A" strokeWidth={2.5} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 136,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    padding: 12,
    justifyContent: 'space-between',
    // Hard shadow
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    marginRight: 12,
    marginBottom: 8, // Space for shadow
  },
  title: {
    fontSize: 18,
    fontFamily: 'BeVietnamPro_900Black',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    // Micro hard shadow for the button
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  pressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
    shadowOffset: { width: 1, height: 1 },
  },
});
