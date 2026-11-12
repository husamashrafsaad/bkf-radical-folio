// BKF Radical Folio — Interactive Script
document.addEventListener('DOMContentLoaded', () => {
  initAudioStillness();
  initGatherRotator();
  initCanonFilters();
  initModal();
  initPrintButton();
});

// 1. Web Audio Ambient Stillness Generator (Tea kettle warmth / soft harmonic chime)
let audioCtx = null;
let isPlaying = false;
let ambientNodes = [];

function initAudioStillness() {
  const btn = document.getElementById('btn-stillness');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!isPlaying) {
      startStillnessAudio();
      btn.classList.add('active');
      btn.innerHTML = '<span>▶</span> Playing Stillness (Simmer & Chime)';
    } else {
      stopStillnessAudio();
      btn.classList.remove('active');
      btn.innerHTML = '<span>⏸</span> A moment of stillness';
    }
    isPlaying = !isPlaying;
  });
}

function startStillnessAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Master gain
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Warm base tones (Baghdad teahouse calm drone)
    const freqs = [174.61, 261.63, 349.23, 440.00]; // F3, C4, F4, A4 soothing chord
    freqs.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      // Gentle subtle modulation
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.value = 0.15 + Math.random() * 0.1;
      lfoGain.gain.value = 4.0;
      lfo.connect(osc.frequency);
      lfo.start();
      ambientNodes.push(lfo);

      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();

      ambientNodes.push(osc);
      ambientNodes.push(gain);
    });

    ambientNodes.push(masterGain);
  } catch (err) {
    console.warn('Web Audio not allowed or supported:', err);
  }
}

function stopStillnessAudio() {
  if (ambientNodes.length > 0) {
    ambientNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    ambientNodes = [];
  }
}

// 2. Gather Again Aphorism Rotator
const aphorisms = [
  {
    en: "An experimental commons rooted in Iraqi modernism, radical tenderness, and an uncompromising refusal of tyranny.",
    ar: "مشاع تجريبي متجذر في الحداثة العراقية، الحنان الراديكالي، والرفض الحاسم للاستبداد."
  },
  {
    en: "To dilly-dally over hot tea with comrades is to take back the hours that empire demands for labor.",
    ar: "التلكؤ على استكان الشاي مع الرفاق هو استرداد للساعات التي يبتزها الطغيان."
  },
  {
    en: "Tenderness is not surrender; it is the sanctuary that shelters the stubborn fire.",
    ar: "الحنان ليس استسلاماً؛ بل هو الملاذ الذي يحرس الشعلة العنيدة."
  },
  {
    en: "No kings, no masters. We build our refuge book by book, samovar by samovar.",
    ar: "لا ملوك ولا أسياد. نبني ملجأنا كتاباً إثر كتاب، وسماوراً إثر سماور."
  },
  {
    en: "From the bronze murals of Tahrir to the paper folios of Baghdad: freedom is sculpted collectively.",
    ar: "من جدارية التحرير البرونزية إلى أوراق بغداد: الحرية تُنحت معاً."
  }
];

let aphorismIdx = 0;

function initGatherRotator() {
  const btnGather = document.getElementById('btn-gather');
  const statementEl = document.getElementById('caption-statement-text');
  if (!btnGather || !statementEl) return;

  btnGather.addEventListener('click', () => {
    aphorismIdx = (aphorismIdx + 1) % aphorisms.length;
    statementEl.style.opacity = '0';
    setTimeout(() => {
      statementEl.innerHTML = aphorisms[aphorismIdx].en;
      statementEl.style.opacity = '1';
    }, 200);
  });
}

