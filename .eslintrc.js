const eslintExtends = [
  "next/core-web-vitals",
  "eslint:all",
  "plugin:prettier/recommended",
  "plugin:@typescript-eslint/recommended-type-checked",
  "plugin:@typescript-eslint/stylistic-type-checked",
  "plugin:jest/recommended",
  "plugin:unicorn/recommended",
  "plugin:react/recommended",
  "plugin:react-hooks/recommended",
  "plugin:jsx-a11y/recommended",
]

const rules = {
  // https://mui.com/material-ui/guides/minimizing-bundle-size/
  "no-restricted-imports": [
    "error",
    {
      patterns: ["@mui/*/*/*", "!@mui/material/test-utils/*"],
    },
  ],

  "no-relative-import-paths/no-relative-import-paths": [
    "error",
    { allowSameFolder: true },
  ],

  // eslint:all
  "one-var": ["error", "never"],
  "sort-keys": "off",
  "sort-imports": "off",
  "max-lines-per-function": "off",
  "max-statements": "off",
  "max-lines": "off",
  "max-params": "off",
  "max-classes-per-file": "off",
  "id-length": "off",
  "no-warning-comments": "off",
  "no-ternary": "off",
  "no-continue": "off",
  "no-undefined": "off",
  "no-await-in-loop": "off",
  "no-plusplus": "off",
  "no-useless-constructor": "off",
  "new-cap": "off",
  camelcase: "off",
  "capitalized-comments": "off",
  "lines-between-class-members": "off",
  "require-unicode-regexp": "off",
  "init-declarations": "off",
  "multiline-comment-style": "off",
  "consistent-return": "off",
  "prefer-named-capture-group": "off",

  // @typescript-eslint
  "@typescript-eslint/prefer-readonly-parameter-types": "off",
  "@typescript-eslint/promise-function-async": "off",
  "@typescript-eslint/explicit-function-return-type": "off",
  "@typescript-eslint/strict-boolean-expressions": "off",
  "@typescript-eslint/no-unnecessary-condition": "off",
  "no-magic-numbers": "off",
  "@typescript-eslint/no-unsafe-assignment": "off",
  "@typescript-eslint/no-unsafe-call": "off",
  "@typescript-eslint/no-unsafe-return": "off",
  "@typescript-eslint/no-unsafe-argument": "off",
  "@typescript-eslint/no-unsafe-member-access": "off",
  "@typescript-eslint/explicit-module-boundary-types": "off",
  "@typescript-eslint/quotes": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-type-alias": "off",
  "@typescript-eslint/naming-convention": "off",
  "@typescript-eslint/no-invalid-void-type": "off",
  "@typescript-eslint/init-declarations": "off",
  "@typescript-eslint/lines-between-class-members": "off",
  "@typescript-eslint/restrict-template-expressions": "off",
  "@typescript-eslint/explicit-member-accessibility": "off",
  "@typescript-eslint/parameter-properties": "off",
  "@typescript-eslint/member-ordering": "off",
  "@typescript-eslint/unbound-method": "off",
  "@typescript-eslint/consistent-type-definitions": "off",
  "@typescript-eslint/indent": "off",
  "@typescript-eslint/no-empty-interface": [
    "error",
    { allowSingleExtends: true },
  ],
  "@typescript-eslint/require-array-sort-compare": [
    "error",
    { ignoreStringArrays: true },
  ],
  "@typescript-eslint/return-await": "off",
  "@typescript-eslint/non-nullable-type-assertion-style": "off",
  "@typescript-eslint/no-non-null-assertion": "off",
  "@typescript-eslint/method-signature-style": "off",
  "@typescript-eslint/no-empty-function": "off",
  "@typescript-eslint/object-curly-spacing": "off",
  "@typescript-eslint/space-before-function-paren": "off",
  "@typescript-eslint/comma-dangle": "off",
  "@typescript-eslint/no-extra-parens": "off",

  // unicorn
  "unicorn/catch-error-name": [
    "warn",
    {
      name: "e",
    },
  ],
  "unicorn/filename-case": "off",
  "unicorn/no-array-callback-reference": "off",
  "unicorn/no-array-reduce": "off",
  "unicorn/no-null": "off",
  "unicorn/no-thenable": "off",
  "unicorn/no-useless-undefined": "off",
  "unicorn/numeric-separators-style": "off",
  "unicorn/prefer-module": "off",
  "unicorn/prefer-node-protocol": "off",
  "unicorn/prefer-regexp-test": "off",
  "unicorn/prefer-set-has": "off",
  "unicorn/prefer-spread": "off",
  "unicorn/prevent-abbreviations": "off",
  "unicorn/template-indent": "off",
  "unicorn/text-encoding-identifier-case": "off",
  "unicorn/no-array-for-each": "off",

  // react
  "react/react-in-jsx-scope": "off",
  "react/boolean-prop-naming": "error",
  "react/button-has-type": "error",
  "react/destructuring-assignment": "error",
  "react/forbid-prop-types": "error",
  "react/jsx-curly-brace-presence": "error",
  "react/jsx-no-useless-fragment": [
    "error",
    {
      allowExpressions: true,
    },
  ],
  "react/jsx-pascal-case": "error",
  "react/jsx-sort-props": [
    "error",
    {
      callbacksLast: true,
      noSortAlphabetically: true,
      reservedFirst: true,
      shorthandLast: true,
    },
  ],
  "react/no-danger": "warn",
  "react/no-typos": "error",
  "react/prop-types": "off",
  "react/self-closing-comp": "error",
  "simple-import-sort/exports": "error",
  "no-duplicate-imports": "off",
  "import/no-duplicates": "error",
  "simple-import-sort/imports": [
    "error",
    {
      groups: [
        ["^\\u0000"],
        [
          "^react",
          "^react-native",
          "^next",
          "^axios",
          "^graphql",
          "^urql",
          "^pages",
          "^views",
          "^@?\\w",
        ],
        ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
        ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
      ],
    },
  ],
  "@typescript-eslint/no-confusing-void-expression": "off",
  "@typescript-eslint/no-misused-promises": "off",
  "no-underscore-dangle": "off",
  "class-methods-use-this": "off",
  "func-style": "off",
  "jsx-a11y/no-autofocus": [
    2,
    {
      // focus order success criterion: https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-order.html
      ignoreNonDOM: true,
    },
  ],
}

module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"], // Your TypeScript files extension
      extends: eslintExtends,
      plugins: [
        "simple-import-sort",
        "@typescript-eslint",
        "no-relative-import-paths",
      ],
      rules,
      parserOptions: {
        project: true, // Specify it only for TypeScript files
      },
    },
  ],
  extends: ["plugin:@next/next/recommended"],
}
