import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, PanResponder, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastStore } from '../store/useToastStore';
import { ThemedText } from './ThemedText';
import { Colors, Stroke, Shadow } from '../constants/Theme';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const TOAST_HEIGHT = 80;

export function GlobalToast() {
  const { visible, message, type, duration, hideToast } = useToastStore();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-200)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Slide down Animation
      Animated.spring(translateY, {
        toValue: insets.top + 16,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();

      // If duration is provided, handle the "Hurry" progress bar logic
      if (duration) {
        progressAnim.setValue(1);
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: duration * 1000,
          useNativeDriver: false,
        }).start();

        timeoutRef.current = setTimeout(() => {
          handleDismiss();
        }, duration * 1000);
      } else {
        // Fallback for regular toasts: auto-hide after 5s or 10s
        timeoutRef.current = setTimeout(() => {
          handleDismiss();
        }, 5000);
      }
    } else {
      // Slide up and reset
      Animated.timing(translateY, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
      }).start();
      progressAnim.setValue(1);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [visible, insets.top, duration]);

  const handleDismiss = () => {
    Animated.timing(translateY, {
      toValue: -200,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      hideToast();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5 && gestureState.dy < 0;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          translateY.setValue(insets.top + 16 + gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -30) {
          handleDismiss();
        } else {
          Animated.spring(translateY, {
            toValue: insets.top + 16,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const getIcon = () => {
    const size = 20;
    switch (type) {
      case 'success': return <CheckCircle2 size={size} color={Colors.brandPrimary} />;
      case 'error': return <XCircle size={size} color={Colors.brandPrimary} />;
      case 'warning': return <AlertCircle size={size} color={Colors.black} />;
      case 'critical': return <AlertCircle size={size} color={Colors.white} />;
      default: return <Info size={size} color={Colors.black} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'warning': return Colors.brandSecondary;
      case 'critical': return Colors.brandPrimary;
      case 'success': return Colors.white;
      default: return Colors.white;
    }
  };

  const getBarColor = () => {
    if (type === 'critical') return Colors.white;
    if (type === 'warning') return Colors.brandPrimary;
    return Colors.black;
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <ThemedText style={[
          styles.text,
          type === 'critical' && { color: Colors.white }
        ]}>{message}</ThemedText>
      </View>

      {duration !== undefined && (
        <View style={styles.progressWrapper}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { 
                backgroundColor: getBarColor(),
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]} 
          />
        </View>
      )}

      <View style={styles.dragHandle} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 9999,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.black,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
    lineHeight: 20,
  },
  progressWrapper: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.black,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
});
