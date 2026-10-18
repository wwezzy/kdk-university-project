
document.addEventListener('DOMContentLoaded', () => {

  // Task 1: Form Validation
  const form = document.getElementById('admissions-form');

  if (form) {
    const ids = [
      'applicantName',
      'applicantEmail',
      'selectedProgram',
      'applicantPassword',
      'confirmPassword'
    ];

    const fields = Object.fromEntries(
      ids.map(id => [id, document.getElementById(id)])
    );

    const status = document.getElementById('admissions-form-status');

    function showError(field, message) {
      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');
      document.getElementById(`${field.id}Error`).textContent = message;
    }

    function clearError(field) {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
      document.getElementById(`${field.id}Error`).textContent = '';
    }

    Object.values(fields).forEach(field => {
      ['input', 'change'].forEach(type => {
        field.addEventListener(type, () => {
          clearError(field);
          status.textContent = '';
          status.className = 'a4-validation-status';
        });
      });
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      Object.values(fields).forEach(clearError);

      const name = fields.applicantName;
      const email = fields.applicantEmail;
      const program = fields.selectedProgram;
      const password = fields.applicantPassword;
      const confirmation = fields.confirmPassword;

      if (name.value.trim().length < 2) {
        showError(name, 'Enter your name (at least 2 characters).');
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email.value.trim()) || !email.validity.valid) {
        showError(email, 'Enter a valid email address.');
      }

      if (!program.value) {
        showError(program, 'Please select a program.');
      }

      if (password.value.length < 8) {
        showError(password, 'Password must contain at least 8 characters.');
      }

      if (!confirmation.value) {
        showError(confirmation, 'Please confirm your password.');
      } else if (confirmation.value !== password.value) {
        showError(confirmation, 'Passwords do not match.');
      }

      const invalid = form.querySelector('.is-invalid');

      status.className = invalid
        ? 'a4-validation-status alert alert-danger mt-3'
        : 'a4-validation-status alert alert-success mt-3';

      if (invalid) {
        status.textContent = 'Please correct the highlighted fields.';
        invalid.focus();
      } else {
        status.textContent = 'Form validated successfully! Demo only: no data was sent.';
        form.reset();
      }
    });
  }

  // Task 2: FAQ Accordion
  const faqItems = document.querySelectorAll('.a4-faq-item');

  faqItems.forEach(item => {
    const button = item.querySelector('.a4-faq-button');
    const answer = item.querySelector('.a4-faq-answer');

    if (!button || !answer) return;

    answer.style.maxHeight = '0px';
    answer.setAttribute('aria-hidden', 'true');

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      button.setAttribute('aria-expanded', String(!isOpen));
      answer.setAttribute('aria-hidden', String(isOpen));
      item.classList.toggle('is-open', !isOpen);

      answer.style.maxHeight = isOpen
        ? '0px'
        : `${answer.scrollHeight}px`;
    });
  });

  window.addEventListener('resize', () => {
    faqItems.forEach(item => {
      if (item.classList.contains('is-open')) {
        const answer = item.querySelector('.a4-faq-answer');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  // Task 3: Popup Contact Form
  const popup = document.getElementById('a4-popup');
  const openPopupButton = document.getElementById('openContactPopup');

  if (popup && openPopupButton) {
    const closeButtons = popup.querySelectorAll('[data-close-popup]');
    const contactForm = document.getElementById('a4-contact-form');
    const popupStatus = document.getElementById('a4-popup-status');
    let previousFocus = null;

    function openPopup() {
      previousFocus = document.activeElement;
      popup.hidden = false;
      document.body.classList.add('a4-modal-open');
      popup.querySelector('.a4-close').focus();
    }

    function closePopup() {
      popup.hidden = true;
      document.body.classList.remove('a4-modal-open');

      if (previousFocus) previousFocus.focus();
    }

    openPopupButton.addEventListener('click', openPopup);

    closeButtons.forEach(button => {
      button.addEventListener('click', closePopup);
    });

    popup.addEventListener('click', event => {
      if (event.target === popup) closePopup();
    });

    popup.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closePopup();
        return;
      }

      if (event.key === 'Tab') {
        const elements = [
          ...popup.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), textarea:not([disabled])'
          )
        ];

        const first = elements[0];
        const last = elements[elements.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    const name = document.getElementById('contactName');
    const message = document.getElementById('contactMessage');

    [name, message].forEach(field => {
      field.addEventListener('input', () => {
        field.setCustomValidity('');
      });
    });

    contactForm.addEventListener('submit', event => {
      event.preventDefault();

      name.setCustomValidity(
        name.value.trim().length < 2
          ? 'Please enter at least 2 characters.'
          : ''
      );

      message.setCustomValidity(
        message.value.trim().length < 10
          ? 'Please enter at least 10 characters.'
          : ''
      );

      if (!contactForm.reportValidity()) return;

      popupStatus.textContent =
        'Form validated successfully! Demo only: no message was sent.';

      popupStatus.className = 'a4-popup-status mt-3 text-success';
      contactForm.reset();
    });
  }

  // Task 4: Change Background Color
  const colorButton = document.getElementById('changeBgColor');

  if (colorButton) {
    const colors = [
      '#ffffff',
      '#edf7ff',
      '#f2faef',
      '#fff6e9',
      '#f3edff'
    ];

    let currentColor = 0;

    colorButton.addEventListener('click', () => {
      currentColor = (currentColor + 1) % colors.length;
      document.body.style.backgroundColor = colors[currentColor];
    });
  }

  // Task 5: Display Current Date and Time
  const clocks = document.querySelectorAll('[data-current-datetime]');

  if (clocks.length) {
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    function updateDateTime() {
      const now = new Date();

      clocks.forEach(clock => {
        clock.textContent = formatter.format(now);
        clock.dateTime = now.toISOString();
      });
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

});
