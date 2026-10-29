/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontWeight: '400',
                letterSpacing: '-0.03em',
                marginBottom: '0.25em',
              },
              'h2, h3, h4': {
                fontWeight: '400',
                letterSpacing: '-0.03em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: 'var(--text-h2)',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: 'var(--text-display)',
              },
              h2: {
                fontSize: 'var(--text-h2)',
              },
            },
          ],
        },
      },
    },
  },
}

export default config
