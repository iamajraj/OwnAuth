Implemented own authentication flow like next-auth but simpler and straight forward approach. Used Drizzle ORM with Sqlite for database handling because I was too bored to read the next-auth documentation. [Btw ignore that sqlite.db file in the repo :)]

##### *password encryption not added yet

## own-auth

You can find my own-auth inside:

```
.
└── src/
    └── lib/
        └── own-auth/
```

## Technologies

- Nextjs (App router)
- Sqlite
- Drizzle ORM

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
