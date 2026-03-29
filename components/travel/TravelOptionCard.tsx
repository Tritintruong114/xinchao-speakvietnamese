import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Colors, Stroke, Shadow } from '@/constants/Theme';
import { ThemedText } from '@/components/ThemedText';

interface TravelOptionCardProps {
  title: string;
  subtitle: string;
  image?: ImageSourcePropType;
  icon?: LucideIcon;
  onPress?: () => void;
  highlighted?: boolean;
}

export function TravelOptionCard({
  title,
  subtitle,
  image,
  icon: Icon,
  onPress,
  highlighted = false,
}: TravelOptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        highlighted ? styles.highlighted : styles.defaultCard,
        pressed && styles.pressed,
      ]}
    >
      {image ? (
        <Image source={image} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={styles.iconBadge}>
          {Icon && <Icon size={32} color={Colors.black} strokeWidth={2.5} />}
        </View>
      )}
      <View style={styles.textBlock}>
        <ThemedText type="h2" color={highlighted ? Colors.white : Colors.black} style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText type="body" color={highlighted ? Colors.white : Colors.textMain} style={styles.subtitle}>
          {subtitle}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 96,
    shadowColor: Shadow.color,
    shadowOffset: { width: Shadow.offset, height: Shadow.offset },
    shadowOpacity: Shadow.opacity,
    shadowRadius: 0,
    elevation: Shadow.offset,
  },
  defaultCard: {
    backgroundColor: Colors.white,
  },
  highlighted: {
    backgroundColor: Colors.brandPrimary,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: Stroke.width,
    borderColor: Stroke.color,
    backgroundColor: Colors.brandSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    paddingLeft: 12,
  },
  title: {
    marginBottom: 2,
    fontSize: 18,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 17,
  },
  pressed: {
    transform: [{ translateX: Shadow.offset / 4 }, { translateY: Shadow.offset / 4 }],
    shadowOffset: { width: Shadow.offset / 2, height: Shadow.offset / 2 },
    elevation: Shadow.offset / 2,
  },
});

