/*
 * Replaces the two behaviours of the legacy Signal markup that depended on WordPress:
 *  1. the FluentForm contact form, which posted to admin-ajax, now posts to Payload's form-submissions
 *  2. the post grid filters, which fetched results over admin-ajax, now filter the rendered items
 * Everything else runs on the original Salient scripts.
 */
;(function () {
  // FluentForm field names -> Payload form field names (see the "Signal Contact Form" in Payload)
  var FIELD_MAP = {
    'names[first_name]': 'firstName',
    'names[last_name]': 'lastName',
    email: 'email',
    input_text: 'phone',
  }
  var INTEREST_MAP = {
    Analytics: 'interestAnalytics',
    'PPC Advertising': 'interestPpc',
    SEO: 'interestSeo',
    'Web Design': 'interestWebDesign',
  }

  function initForm(form) {
    form.classList.remove('ff-form-loading')
    var wrapper = form.closest('.fluentform')
    if (wrapper) wrapper.classList.remove('ff-form-loading')

    form.addEventListener(
      'submit',
      function (event) {
        event.preventDefault()
        event.stopImmediatePropagation()

        var formId = form.getAttribute('data-signal-form')
        var button = form.querySelector('.ff-btn-submit')
        var errors = document.getElementById(form.id + '_errors')
        if (errors) errors.innerHTML = ''

        if (!formId) {
          if (errors)
            errors.innerHTML =
              '<div class="error text-danger">The contact form is not set up yet.</div>'
          return
        }

        var data = new FormData(form)
        var submissionData = []
        Object.keys(FIELD_MAP).forEach(function (name) {
          var value = data.get(name)
          if (value) submissionData.push({ field: FIELD_MAP[name], value: String(value) })
        })
        data.getAll('checkbox[]').forEach(function (value) {
          var field = INTEREST_MAP[String(value).trim()]
          if (field) submissionData.push({ field: field, value: 'true' })
        })

        form.classList.add('ff-form-loading')
        if (button) button.disabled = true

        fetch('/api/form-submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ form: Number(formId) || formId, submissionData: submissionData }),
        })
          .then(function (response) {
            if (!response.ok) throw new Error(String(response.status))
            // FluentForm's own success state: the form is replaced by the message
            var message = document.createElement('div')
            message.className = 'ff-message-success'
            message.setAttribute('role', 'status')
            message.textContent =
              form.getAttribute('data-signal-success') || 'Thank you, we will be in touch soon.'
            form.parentNode.insertBefore(message, form)
            form.style.display = 'none'
          })
          .catch(function () {
            if (errors)
              errors.innerHTML =
                '<div class="error text-danger">Something went wrong. Please try again.</div>'
          })
          .finally(function () {
            form.classList.remove('ff-form-loading')
            if (button) button.disabled = false
          })
      },
      true,
    )
  }

  function onFilterClick(event) {
    var link =
      event.target.closest && event.target.closest('.nectar-post-grid-filters a[data-filter]')
    if (!link) return
    // Runs in the capture phase, before Salient's handler that would request the filtered grid from WordPress
    event.preventDefault()
    event.stopImmediatePropagation()

    var wrap = link.closest('.nectar-post-grid-wrap')
    if (!wrap || link.classList.contains('active')) return

    wrap.querySelectorAll('.nectar-post-grid-filters a').forEach(function (a) {
      a.classList.toggle('active', a === link)
    })

    var filter = link.getAttribute('data-filter')
    wrap.classList.add('loading')
    window.setTimeout(function () {
      wrap.querySelectorAll('.nectar-post-grid-item').forEach(function (item) {
        var categories = (item.getAttribute('data-signal-categories') || '').split(' ')
        item.style.display = filter === '-1' || categories.indexOf(filter) !== -1 ? '' : 'none'
      })
      wrap.classList.remove('loading')
      window.dispatchEvent(new Event('resize'))
    }, 350)
  }

  document.addEventListener('click', onFilterClick, true)

  function init() {
    document.querySelectorAll('form[data-signal-form]').forEach(initForm)
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
  else init()
})()
