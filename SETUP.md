# How to Run DatingPool Website

## Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)

## Step-by-Step Instructions

### Step 1: Open Terminal/Command Prompt
- On Windows: Press `Win + R`, type `cmd` or `powershell`, and press Enter
- Or right-click in the project folder and select "Open in Terminal"

### Step 2: Navigate to Project Directory
```bash
cd "C:\Users\Bwilk\Desktop\Datingpool.ai"
```

### Step 3: Install Dependencies (if not already installed)
```bash
npm install
```
This will install React, Vite, and all required packages. You only need to do this once, or when dependencies change.

### Step 4: Start the Development Server
```bash
npm run dev
```

### Step 5: Open in Browser
After running `npm run dev`, you should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and go to: **http://localhost:5173/**

## Other Useful Commands

### Build for Production
```bash
npm run build
```
This creates an optimized production build in the `dist` folder.

### Preview Production Build
```bash
npm run preview
```
This lets you preview the production build locally.

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port (5174, 5175, etc.). Check the terminal output for the correct URL.

### Dependencies Not Found
If you get errors about missing modules, run:
```bash
npm install
```

### Clear Cache and Reinstall
If you encounter issues, try:
```bash
rm -rf node_modules
npm install
```
(On Windows PowerShell, use: `Remove-Item -Recurse -Force node_modules`)

