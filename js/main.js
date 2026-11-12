// BKF Radical Folio — Main Script

document.addEventListener('DOMContentLoaded', () => {
  initLeavesPagination();
  initAudioStillness();
  initGatherRotator();
});

// 1. Leaf Pagination (Leaf 01: Emily Dickinson, Lacan & Žižek, Yeats | Leaf 02: Plath & Frost, Leonard Cohen)
function initLeavesPagination() {
  const leaf01Rows = document.querySelectorAll('.leaf-01');
  const leaf02Rows = document.querySelectorAll('.leaf-02');
  const btnPrev = document.getElementById('btn-prev-leaf');
  const btnNext = document.getElementById('btn-next-leaf');
  const num01 = document.getElementById('leaf-num-1');
  const num02 = document.getElementById('leaf-num-2');
  const leafLabel = document.getElementById('leaf-current-label');

  let currentLeaf = 1;

  function setLeaf(leaf) {
    currentLeaf = leaf;

    if (leaf === 1) {
      leaf01Rows.forEach(r => r.style.display = 'grid');
      leaf02Rows.forEach(r => r.style.display = 'none');
      num01.classList.add('active');
      num02.classList.remove('active');
      btnPrev.classList.add('disabled');
      btnNext.classList.remove('disabled');
      if (leafLabel) leafLabel.textContent = 'LEAF 01 OF 02';
    } else {
      leaf01Rows.forEach(r => r.style.display = 'none');
      leaf02Rows.forEach(r => r.style.display = 'grid');
      num01.classList.remove('active');
      num02.classList.add('active');
      btnPrev.classList.remove('disabled');
      btnNext.classList.add('disabled');
      if (leafLabel) leafLabel.textContent = 'LEAF 02 OF 02';
    }
  }

  if (num01) num01.addEventListener('click', () => setLeaf(1));
  if (num02) num02.addEventListener('click', () => setLeaf(2));

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentLeaf > 1) setLeaf(currentLeaf - 1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentLeaf < 2) setLeaf(currentLeaf + 1);
    });
  }

  // Initial state
  setLeaf(1);
}

// 2. Audio Stillness Generator (Subtle calming ambient chord)
let audioCtx = null;
let isAudioPlaying = false;
let ambientNodes = [];

function initAudioStillness() {
  const btn = document.getElementById('btn-stillness');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!isAudioPlaying) {
      startStillness();
      btn.classList.add('active');
      btn.textContent = '▶ A moment of stillness (playing)';
    } else {
      stopStillness();
      btn.classList.remove('active');
      btn.textContent = '⏸ A moment of stillness';
    }
    isAudioPlaying = !isAudioPlaying;
  });
}

function startStillness() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Harmonic chords
    const freqs = [174.61, 220.00, 261.63, 349.23];
    freqs.forEach(freq => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();

      ambientNodes.push(osc, gain);
    });
    ambientNodes.push(masterGain);
  } catch (e) {
    console.warn('Audio not available:', e);
  }
}

function stopStillness() {
  ambientNodes.forEach(node => {
    try {
      if (node.stop) node.stop();
      if (node.disconnect) node.disconnect();
    } catch (e) {}
  });
  ambientNodes = [];
}

// 3. Aphorism Rotator (Gather again)
const aphorisms = [
  "An experimental commons rooted in Iraqi modernism, radical tenderness, and an uncompromising refusal of tyranny.",
  "No kings. No masters. Only each other.",
  "Tenderness is a radical act. الحنان فعل مقاومة",
  "To dilly dally with comrades over tea is to reclaim the hours stolen by tyranny."
];
let aphorismIdx = 0;

function initGatherRotator() {
  const btn = document.getElementById('btn-gather');
  const target = document.getElementById('caption-statement-text');
  if (!btn || !target) return;

  btn.addEventListener('click', () => {
    aphorismIdx = (aphorismIdx + 1) % aphorisms.length;
    target.style.opacity = '0';
    setTimeout(() => {
      target.textContent = aphorisms[aphorismIdx];
      target.style.opacity = '1';
    }, 150);
  });
}
