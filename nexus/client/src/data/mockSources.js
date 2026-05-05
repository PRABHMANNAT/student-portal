/**
 * Mock learning-resource data keyed by topic name.
 * Structure is designed so it can later be swapped for a real API response.
 */

const MOCK_SOURCES = {
  // ── Generic fallback ───────────────────────────────────────────────
  _default: {
    articles: [
      { title: "A Complete Beginner's Guide", source: 'freeCodeCamp', snippet: 'Everything you need to get started with this topic, from fundamentals to hands-on projects.', url: 'https://www.freecodecamp.org/news/complete-guide' },
      { title: 'Deep Dive: Core Concepts Explained', source: 'Medium', snippet: 'An in-depth walkthrough of the most important concepts and how they connect.', url: 'https://medium.com/@dev/core-concepts' },
      { title: 'Practical Patterns & Anti-Patterns', source: 'Dev.to', snippet: 'Real-world patterns every developer should know, plus common mistakes to avoid.', url: 'https://dev.to/patterns-guide' },
    ],
    videos: [
      { title: 'Crash Course in 100 Seconds', channel: 'YouTube — Fireship', duration: '12:34', url: 'https://youtube.com/watch?v=example1' },
      { title: 'Build a Full Project From Scratch', channel: 'YouTube — Traversy Media', duration: '1:24:00', url: 'https://youtube.com/watch?v=example2' },
    ],
    docs: [
      { title: 'MDN Web Docs — Reference', url: 'https://developer.mozilla.org/en-US/docs' },
      { title: 'Official Documentation', url: 'https://docs.example.com' },
    ],
  },

  // ── Specific topics ────────────────────────────────────────────────
  'Internet': {
    articles: [
      { title: 'How Does the Internet Work?', source: 'freeCodeCamp', snippet: 'A high-level overview of protocols, DNS, and the client-server model.', url: 'https://www.freecodecamp.org/news/how-does-the-internet-work' },
      { title: 'The Internet Explained', source: 'Vox', snippet: 'What happens when you type a URL into your browser — packets, routing, and more.', url: 'https://www.vox.com/internet-explained' },
      { title: 'TCP/IP and HTTP — The Full Story', source: 'Dev.to', snippet: 'Understanding the protocol stack that powers every web request.', url: 'https://dev.to/tcp-ip-http' },
    ],
    videos: [
      { title: 'How the Internet Works in 5 Minutes', channel: 'YouTube — Aaron', duration: '5:23', url: 'https://youtube.com/watch?v=7_LPdttKXPc' },
      { title: 'Networking Fundamentals', channel: 'YouTube — NetworkChuck', duration: '18:40', url: 'https://youtube.com/watch?v=network-fund' },
    ],
    docs: [
      { title: 'MDN — How the Web works', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works' },
    ],
  },

  'HTML': {
    articles: [
      { title: 'HTML Full Course for Beginners', source: 'freeCodeCamp', snippet: 'Learn the structure of every web page — elements, attributes, forms, and semantics.', url: 'https://www.freecodecamp.org/news/html-full-course' },
      { title: 'Semantic HTML: Why It Matters', source: 'Medium', snippet: 'How proper HTML improves accessibility, SEO, and maintainability.', url: 'https://medium.com/@dev/semantic-html' },
      { title: '10 HTML Tips You Probably Didn\'t Know', source: 'Dev.to', snippet: 'Lesser-known HTML features that can save you time.', url: 'https://dev.to/html-tips' },
    ],
    videos: [
      { title: 'HTML Crash Course for Absolute Beginners', channel: 'YouTube — Traversy Media', duration: '1:00:42', url: 'https://youtube.com/watch?v=UB1O30fR-EE' },
      { title: 'HTML in 100 Seconds', channel: 'YouTube — Fireship', duration: '2:14', url: 'https://youtube.com/watch?v=ok-plXXHlWw' },
    ],
    docs: [
      { title: 'MDN — HTML Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
      { title: 'W3Schools — HTML Tutorial', url: 'https://www.w3schools.com/html/' },
    ],
  },

  'CSS': {
    articles: [
      { title: 'CSS Fundamentals You Must Know', source: 'freeCodeCamp', snippet: 'Box model, flexbox, grid, positioning, and responsive design — all in one guide.', url: 'https://www.freecodecamp.org/news/css-fundamentals' },
      { title: 'Modern CSS in 2024', source: 'Dev.to', snippet: 'Container queries, :has(), nesting, and other new CSS features you can use today.', url: 'https://dev.to/modern-css-2024' },
      { title: 'The Complete Guide to Flexbox', source: 'CSS-Tricks', snippet: 'Everything you need to know about the flexbox layout model.', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
    ],
    videos: [
      { title: 'CSS Crash Course for Beginners', channel: 'YouTube — Traversy Media', duration: '1:25:10', url: 'https://youtube.com/watch?v=yfoY53QXEnI' },
      { title: 'Flexbox in 100 Seconds', channel: 'YouTube — Fireship', duration: '2:30', url: 'https://youtube.com/watch?v=flexbox100' },
      { title: 'CSS Grid Full Course', channel: 'YouTube — freeCodeCamp', duration: '4:01:22', url: 'https://youtube.com/watch?v=css-grid-full' },
    ],
    docs: [
      { title: 'MDN — CSS Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
    ],
  },

  'JavaScript': {
    articles: [
      { title: 'JavaScript — The Definitive Guide (Summary)', source: 'freeCodeCamp', snippet: 'Variables, functions, closures, async/await, and the event loop explained clearly.', url: 'https://www.freecodecamp.org/news/javascript-definitive' },
      { title: 'You Don\'t Know JS Yet', source: 'GitHub', snippet: 'A deep dive into JavaScript\'s quirks and powerful features.', url: 'https://github.com/getify/You-Dont-Know-JS' },
      { title: '33 JavaScript Concepts Every Developer Should Know', source: 'Dev.to', snippet: 'From hoisting to generators — a comprehensive concept map.', url: 'https://dev.to/33-js-concepts' },
    ],
    videos: [
      { title: 'JavaScript Full Course for Beginners', channel: 'YouTube — freeCodeCamp', duration: '8:01:23', url: 'https://youtube.com/watch?v=jS4aFq5-91M' },
      { title: 'JavaScript in 100 Seconds', channel: 'YouTube — Fireship', duration: '2:25', url: 'https://youtube.com/watch?v=DHjqpvDnNGE' },
    ],
    docs: [
      { title: 'MDN — JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
      { title: 'javascript.info — The Modern JavaScript Tutorial', url: 'https://javascript.info' },
    ],
  },

  'React': {
    articles: [
      { title: 'React — A Complete Introduction', source: 'freeCodeCamp', snippet: 'Components, hooks, state management, and the React ecosystem in one place.', url: 'https://www.freecodecamp.org/news/react-introduction' },
      { title: 'Thinking in React', source: 'React Docs', snippet: 'The mental model for building component-based UIs.', url: 'https://react.dev/learn/thinking-in-react' },
      { title: 'Advanced React Patterns', source: 'Dev.to', snippet: 'Compound components, render props, custom hooks, and performance patterns.', url: 'https://dev.to/advanced-react-patterns' },
    ],
    videos: [
      { title: 'React Full Course 2024', channel: 'YouTube — freeCodeCamp', duration: '5:45:00', url: 'https://youtube.com/watch?v=react-full-2024' },
      { title: 'React in 100 Seconds', channel: 'YouTube — Fireship', duration: '2:22', url: 'https://youtube.com/watch?v=Tn6-PIqc4UM' },
    ],
    docs: [
      { title: 'React Official Docs', url: 'https://react.dev' },
      { title: 'React API Reference', url: 'https://react.dev/reference/react' },
    ],
  },
};

/**
 * Look up sources for a topic. Falls back to _default if no exact match.
 */
export function getSourcesForTopic(topicName) {
  const key = Object.keys(MOCK_SOURCES).find(
    (k) => k.toLowerCase() === (topicName || '').toLowerCase()
  );
  return MOCK_SOURCES[key] || MOCK_SOURCES._default;
}

export default MOCK_SOURCES;
