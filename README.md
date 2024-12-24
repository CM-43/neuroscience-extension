
# Neuroscience Extension

**Neuroscience Extension** is a React-based web application designed to host a series of cognitive and perceptual minigames, intended for use in neuroscience-related studies, training sessions, or educational programs. Each minigame presents users with tasks like identifying shapes, matching towers of disks, recognizing patterns in sequences, and more.

This repository contains the full source code and configuration files for the Neuroscience Extension. The application is deployed to GitHub Pages, providing a convenient, browser-based interface that runs without additional installation.

## Features

- **Multiple Minigames:** A collection of different minigames, each following a structured flow:
  - Instruction screen
  - Transition screen
  - Game screen (with timers, user interactions, logic)
  - End transition screen
  - Summary screen with user performance data and strategy tips
- **Consistent UI and Flow:** Each minigame follows a similar structure and UI pattern, making it easy for users to navigate between games.
- **Data Tracking:** Uses `localStorage` to record user performance (e.g., timing, correctness, moves made) across rounds.
- **Configurable Timers and Content:** Many aspects (timing, images, instructions) can be adjusted without changing core game logic.

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/<your-username>/neuroscience-extension.git
   ```
2. **Install Dependencies:**
   ```bash
   cd neuroscience-extension
   npm install
   ```
3. **Start the Development Server:**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`.

## Building and Deploying

This project uses `gh-pages` for deployment. The `homepage` field in `package.json` and the `deploy` script are set up to deploy directly to GitHub Pages.

- **Build Production Version:**
  ```bash
  npm run build
  ```
  This creates an optimized production build in the `build` folder.

- **Deploy to GitHub Pages:**
  ```bash
  npm run deploy
  ```
  This command builds the app (via `predeploy`) and then pushes it to the `gh-pages` branch of your repository. Once complete, the deployed app will be accessible at:
  ```
  https://<your-username>.github.io/neuroscience-extension
  ```

## Updating Configuration and Images

The Neuroscience Extension relies on various configuration files, JSON data, and image assets, all of which are located within the `public` and `src` directories. To make changes to these without altering the core code, you have two main approaches:

### 1. Updating Configurations and Images, Then Redeploying

**Recommended approach** for significant changes.

- **Step-by-Step:**
  1. Make changes to any configuration files (JSON, timing configs, etc.) inside `public` or `src`.
  2. Update or add new images inside the `public/images` directory or wherever images are referenced.
  3. Once changes are complete, run:
     ```bash
     npm run build
     npm run deploy
     ```
  4. Wait a moment for GitHub Pages to update. Your changes will now be live.

This approach ensures a clean version-controlled record of what changed and simplifies reverting if something goes wrong.

### 2. Editing Files Directly in the `gh-pages` Branch (Without Redeployment)

**Not recommended**, but possible if you need a quick fix without a rebuild.

- **Step-by-Step:**
  1. Go to the `gh-pages` branch of your repository on GitHub.
  2. Navigate to the `build` directory (this is where your deployed site files live).
  3. Locate the specific configuration file (for example, a JSON file) or image you need to update.
  4. Use GitHub’s online file editor to make the changes and commit them directly to the `gh-pages` branch.

**Important:** Any edits made directly in the `gh-pages` branch will be overwritten the next time you run `npm run deploy` from the main branch. Thus, if you choose this method, make sure to replicate those changes back in the main source (so they don't get lost on the next deploy).

## Contributing

Contributions to improve the minigames, add new features, or enhance code quality are welcome. Please open an issue or submit a pull request describing your proposed changes.

## License

This project is distributed under the [MIT License](LICENSE). Feel free to use, modify, and distribute as per the terms of the license.

---
