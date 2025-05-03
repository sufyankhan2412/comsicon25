import React from 'react';
import { Link } from 'react-router-dom';

const trustedLogos = [
  'logo1', 'logo2', 'logo3', 'logo4', 'logo5', 'logo6'
]; // Replace with actual logo images if available

const integrations = [
  'Google Calendar', 'Slack', 'Microsoft Teams', 'Zoom', 'Dropbox', 'Trello', 'GitHub', 'Outlook', 'Asana', 'Notion', 'Gmail', 'Drive'
];

const testimonials = [
  {
    company: 'HackerOne',
    stat: '169%',
    result: 'ROI improvement',
    color: 'bg-primary-50',
  },
  {
    company: 'Vonage',
    stat: '160%',
    result: 'Increase in customer reach',
    color: 'bg-blue-50',
  },
  {
    company: 'UT Dallas',
    stat: '20%',
    result: 'Decrease in meeting no-shows',
    color: 'bg-yellow-50',
  },
];

const securityBadges = [
  'PCI DSS', 'GDPR', 'SOC 2', 'ISO 27001'
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col scroll-smooth">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600">CollabSphere</span>
            </div>
            {/* Nav + Auth Buttons */}
            <div className="flex items-center">
              <nav className="flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-primary-600">Features</a>
                <a href="#integrations" className="text-gray-600 hover:text-primary-600">Integrations</a>
                <a href="#pricing" className="text-gray-600 hover:text-primary-600">Pricing</a>
                <a href="#security" className="text-gray-600 hover:text-primary-600">Security</a>
              </nav>
              <div className="flex items-center space-x-2 ml-6">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
              Easy team collaboration ahead
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-xl">
              CollabSphere helps your team manage projects, communicate, and stay on track—all in one place. Boost productivity and never miss a deadline again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link to="/signup" className="px-8 py-3 rounded-md text-white bg-primary-600 hover:bg-primary-700 font-semibold shadow">
                Get Started Free
              </Link>
              <Link to="/login" className="px-8 py-3 rounded-md text-primary-600 border border-primary-600 hover:bg-primary-50 font-semibold shadow">
                Log In
              </Link>
            </div>
            {/* <div className="mt-6 flex flex-col sm:flex-row gap-2 items-center justify-center md:justify-start">
              <button className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 text-sm font-medium">Sign up with Google</button>
              <button className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 text-sm font-medium">Sign up with Microsoft</button>
            </div> */}
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            {/* Hero illustration - Place Hero.jpg in client/public/assets/ */}
            <img
              src="/assets/Hero.jpg"
              alt="Team collaboration illustration"
              className="w-full max-w-xl h-auto md:w-[500px] md:h-[350px] object-cover rounded-3xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 opacity-80">
          <span className="text-gray-500 text-sm mr-4">Trusted by 10,000+ teams worldwide</span>
          <img src="https://cdn.simpleicons.org/google/4285F4" alt="Google" className="h-8 w-8" />
          <img src="https://cdn.simpleicons.org/slack/611f69" alt="Slack" className="h-8 w-8" />
          <img src="https://cdn.simpleicons.org/dropbox/0061FF" alt="Dropbox" className="h-8 w-8" />
          <img src="https://cdn.simpleicons.org/trello/0079BF" alt="Trello" className="h-8 w-8" />
          <img src="https://cdn.simpleicons.org/github/181717" alt="GitHub" className="h-8 w-8" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">CollabSphere makes teamwork simple</h2>
            <p className="mt-4 text-lg text-gray-500">All the tools you need to manage projects, communicate, and deliver results—faster.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-primary-50 p-8 rounded-xl shadow flex flex-col items-center">
              <img src="https://cdn.jsdelivr.net/npm/heroicons@2.0.13/24/outline/clipboard-document-list.svg" alt="Task Management" className="h-10 w-10 mb-3 text-primary-600" />
              <h3 className="text-xl font-semibold text-primary-700 mb-2">Task Management</h3>
              <p className="text-gray-600 mb-4">Create, assign, and track tasks with ease. Stay organized and never miss a deadline.</p>
              <ul className="text-sm text-gray-500 list-disc ml-5">
                <li>Kanban & List views</li>
                <li>Due dates & reminders</li>
                <li>Progress tracking</li>
              </ul>
            </div>
            <div className="bg-primary-50 p-8 rounded-xl shadow flex flex-col items-center">
              <img src="https://cdn.jsdelivr.net/npm/heroicons@2.0.13/24/outline/chat-bubble-left-right.svg" alt="Team Communication" className="h-10 w-10 mb-3 text-primary-600" />
              <h3 className="text-xl font-semibold text-primary-700 mb-2">Team Communication</h3>
              <p className="text-gray-600 mb-4">Chat, share files, and keep everyone in the loop with real-time updates.</p>
              <ul className="text-sm text-gray-500 list-disc ml-5">
                <li>Group & direct messaging</li>
                <li>File sharing</li>
                <li>Notifications</li>
              </ul>
            </div>
            <div className="bg-primary-50 p-8 rounded-xl shadow flex flex-col items-center">
              <img src="https://cdn.jsdelivr.net/npm/heroicons@2.0.13/24/outline/chart-bar.svg" alt="Project Insights" className="h-10 w-10 mb-3 text-primary-600" />
              <h3 className="text-xl font-semibold text-primary-700 mb-2">Project Insights</h3>
              <p className="text-gray-600 mb-4">Visualize progress and performance with dashboards and analytics.</p>
              <ul className="text-sm text-gray-500 list-disc ml-5">
                <li>Custom dashboards</li>
                <li>Team analytics</li>
                <li>Export reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Connect CollabSphere to your favorite tools</h2>
            <p className="mt-4 text-lg text-gray-500">Seamlessly integrate with 20+ popular apps to supercharge your workflow.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <img src="https://cdn.simpleicons.org/googlecalendar/4285F4" alt="Google Calendar" className="h-8 w-8" />
            <img src="https://cdn.simpleicons.org/slack/611f69" alt="Slack" className="h-8 w-8" />
            <img src="https://cdn.simpleicons.org/zoom/2D8CFF" alt="Zoom" className="h-8 w-8" />
            <img src="https://cdn.simpleicons.org/dropbox/0061FF" alt="Dropbox" className="h-8 w-8" />
            <img src="https://cdn.simpleicons.org/trello/0079BF" alt="Trello" className="h-8 w-8" />
            <img src="https://cdn.simpleicons.org/github/181717" alt="GitHub" className="h-8 w-8" />
            <img src="https://cdn.simpleicons.org/asana/273347" alt="Asana" className="h-8 w-8" />
            <img src="https://cdn.simpleicons.org/notion/000000" alt="Notion" className="h-8 w-8" />
            <img src="https://cdn.simpleicons.org/gmail/D14836" alt="Gmail" className="h-8 w-8" />
            <img src="https://cdn.simpleicons.org/googledrive/4285F4" alt="Drive" className="h-8 w-8" />
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Pick the perfect plan for your team</h2>
            <p className="mt-4 text-lg text-gray-500">Simple, transparent pricing for teams of all sizes.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="flex-1 max-w-xs mx-auto bg-primary-50 rounded-xl shadow p-8">
              <h3 className="text-lg font-semibold text-primary-700">Free</h3>
              <p className="text-3xl font-extrabold text-gray-900 my-2">$0</p>
              <p className="text-gray-500 mb-4">Always free for small teams</p>
              <ul className="text-sm text-gray-500 mb-6 list-disc ml-5">
                <li>Up to 5 users</li>
                <li>Basic features</li>
              </ul>
              <Link to="/signup" className="block w-full text-center py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700">Get Started</Link>
            </div>
            <div className="flex-1 max-w-xs mx-auto bg-white border-2 border-primary-600 rounded-xl shadow p-8">
              <h3 className="text-lg font-semibold text-primary-700">Pro</h3>
              <p className="text-3xl font-extrabold text-gray-900 my-2">$9.99</p>
              <p className="text-gray-500 mb-4">For growing teams</p>
              <ul className="text-sm text-gray-500 mb-6 list-disc ml-5">
                <li>Up to 20 users</li>
                <li>Advanced features</li>
                <li>Priority support</li>
              </ul>
              <Link to="/signup" className="block w-full text-center py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700">Try Pro</Link>
            </div>
            <div className="flex-1 max-w-xs mx-auto bg-primary-900 text-white rounded-xl shadow p-8">
              <h3 className="text-lg font-semibold">Enterprise</h3>
              <p className="text-3xl font-extrabold my-2">Custom</p>
              <p className="mb-4">For large organizations</p>
              <ul className="text-sm mb-6 list-disc ml-5">
                <li>Unlimited users</li>
                <li>Custom integrations</li>
                <li>Dedicated support</li>
              </ul>
              <Link to="/signup" className="block w-full text-center py-2 rounded bg-white text-primary-900 font-semibold hover:bg-primary-100">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Business Impact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Discover how businesses grow with CollabSphere</h2>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className={`flex-1 rounded-xl shadow p-8 text-center ${t.color}`}>
                <div className="text-4xl font-extrabold text-primary-600 mb-2">{t.stat}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{t.result}</div>
                <div className="text-gray-500">{t.company}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Built to keep your organization secure</h2>
            <p className="mt-4 text-lg text-gray-500">CollabSphere is compliant with industry-leading security standards.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <img src="https://img.icons8.com/color/48/000000/security-checked.png" alt="PCI DSS" className="h-16 w-16 rounded-full mb-2" />
            <img src="https://img.icons8.com/color/48/000000/gdpr.png" alt="GDPR" className="h-16 w-16 rounded-full mb-2" />
            <img src="https://img.icons8.com/color/48/000000/shield.png" alt="SOC 2" className="h-16 w-16 rounded-full mb-2" />
            <img src="https://img.icons8.com/color/48/000000/certificate.png" alt="ISO 27001" className="h-16 w-16 rounded-full mb-2" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-white py-10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold">CollabSphere</div>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#features" className="hover:underline">Features</a>
            <a href="#integrations" className="hover:underline">Integrations</a>
            <a href="#pricing" className="hover:underline">Pricing</a>
            <a href="#security" className="hover:underline">Security</a>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </div>
          <div className="text-xs text-primary-200">&copy; {new Date().getFullYear()} CollabSphere. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 