# 🚆 AI Rail Disruption Copilot

> An AI-assisted decision-support interface for analyzing railway disruptions and exploring operational responses to delays, rerouting, and service interruptions.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://ai-rail-disruption-copilot.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend%20%26%20Database-3ECF8E?logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://vercel.com/)

## 📖 Overview

**AI Rail Disruption Copilot** is a web-based decision-support application built around railway disruption scenarios. The project provides a structured interface for entering disruption information and exploring operational responses in a fast, modern dashboard experience.

The application is designed around a practical question: **when a railway disruption occurs, how can software help operators understand the situation and evaluate possible actions quickly?**

The current implementation is a client-side TypeScript/React application with Supabase integration and Vercel deployment. The repository also contains the foundations for extending the product with richer AI-driven decision logic and operational data workflows.

## ✨ Key Features

- 🚦 **Disruption Scenario Handling** — Work with structured railway disruption information such as delays, route constraints, and operational conditions.
- 🧠 **AI-Assisted Decision Support** — Designed to support intelligent analysis and actionable response exploration.
- 📊 **Operational Dashboard Experience** — Presents complex information through a focused, responsive web interface.
- ⚡ **Fast Development & Delivery** — Built with Vite and deployed through Vercel for rapid web delivery.
- 🗄️ **Supabase Integration** — Uses Supabase as the project's backend/database platform.
- 📱 **Responsive UI** — Built with React, Tailwind CSS, and reusable UI components for different screen sizes.

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS |
| UI Components | Radix UI, custom reusable components |
| State / Data | TanStack React Query |
| Forms & Validation | React Hook Form, Zod |
| Backend / Database | Supabase |
| Charts | Recharts |
| Icons | Lucide React |
| Testing | Vitest, Testing Library, JSDOM |
| Linting | ESLint |
| Deployment | Vercel |
| Package Management | npm / Bun lockfile present |

The repository's package configuration confirms TypeScript, React, Vite, Supabase, Tailwind CSS, Vitest, ESLint, React Hook Form, Zod, Recharts, and related libraries are part of the implementation. fileciteturn3file0

## 🏗️ Architecture at a Glance

```text
User
  │
  ▼
React + TypeScript UI
  │
  ├── Scenario / disruption inputs
  ├── Reusable UI components
  ├── Data visualization
  └── Decision-support presentation
  │
  ▼
Supabase
  │
  └── Backend / database integration
  │
  ▼
Vercel
  └── Web deployment
```

## 📂 Project Structure

```text
AI-rail-Disruption-Copilot/
├── src/                  # Main React + TypeScript application
├── supabase/             # Supabase-related configuration/functions
├── public/               # Public/static assets
├── index.html            # Application entry HTML
├── package.json          # Scripts and dependencies
├── tsconfig*.json        # TypeScript configuration
├── tailwind.config.ts    # Tailwind configuration
├── vite.config.ts        # Vite configuration
├── vitest.config.ts      # Test configuration
├── components.json       # UI component configuration
└── eslint.config.js      # ESLint configuration
```

## 🚀 Live Demo

**[Open AI Rail Disruption Copilot →](https://ai-rail-disruption-copilot.vercel.app)**

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** 18+
- **npm** (or Bun)
- A **Supabase** project if the features you use require Supabase connectivity

### 1. Clone the repository

```bash
git clone https://github.com/paraspalawat/AI-rail-Disruption-Copilot.git
cd AI-rail-Disruption-Copilot
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

### 3. Configure environment variables

Create a local `.env` file for any environment-specific values required by the application.

> **Never commit real credentials, API keys, or secrets to GitHub.**

If a variable template is provided for the project, copy the variable names into your local `.env` and fill in your own values.

### 4. Start the development server

```bash
npm run dev
```

Vite will start the local development server and print the local URL in your terminal.

## 🧪 Development Scripts

The repository defines the following npm scripts: fileciteturn3file0

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build using development mode
npm run build:dev

# Run ESLint
npm run lint

# Preview a production build locally
npm run preview

# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## 🧠 How the Concept Works

The project follows a disruption-management workflow:

1. **Capture the disruption** — represent the current railway disruption in structured form.
2. **Understand constraints** — consider the operational conditions affecting service, routes, and delays.
3. **Evaluate responses** — use the application as a decision-support layer for considering possible operational actions.
4. **Present the result** — surface the relevant information in a clear dashboard so users can review and act on it.

The architecture is intentionally suitable for further expansion into richer AI models, live railway feeds, optimization algorithms, and automated recommendations.

## 🎯 Project Goals

- Explore AI-assisted decision support for real-world transportation systems.
- Build a practical interface for disruption analysis and response planning.
- Create a foundation for integrating operational data with intelligent recommendations.
- Provide a scalable frontend architecture for future railway intelligence features.

## 🔮 Future Improvements

Potential extensions include:

- Integration with live railway/transportation data feeds.
- More advanced AI-generated recommendations and explanations.
- Route and resource optimization algorithms.
- Historical disruption analytics and performance tracking.
- Role-based operator workflows.
- Real-time notifications and monitoring.
- Richer map-based visualization of affected services.

## 🔐 Security Notes

This repository is intended to contain source code and configuration—not secrets. Keep environment variables and credentials local, and use your deployment platform's secret/environment-variable management for production values.

## 🤝 Contributing

Contributions, ideas, and improvements are welcome. For substantial changes, open an issue first to discuss the proposed direction.

## 📄 License

No explicit open-source license is currently defined in the repository. If you intend to allow reuse or contributions under specific terms, add an appropriate `LICENSE` file.

## 👨‍💻 Author

**Paras Palawat**

GitHub: [@paraspalawat](https://github.com/paraspalawat)

---

⭐ If you find the project interesting, consider starring the repository.
