# React Hooks - Complete Notes

## What Are Hooks?

Hooks are functions that let you use React features such as state, side effects, context, refs, and memoization from function components. Before hooks, developers often had to convert components into classes just to use lifecycle methods or local state. Hooks changed that model. They made function components the default place for nearly all day-to-day React work.

The core idea is simple: a component renders UI based on data, and hooks give that component controlled access to the data and behavior it needs. A hook does not replace React. It plugs into React's rendering model. That is why the React team describes hooks as a way to "hook into" React features.

Hooks also improved code organization. In class components, related logic was often split across `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. With hooks, the setup and cleanup logic for the same concern can stay in one place. That makes components easier to read and easier to modify.

## Why Hooks Matter

Hooks solve several practical problems:

- They reduce the need for class components.
- They make shared stateful logic easier to extract into custom hooks.
- They keep related logic together instead of scattering it across lifecycle methods.
- They improve reuse without forcing patterns like render props or higher-order components.

In real projects, hooks matter because they support maintainability. When a component has to fetch data, respond to user input, register an event listener, and expose a memoized callback to child components, hooks give you a clear way to structure that work.

## Rules of Hooks

React hooks come with two important rules:

1. Call hooks only at the top level of a React function component or a custom hook.
2. Do not call hooks inside loops, conditions, or nested functions.

These rules exist because React tracks hooks by call order. If the order changes between renders, React can no longer match stored state to the correct hook call. That leads to broken behavior.

This is why code like the following is incorrect:

```jsx
if (isLoggedIn) {
  const [name, setName] = useState('');
}
```

The correct pattern is to call the hook unconditionally and branch later in the render or effect logic.

## `useState`

`useState` adds local state to a function component. It returns a pair: the current value and a setter function.

```jsx
const [count, setCount] = useState(0);
```

The setter does not update the value immediately in place. Instead, it schedules a re-render with the new state. This matters because React batches updates and decides when to render again.

Use `useState` for data that affects rendering, such as:

- form fields
- toggle states
- selected tabs
- fetched results
- loading flags

Avoid storing derived values when they can be computed from other state during render. If `fullName` is always `firstName + lastName`, you usually do not need a separate state variable for it.

## `useEffect`

`useEffect` lets a component synchronize with things outside React. This includes API requests, timers, subscriptions, DOM APIs, analytics calls, and imperative libraries.

```jsx
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

The second argument is the dependency array. It tells React when the effect should re-run. If you omit it, the effect runs after every render. If you pass an empty array, it runs once after mount. If you pass values, React re-runs the effect when those values change.

Effects can return a cleanup function:

```jsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
```

Cleanup is essential when an effect registers something persistent. Without cleanup, you can leak timers, listeners, or subscriptions.

## Dependency Arrays

Dependency arrays are one of the most important hook concepts. They are also one of the most common sources of bugs.

If you leave out a dependency, the effect may keep using stale values from an older render. If you include a value that changes on every render, the effect may fire more often than you intended. The correct dependency list is the one that reflects every value used from outside the effect body.

This means dependency arrays are about correctness first. Performance comes second.

For example, this is risky:

```jsx
useEffect(() => {
  fetchData(userId);
}, []);
```

If `userId` changes, the effect will not respond. In most cases it should be:

```jsx
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

## `useRef`

`useRef` stores a mutable value that persists between renders without causing a re-render when it changes.

It is commonly used for:

- DOM references
- timeout IDs
- previous values
- instance-like mutable containers

```jsx
const inputRef = useRef(null);
```

You can attach the ref to an element and access it after render:

```jsx
<input ref={inputRef} />
```

Then later:

```jsx
inputRef.current.focus();
```

A common mistake is to use refs as hidden state. If a value should change the visible UI, it usually belongs in `useState`, not `useRef`.

## `useMemo`

`useMemo` memoizes the result of a computation so React can reuse it between renders until dependencies change.

```jsx
const filtered = useMemo(() => {
  return items.filter((item) => item.active);
}, [items]);
```

Use `useMemo` when:

- the computation is expensive
- the derived value is passed to memoized children
- stable identity matters for performance

Do not use `useMemo` everywhere. It adds complexity. If the computation is cheap, memoization may add more overhead than it removes.

## `useCallback`

`useCallback` memoizes a function definition.

```jsx
const handleSave = useCallback(() => {
  saveDocument(id);
}, [id]);
```

This is helpful when:

- a callback is passed into memoized child components
- the callback is a dependency of another hook
- stable identity prevents unnecessary work

Like `useMemo`, `useCallback` should be used intentionally. Wrapping every handler with it can make components harder to reason about without a real performance gain.

## `useContext`

`useContext` reads a context value exposed by a matching provider above the component in the tree.

It is useful for cross-cutting data such as:

- authentication state
- theme settings
- localization
- shared UI state

Context helps avoid prop drilling, but it should be used carefully. If a large context object changes often, many consumers can re-render. In larger apps, teams often split context by concern or use more specialized state tools when update frequency becomes a problem.

## Custom Hooks

Custom hooks are regular JavaScript functions whose names start with `use` and which call other hooks internally. They let you extract reusable stateful logic into a focused unit.

```jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}
```

Custom hooks are valuable because they keep domain behavior consistent. If several components need debounced search, keyboard shortcuts, API loading state, or viewport listeners, a custom hook is often cleaner than duplicating the logic.

## Common Pitfalls

The biggest hook mistakes usually come from misunderstanding render cycles.

One common issue is stale closures. A callback or effect captures values from a render, but later logic assumes it sees the newest values. This often happens with timers, subscriptions, and event listeners.

Another issue is overusing effects. Many things that developers first place inside `useEffect` can actually be calculated during render. If something can be derived directly from props or state, prefer plain computation.

A third issue is using effects for event-driven logic. For example, if a user clicks a button and that should trigger a download, the code usually belongs in the click handler, not in an effect watching a flag.

## Practical Example

Imagine a search component. `useState` stores the query and results. `useEffect` handles debounced fetching. `useMemo` computes grouped summaries from the result list. `useCallback` stabilizes handlers passed to child rows. `useRef` stores the debounce timer ID or an input ref for focus management.

The important lesson is that hooks work best when each one has a clear responsibility. State stores render-driving data. Effects synchronize with external systems. Memoization handles expensive or identity-sensitive work. Refs preserve mutable values that do not belong in state.

## Quick Reference Summary

- `useState` stores render-driving local state.
- `useEffect` synchronizes with external systems.
- `useRef` holds mutable values without re-rendering.
- `useMemo` memoizes computed values.
- `useCallback` memoizes functions.
- `useContext` reads shared values from a provider.
- Custom hooks package reusable stateful behavior.

The best way to learn hooks is to build with them, then review bugs carefully. Most hook mistakes are not random. They usually come from misunderstanding dependencies, render timing, or what should and should not live in state. If you stay disciplined about those boundaries, hooks become one of the clearest parts of modern React.
