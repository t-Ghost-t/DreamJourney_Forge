<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1LiaLTGJJvTraa7x78pk9zheRZVMrZ2_g

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions:

1. **Create a GitHub repository** (if you haven't already):
   - Go to GitHub and create a new repository
   - Name it `dreamjourney_forge` (or any name you prefer)

2. **Push your code to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy on every push to the `main` branch

4. **Access your deployed app**:
   - Your app will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
   - The first deployment may take a few minutes

### Environment Variables:

If your app requires API keys (like `GEMINI_API_KEY`), you can set them as GitHub Secrets:
- Go to **Settings** → **Secrets and variables** → **Actions**
- Click **New repository secret**
- Add your secrets (e.g., `GEMINI_API_KEY`)
- Update the workflow file (`.github/workflows/deploy.yml`) to use these secrets if needed

**Note:** For client-side API keys, be aware that they will be visible in the built JavaScript. Consider using environment variables or a backend proxy for sensitive keys.