// 3. Reading Canon Filtering
function initCanonFilters() {
  const filterBtns = document.querySelectorAll('.canon-filter-btn');
  const cards = document.querySelectorAll('.canon-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 4. Excerpt Modal System
const excerptsData = {
  'jawad-saleem': {
    tag: 'Iraqi Modernism & Art',
    title: 'Jewad Selim & the Baghdad Modern Art Group (1951)',
    author: 'Archival Essay by BKF Editorial Collective',
    quote: 'Art is neither a mirror to servitude nor an ornament for the ruler\'s palace. It is the cry of a people shaping their dawn out of ancient clay and modern iron.',
    body: `When Jewad Selim and Shakir Hassan Al Said drafted the 1951 manifesto for the Baghdad Modern Art Group (جماعة بغداد للفن الحديث), they were not proposing mere stylistic novelty. They demanded that the Iraqi artist reclaim the unbroken lineage of Mesopotamian seals, Abbasid illumination, and street life, wedding them to radical modern form.<br><br>
In *Nasb al-Hurriyah* (Monument to Freedom) presiding over Tahrir Square, the struggle against tyranny is immortalized in bronze: from the soldier shattering prison gates to the woman lifting the torch of dawn. We honor this lineage not as museum dust, but as active tools of defiance.`
  },
  'sayyab-rain': {
    tag: 'Poetry & Free Verse',
    title: 'Rain Song (أنشودة المطر) & Other Revolutionary Verses',
    author: 'Badr Shakir al-Sayyab (بدر شاكر السياب)',
    quote: 'And there is hunger in Iraq / The harvest scatters / The crows feast / But every drop of rain carries a seed of revolution.',
    body: `Al-Sayyab did not merely shatter classical Arabic meter; he breathed the tragic, fertile soil of Jaykur into modern world poetry. Writing in exile and illness, his verse remained uncompromising in its refusal of dictatorship and colonial theft.<br><br>
In our reading circles, *Rain Song* is chanted as an incantation of renewal: proving that out of starvation and oppression, the soil of the two rivers inevitably germinates collective liberation.`
  },
  'radical-tenderness': {
    tag: 'Manifesto & Praxis',
    title: 'Radical Tenderness: A Broadsheet for Fragile Collectives',
    author: 'BKF Collective Folio No. 4',
    quote: 'To care for one another without ledger or suspicion is the first defeat of the fascist state in our daily habits.',
    body: `Authoritarian regimes rely upon atomization: making every neighbor an informant, every colleague a rival, and every quiet afternoon an illicit waste. <br><br>
Radical tenderness is our antidote. It is the stubborn commitment to wash each other's teacups, to distribute forbidden literature, to make soup when the barricades are cold, and to refuse the cynicism that dictators count upon to rule.`
  },
  'nazik-free-verse': {
    tag: 'Poetics & Rebellion',
    title: 'Revolt Against the Rhyme: Women Re-engineering Arabic Form',
    author: 'Nazik al-Malaika (نازك الملائكة)',
    quote: 'A verse that cannot hold the tremor of contemporary grief is no longer poetry; it is a gilded cage.',
    body: `In 1947, Nazik al-Malaika published *Cholera*, revolutionizing Arab poetics by dismantling centuries of rigid monorhyme. Her intellectual defiance proved that cultural forms cannot remain static while society bleeds.<br><br>
We read al-Malaika to remember that every revolutionary breakthrough begins with someone brave enough to break the metric mold of their ancestors while honoring their spirit.`
  },
  'teahouse-commons': {
    tag: 'Spatial Autonomy & History',
    title: 'The Samovar & the Street: Baghdad’s Radical Chaikhanas',
    author: 'Field Notes by the Folio Fellowship',
    quote: 'In the tea house, there is no high chair for the minister. The samovar boils equally for poet, porter, and deserter.',
    body: `From Al-Zahawi and Hassan Ajami to the back-alleys of Mutanabbi Street, Baghdad\'s chaikhanas have always served as autonomous parliaments of the dispossessed. Under successive military dictatorships, secret police sat at corner tables, listening frantically to whispered metaphors.<br><br>
This landing page is modeled on the chaikhana: a slow table where ideas are passed hot in small glasses (istikan), and dilly-dallying is recognized as a vital human right.`
  },
  'linocut-press': {
    tag: 'Tactile Print & Counter-Culture',
    title: 'Carving Resistance: Linocut, Woodblock & Clandestine Print',
    author: 'BKF Print Studio Handbook',
    quote: 'The digital screen can be turned off with a switch; ink pressed into damp rag paper survives fire, flood, and censors.',
    body: `Why an illustrated broadsheet? Because digital feeds are engineered for fleeting outrage and algorithmic control. Tactile print requires wood gouges, ink rollers, hand presses, and physical distribution hand-to-hand.<br><br>
The linocut artwork featuring our animal comrades is distributed under anti-copyright: download, carve, print on scrap paper, paste upon alleyway walls, and distribute freely.`
  }
};

function initModal() {
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalAuthor = document.getElementById('modal-author');
  const modalQuote = document.getElementById('modal-quote');
  const modalBody = document.getElementById('modal-body');

  document.querySelectorAll('.btn-read-excerpt').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const excerptId = e.target.dataset.id;
      const data = excerptsData[excerptId];
      if (!data) return;

      modalTag.textContent = data.tag;
      modalTitle.textContent = data.title;
      modalAuthor.textContent = data.author;
      modalQuote.textContent = `“${data.quote}”`;
      modalBody.innerHTML = data.body;

      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop && backdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

// 5. Print Broadside Poster
function initPrintButton() {
  const printBtn = document.getElementById('btn-print-broadsheet');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}
