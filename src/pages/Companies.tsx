
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building, MapPin, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getJobs } from "../utils/localStorage";
import { useAuth } from "../hooks/useAuth";

const Companies = () => {
  const [jobs, setJobs] = useState(getJobs());
  const { user } = useAuth();

  useEffect(() => {
    const currentJobs = getJobs();
    setJobs(currentJobs);
  }, []);

  // Get unique companies with job counts
  const companies = jobs.reduce((acc, job) => {
    if (!acc[job.company]) {
      acc[job.company] = {
        name: job.company,
        location: job.location,
        jobCount: 0,
        jobs: []
      };
    }
    acc[job.company].jobCount++;
    acc[job.company].jobs.push(job);
    return acc;
  }, {} as Record<string, any>);

  const companyList = Object.values(companies);

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
              <Link to="/jobs" className="text-gray-600 hover:text-blue-600 transition-colors">
                Find Jobs
              </Link>
              <Link to="/companies" className="text-blue-600 font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Companies</h1>
          <p className="text-gray-600">Discover {companyList.length} companies hiring now</p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyList.map((company, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {company.location}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                    {company.jobCount} {company.jobCount === 1 ? 'job' : 'jobs'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    Growing team
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Open positions: {company.jobCount}
                  </div>
                  <div className="pt-3">
                    <Link to={`/jobs?company=${encodeURIComponent(company.name)}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        View Jobs
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;
