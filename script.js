const form = document.querySelector('#contact-form')
const phoneInput = document.querySelector('#phone')
const result = document.querySelector('#form-result')
const whatsappLink = document.querySelector('#whatsapp-link')
const year = document.querySelector('#year')

const fields = {
  name: { message: 'Informe seu nome.', minimum: 2 },
  clinic: { message: 'Informe o nome da clínica.', minimum: 2 },
  phone: { message: 'Informe um WhatsApp válido com DDD.', minimum: 10, digits: true },
  city: { message: 'Informe sua cidade e estado.', minimum: 3 },
  procedure: { message: 'Escolha o procedimento prioritário.', minimum: 1 },
}

year.textContent = new Date().getFullYear()

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits ? `(${digits}` : ''
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function setError(input, message = '') {
  const field = input.closest('.ds-field')
  const error = document.querySelector(`#${input.id}-error`)
  field.classList.toggle('has-error', Boolean(message))
  input.setAttribute('aria-invalid', String(Boolean(message)))
  if (message) input.setAttribute('aria-describedby', error.id)
  else input.removeAttribute('aria-describedby')
  error.textContent = message
}

function validateField(input) {
  const rule = fields[input.name]
  if (!rule) return true
  const value = rule.digits ? input.value.replace(/\D/g, '') : input.value.trim()
  const valid = value.length >= rule.minimum
  setError(input, valid ? '' : rule.message)
  return valid
}

phoneInput.addEventListener('input', () => {
  phoneInput.value = formatPhone(phoneInput.value)
  if (phoneInput.getAttribute('aria-invalid') === 'true') validateField(phoneInput)
})

Object.keys(fields).forEach((name) => {
  const input = form.elements[name]
  input.addEventListener('blur', () => validateField(input))
  input.addEventListener('change', () => validateField(input))
})

form.addEventListener('submit', (event) => {
  event.preventDefault()
  result.hidden = true

  const invalid = Object.keys(fields)
    .map((name) => form.elements[name])
    .filter((input) => !validateField(input))

  if (invalid.length) {
    invalid[0].focus()
    return
  }

  const data = new FormData(form)
  const message = [
    'Olá! Conheci a Lume e gostaria de conversar sobre páginas para os procedimentos da minha clínica.',
    '',
    `Nome: ${data.get('name')}`,
    `Clínica: ${data.get('clinic')}`,
    `WhatsApp: ${data.get('phone')}`,
    `Cidade/Estado: ${data.get('city')}`,
    `Procedimento prioritário: ${data.get('procedure')}`,
    data.get('website') ? `Site/Instagram: ${data.get('website')}` : '',
  ].filter(Boolean).join('\n')

  whatsappLink.href = `https://wa.me/5548988512030?text=${encodeURIComponent(message)}`
  result.hidden = false
  result.focus()
})
