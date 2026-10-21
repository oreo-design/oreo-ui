export const SHEET_CODE = `@keyframes sheet-in {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  60% {
    transform: translateY(-4%);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
  }
}

.sheet {
  animation: sheet-in 500ms
    cubic-bezier(0.32, 0.72, 0, 1);
}`;
