
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Building, Clock, Briefcase, DollarSign, Users, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getJobById, saveApplication, hasUserApplied } from "../utils/localStorage";
import { useAuth } from "../hooks/useAuth";

const JobDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  
  // Get job from localStorage instead of mock data
  const job = getJobById(id || "");
  
  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <Link to="/jobs" className="text-blue-600 hover:text-blue-700">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const alreadyApplied = user && hasUserApplied(job.id, user.id);

  const handleApply = () => {
    if (!isAuthenticated) {
      // Store the current job ID in localStorage to redirect back after login
      localStorage.setItem('redirect_after_login', `/jobs/${id}`);
      navigate(`/register?type=candidate`);
      return;
    }

    if (user?.userType !== 'candidate') {
      toast({
        title: "Access Denied",
        description: "Only job seekers can apply for jobs.",
        variant: "destructive",
      });
      return;
    }

    setShowApplicationForm(true);
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setApplying(true);
    
    try {
      const application = {
        id: Date.now().toString(),
        jobId: job.id,
        candidateId: user.id,
        candidateName: user.fullName,
        candidateEmail: user.email,
        coverLetter,
        appliedAt: new Date().toISOString(),
        status: 'pending' as const
      };

      saveApplication(application);
      
      toast({
        title: "Application Submitted!",
        description: "Your application has been sent to the employer.",
      });
      
      setShowApplicationForm(false);
      setCoverLetter("");
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
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
              <Link to="/jobs" className="text-gray-600 hover:text-blue-600 transition-colors">
                Find Jobs
              </Link>
              <Link to="/companies" className="text-gray-600 hover:text-blue-600 transition-colors">
                Companies
              </Link>
              {isAuthenticated ? (
                <>
                  <span className="text-gray-600">Welcome, {user?.fullName}</span>
                  {user?.userType === 'employer' && (
                    <Link to="/post-job" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Post Job
                    </Link>
                  )}
                </>
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
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/jobs" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Building className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                      <div className="flex items-center space-x-4 text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {job.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(job.postedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {job.type}
                        </Badge>
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {job.salary}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Job Description</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Requirements</h2>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {job.requirements.split('\n').map((requirement, index) => (
                      <p key={index} className="text-gray-700 mb-2">{requirement}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Button */}
            <Card>
              <CardContent className="p-6">
                {alreadyApplied ? (
                  <div className="text-center">
                    <Badge className="bg-green-100 text-green-800 border-green-200 mb-3">
                      Application Submitted
                    </Badge>
                    <p className="text-sm text-gray-600">
                      You have already applied for this job
                    </p>
                  </div>
                ) : (
                  <>
                    <Button 
                      onClick={handleApply}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                    >
                      <Briefcase className="w-5 h-5 mr-2" />
                      Apply for this Job
                    </Button>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Takes less than 2 minutes
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">About {job.company}</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-sm">
                  {job.company} is a leading company in their industry, committed to excellence and innovation.
                </p>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Location</span>
                    <span className="text-gray-900 text-sm font-medium">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Job Type</span>
                    <span className="text-gray-900 text-sm font-medium">{job.type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Apply for {job.title}</h3>
            <form onSubmit={submitApplication}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us why you're interested in this position..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              <div className="flex space-x-4">
                <Button 
                  type="submit"
                  disabled={applying}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
