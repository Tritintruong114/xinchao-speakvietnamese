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
        <ThemedText 
          type="h2" 
          color={highlighted ? Colors.white : Colors.black} 
          style={[styles.title, highlighted && { color: Colors.white }]}
        >
          {title}
        </ThemedText>
        <ThemedText 
          type="body" 
          color={highlighted ? Colors.white : Colors.textMain} 
          style={[styles.subtitle, highlighted && { color: Colors.white }]}
        >
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
    borderColor: Colors.black,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 96,
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    marginBottom: 8,
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
    width: 64,
    height: 64,
    borderRadius: 12,
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
    fontFamily: 'BeVietnamPro_900Black',
    fontSize: 20,
    lineHeight: 24,
    marginBottom: 2,
    color: Colors.black,
  },
  subtitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 13,
    lineHeight: 18,
    color: Colors.black,
    opacity: 0.6,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 2, height: 2 },
    elevation: 2,
  },
});
