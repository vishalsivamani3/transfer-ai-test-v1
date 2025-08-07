# Transfer.ai - Your Community College Progress Partner

From enrollment to excellence. Transfer.ai is a comprehensive platform designed to help community college students optimize their transfer journey to four-year universities.

## 🎯 What Transfer.ai Does

Our platform operates as a one-stop shop for community college students attempting to matriculate at the 4-year university of their choice, centralizing many of the key functions the average applicant + student needs to both transfer to and thrive at their top choice institution.

### Key Features

- **Course Selection Optimization**: Select professors with the best RateMyProfessor reviews at convenient time slots
- **Guaranteed Transfer Routes**: Track and identify guaranteed transfer routes in the student's home state
- **Transfer Requisites Monitoring**: Monitor transfer requisites for specific degree programs, majors, and pre-professional tracks
- **Comprehensive Transfer Lists**: Generate transfer lists for both 1-year and 2-year transfers with credit cross-matching validation
- **Personalized Dashboard**: Sleek and easy-to-use prep pal dashboard with all features at the click of a button

## 🚀 Why Transfer.ai?

Our purpose is driven by three salient observations about the community college transfer landscape:

### 1. Student-to-Resource Ratios
Community colleges are incredibly affordable (and often free in many states), making them widely accessible. However, counselors, teachers, and advisors struggle to provide individualized attention. Transfer.ai bridges these resource gaps, giving students a personalized tool to commandeer their own journey.

### 2. Market Vacancy
High-achieving students are usually targeted at the high school level by "big consulting" services, leaving a huge gap in the market for community college students who predominantly come from first-generation low-income backgrounds. Transfer.ai addresses this neglected population.

### 3. Tomorrow's Torch Bearer
In an academic climate marred by logistical morass, Transfer.ai ushers in an era where generative AI innovation removes red tape around receiving a college education instead of supplanting it.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Forms**: React Hook Form with Zod validation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd transfer-ai-test-v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses Supabase with the following main tables:

### Profiles Table
- User profile information
- Academic goals and preferences
- Transfer timeline and target universities
- Career interests and transfer goals

### Courses Table
- Course information and status
- Professor ratings and reviews
- Transfer credit validation
- Course recommendations

### Transfer Pathways Table
- University-specific transfer requirements
- Guaranteed transfer agreements
- Credit transfer validation
- Admission probability analysis

## 🎨 Features

### Authentication & Onboarding
- Secure user authentication with Supabase Auth
- Comprehensive onboarding process
- Profile customization and goal setting

### Dashboard Overview
- Progress tracking with visual indicators
- Academic metrics (GPA, credits, courses)
- Transfer pathway analysis
- Recent activity feed

### Course Management
- Personalized course recommendations
- Professor ratings and reviews
- Course scheduling and planning
- Transfer credit tracking

### Transfer Analysis
- University-specific pathway analysis
- Guaranteed transfer route identification
- Credit transfer validation
- Admission probability assessment

### Recommendations Engine
- AI-powered course recommendations
- GPA optimization strategies
- Transfer timeline planning
- Next steps guidance

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Lucide](https://lucide.dev/) for the excellent icon set
- [Supabase](https://supabase.com/) for the powerful backend platform
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

For support, email support@transfer.ai or join our community Discord server.

---

**Transfer.ai** - Empowering community college students to reach their academic dreams through intelligent transfer planning and optimization. 