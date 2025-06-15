import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Building, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getJobs } from "../utils/localStorage";
import { useAuth } from "../hooks/useAuth";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [latestJobs, setLatestJobs] = useState(getJobs().slice(0, 3));
  const { user, logout } = useAuth();

  useEffect(() => {
    // Refresh latest jobs from localStorage - show latest 3 on homepage
    const jobs = getJobs();
    // Sort by posted date and take the latest 3
    const sortedJobs = jobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    setLatestJobs(sortedJobs.slice(0, 3));
  }, []);

  const handleSearch = () => {
    // Navigate to jobs page with search params
    window.location.href = `/jobs?search=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(location)}`;
  };

  const formatPostedAt = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                JobStream
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/jobs" className="text-gray-600 hover:text-blue-600 transition-colors">
                Find Jobs
              </Link>
              <Link to="/companies" className="text-gray-600 hover:text-blue-600 transition-colors">
                Companies
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Welcome, {user.fullName}</span>
                  {user.userType === 'employer' && (
                    <Link to="/post-job">
                      <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                        Post Job
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Dream
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Career
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover thousands of job opportunities from top companies. Your next career move is just a search away.
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-16 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-700"
              >
                Search Jobs
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{getJobs().length}+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">2,500+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50,000+</div>
              <div className="text-gray-600">Success Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Jobs</h2>
            <p className="text-gray-600 text-lg">Recently posted opportunities from top employers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {latestJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-blue-600 bg-blue-50 border-blue-200">
                      {job.type}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatPostedAt(job.postedAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Building className="w-4 h-4 mr-2" />
                    {job.company}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">{job.description}</p>
                  <div className="text-lg font-semibold text-green-600">{job.salary}</div>
                </CardContent>
                <CardFooter>
                  <Link to={`/jobs/${job.id}`} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/jobs">
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have found their dream jobs through JobStream
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?type=candidate">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50">
                Find Jobs
              </Button>
            </Link>
            <Link to="/register?type=employer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">JobStream</h3>
              <p className="text-gray-400">
                Connecting talent with opportunity. Find your dream job or hire the perfect candidate.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/jobs" className="hover:text-white">Browse Jobs</Link></li>
                <li><Link to="/companies" className="hover:text-white">Companies</Link></li>
                <li><Link to="/register?type=candidate" className="hover:text-white">Create Profile</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/register?type=employer" className="hover:text-white">Post Jobs</Link></li>
                <li><Link to="/post-job" className="hover:text-white">Employer Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 JobStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
