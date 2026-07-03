let audioCtx = null;
let isPlaying = false;
let oscillators = [];
let gainNode = null;
let filterNode = null;
let delayNode = null;
let feedbackGain = null;
let lfo = null;

// Creates a rich, detuned A-minor 7 chord synth pad with lowpass LFO filter sweeps and delay feedback
export function startAmbientAudio() {
  if (isPlaying) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Lowpass filter for smooth warmth
    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(280, audioCtx.currentTime);
    filterNode.Q.setValueAtTime(1.5, audioCtx.currentTime);

    // detuned AMin7 chord frequencies: A2(110Hz), C3(130.81Hz), E3(164.81Hz), G3(196Hz)
    const freqs = [110.00, 130.81, 164.81, 196.00];
    oscillators = freqs.map((f, i) => {
      const osc = audioCtx.createOscillator();
      // Use triangle waves for smooth woodwind-like textures
      osc.type = 'triangle';
      // Apply fine micro-detuning to create spatial stereo chorus thickness
      const detuneVal = (i - 1.5) * 8; 
      osc.frequency.setValueAtTime(f, audioCtx.currentTime);
      osc.detune.setValueAtTime(detuneVal, audioCtx.currentTime);
      
      osc.connect(filterNode);
      return osc;
    });

    // Master volume gain
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
    // Smooth attack transition
    gainNode.gain.linearRampToValueAtTime(0.065, audioCtx.currentTime + 3.0);

    // Create a spatial feedback delay loop
    delayNode = audioCtx.createDelay(1.0);
    delayNode.delayTime.setValueAtTime(0.6, audioCtx.currentTime);
    
    feedbackGain = audioCtx.createGain();
    feedbackGain.gain.setValueAtTime(0.38, audioCtx.currentTime); // 38% feedback repeat

    // Connect delay circuit
    filterNode.connect(delayNode);
    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode); // feedback loop
    
    // Connect output channels
    filterNode.connect(gainNode);
    delayNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Setup LFO to sweep lowpass filter frequency (breathing pad effect)
    lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, audioCtx.currentTime); // very slow (12-second cycle)
    
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(110, audioCtx.currentTime); // sweep filter between ~170Hz and 390Hz
    
    lfo.connect(lfoGain);
    lfoGain.connect(filterNode.frequency); // modulate filter frequency

    // Play all sources
    oscillators.forEach(osc => osc.start());
    lfo.start();
    isPlaying = true;
    
    const label = document.getElementById('music-status-text');
    if (label) label.textContent = 'SOUND OFF';
  } catch (e) {
    console.warn('Web Audio synthesis failed to start:', e);
  }
}

export function toggleAmbientAudio() {
  if (!audioCtx) {
    startAmbientAudio();
    return;
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
    const label = document.getElementById('music-status-text');
    if (label) label.textContent = 'SOUND OFF';
  } else if (audioCtx.state === 'running') {
    audioCtx.suspend();
    const label = document.getElementById('music-status-text');
    if (label) label.textContent = 'SOUND ON';
  }
}

// Single click binding called during main setup to prevent double listener registration
export function initAudioBindings() {
  const musicToggle = document.getElementById('music-toggle');
  if (musicToggle) {
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAmbientAudio();
    });
  }
}
