import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Briefcase, Building, FileCheck, CheckCircle2, Search, LineChart } from 'lucide-react';
import { Footer } from './Footer';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
        <motion.div 
          className="container px-4 text-center z-10"
          initial="hidden" animate="visible" variants={stagger}
        >

          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto text-foreground">
            Hire faster. <span className="text-primary">Apply smarter.</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            The next-generation applicant tracking system. Streamline your hiring pipeline or land your dream job with ease.
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full">
              <Link to="/jobs">Find Jobs</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full">
              <Link to="/register">Post a Job</Link>
            </Button>
          </motion.div>
        </motion.div>
        {/* Abstract Background Shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full -z-10 pointer-events-none" />
      </section>

      {/* 3. Stats Strip */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Jobs", value: "10,000+" },
            { label: "Companies", value: "2,500+" },
            { label: "Candidates Placed", value: "50,000+" },
            { label: "Time Saved", value: "45%" }
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Features Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Powerful features to help both candidates and recruiters succeed in the modern job market.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Briefcase, title: "Effortless Job Posting", desc: "Create and publish beautiful job listings in minutes." },
            { icon: FileCheck, title: "Smart Resume Parsing", desc: "Upload PDFs and let our system extract the vital information." },
            { icon: Search, title: "Advanced Filters", desc: "Find the exact role or candidate you're looking for instantly." },
            { icon: CheckCircle2, title: "Live Status Tracking", desc: "Candidates know exactly where they stand in the pipeline." },
            { icon: LineChart, title: "Recruiter Dashboard", desc: "Analytics and insights at your fingertips." },
            { icon: Building, title: "Secure Authentication", desc: "Role-based access control keeps your data safe." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. How it Works */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Talentify Works</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16">
            {/* For Applicants */}
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <span className="text-primary">For Job Seekers</span>
              </h3>
              <div className="space-y-8">
                {[
                  { step: "1", title: "Create a Profile", desc: "Sign up and complete your candidate profile in seconds." },
                  { step: "2", title: "Browse & Apply", desc: "Search through thousands of curated jobs and apply with one click." },
                  { step: "3", title: "Track Progress", desc: "Monitor your application status from New to Shortlisted in real-time." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-1">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Recruiters */}
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <span className="text-primary">For Recruiters</span>
              </h3>
              <div className="space-y-8">
                {[
                  { step: "1", title: "Post a Job", desc: "Set up your company profile and list your open positions." },
                  { step: "2", title: "Review Applications", desc: "Preview PDF resumes instantly without downloading them." },
                  { step: "3", title: "Manage Pipeline", desc: "Move candidates through stages and make your hires." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full border-2 border-primary text-primary flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-1">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-24 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Trusted by Professionals</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card border rounded-2xl p-8 shadow-sm">
            <div className="flex text-yellow-400 mb-4">{"★".repeat(5)}</div>
            <p className="text-lg italic mb-6">"Talentify completely transformed our hiring process. We reduced our time-to-hire by half just through their intuitive dashboard."</p>
            <div className="font-semibold">- Sarah Jenkins, HR Director</div>
          </div>
          <div className="bg-card border rounded-2xl p-8 shadow-sm">
            <div className="flex text-yellow-400 mb-4">{"★".repeat(5)}</div>
            <p className="text-lg italic mb-6">"The cleanest job application experience I've ever had. Being able to see my resume preview right in the modal gave me peace of mind."</p>
            <div className="font-semibold">- David Chen, Software Engineer</div>
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to transform your career?</h2>
        <p className="text-primary-foreground/80 mb-10 max-w-2xl mx-auto text-lg">
          Join thousands of other companies and candidates already using Talentify.
        </p>
        <Button asChild size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full text-primary hover:bg-background/90">
          <Link to="/register">Get Started for Free</Link>
        </Button>
      </section>

      <Footer />
    </div>
  );
};
