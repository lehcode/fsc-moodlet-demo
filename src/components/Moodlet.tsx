import React, { useState } from 'react';

import { cn } from '../lib/utils/merge-class-names';

export type FSCState = 'NOT_REQUIRED' | 'REQUIRED' | 'CURRENT' | 'COMPLETED';
export type FSCAction = 'FUELLING' | 'SERVICING' | 'CLEANING';

interface FSCMoodletProps {
  initialStates?: Record<FSCAction, FSCState>;
  variant?: 'letter' | 'word';
  className?: string;
  onChange?: (item: FSCAction, newState: FSCState) => void;
}

const FSCMoodlet: React.FC<FSCMoodletProps> = ({
  initialStates,
  variant = 'letter',
  className,
  onChange,
}) => {
  const [states, setStates] = useState<Record<FSCAction, FSCState>>(() => ({
    FUELLING: 'REQUIRED',
    SERVICING: 'REQUIRED',
    CLEANING: 'REQUIRED',
    ...initialStates,
  }));

  const getNextState = (currentState: FSCState): FSCState => {
    const stateFlow: Record<FSCState, FSCState> = {
      NOT_REQUIRED: 'REQUIRED',
      REQUIRED: 'CURRENT',
      CURRENT: 'COMPLETED',
      COMPLETED: 'CURRENT',
    };
    return stateFlow[currentState];
  };

  const handleClick = (item: FSCAction, isRightClick: boolean = false) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();

      let newState: FSCState = states[item];

      if (isRightClick) {
        newState = 'NOT_REQUIRED';
      } else {
        newState = getNextState(states[item]);
      }

      setStates((prev) => ({
        ...prev,
        [item]: newState,
      }));

      onChange?.(item, newState);
    };
  };

  const getStateColor = (state: FSCState): string => {
    const colors: Record<FSCState, string> = {
      NOT_REQUIRED: 'bg-purple-100 text-purple-700',
      REQUIRED: 'bg-purple-200 text-purple-800',
      CURRENT: 'bg-red-200 text-red-800',
      COMPLETED: 'bg-green-200 text-green-800',
    };
    return colors[state];
  };

  const renderMoodlet = (item: FSCAction) => {
    const label = variant === 'letter' ? item[0] : item;
    const state = states[item];

    return (
      <button
        type="button"
        key={item}
        className={cn(
          'px-3 py-1 rounded-full font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          getStateColor(state),
          variant === 'word' ? 'text-sm' : 'text-xs w-8 h-8',
        )}
        onClick={handleClick(item)}
        onContextMenu={handleClick(item, true)}
        title={`${item} - ${state.replace('_', ' ')}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className={cn('flex gap-2 items-center', className)}>
      {renderMoodlet('FUELLING')}
      {renderMoodlet('SERVICING')}
      {renderMoodlet('CLEANING')}
    </div>
  );
};

export default FSCMoodlet;