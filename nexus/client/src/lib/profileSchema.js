export const PROFILE_SCHEMA_FIELDS = {
  identity: ['fullName', 'email'],
  education: ['university', 'degree', 'major', 'graduationYear', 'gpa', 'yearOfStudy'],
  geography: ['country', 'city', 'visaStatus', 'workAuthCountries', 'willingToRelocate', 'remotePreference'],
  experience: ['yearsOfExperience', 'internships', 'projects', 'volunteerWork'],
  skills: ['programmingLanguages', 'frameworks', 'tools', 'certifications'],
  goals: ['targetRole', 'targetCompanies', 'targetTimeline', 'hoursPerWeek', 'budget', 'learningStyle', 'strengths', 'weaknesses']
};

export const DEMO_PROFILE = {
  fullName: 'Prabhmannat Singh',
  email: 'prabh@example.com',
  university: 'UNSW Sydney',
  degree: 'B.S. Computer Science',
  major: 'Software Engineering',
  graduationYear: 2027,
  gpa: null,
  yearOfStudy: 2,
  country: 'Australia',
  city: 'Sydney',
  visaStatus: 'student_visa',
  workAuthCountries: ['AU', 'IN'],
  willingToRelocate: true,
  remotePreference: 'hybrid',
  yearsOfExperience: 1,
  internships: [
    {
      company: 'Local Startup',
      role: 'Frontend Intern',
      duration: '3 months',
      stack: ['React', 'Tailwind']
    }
  ],
  projects: [
    {
      name: 'Nexus Student Portal',
      description: 'Career platform for students',
      stack: ['React', 'Node'],
      link: ''
    }
  ],
  volunteerWork: [
    {
      org: 'UNSW CSE Society',
      role: 'Web Lead',
      impact: 'Built society website'
    }
  ],
  programmingLanguages: ['JavaScript', 'Python', 'TypeScript'],
  frameworks: ['React', 'Node.js', 'Express'],
  tools: ['Git', 'Figma', 'VS Code'],
  certifications: [],
  targetRole: 'Full Stack Engineer',
  targetCompanies: ['Atlassian', 'Canva', 'Stripe'],
  targetTimeline: '1_year',
  hoursPerWeek: 15,
  budget: 'free_only',
  learningStyle: 'project_based',
  strengths: ['fast learner', 'design sense'],
  weaknesses: ['system design', 'DSA']
};

export function normalizeProfile(profile = {}) {
  return {
    ...DEMO_PROFILE,
    ...profile,
    internships: profile.internships || DEMO_PROFILE.internships,
    projects: profile.projects || DEMO_PROFILE.projects,
    volunteerWork: profile.volunteerWork || DEMO_PROFILE.volunteerWork,
    programmingLanguages: profile.programmingLanguages || DEMO_PROFILE.programmingLanguages,
    frameworks: profile.frameworks || DEMO_PROFILE.frameworks,
    tools: profile.tools || DEMO_PROFILE.tools,
    certifications: profile.certifications || DEMO_PROFILE.certifications,
    targetCompanies: profile.targetCompanies || DEMO_PROFILE.targetCompanies,
    strengths: profile.strengths || DEMO_PROFILE.strengths,
    weaknesses: profile.weaknesses || DEMO_PROFILE.weaknesses,
    workAuthCountries: profile.workAuthCountries || DEMO_PROFILE.workAuthCountries
  };
}
