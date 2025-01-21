
import FSCMoodlet, { type FSCAction, type FSCState } from './components/Moodlet';

/**
 * The main app component, which renders three FSCMoodlet instances.
 *
 * The first is the letter variant with some pre-set initial states.
 * The second one is the word variant with some pre-set initial states.
 * The third one renders the letter variant in a disabled state.
 */
function App() {
  /**
   * Called whenever the state of any of the moodlets is changed.
   *
   * Logs the action and new state to the console.
   *
   * @param item - The action that was changed.
   * @param newState - The new state of the action.
   */
  const handleStateChange = (item: FSCAction, newState: FSCState) => {
    // eslint-disable-next-line no-console
    console.log(`${item} changed to ${newState}`);
  };

  return (
    <div className="container mx-auto p-8 space-y-8 content-start">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Letter Variant</h2>
        <FSCMoodlet
          variant="letter"
          initialStates={{
            FUELLING: 'REQUIRED',
            SERVICING: 'CURRENT',
            CLEANING: 'COMPLETED',
          }}
          onChange={handleStateChange}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Word Variant</h2>
        <FSCMoodlet
          variant="word"
          initialStates={{
            FUELLING: 'NOT_REQUIRED',
            SERVICING: 'REQUIRED',
            CLEANING: 'CURRENT',
          }}
          onChange={handleStateChange}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Disabled State</h2>
        <FSCMoodlet
          variant="letter"
          disabled
          initialStates={{
            FUELLING: 'COMPLETED',
            SERVICING: 'CURRENT',
            CLEANING: 'REQUIRED',
          }}
          onChange={handleStateChange}
        />
      </div>
    </div>
  );
}

export default App;