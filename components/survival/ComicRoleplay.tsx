import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Colors, BorderRadius } from '../../constants/Theme';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';
import { Dialogue } from '../../constants/SurvivalData';
import { DialogueBubble } from './DialogueBubble';
import { useToastStore } from '../../store/useToastStore';
import { useRoleplayTimer } from '../../hooks/useRoleplayTimer';
import { MascotAdvisor } from './MascotAdvisor';
import { OptionGrid } from './OptionGrid';
import { CalculatorOverlay } from './CalculatorOverlay';

interface ComicRoleplayProps {
  dialogues: Dialogue[];
  onComplete: () => void;
}

export const ComicRoleplay = ({ dialogues, onComplete }: ComicRoleplayProps) => {
  const scrollRef = React.useRef<ScrollView>(null);
  const [currentDialogueId, setCurrentDialogueId] = useState<string | undefined>(dialogues[0]?.id);
  const [history, setHistory] = useState<Dialogue[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcValue, setCalcValue] = useState('0');
  const { showToast, hideToast } = useToastStore();

  const currentDialogue = dialogues.find(d => d.id === currentDialogueId);

  // Modularized Timer Logic
  const { timeLeft, resetTimer } = useRoleplayTimer(currentDialogue, (timeoutId) => {
    setCurrentDialogueId(timeoutId);
  });

  useEffect(() => {
    if (currentDialogue) {
      // Don't add to history if it's a tip (speaker: 'app' or 'mascot') or waiting for initial input
      const isTip = currentDialogue.speaker === 'app' || currentDialogue.speaker === 'mascot';
      const isWaitingForInput = currentDialogue.speaker === 'user' && !currentDialogue.text;
      
      if (!isTip && !isWaitingForInput && !history.find(h => h.id === currentDialogue.id)) {
        setHistory(prev => [...prev, currentDialogue]);
      }
    }
    
    // Auto-advance logic
    if (currentDialogue && (currentDialogue.speaker === 'app' || currentDialogue.speaker === 'mascot' || currentDialogue.speaker === 'seller') && currentDialogue.nextId && !currentDialogue.options) {
      if (currentDialogue.speaker === 'app' || currentDialogue.speaker === 'mascot') {
          const timer = setTimeout(() => {
            setCurrentDialogueId(currentDialogue.nextId);
          }, 3500);
          return () => clearTimeout(timer);
      }
    }
  }, [currentDialogueId, currentDialogue, history]);

  const handleOptionSelect = (option: { label: string, nextId: string, audioUri?: string }) => {
    resetTimer();
    
    if (currentDialogue) {
        setHistory(prev => [...prev, { ...currentDialogue, text: option.label, audioUri: option.audioUri }]);
    }

    if (option.nextId === 'end_success' || option.nextId === 'end_partial') {
      onComplete();
    } else {
      setCurrentDialogueId(option.nextId);
    }
  };

  useEffect(() => {
     if (currentDialogueId === 'end_success' || currentDialogueId === 'end_partial') {
       onComplete();
     }
  }, [currentDialogueId]);

  const getLatestVendorPrice = () => {
    const sellerMsgs = history.filter(h => h.speaker === 'seller').reverse();
    for (const msg of sellerMsgs) {
      const text = msg.text || '';
      const cleanText = text.replace(/[,.]/g, '');
      const match = cleanText.match(/(\d+)/);
      if (match) return parseInt(match[0], 10);
    }
    return null;
  };

  const handleCalculatorSubmit = (value: string) => {
    if (value) {
      const cleanValue = value.replace(/\D/g, '');
      const numericValue = parseInt(cleanValue, 10);
      const vendorPrice = getLatestVendorPrice();

      if (vendorPrice && numericValue > vendorPrice) {
        showToast("You should offer a lower price than the vendor!", "warning");
        return;
      }

      setShowCalculator(false);
      resetTimer();
      
      if (currentDialogue) {
        setHistory(prev => [...prev, { ...currentDialogue, text: `${value.toLocaleString()} VND, okay?` }]);
      }
      if (currentDialogue?.nextId) {
        setCurrentDialogueId(currentDialogue.nextId);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollRef}
        style={styles.historyScroll} 
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        <View style={{ padding: 24, paddingBottom: 120 }}>
          {history.map((d, index) => (
            <DialogueBubble 
              key={`${d.id}-${index}`}
              dialogue={d}
              isUser={d.speaker === 'user'}
              isSeller={d.speaker === 'seller'}
            />
          ))}
          
          {currentDialogue?.options && (
            <OptionGrid 
              options={currentDialogue.options} 
              onSelect={handleOptionSelect} 
            />
          )}

          {currentDialogue?.speaker === 'user' && !currentDialogue.text && !currentDialogue.options && !showCalculator && (
            <TouchableOpacity 
              style={styles.openCalculatorBtn}
              onPress={() => setShowCalculator(true)}
            >
              <ThemedText style={styles.buttonText}>OPEN CALCULATOR</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <MascotAdvisor 
        visible={currentDialogue?.speaker === 'app' || currentDialogue?.speaker === 'mascot'}
        text={currentDialogue?.tip || currentDialogue?.text || ''}
        expression="happy"
      />

      {!currentDialogue?.options && currentDialogue?.nextId && !showCalculator && !(currentDialogue?.speaker === 'user' && !currentDialogue?.text) && (
         <View style={styles.bottomActionContainer}>
            <ThemedButton 
              title="CONTINUE" 
              type="primary"
              onPress={() => setCurrentDialogueId(currentDialogue.nextId)}
              style={styles.fullWidthBtn}
            />
         </View>
      )}

      {showCalculator && (
        <CalculatorOverlay 
          value={calcValue}
          onValueChange={setCalcValue}
          onSubmit={handleCalculatorSubmit}
          expression={timeLeft !== null && timeLeft < 5 ? "excited" : "happy"}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  historyScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
    gap: 16,
  },
  openCalculatorBtn: {
    backgroundColor: Colors.brandSecondary,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: BorderRadius.button,
    padding: 16,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  bottomActionContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  fullWidthBtn: {
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro_800ExtraBold',
    color: Colors.black,
  },
});

