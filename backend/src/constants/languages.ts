export const LANGUAGES = {
  CPP: 'cpp',
  C: 'c',
  JAVA: 'java',
  PYTHON: 'python',
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
  GO: 'go',
  RUST: 'rust',
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const LANGUAGE_LABELS: Record<Language, string> = {
  cpp: 'C++',
  c: 'C',
  java: 'Java',
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  go: 'Go',
  rust: 'Rust',
};
