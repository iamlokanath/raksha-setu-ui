# Raksha Setu UI

Shelter reporting and the district operational view.

Behaviour is specified in [documents/README.md](documents/README.md). The app uses Next.js, TypeScript, Tailwind CSS, and Redux. Visible text is in English, Hindi, and Odia.

## Run locally

```powershell
npm install
copy .env.example .env.local
npm run dev
```

The API base URL defaults to `http://localhost:8000`. Start the server in `raksha-setu-server` first.

```powershell
npm test
```

Theme tokens live in `src/config`. They are structural neutrals until an approved visual design is supplied. Status is shown with words, not a separate colour language.
