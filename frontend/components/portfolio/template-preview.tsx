'use client';

import { ModernTemplate } from './templates/modern-template';
import { ProfessionalTemplate } from './templates/professional-template';
import { CreativeTemplate } from './templates/creative-template';
import { MinimalTemplate } from './templates/minimal-template';

export interface ContactJson {
  email?: string;
  phone?: string;
  city?: string;
  district?: string;
  facebook?: string;
  github?: string;
}

interface SkillsData {
  selected: string[];
}

interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

interface ExperienceData {
  items: ExperienceItem[];
}

interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  currentlyStudying: boolean;
  description: string;
}

interface EducationData {
  items: EducationItem[];
}

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate: string;
  endDate?: string;
  featured: boolean;
}

interface ProjectsData {
  items: ProjectItem[];
}

interface PortfolioData {
  title: string;
  headline: string;
  summary: string;
  photoUrl: string;
  contactJson: ContactJson;
  skills?: SkillsData;
  experience?: ExperienceData;
  education?: EducationData;
  projects?: ProjectsData;
  selectedTemplate?: number;
}

interface TemplatePreviewProps {
  templateId: number;
  data: PortfolioData;
}

export function TemplatePreview({ templateId, data }: TemplatePreviewProps) {
  const renderTemplate = () => {
    switch (templateId) {
      case 1:
        return <ModernTemplate data={data} />;
      case 2:
        return <ProfessionalTemplate data={data} />;
      case 3:
        return <CreativeTemplate data={data} />;
      case 4:
        return <MinimalTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="h-full rounded-lg border border-slate-700/50 bg-white flex flex-col">
      {/* Browser mockup */}
      <div className="bg-slate-700/50 p-3 flex gap-2 border-b border-slate-700/50 shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <div className="w-3 h-3 rounded-full bg-green-500/60" />
      </div>

      {/* Template Content */}
      <div className="flex-1 overflow-y-auto bg-white">{renderTemplate()}</div>
    </div>
  );
}
