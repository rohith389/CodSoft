// User types
export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
  userType: 'candidate' | 'employer';
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements?: string;
  employerId: string;
  postedAt: string;
  featured: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  coverLetter: string;
  resumeUrl?: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'jobstream_users',
  JOBS: 'jobstream_jobs',
  APPLICATIONS: 'jobstream_applications',
  CURRENT_USER: 'jobstream_current_user'
};

// User management
export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
};

export const authenticateUser = (email: string, password: string): User | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  }
  return null;
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const logoutUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Job management
export const saveJob = (job: Job): void => {
  const jobs = getJobs();
  const existingIndex = jobs.findIndex(j => j.id === job.id);
  
  if (existingIndex >= 0) {
    jobs[existingIndex] = job;
  } else {
    jobs.push(job);
  }
  
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
};

export const getJobs = (): Job[] => {
  const jobs = localStorage.getItem(STORAGE_KEYS.JOBS);
  return jobs ? JSON.parse(jobs) : [];
};

export const getJobById = (id: string): Job | null => {
  const jobs = getJobs();
  return jobs.find(job => job.id === id) || null;
};

export const getJobsByEmployer = (employerId: string): Job[] => {
  const jobs = getJobs();
  return jobs.filter(job => job.employerId === employerId);
};

export const deleteJob = (id: string): void => {
  const jobs = getJobs();
  const filteredJobs = jobs.filter(job => job.id !== id);
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(filteredJobs));
};

// Application management
export const saveApplication = (application: Application): void => {
  const applications = getApplications();
  const existingIndex = applications.findIndex(a => a.id === application.id);
  
  if (existingIndex >= 0) {
    applications[existingIndex] = application;
  } else {
    applications.push(application);
  }
  
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
};

export const getApplications = (): Application[] => {
  const applications = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
  return applications ? JSON.parse(applications) : [];
};

export const getApplicationsByJob = (jobId: string): Application[] => {
  const applications = getApplications();
  return applications.filter(app => app.jobId === jobId);
};

export const getApplicationsByCandidate = (candidateId: string): Application[] => {
  const applications = getApplications();
  return applications.filter(app => app.candidateId === candidateId);
};

export const hasUserApplied = (jobId: string, candidateId: string): boolean => {
  const applications = getApplications();
  return applications.some(app => app.jobId === jobId && app.candidateId === candidateId);
};

// Initialize with sample data
export const initializeSampleData = (): void => {
  const existingJobs = getJobs();
  if (existingJobs.length === 0) {
    const sampleJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120k - $180k',
        description: 'Join our engineering team to build scalable web applications using React, Node.js, and cloud technologies. We are looking for someone with 5+ years of experience.',
        requirements: '• 5+ years of React experience\n• Node.js backend development\n• AWS/Cloud experience\n• Strong problem-solving skills',
        employerId: 'sample-employer-1',
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        featured: true
      },
      {
        id: '2',
        title: 'Product Manager',
        company: 'StartupXYZ',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$90k - $130k',
        description: 'Lead product strategy and work with cross-functional teams to deliver innovative solutions.',
        requirements: '• 3+ years of product management experience\n• Strong analytical skills\n• Experience with agile methodologies',
        employerId: 'sample-employer-2',
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        featured: false
      },
      {
        id: '3',
        title: 'UX Designer',
        company: 'DesignStudio',
        location: 'Remote',
        type: 'Contract',
        salary: '$70k - $90k',
        description: 'Create beautiful and intuitive user experiences for web and mobile applications.',
        requirements: '• 3+ years of UX design experience\n• Proficiency in Figma/Sketch\n• Portfolio showcasing design process',
        employerId: 'sample-employer-3',
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        featured: true
      },
      {
        id: '4',
        title: 'DevOps Engineer',
        company: 'CloudTech',
        location: 'Austin, TX',
        type: 'Full-time',
        salary: '$100k - $140k',
        description: 'Build and maintain CI/CD pipelines and cloud infrastructure for our growing platform.',
        requirements: '• Experience with AWS/Azure\n• Docker and Kubernetes\n• CI/CD pipeline experience\n• Infrastructure as Code',
        employerId: 'sample-employer-4',
        postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        featured: false
      },
      {
        id: '5',
        title: 'Frontend Developer',
        company: 'WebSolutions',
        location: 'Remote',
        type: 'Part-time',
        salary: '$60k - $80k',
        description: 'Develop responsive web applications using modern JavaScript frameworks.',
        requirements: '• 2+ years React experience\n• HTML, CSS, JavaScript\n• Responsive design skills\n• Git version control',
        employerId: 'sample-employer-5',
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        featured: true
      },
      {
        id: '6',
        title: 'Data Scientist',
        company: 'DataCorp',
        location: 'Seattle, WA',
        type: 'Full-time',
        salary: '$110k - $160k',
        description: 'Analyze complex datasets and build machine learning models to drive business insights.',
        requirements: '• Python and R programming\n• Machine learning experience\n• SQL and database skills\n• Statistics background',
        employerId: 'sample-employer-6',
        postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        featured: false
      },
      {
        id: '7',
        title: 'Marketing Manager',
        company: 'GrowthCo',
        location: 'Los Angeles, CA',
        type: 'Full-time',
        salary: '$80k - $110k',
        description: 'Lead digital marketing campaigns and grow our online presence across multiple channels.',
        requirements: '• 4+ years marketing experience\n• Google Ads and Analytics\n• Social media marketing\n• Content strategy',
        employerId: 'sample-employer-7',
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        featured: false
      },
      {
        id: '8',
        title: 'Mobile App Developer',
        company: 'AppStudio',
        location: 'Chicago, IL',
        type: 'Contract',
        salary: '$85k - $115k',
        description: 'Build cross-platform mobile applications using React Native or Flutter.',
        requirements: '• React Native or Flutter\n• iOS/Android development\n• API integration\n• App store deployment',
        employerId: 'sample-employer-8',
        postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        featured: false
      },
      {
        id: '9',
        title: 'Full Stack Developer',
        company: 'InnovateTech',
        location: 'Boston, MA',
        type: 'Full-time',
        salary: '$95k - $135k',
        description: 'Work on both frontend and backend development using modern web technologies.',
        requirements: '• 4+ years full stack experience\n• React and Node.js\n• Database design\n• RESTful API development',
        employerId: 'sample-employer-9',
        postedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        featured: false
      },
      {
        id: '10',
        title: 'AI/ML Engineer',
        company: 'AITech Solutions',
        location: 'Palo Alto, CA',
        type: 'Full-time',
        salary: '$130k - $190k',
        description: 'Develop and deploy machine learning models to solve complex business problems.',
        requirements: '• PhD or Masters in CS/ML\n• TensorFlow/PyTorch experience\n• Deep learning expertise\n• MLOps knowledge',
        employerId: 'sample-employer-10',
        postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        featured: true
      }
    ];
    
    sampleJobs.forEach(job => saveJob(job));
  }
};
