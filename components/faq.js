// components/faq.js
import { faqData } from '../data/faqData.js';

export function initFAQ() {
  const faqContainer = document.getElementById('faq-container');
  if (!faqContainer) return;

  // Dynamically render the HTML
  faqData.forEach((item, index) => {
    const faqElement = document.createElement('div');
    faqElement.className = 'faq-item';
    
    faqElement.innerHTML = `
      <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${index}">
        ${item.question}
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer" id="faq-answer-${index}">
        <p>${item.answer}</p>
      </div>
    `;

    faqContainer.appendChild(faqElement);
  });

  // Add click logic for the accordion
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    
    questionBtn.addEventListener('click', () => {
      // Optional: Close all other open FAQs when one is clicked
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current FAQ
      const isActive = item.classList.contains('active');
      item.classList.toggle('active');
      questionBtn.setAttribute('aria-expanded', !isActive);
    });
  });
}