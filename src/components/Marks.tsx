/* The product's marks, from its logo: a cart with a cube in the basket. Decorative: the name is always written next to them. */
export function Cube({ className = '' }: { className?: string }) {
  return (
    <svg className={`cube ${className}`} viewBox="26 10 18 20" aria-hidden="true" focusable="false">
      <path d="M35 10 L44 15 L35 20 L26 15 Z" fill="#ffcf5c" />
      <path d="M26 15 L35 20 V30 L26 25 Z" fill="#f2a42b" />
      <path d="M35 20 L44 15 V25 L35 30 Z" fill="#d9821c" />
    </svg>
  );
}

export function Logo() {
  return (
    <svg className="logo" viewBox="8 8 46 46" aria-hidden="true" focusable="false">
      <path d="M35 10 L44 15 L35 20 L26 15 Z" fill="#ffcf5c" />
      <path d="M26 15 L35 20 V30 L26 25 Z" fill="#f2a42b" />
      <path d="M35 20 L44 15 V25 L35 30 Z" fill="#d9821c" />
      <path
        d="M10 25.5 H15.5 L21.5 44 H47 L51.5 31 H17.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24.5" cy="50.5" r="3.1" fill="currentColor" />
      <circle cx="43.5" cy="50.5" r="3.1" fill="currentColor" />
    </svg>
  );
}
