// =============================================================
// THINGS I'M LEARNING — posts
// To add a note, copy one { ... } block below and change it.
//   title    shown on the card and the post page
//   date     'YYYY-MM-DD' (posts are sorted newest first automatically)
//   tags     list of short labels
//   summary  1–2 sentences for the card
//   body     the full post. Leave a blank line between paragraphs.
//            Wrap code in `backticks` to show it in a code style.
// Each post gets its own link: learning.html#the-post-title
// =============================================================
var POSTS = [
  {
    title: 'Dark mode without the white flash',
    date: '2026-10-28',
    tags: ['CSS', 'JavaScript', 'Accessibility'],
    summary: 'How my portfolio picks light or dark mode before the page appears, follows the visitor\'s system setting, and remembers their choice.',
    body: `This week I upgraded the dark/light toggle on my portfolio. Before, everyone got dark mode first, even if their phone was set to light. Now the site follows the visitor's system setting until they choose for themselves.

The tricky part is timing. If the theme is set by a script at the bottom of the page, the browser first paints the default colours and then switches, so you see a quick flash. The fix is a tiny script inside the \`<head>\` that runs before anything is drawn. It reads the saved choice from \`localStorage\`, and if there isn't one it checks \`matchMedia('(prefers-color-scheme: light)')\`.

I also learned that \`localStorage\` can throw an error, for example in some private browsing modes. Wrapping it in \`try/catch\` means the toggle still works for that visit instead of breaking the whole script.

Finally, I moved every colour into CSS variables, so both themes are defined in one place. That made it easy to check contrast: I measured each text colour against its background and fixed the ones below the 4.5:1 WCAG minimum.`
  }
];
