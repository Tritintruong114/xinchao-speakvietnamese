'use client';

import { BrutalCard, cn, getBrutalButtonClassName } from '@xinchao/ui-web';
import React from 'react';

type FormResultBannerProps = {
  variant: 'success' | 'error';
  title: string;
  children?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  /** Default `left` for forms; `center` for hero-style sections */
  align?: 'left' | 'center';
};

export function FormResultBanner({
  variant,
  title,
  children,
  actionLabel,
  onAction,
  className,
  align = 'left',
}: FormResultBannerProps) {
  const isSuccess = variant === 'success';
  const center = align === 'center';

  return (
    <div
      className={cn('max-w-2xl mx-auto', center ? 'text-center' : 'text-left', className)}
      role={isSuccess ? 'status' : 'alert'}
      aria-live={isSuccess ? 'polite' : 'assertive'}
    >
      <BrutalCard
        backgroundColor={isSuccess ? 'bg-brand-mint' : 'bg-white'}
        className={cn(
          'p-8 md:p-10 border-4 brutal-shadow-lg space-y-4',
          !isSuccess && 'border-brand-red',
        )}
      >
        <h3
          className={cn(
            'text-2xl md:text-3xl font-black uppercase tracking-tight text-text-main',
            center && 'text-center',
          )}
        >
          {title}
        </h3>
        {children ? (
          <div
            className={cn(
              'text-lg font-bold text-text-main/90 leading-snug',
              center && 'text-center',
            )}
          >
            {children}
          </div>
        ) : null}
        {actionLabel && onAction ? (
          <div className={cn('pt-2', center && 'flex justify-center')}>
            <button
              type="button"
              onClick={onAction}
              className={getBrutalButtonClassName({
                variant: 'secondary',
                className: 'w-full sm:w-auto text-base uppercase tracking-wide',
              })}
            >
              {actionLabel}
            </button>
          </div>
        ) : null}
      </BrutalCard>
    </div>
  );
}
