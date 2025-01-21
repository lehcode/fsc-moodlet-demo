import React, { useState } from 'react';

import { joinClassNames } from '../lib/utils/join-class-names';

export type FSCState = 'NOT_REQUIRED' | 'REQUIRED' | 'CURRENT' | 'COMPLETED';
export type FSCAction = 'FUELLING' | 'SERVICING' | 'CLEANING';

interface IFSCMoodletProps {
  initialStates?: Partial<Record<FSCAction, FSCState>>;
  variant?: 'letter' | 'word';
  className?: string;
  onChange?: (item: FSCAction, newState: FSCState) => void;
  disabled?: boolean;
}

/**
 * A moodlet component that displays three buttons with state labels.
 *
 * The buttons are labeled with the first letter of the action they represent.
 * The state of the button is represented by its background color.
 * The buttons can be clicked to change their state.
 * The component also accepts an optional prop of `variant` which can be set to `'word'` to display the full action name on the button.
 * The component also accepts an optional prop of `disabled` which can be set to `true` to disable all the buttons.
 *
 * @param {Object} props - The props object.
 * @param {Object} [props.initialStates] - An object where the keys are the actions and the values are the initial states.
 * @param {'letter'|'word'} [props.variant] - The variant of the component. If set to `'word'`, the full action name is displayed on the button.
 * @param {string} [props.className] - The class name to apply to the outermost element.
 * @param {(item: FSCAction, newState: FSCState) => void} [props.onChange] - A callback function that is called whenever the state of any of the moodlets is changed.
 * @param {boolean} [props.disabled] - Whether or not the moodlet should be disabled.
 *
 * @returns {React.ReactElement} A React element.
 */
const FSCMoodlet: React.FC<IFSCMoodletProps> = ({
  initialStates = {},
  variant = 'letter',
  className,
  onChange,
  disabled = false,
}) => {
  const [states, setStates] = useState<Record<FSCAction, FSCState>>(() => ({
    FUELLING: 'REQUIRED',
    SERVICING: 'REQUIRED',
    CLEANING: 'REQUIRED',
    ...initialStates,
  }));

  /**
   * Returns the next state of the moodlet based on the given current state.
   *
   * If the current state is `'COMPLETED'`, the next state is `'CURRENT'`.
   * Otherwise, the next state is determined by the state flow object.
   *
   * @param {FSCState} currentState - The current state of the moodlet.
   *
   * @returns {FSCState} The next state of the moodlet.
   */
  const getNextState = (currentState: FSCState): FSCState => {
    if (currentState === 'COMPLETED') {
      return 'CURRENT';
    }

    const stateFlow: Record<FSCState, FSCState> = {
      NOT_REQUIRED: 'REQUIRED',
      REQUIRED: 'CURRENT',
      CURRENT: 'COMPLETED',
      COMPLETED: 'CURRENT',
    };
    return stateFlow[currentState];
  };

  /**
   * Returns a function that updates the state of the moodlet based on the given
   * item and whether the click was a right-click or not.
   *
   * If disabled, the returned function does nothing.
   *
   * @param {FSCAction} item - The item to update the state for.
   * @param {boolean} [isRightClick] - Whether the click was a right-click or not.
   *
   * @returns {(e: React.MouseEvent) => void} A function to handle the click event.
   */
  const handleClick = (item: FSCAction, isRightClick: boolean = false) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      if (disabled) return;

      let newState: FSCState;
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

  /**
   * Returns a Tailwind CSS class string that represents the style for the given
   * state.
   *
   * The style includes the base style of transitioning colors with a duration of
   * 200ms, plus the specific style for the given state.
   *
   * If the moodlet is disabled, adds `opacity-50 cursor-not-allowed` to the
   * style.
   *
   * @param {FSCState} state - The state to get the style for.
   *
   * @returns {string} The Tailwind CSS class string for the given state.
   */
  const getStateStyle = (state: FSCState): string => {
    const baseStyle = 'transition-colors duration-200';
    const styles: Record<FSCState, string> = {
      NOT_REQUIRED: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      REQUIRED: 'bg-purple-200 text-purple-800 hover:bg-purple-300',
      CURRENT: 'bg-red-200 text-red-800 hover:bg-red-300',
      COMPLETED: 'bg-green-200 text-green-800 hover:bg-green-300',
    };
    return joinClassNames(baseStyle, styles[state], disabled ? 'opacity-50 cursor-not-allowed' : undefined);
  };

  /**
   * Renders a single moodlet button.
   *
   * The button is rendered with a class name based on the current state of the
   * moodlet, and is given an onClick and onContextMenu event handler that will
   * trigger the handleClick function with the item and whether it was a right click
   * or not.
   *
   * @param {FSCAction} item - The action to render the moodlet for.
   *
   * @returns {React.ReactElement} The rendered moodlet button.
   */
  const renderMoodlet = (item: FSCAction) => {
    const label = variant === 'letter' ? item[0] : item.toLowerCase();
    const state = states[item];
    const buttonSize = variant === 'letter' ? 'w-8 h-8' : 'px-4 py-1';

    return (
      <button
        type="button"
        key={item}
        className={joinClassNames(
          'rounded-full font-medium',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
          buttonSize,
          getStateStyle(state),
        )}
        onClick={handleClick(item)}
        onContextMenu={handleClick(item, true)}
        title={`${item} - ${state.replace('_', ' ')}`}
        disabled={disabled}
      >
        {label}
      </button>
    );
  };

  return (
    <div 
      className={joinClassNames(
        'flex gap-2 items-center p-1',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className
      )}
    >
      {renderMoodlet('FUELLING')}
      {renderMoodlet('SERVICING')}
      {renderMoodlet('CLEANING')}
    </div>
  );
};

export default FSCMoodlet;