import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next"],
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
      // Menonaktifkan rule yang terkait dengan warning params
      "@next/next/no-await-sync-params": "off", // Nonaktifkan rule ini untuk menangani warning params
    },
  }),
];

export default eslintConfig;
