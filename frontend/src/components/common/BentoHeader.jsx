import React from 'react';
import { Sparkles, BookOpen, Target, Lightbulb } from 'lucide-react';

/**
 * Beautiful header section with aesthetic design
 */
const BentoHeader = ({ title, subtitle, stats }) => {

  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand-medium to-brand-light">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Content */}
      <div className="relative px-8 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Title Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center gap-2 mb-3 md:justify-start">
              <Sparkles className="w-6 h-6 text-white" />
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                {title || 'Jakwelin Notes'}
              </h1>
            </div>
            <p className="text-lg text-white/80">
              {subtitle || 'Organize your thoughts, powered by blockchain'}
            </p>
          </div>

          {/* Stats Cards - Side by Side, Bigger */}
          <div className="flex gap-6">
            <div className="px-8 py-6 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-white" />
                <p className="text-sm font-medium text-white/90">Total Notes</p>
              </div>
              <p className="text-4xl font-bold text-white">{stats?.total || 0}</p>
            </div>
            
            <div className="px-8 py-6 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-white" />
                <p className="text-sm font-medium text-white/90">This Week</p>
              </div>
              <p className="text-4xl font-bold text-white">{stats?.thisWeek || 0}</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <Lightbulb className="w-12 h-12 text-white" />
        </div>
      </div>
    </div>
  );
};

export default BentoHeader;

