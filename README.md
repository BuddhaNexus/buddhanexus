This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server (make sure to use [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) and not `npm`!):

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## API type code generation & API Client

The project uses `[openapi-typescript](https://openapi-ts.pages.dev/introduction)` and `[openapi-fetch](https://openapi-ts.pages.dev/openapi-fetch/)` to interface between the backend.

Types are generated from the API project's [OpenAPI docs page](https://buddhanexus2.kc-tbts.uni-hamburg.de/api/docs#/) by running:

```
yarn openapi-ts
```

`openapi-fetch`'s api client (instantiated in `utils/api/client.ts`) can then be used to fetch typed data ([see docs](https://openapi-ts.pages.dev/openapi-fetch/)).

## MDX page i18n (Draft)

Static pages built from mdx files are held in `/content/`. Each page has a dedicated directory containing localized mdx files for supported locals:

```
├── content
    ├── news
    │   ├── author-and-translators-identification-inittiative
    │   │   ├── de.mdx
    │   │   └── en.mdx
    …
    └── pages
        ├── contact
        │   ├── de.mdx
        │   └── en.mdx
        ├── events
        │   ├── de.mdx
        │   └── en.mdx
        …
```

Content files must contain frontmatter following the schema defined in the `MDXFrontmatter` interface.

So that external link open in new tabs it is necessary to use regular html `a` elements with `target="_blank" rel="noopener"` attributes.

Original native mdx links have been converted with:

```
\[((.*?\n?){0,4})\]\((\s*?http(.*?\n?){0,4})\)
<a href="$3" target="_blank" rel="noopener">$1</a>
```

### Localized URLs

<details>
<summary>
It's possible, but… 
</summary>

…the initial implementation had more of a maintanence burden than ideal so was shelved at bbec5441a

Static page routes are defined in `/routes-i18n.ts` which handles URL localization.

When adding a new page / news post, entries for the page need to be added to both of the following objects:

- `rewrites` (used to render pages with localized URLs), and
- `routes` (used to creates localized hrefs for the Link component).

If a path contains characters not allowed in the [RFC3986](https://www.rfc-editor.org/rfc/rfc3986#section-2) spec (in short a character that isn't an [ASCII alphanumeric](https://oeis.org/wiki/ASCII#ASCII_alphanumeric_characters), `/`, `-`, `.`, `_`, or `~`) it must be percent-encoded which enables fully localized page paths:

```js
`/${encodeURIComponent("ཨོཾ་མུ་ནེ་མུ་ནེ་མ་ཧཱ་མུ་ན་ཡེ་སྭཱ་ཧཱ།")}`;
```

Within mdx files, external links can used the regular markdown link syntax. However internal links should use the `Link` component with the page directory name as a `route` prop value to enable i18n route handling. Eg:

```jsx
<Link route="/news">Nachrichten</Link>
```

For bonus points see:

- [What are valid URLs?](https://stackoverflow.com/a/36667242/7794529)
- [What is URL encoding or Percent Encoding?](https://www.urlencoder.io/)
- [WHATWG URL spec](https://url.spec.whatwg.org/)

</details>

<br>

### JSX components & imports

These can be used in mdx files, by declaring them through the optional `components`, `imports` & `props` frontmatter properties and importing them in `utils/mdxPageImports.ts`. These will then be passed to `MDXRemote` in the page template file, which renders compiled source from next-mdx-remote's serializer (see [pages/[slug].tsx](pages/[slug].tsx)).

It might be worth sanity checking this implementation. Heed the wisdom of the [readme](https://github.com/hashicorp/next-mdx-remote)!

## Learn More about Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

```

```
