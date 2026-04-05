import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Colors, Stroke, Shadow, BorderRadius } from '../constants/Theme';
import { Trash2 } from 'lucide-react-native';
import { ThemedText } from './ThemedText';

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
  textColor = Colors.black, 
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
            <Trash2 size={16} color={Colors.black} strokeWidth={2.5} />
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
    borderRadius: BorderRadius.card,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    padding: 12,
    justifyContent: 'space-between',
    // Hard shadow
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
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
    backgroundColor: Colors.white,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    alignItems: 'center',
    justifyContent: 'center',
    // Micro hard shadow for the button
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset / 2, height: Shadow.offset / 2 },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset / 2,
  },
  pressed: {
    transform: [{ translateX: Shadow.offset / 4 }, { translateY: Shadow.offset / 4 }],
    shadowOffset: { width: Shadow.offset / 4, height: Shadow.offset / 4 },
  },
});
