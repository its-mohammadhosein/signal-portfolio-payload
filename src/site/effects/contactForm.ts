import { all, type Cleanup } from './shared'

// FluentForm field names -> the "Signal Contact Form" fields in Payload
const FIELDS: Record<string, string> = {
  'names[first_name]': 'firstName',
  'names[last_name]': 'lastName',
  email: 'email',
  input_text: 'phone',
}
const INTERESTS: Record<string, string> = {
  Analytics: 'interestAnalytics',
  'PPC Advertising': 'interestPpc',
  SEO: 'interestSeo',
  'Web Design': 'interestWebDesign',
}

/** The contact form keeps FluentForm's markup and styles; submissions go to Payload's form-submissions */
function contactForm(form: HTMLFormElement): Cleanup {
  form.classList.remove('ff-form-loading')
  form.closest('.fluentform')?.classList.remove('ff-form-loading')
  const errors = document.getElementById(`${form.id}_errors`)
  const button = form.querySelector<HTMLButtonElement>('.ff-btn-submit')

  const onSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    if (errors) errors.innerHTML = ''
    const formId = form.getAttribute('data-signal-form')
    if (!formId) {
      if (errors)
        errors.innerHTML =
          '<div class="error text-danger">The contact form is not set up yet.</div>'
      return
    }

    const data = new FormData(form)
    const submissionData = Object.entries(FIELDS).flatMap(([name, field]) => {
      const value = data.get(name)
      return value ? [{ field, value: String(value) }] : []
    })
    data.getAll('checkbox[]').forEach((value) => {
      const field = INTERESTS[String(value).trim()]
      if (field) submissionData.push({ field, value: 'true' })
    })

    form.classList.add('ff-form-loading')
    if (button) button.disabled = true
    try {
      const response = await fetch('/api/form-submissions', {
        body: JSON.stringify({ form: Number(formId) || formId, submissionData }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      if (!response.ok) throw new Error(String(response.status))
      // FluentForm's success state: the message replaces the form
      const message = document.createElement('div')
      message.className = 'ff-message-success'
      message.setAttribute('role', 'status')
      message.textContent = 'Thank you, we will be in touch soon.'
      form.parentNode?.insertBefore(message, form)
      form.style.display = 'none'
    } catch {
      if (errors)
        errors.innerHTML =
          '<div class="error text-danger">Something went wrong. Please try again.</div>'
    } finally {
      form.classList.remove('ff-form-loading')
      if (button) button.disabled = false
    }
  }

  form.addEventListener('submit', onSubmit)
  return () => form.removeEventListener('submit', onSubmit)
}

export function contactForms(): Cleanup {
  const cleanups = all<HTMLFormElement>('form[data-signal-form]').map(contactForm)
  return () => cleanups.forEach((c) => c())
}
