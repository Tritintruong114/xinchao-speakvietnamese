import { BrutalMarquee } from '@xinchao/ui-web';
import React from 'react';
import { BrutalSection } from '../layout/BrutalSection';

interface MarqueeSectionProps {
  items?: string[];
}

const DEFAULT_ITEMS = [
  'Scan Menu',
  'Street Slang',
  'Bargain like a pro',
  'Navigate like a local',
  'Order like a local',
  'Count change fast',
  'Decode street signs',
  'Survival audio',
];

export const MarqueeSection: React.FC<MarqueeSectionProps> = ({ items = DEFAULT_ITEMS }) => {
  return (
    <BrutalSection padding="none" id="marquee">
      <BrutalMarquee items={items} />
    </BrutalSection>
  );
};
