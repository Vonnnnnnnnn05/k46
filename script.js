/**
 * Navy Blue Love Letter - Happy 46th Monthsary (Klariss)
 * Includes: Starfield canvas, shooting stars, ambient floating hearts,
 * 3D envelope opening animation, custom Web Audio music box melody,
 * and interactive heart bursts.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const starCanvas = document.getElementById('starCanvas');
  const heartsContainer = document.getElementById('heartsContainer');
  const envelopeBox = document.getElementById('envelopeBox');
  const envelopeFlap = document.getElementById('envelopeFlap');
  const waxSeal = document.getElementById('waxSeal');
  const letterModal = document.getElementById('letterModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeLetterBtn = document.getElementById('closeLetterBtn');
  const musicToggle = document.getElementById('musicToggle');
  const sendHeartsBtn = document.getElementById('sendHeartsBtn');
  const loveCount = document.getElementById('loveCount');

  // =========================================================================
  // 1. STARFIELD & SHOOTING STARS CANVAS
  // =========================================================================
  const ctx = starCanvas.getContext('2d');
  let width = (starCanvas.width = window.innerWidth);
  let height = (starCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = starCanvas.width = window.innerWidth;
    height = starCanvas.height = window.innerHeight;
    initStars();
  });

  const stars = [];
  const shootingStars = [];
  const STAR_COUNT = Math.min(140, Math.floor((width * height) / 9000));

  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.5 + 0.4;
      this.alpha = Math.random() * 0.7 + 0.2;
      this.speed = Math.random() * 0.015 + 0.005;
      this.direction = Math.random() > 0.5 ? 1 : -1;
      // Starlight colors: mostly soft white, light cyan, subtle warm gold
      const colors = ['#ffffff', '#bae6fd', '#7dd3fc', '#fef08a', '#e0f2fe'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    draw() {
      this.alpha += this.speed * this.direction;
      if (this.alpha >= 0.95 || this.alpha <= 0.15) {
        this.direction *= -1;
      }
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, this.alpha));
      ctx.shadowBlur = this.radius * 4;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  class ShootingStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * (height * 0.4);
      this.length = Math.random() * 80 + 40;
      this.speed = Math.random() * 7 + 6;
      this.angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1);
      this.opacity = 1;
      this.active = false;
    }
    spawn() {
      this.reset();
      this.active = true;
    }
    update() {
      if (!this.active) return;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity -= 0.018;
      if (this.opacity <= 0 || this.x > width || this.y > height) {
        this.active = false;
      }
    }
    draw() {
      if (!this.active || this.opacity <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;
      const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
      gradient.addColorStop(0.3, `rgba(56, 189, 248, ${this.opacity * 0.8})`);
      gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
      ctx.restore();
    }
  }

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(new Star());
    }
    shootingStars.length = 0;
    for (let i = 0; i < 2; i++) {
      shootingStars.push(new ShootingStar());
    }
  }

  initStars();

  // Trigger shooting stars randomly every 4-8 seconds
  setInterval(() => {
    const star = shootingStars.find(s => !s.active);
    if (star) star.spawn();
  }, 4500);

  function animateSky() {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      star.draw();
    }
    for (const sStar of shootingStars) {
      sStar.update();
      sStar.draw();
    }
    requestAnimationFrame(animateSky);
  }
  animateSky();

  // =========================================================================
  // 2. AMBIENT FLOATING HEARTS GENERATOR
  // =========================================================================
  const heartIcons = ['💙', '✨', '🤍', '🌙', '💫', '💖'];

  function createFloatingParticle() {
    if (document.hidden) return;
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.left = Math.random() * 95 + '%';
    const duration = Math.random() * 6 + 8; // 8-14s
    const size = Math.random() * 0.9 + 0.8; // 0.8 - 1.7rem
    heart.style.animationDuration = duration + 's';
    heart.style.fontSize = size + 'rem';
    heart.style.opacity = (Math.random() * 0.4 + 0.3).toString();

    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }

  // Create subtle floating particles every 1.5s
  setInterval(createFloatingParticle, 1600);

  // =========================================================================
  // 3. ENVELOPE OPEN / CLOSE INTERACTION
  // =========================================================================
  let isEnvelopeOpen = false;

  function openEnvelope(e) {
    if (isEnvelopeOpen) return;
    isEnvelopeOpen = true;

    // Get position of the wax seal for particle explosion
    const rect = waxSeal.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    // Trigger seal burst effect
    spawnBurstParticles(originX, originY, 25);

    // Play chime sound
    playChimeSound();

    // Start music if not yet playing
    if (!audioState.isPlaying) {
      toggleMusic();
    }

    // Fold back the top flap
    envelopeFlap.style.transform = 'rotateX(180deg)';
    envelopeFlap.style.zIndex = '1';

    // After animation, show the expanded letter modal
    setTimeout(() => {
      letterModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }, 450);
  }

  function closeEnvelope() {
    letterModal.classList.remove('active');
    document.body.style.overflow = '';

    setTimeout(() => {
      envelopeFlap.style.transform = 'rotateX(0deg)';
      envelopeFlap.style.zIndex = '4';
      isEnvelopeOpen = false;
    }, 350);
  }

  // Event Listeners for Opening
  envelopeBox.addEventListener('click', openEnvelope);
  waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope(e);
  });

  // Keyboard accessibility (Enter / Space opens envelope)
  envelopeBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope(e);
    }
  });

  // Event Listeners for Closing
  closeLetterBtn.addEventListener('click', closeEnvelope);
  modalBackdrop.addEventListener('click', closeEnvelope);

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isEnvelopeOpen) {
      closeEnvelope();
    }
  });

  // =========================================================================
  // 4. HEART BURST PARTICLE EFFECT
  // =========================================================================
  function spawnBurstParticles(x, y, count = 20) {
    const burstSymbols = ['💙', '💛', '✨', '🤍', '⭐', '💖'];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'heart-burst-particle';
      particle.textContent = burstSymbols[Math.floor(Math.random() * burstSymbols.length)];

      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const distance = Math.random() * 120 + 60;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rot = Math.random() * 360;

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.setProperty('--rot', `${rot}deg`);

      document.body.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 1400);
    }
  }

  // "Send Love Back" Button inside the letter
  let currentLoveCount = 46;
  sendHeartsBtn.addEventListener('click', (e) => {
    currentLoveCount++;
    loveCount.textContent = currentLoveCount;

    const rect = sendHeartsBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    spawnBurstParticles(x, y, 22);
    playChimeSound();
  });

  // =========================================================================
  // 5. ROMANTIC WEB AUDIO SYNTHESIZER (MUSIC BOX & CHIME)
  // Zero external MP3 downloads required! Pure browser Web Audio API.
  // =========================================================================
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Gentle chime sound for clicks/openings
  function playChimeSound() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Bright Chord)

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.08, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.85);
      });
    } catch (err) {
      console.warn('Audio not allowed yet:', err);
    }
  }

  // Romantic gentle music box melody (Canon in D / Love Ballad progression)
  // Notes in Hz
  const NOTE_FREQS = {
    D4: 293.66, FS4: 369.99, A4: 440.00, D5: 587.33,
    A3: 220.00, CS4: 277.18, E4: 329.63,
    B3: 246.94, D4_2: 293.66, FS4_2: 369.99,
    FS3: 185.00,
    G3: 196.00, B3_2: 246.94, D4_3: 293.66,
    G4: 392.00,
    CS5: 554.37, B4: 493.88
  };

  const melodyNotes = [
    { freq: NOTE_FREQS.D5, dur: 0.8 },
    { freq: NOTE_FREQS.CS5, dur: 0.8 },
    { freq: NOTE_FREQS.B4, dur: 0.8 },
    { freq: NOTE_FREQS.A4, dur: 0.8 },
    { freq: NOTE_FREQS.G4, dur: 0.8 },
    { freq: NOTE_FREQS.FS4, dur: 0.8 },
    { freq: NOTE_FREQS.E4, dur: 0.8 },
    { freq: NOTE_FREQS.D4, dur: 0.8 },

    { freq: NOTE_FREQS.FS4, dur: 0.4 },
    { freq: NOTE_FREQS.A4, dur: 0.4 },
    { freq: NOTE_FREQS.D5, dur: 0.8 },
    { freq: NOTE_FREQS.CS5, dur: 0.4 },
    { freq: NOTE_FREQS.B4, dur: 0.4 },
    { freq: NOTE_FREQS.A4, dur: 0.8 },
    { freq: NOTE_FREQS.G4, dur: 0.4 },
    { freq: NOTE_FREQS.FS4, dur: 0.4 },
    { freq: NOTE_FREQS.E4, dur: 0.8 }
  ];

  const audioState = {
    isPlaying: false,
    intervalId: null,
    currentStep: 0
  };

  function playTone(freq, duration = 0.6) {
    if (!audioState.isPlaying) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Music box soft tone (sine + gentle triangle mix)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Low pass warmth filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration * 1.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration * 1.6);
    } catch (e) {
      console.warn(e);
    }
  }

  function stepMelody() {
    if (!audioState.isPlaying) return;
    const note = melodyNotes[audioState.currentStep];
    playTone(note.freq, note.dur);

    audioState.currentStep = (audioState.currentStep + 1) % melodyNotes.length;
    const nextInterval = note.dur * 850;
    audioState.intervalId = setTimeout(stepMelody, nextInterval);
  }

  function toggleMusic() {
    const statusText = musicToggle.querySelector('.music-status');
    const icon = musicToggle.querySelector('i');

    if (audioState.isPlaying) {
      // Pause
      audioState.isPlaying = false;
      if (audioState.intervalId) clearTimeout(audioState.intervalId);
      musicToggle.classList.remove('playing');
      statusText.textContent = 'Play Melody';
      icon.className = 'fa-solid fa-music';
    } else {
      // Play
      audioState.isPlaying = true;
      getAudioContext();
      musicToggle.classList.add('playing');
      statusText.textContent = 'Playing Melody 💙';
      icon.className = 'fa-solid fa-volume-high';
      stepMelody();
    }
  }

  musicToggle.addEventListener('click', toggleMusic);
});
