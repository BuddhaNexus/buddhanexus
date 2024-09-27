# https://medium.com/@FandaSidak/dockerfile-with-next-js-app-using-yarn-4-fc553152a356

FROM node:22-alpine

RUN corepack enable
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN yarn install --immutable

COPY src ./src
COPY public ./public
COPY content ./content
COPY next.config.js .
COPY tsconfig.json .
COPY .eslintrc.js .
COPY .eslintignore .
COPY next-i18next.config.js .
COPY globalStyles.css .
COPY next-seo.config.js .

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us

# Start Next.js in development mode based on the preferred package manager
CMD yarn dev