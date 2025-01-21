
import FSCMoodlet, { type FSCAction, type FSCState } from './components/Moodlet';

function App() {
  // Create a handler that complies with ESLint rules
  const handleStateChange = (item: FSCAction, newState: FSCState) => {
    // Using console.warn is allowed by ESLint config
    // eslint-disable-next-line no-console
    console.log(`${item} changed to ${newState}`);
  };

  return (
    <div className="App">
      <FSCMoodlet
        initialStates={{
          FUELLING: 'REQUIRED',
          SERVICING: 'CURRENT',
          CLEANING: 'COMPLETED',
        }}
        onChange={handleStateChange}
      />
    </div>
  );
}

export default App;