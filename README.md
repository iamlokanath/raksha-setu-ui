# Raksha Setu UI

Shelter reporting and the district operational view. The app uses Next.js, TypeScript, Tailwind CSS, and Redux. Visible text is in English, Hindi, and Odia.

Open a terminal in this folder (`raksha-setu-ui`) before you run the commands below. Use PowerShell.

Start the API in `raksha-setu-server` first. This app calls http://localhost:8000.

## Start the application

Use this every time, after the one-time setup.

```powershell
npm run dev
```

Leave that window open. Open http://localhost:3000.

Stop it with Ctrl+C in that window.

## One-time setup

You need Node.js 20 or newer.

```powershell
npm install
copy .env.example .env.local
```

`.env.local` should contain:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

`copy .env.example .env.local` already writes those values. You only need to edit `.env.local` if the API is not on port 8000.

## Sign in

Open http://localhost:3000 and choose **Login**. Usernames and the shared password are created by the server seed. See the sign-in table in `raksha-setu-server/README.md`. On the login screen, select the role that matches that account.

## Tests

```powershell
npm test
```
