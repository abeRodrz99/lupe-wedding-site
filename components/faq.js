// components/faq.js
import { faqData } from '../data/faqData.js';

// Accepts either a plain string or { en, es }
const pick = (value, locale) =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value[locale] ?? value.en)
    : value;

export function initFAQ(locale = 'en') {
  const faqContainer = document.getElementById('faq-container');
  if (!faqContainer) return;

  faqContainer.innerHTML = '';

  faqData.forEach((item, index) => {
    const question = pick(item.question, locale);
    const answer   = pick(item.answer, locale);

    const faqElement = document.createElement('div');
    faqElement.className = 'faq-item';

    faqElement.innerHTML = `
      <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${index}">
        ${question}
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer" id="faq-answer-${index}">
        ${[].concat(answer).map((p) => `<p>${p}</p>`).join('')}
      </div>
    `;

    faqContainer.appendChild(faqElement);
  });

  const faqItems = faqContainer.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');

    questionBtn.addEventListener('click', () => {
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      const isActive = item.classList.contains('active');
      item.classList.toggle('active');
      questionBtn.setAttribute('aria-expanded', String(!isActive));
    });
  });
}