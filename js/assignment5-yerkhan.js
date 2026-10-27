'use strict';

// Assignment 5 — additional interactions for Programs and Admissions only.
// Existing Assignment 4 code remains in js/yerkhan.js.
document.addEventListener('DOMContentLoaded', () => {
  const widgets = document.querySelectorAll('.a5-widget');
  if (!widgets.length) return;

  // 1. Accessible day/night mode, scoped to the Assignment 5 widgets.
  const themeButtons = document.querySelectorAll('[data-a5-theme-toggle]');
  let nightMode = false;
  try {
    nightMode = localStorage.getItem('kdk-a5-night-mode') === 'true';
  } catch (error) {
    // The page still works when storage is disabled.
  }

  function applyTheme() {
    widgets.forEach(widget => widget.classList.toggle('a5-night', nightMode));
    themeButtons.forEach(button => {
      button.textContent = nightMode ? 'Switch to Day Mode' : 'Switch to Night Mode';
      button.setAttribute('aria-pressed', String(nightMode));
    });
  }

  applyTheme();
  themeButtons.forEach(button => {
    button.addEventListener('click', () => {
      nightMode = !nightMode;
      applyTheme();
      try {
        localStorage.setItem('kdk-a5-night-mode', String(nightMode));
      } catch (error) {
        // Persisting the preference is optional.
      }
    });
  });

  // 2. Arrow-key navigation for the existing Bootstrap navigation links.
  const navLinks = [...document.querySelectorAll(
    '.assignment3-navbar .navbar-nav > a.nav-link'
  )];
  navLinks.forEach((link, index) => {
    link.addEventListener('keydown', event => {
      let direction = 0;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          direction = 1;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          direction = -1;
          break;
        default:
          return;
      }
      event.preventDefault();
      navLinks[(index + direction + navLinks.length) % navLinks.length].focus();
    });
  });

  // 3. Short, non-overlapping sound, synthesized by the Web Audio API.
  // No MP3 file or backend is required.
  let audioContext = null;
  let activeOscillator = null;
  function playSuccessSound() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      if (!audioContext) audioContext = new AudioContextClass();
      if (audioContext.state === 'suspended') {
        audioContext.resume().catch(() => {});
      }
      if (activeOscillator) {
        try { activeOscillator.stop(); } catch (error) { /* Already stopped. */ }
      }
      const now = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const volume = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(660, now);
      oscillator.frequency.setValueAtTime(880, now + 0.09);
      volume.gain.setValueAtTime(0.0001, now);
      volume.gain.exponentialRampToValueAtTime(0.10, now + 0.02);
      volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      oscillator.connect(volume);
      volume.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.19);
      activeOscillator = oscillator;
      oscillator.addEventListener('ended', () => {
        if (activeOscillator === oscillator) activeOscillator = null;
        oscillator.disconnect();
        volume.disconnect();
      }, { once: true });
    } catch (error) {
      // Audio can be blocked by browser permissions. Other features keep working.
    }
  }

  // 4. Program Explorer: objects + methods, arrays, filtering, DOM creation.
  const explorer = document.getElementById('a5-program-explorer');
  if (explorer) {
    const programCatalog = [
      {
        id: 'software', title: 'Software Engineering', group: 'technology',
        description: 'Design, develop and maintain modern software.',
        skills: ['Web development', 'Databases', 'Algorithms'],
        getDetails() { return `${this.title}: learn ${this.skills.join(', ')} through practical projects.`; }
      },
      {
        id: 'computer', title: 'Computer Science', group: 'technology',
        description: 'Understand computing, algorithms and intelligent systems.',
        skills: ['Programming', 'Operating systems', 'Artificial intelligence'],
        getDetails() { return `${this.title}: learn ${this.skills.join(', ')} through practical projects.`; }
      },
      {
        id: 'cyber', title: 'Cybersecurity', group: 'technology',
        description: 'Protect digital information, applications and networks.',
        skills: ['Network security', 'Cryptography', 'Digital forensics'],
        getDetails() { return `${this.title}: learn ${this.skills.join(', ')} through practical projects.`; }
      },
      {
        id: 'data', title: 'Data Science', group: 'technology',
        description: 'Turn data into meaningful insights and predictions.',
        skills: ['Python', 'Machine learning', 'Data visualization'],
        getDetails() { return `${this.title}: learn ${this.skills.join(', ')} through practical projects.`; }
      },
      {
        id: 'business', title: 'Business Analytics', group: 'business',
        description: 'Make better business decisions using data.',
        skills: ['Business intelligence', 'Analytics', 'Project management'],
        getDetails() { return `${this.title}: learn ${this.skills.join(', ')} through practical projects.`; }
      },
      {
        id: 'design', title: 'Digital Media & Design', group: 'creative',
        description: 'Create intuitive, engaging digital experiences.',
        skills: ['UI/UX design', 'Web design', 'Digital media'],
        getDetails() { return `${this.title}: learn ${this.skills.join(', ')} through practical projects.`; }
      }
    ];

    const categorySelect = document.getElementById('a5-category');
    const searchInput = document.getElementById('a5-search');
    const cardContainer = document.getElementById('a5-program-results');
    const resultCount = document.getElementById('a5-program-count');

    function matchesCategory(program, category) {
      switch (category) {
        case 'technology': return program.group === 'technology';
        case 'business': return program.group === 'business';
        case 'creative': return program.group === 'creative';
        case 'all':
        default: return true;
      }
    }

    function createProgramCard(program) {
      const card = document.createElement('article');
      card.className = 'a5-card';
      const title = document.createElement('h3');
      title.textContent = program.title;
      const description = document.createElement('p');
      description.textContent = program.description;
      const button = document.createElement('button');
      button.className = 'btn btn-outline-primary btn-sm';
      button.type = 'button';
      button.textContent = 'Read More';
      button.setAttribute('aria-expanded', 'false');
      const details = document.createElement('p');
      details.className = 'a5-card-details';
      details.id = `a5-details-${program.id}`;
      details.textContent = program.getDetails();
      button.setAttribute('aria-controls', details.id);

      // Assignment 5: manipulate CSS display and ARIA attributes at runtime.
      button.addEventListener('click', () => {
        const isOpen = button.getAttribute('aria-expanded') === 'true';
        details.style.display = isOpen ? 'none' : 'block';
        button.textContent = isOpen ? 'Read More' : 'Show Less';
        button.setAttribute('aria-expanded', String(!isOpen));
      });
      card.append(title, description, button, details);
      return card;
    }

    function renderPrograms() {
      const category = categorySelect.value;
      const query = searchInput.value.trim().toLowerCase();
      const filtered = programCatalog.filter(program =>
        matchesCategory(program, category) &&
        `${program.title} ${program.description} ${program.skills.join(' ')}`
          .toLowerCase().includes(query)
      );

      const fragment = document.createDocumentFragment();
      filtered.forEach(program => fragment.appendChild(createProgramCard(program)));
      cardContainer.replaceChildren(fragment);
      resultCount.textContent = `${filtered.length} of ${programCatalog.length} programs shown`;
      if (filtered.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'a5-empty';
        empty.textContent = 'No matching programs. Try a different search or category.';
        cardContainer.appendChild(empty);
      }
    }

    categorySelect.addEventListener('change', renderPrograms);
    searchInput.addEventListener('input', renderPrograms);
    renderPrograms();

    // 5. One click listener displays the real current time.
    const timeButton = document.getElementById('a5-show-time');
    const timeDisplay = document.getElementById('a5-current-time');
    timeButton.addEventListener('click', () => {
      timeDisplay.textContent = new Date().toLocaleTimeString();
    });

    // 6. Accessible star rating using querySelectorAll and direct style changes.
    const stars = [...explorer.querySelectorAll('[data-a5-star]')];
    const ratingStatus = document.getElementById('a5-rating-status');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = Number(star.dataset.a5Star);
        stars.forEach(item => {
          const selected = Number(item.dataset.a5Star) <= rating;
          item.style.color = selected ? '#ffbe38' : '';
          item.setAttribute('aria-pressed', String(Number(item.dataset.a5Star) === rating));
        });
        ratingStatus.textContent = `You rated the explorer ${rating} out of 5 stars. Thank you!`;
      });
    });

    // 7. Multi-step program quiz. DOM nodes are hidden, not removed, so inputs persist.
    const wizard = document.getElementById('a5-wizard');
    const steps = [...wizard.querySelectorAll('[data-a5-wizard-step]')];
    const backButton = document.getElementById('a5-wizard-back');
    const nextButton = document.getElementById('a5-wizard-next');
    const stepIndicator = document.getElementById('a5-step-indicator');
    const wizardMessage = document.getElementById('a5-wizard-message');
    const wizardResult = document.getElementById('a5-wizard-result');
    const interest = document.getElementById('a5-interest');
    const strength = document.getElementById('a5-strength');
    const review = document.getElementById('a5-wizard-review');
    let currentStep = 0;

    function showStep(stepIndex) {
      steps.forEach((step, index) => { step.hidden = index !== stepIndex; });
      backButton.hidden = stepIndex === 0;
      nextButton.textContent = stepIndex === steps.length - 1 ? 'See My Match' : 'Next';
      stepIndicator.textContent = `Step ${stepIndex + 1} of ${steps.length}`;
      wizardMessage.textContent = '';
      if (stepIndex === steps.length - 1) {
        review.textContent = `Interest: ${interest.selectedOptions[0].textContent}. ` +
          `Strength: ${strength.selectedOptions[0].textContent}.`;
      }
    }

    // An explicit callback: navigateWizard receives the rendering function.
    function navigateWizard(nextStep, onStepChanged) {
      currentStep = Math.max(0, Math.min(nextStep, steps.length - 1));
      onStepChanged(currentStep);
    }

    function recommendProgram() {
      let programId;
      switch (interest.value) {
        case 'building': programId = 'software'; break;
        case 'systems': programId = 'computer'; break;
        case 'security': programId = 'cyber'; break;
        case 'numbers': programId = strength.value === 'communication' ? 'business' : 'data'; break;
        case 'creative': programId = 'design'; break;
        default: programId = 'software';
      }
      const program = programCatalog.find(item => item.id === programId);
      wizardResult.hidden = false;
      wizardResult.textContent = `Your suggested program is ${program.title}. ` +
        `${program.description} This is a demo recommendation, not an admission decision.`;
      playSuccessSound();
    }

    backButton.addEventListener('click', () => navigateWizard(currentStep - 1, showStep));
    nextButton.addEventListener('click', () => {
      wizardResult.hidden = true;
      const requiredInput = steps[currentStep].querySelector('select[required]');
      if (requiredInput && !requiredInput.value) {
        wizardMessage.textContent = 'Please choose an answer to continue.';
        requiredInput.focus();
        return;
      }
      if (currentStep === steps.length - 1) {
        recommendProgram();
      } else {
        navigateWizard(currentStep + 1, showStep);
      }
    });
    [interest, strength].forEach(select => select.addEventListener('change', () => {
      wizardMessage.textContent = '';
      wizardResult.hidden = true;
    }));
    showStep(0);
  }

  // 8. Admissions page: interactive document checklist and progress animation.
  const checklist = document.getElementById('a5-admissions-checklist');
  if (checklist) {
    const checks = [...checklist.querySelectorAll('[data-a5-check]')];
    const progress = document.getElementById('a5-check-progress');
    const progressLabel = document.getElementById('a5-check-status');
    const reset = document.getElementById('a5-check-reset');
    const readMore = document.getElementById('a5-admissions-readmore');
    const guidance = document.getElementById('a5-extra-guidance');
    let previouslyComplete = false;

    function updateChecklist() {
      const completed = checks.filter(check => check.checked).length;
      const percent = Math.round((completed / checks.length) * 100);
      progress.style.width = `${percent}%`;
      progress.setAttribute('aria-valuenow', String(percent));
      progressLabel.textContent = `${completed} of ${checks.length} steps completed (${percent}%).`;
      const isComplete = completed === checks.length;
      if (isComplete) {
        progressLabel.textContent += ' You are ready to review the application form!';
        if (!previouslyComplete) playSuccessSound();
      }
      previouslyComplete = isComplete;
    }

    checks.forEach(check => check.addEventListener('change', updateChecklist));
    reset.addEventListener('click', () => {
      checks.forEach(check => { check.checked = false; });
      updateChecklist();
    });
    readMore.addEventListener('click', () => {
      const isOpen = readMore.getAttribute('aria-expanded') === 'true';
      guidance.style.display = isOpen ? 'none' : 'block';
      readMore.textContent = isOpen ? 'Read More' : 'Show Less';
      readMore.setAttribute('aria-expanded', String(!isOpen));
    });
    updateChecklist();
  }
});
