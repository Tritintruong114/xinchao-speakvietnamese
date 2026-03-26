import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Colors } from '@/constants/Theme';
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
          {Icon && <Icon size={32} color="#1A1A1A" strokeWidth={2.5} />}
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
    borderWidth: 2,
    borderColor: Colors.black,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 96,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
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
    borderWidth: 2,
    borderColor: Colors.black,
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
    transform: [{ translateX: 1 }, { translateY: 1 }],
  },
});

