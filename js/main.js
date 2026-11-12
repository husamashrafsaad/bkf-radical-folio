// BKF Radical Folio — Main Script (Strictly supporting imported Figma UI)

document.addEventListener('DOMContentLoaded', () => {
  initLeavesPagination();
  initStillnessControl();
  initGatherControl();
});

// 1. Leaf Pagination (Leaf 01: Dickinson, Lacan & Žižek, Yeats)
function initLeavesPagination() {
  const leaf01 = document.getElementById('leaf-01-view');
  const leaf02 = document.getElementById('leaf-02-view');
  const btnPrev = document.getElementById('btn-prev-leaf');
  const btnNext = document.getElementById('btn-next-leaf');
  const num01 = document.getElementById('leaf-num-1');
  const num02 = document.getElementById('leaf-num-2');
  const leafLabel = document.getElementById('leaf-current-label');

  let currentLeaf = 1;

  function setLeaf(leaf) {
    currentLeaf = leaf;

    if (leaf === 1) {
      if (leaf01) leaf01.style.display = 'block';
      if (leaf02) leaf02.style.display = 'none';
      if (num01) num01.classList.add('active');
      if (num02) num02.classList.remove('active');
      if (btnPrev) btnPrev.classList.add('disabled');
      if (btnNext) btnNext.classList.remove('disabled');
      if (leafLabel) leafLabel.textContent = 'LEAF 01 OF 02';
    } else {
      if (leaf01) leaf01.style.display = 'none';
      if (leaf02) leaf02.style.display = 'block';
      if (num01) num01.classList.remove('active');
      if (num02) num02.classList.add('active');
      if (btnPrev) btnPrev.classList.remove('disabled');
      if (btnNext) btnNext.classList.add('disabled');
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
}

// 2. Stillness Control Toggle
function initStillnessControl() {
  const btn = document.getElementById('btn-stillness');
  if (!btn) return;

  let isStill = false;
  btn.addEventListener('click', () => {
    isStill = !isStill;
    btn.classList.toggle('active', isStill);
    const icon = btn.querySelector('.ctrl-icon');
    if (icon) {
      icon.textContent = isStill ? '▶' : '||';
    }
  });
}

// 3. Gather Again Control (Refreshes focus on the central caption statement)
function initGatherControl() {
  const btn = document.getElementById('btn-gather');
  const caption = document.getElementById('caption-statement-text');
  if (!btn || !caption) return;

  btn.addEventListener('click', () => {
    caption.style.transition = 'opacity 0.2s ease';
    caption.style.opacity = '0.3';
    setTimeout(() => {
      caption.style.opacity = '1';
    }, 200);
  });
}
