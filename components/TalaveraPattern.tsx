// Azulejo de Talavera simplificado, repetible como fondo.
export function TalaveraPattern({ className = "" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id="talavera" width="64" height="64" patternUnits="userSpaceOnUse">
          <rect width="64" height="64" fill="none" />
          <circle cx="32" cy="32" r="10" fill="currentColor" />
          <path d="M32 6 L38 20 L32 26 L26 20 Z M32 58 L38 44 L32 38 L26 44 Z M6 32 L20 26 L26 32 L20 38 Z M58 32 L44 26 L38 32 L44 38 Z" fill="currentColor" />
          <circle cx="0" cy="0" r="6" fill="currentColor" />
          <circle cx="64" cy="0" r="6" fill="currentColor" />
          <circle cx="0" cy="64" r="6" fill="currentColor" />
          <circle cx="64" cy="64" r="6" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#talavera)" />
    </svg>
  );
}
