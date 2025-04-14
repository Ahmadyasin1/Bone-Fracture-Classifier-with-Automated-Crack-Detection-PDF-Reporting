import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "Ahmad Yasin",
    role: "Artificial Intelligence and ML/DL Developer",
    image: "/src/statics/AhmadYasin.jpg",
    bio: "Ahmad Yasin is a dedicated technology professional with a Bachelor's degree in Artificial Intelligence. His diverse experience spans AI development, web development, project management, and education. Ahmad Yasin is the first AI developer in Pakistan.",
    social: {
      github: "https://github.com/Ahmadyasin1",
      linkedin: "https://linkedin.com/in/mian-ahmad-yasin",
      email: "mailto:AhmadYasin.info@gmail.com"
    }
  },
  {
    name: "Abdul Rehman",
    role: "Data Scientist",
    image: "/src/statics/AbdulRehman.jpg",
    bio: "Abdul Rehman is an experienced Data Scientist and web developer with 2 years of expertise in data analysis and machine learning. He is a team member of Nexariza and is known for his positive personality.",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:abdul@nexariza.com"
    }
  }
];

export const Team = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-24">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          Meet Our Team
        </h1>
        <p className="text-slate-300 text-center mb-12 max-w-2xl mx-auto">
          Our team of experts combines medical expertise with cutting-edge AI technology
          to provide accurate bone fracture detection.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-amber-400/50 transition-colors">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-amber-400/20"
              />
              <h3 className="text-xl font-semibold text-amber-400 text-center mb-2">{member.name}</h3>
              <p className="text-slate-400 text-center mb-4">{member.role}</p>
              <p className="text-slate-300 text-center mb-6">{member.bio}</p>
              
              <div className="flex justify-center gap-4">
                {member.social.github && (
                  <a href={member.social.github} target="_blank" rel="noopener noreferrer"
                     className="text-slate-400 hover:text-amber-400 transition-colors">
                    <Github size={20} />
                  </a>
                )}
                {member.social.linkedin && (
                  <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer"
                     className="text-slate-400 hover:text-amber-400 transition-colors">
                    <Linkedin size={20} />
                  </a>
                )}
                {member.social.email && (
                  <a href={member.social.email}
                     className="text-slate-400 hover:text-amber-400 transition-colors">
                    <Mail size={20} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};