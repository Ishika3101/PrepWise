import React from 'react';
import { Calendar, FileText, User, Clock } from 'lucide-react';
import DisplayTechIcons from './DisplayTechIcons';

interface InterviewCardProps {
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  role,
  type,
  techstack,
  createdAt,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card-border">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">{role}</h3>
          <span className="px-3 py-1 text-sm font-medium text-primary-200 bg-primary-200/10 rounded-full">
            {type}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-light-100">
            <User className="w-4 h-4" />
            <span className="text-sm">Mock Interview</span>
          </div>
          
          <div className="flex items-center gap-2 text-light-100">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-light-100">
            <FileText className="w-4 h-4" />
            <span className="text-sm">{techstack.length} technologies</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-light-800">
          <DisplayTechIcons techStack={techstack} />
        </div>
        
        <div className="mt-6 flex gap-2">
          <button className="btn-primary flex-1">
            Start Interview
          </button>
          <button className="btn-secondary">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
