
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Building, Clock, Filter, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getJobs } from "../utils/localStorage";
import { useAuth } from "../hooks/useAuth";

const Jobs = () => {
  const [jobs, setJobs] = useState(getJobs());
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const { user } = useAuth();

  useEffect(() => {
    // Refresh jobs from localStorage
    const currentJobs = getJobs();
    setJobs(currentJobs);
  }, []);

  useEffect(() => {
    // Filter and sort jobs based on search criteria
    let filtered = jobs.filter(job => {
      const matchesSearch = searchTerm === "" || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = location === "" ||
        job.location.toLowerCase().includes(location.toLowerCase());
      
      const matchesType = jobType === "all" || job.type === jobType;
      
      return matchesSearch && matchesLocation && matchesType;
    });

    // Sort jobs
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    } else if (sortBy === "salary") {
      filtered.sort((a, b) => {
        const salaryA = parseInt(a.salary.replace(/\D/g, ''));
        const salaryB = parseInt(b.salary.replace(/\D/g, ''));
        return salaryB - salaryA;
      });
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, location, jobType, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setJobType("all");
    setSortBy("newest");
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
    <div className="min-h-screen bg-gray-50">
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
              <Link to="/jobs" className="text-blue-600 font-medium">
                Find Jobs
              </Link>
              <Link to="/companies" className="text-gray-600 hover:text-blue-600 transition-colors">
                Companies
              </Link>
              {user ? (
                <span className="text-gray-600">Welcome, {user.fullName}</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Job</h1>
          <p className="text-gray-600">Discover {filteredJobs.length} opportunities waiting for you</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(searchTerm || location || jobType !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                    Search: {searchTerm}
                  </Badge>
                )}
                {location && (
                  <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                    Location: {location}
                  </Badge>
                )}
                {jobType !== "all" && (
                  <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                    Type: {jobType}
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Job Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jobs List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant={job.featured ? "default" : "secondary"}
                            className={job.featured ? "bg-orange-500 text-white" : ""}
                          >
                            {job.featured ? "Featured" : job.type}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatPostedAt(job.postedAt)}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                          <Link to={`/jobs/${job.id}`}>
                            {job.title}
                          </Link>
                        </h3>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Building className="w-4 h-4 mr-2" />
                          {job.company}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {job.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">{job.salary}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{job.description}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between items-center w-full">
                      <Link to={`/jobs/${job.id}`}>
                        <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                          View Details
                        </Button>
                      </Link>
                      {user && user.userType === 'candidate' && (
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Quick Apply
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or clear the filters.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* ... keep existing code (sidebar content) */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Get Job Alerts</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Never miss a job opportunity. Get notified when new jobs match your criteria.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Create Job Alert
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Job Market Insights</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Jobs</span>
                  <span className="font-semibold">{jobs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New This Week</span>
                  <span className="font-semibold text-green-600">
                    {jobs.filter(job => {
                      const jobDate = new Date(job.postedAt);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return jobDate >= weekAgo;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remote Jobs</span>
                  <span className="font-semibold">
                    {jobs.filter(job => job.location.includes('Remote')).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Featured Jobs</span>
                  <span className="font-semibold text-orange-600">
                    {jobs.filter(job => job.featured).length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Career Resources</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="#" className="block text-blue-600 hover:underline">
                  Resume Writing Tips
                </a>
                <a href="#" className="block text-blue-600 hover:underline">
                  Interview Preparation
                </a>
                <a href="#" className="block text-blue-600 hover:underline">
                  Salary Negotiation Guide
                </a>
                <a href="#" className="block text-blue-600 hover:underline">
                  Career Development
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
