# ⚛️ React Weekly Trends

An automated platform that generates weekly trend reports for the React ecosystem. The system automatically collects data from GitHub trending repositories and awesome-react libraries, creates comprehensive markdown reports, and publishes them through a Next.js web application with push notification capabilities.

## 🚀 Features

- **Automated Weekly Reports**: Automatically generates trend reports every Sunday at midnight UTC
- **GitHub Integration**: Fetches trending React repositories and library updates
- **Push Notifications**: Subscribe to get notified when new reports are published
- **Beautiful UI**: Modern, responsive design with gradient backgrounds and card layouts
- **Markdown Support**: Reports are written in markdown with proper formatting
- **Archive System**: Browse through past weekly reports
- **Mobile Responsive**: Optimized for both desktop and mobile viewing

## 📋 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless Functions)
- **Data Sources**: GitHub API, awesome-react repository
- **Automation**: GitHub Actions
- **Deployment**: Vercel
- **Notifications**: Web Push API with Service Worker

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- GitHub Token (for API access)
- VAPID Keys (for push notifications)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd react-weekly-trends
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   GITHUB_TOKEN=your_github_token_here
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key_here
   VAPID_PRIVATE_KEY=your_vapid_private_key_here
   ```

4. **Generate VAPID keys** (for push notifications)

   ```bash
   npx web-push generate-vapid-keys
   ```

   Copy the public and private keys to your `.env.local` file.

5. **Create initial reports** (optional)

   ```bash
   npm run generate-report
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── subscribe/     # Push notification subscription
│   │   │   └── notify/        # Send notifications
│   │   ├── blog/[week]/       # Individual report pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   └── SubscriptionButton.tsx
│   ├── lib/                   # Utility functions
│   │   ├── markdown.ts        # Markdown rendering
│   │   ├── reports.ts         # Report data management
│   │   ├── push-notifications.ts
│   │   └── subscriptions.ts   # Subscription management
│   └── types/                 # TypeScript type definitions
├── reports/                   # Markdown report files
├── scripts/                   # Build and utility scripts
│   └── generate-report.ts     # Report generation script
├── public/
│   └── sw.js                  # Service Worker
├── .github/workflows/         # GitHub Actions
│   └── generate-weekly-report.yml
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vercel.json               # Vercel deployment config
```

## 📝 Usage

### Manual Report Generation

Generate a new report manually:

```bash
npm run generate-report
```

### Environment Variables

| Variable                       | Description                                  | Required |
| ------------------------------ | -------------------------------------------- | -------- |
| `GITHUB_TOKEN`                 | GitHub API token for fetching trending repos | Yes      |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Public VAPID key for push notifications      | Yes      |
| `VAPID_PRIVATE_KEY`            | Private VAPID key for push notifications     | Yes      |
| `SEND_NOTIFICATIONS`           | Send notifications after report generation   | No       |

### API Endpoints

- **POST /api/subscribe** - Subscribe to push notifications
- **POST /api/notify** - Send push notifications to subscribers

## 🔄 Automation

The application includes automated report generation via GitHub Actions:

1. **Scheduled Generation**: Automatically runs every Sunday at midnight UTC
2. **Manual Trigger**: Can be triggered manually via GitHub Actions UI
3. **Auto-deployment**: Commits new reports and triggers Vercel deployment
4. **Push Notifications**: Sends notifications to subscribers after new reports

### GitHub Actions Workflow

The workflow (`generate-weekly-report.yml`) performs these steps:

1. Checks out the repository
2. Sets up Node.js environment
3. Installs dependencies
4. Generates the weekly report
5. Commits and pushes the new report
6. Sends push notifications to subscribers

## 🎨 Customization

### Styling

The application uses Tailwind CSS for styling. You can customize the design by:

- Modifying the Tailwind configuration in `tailwind.config.js`
- Updating component styles in the `src/components` directory
- Adjusting global styles in `src/app/globals.css`

### Report Template

The report template can be customized in `scripts/generate-report.ts`. You can:

- Modify the markdown structure
- Add new sections or data sources
- Change the formatting and styling
- Add custom insights or analysis

### Data Sources

Currently, the application fetches data from:

- GitHub API (trending repositories)
- awesome-react repository

You can add more data sources by:

- Adding new API calls in the report generation script
- Creating new data parsing functions
- Updating the report template

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**

   ```bash
   vercel
   ```

2. **Set Environment Variables**
   Add your environment variables in the Vercel dashboard:

   - `GITHUB_TOKEN`
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Other Platforms

The application can also be deployed to other platforms that support Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

1. **GitHub API Rate Limits**

   - Ensure your GitHub token has proper permissions
   - Consider using a personal access token for higher rate limits

2. **Push Notifications Not Working**

   - Verify VAPID keys are correctly configured
   - Check browser permissions for notifications
   - Ensure HTTPS is enabled (required for service workers)

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all environment variables are set
   - Run `npm run type-check` to check TypeScript errors

### Development Tips

- Use `npm run dev` for development with hot reload
- Run `npm run lint` to check code quality
- Use `npm run type-check` to verify TypeScript types
- Test push notifications in a browser that supports them (Chrome, Firefox)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- GitHub for the API and trending data
- The React community for maintaining awesome-react
- Vercel for the excellent hosting platform
- All contributors to the libraries and tools used in this project

---

**Happy coding!** 🎉

For questions or support, please open an issue in the GitHub repository.
