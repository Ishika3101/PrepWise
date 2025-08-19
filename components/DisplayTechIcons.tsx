import React from 'react';

interface TechIconProps {
  techStack: string[];
}

const DisplayTechIcons: React.FC<TechIconProps> = ({ techStack }) => {
  const getTechIcon = (tech: string) => {
    const techLower = tech.toLowerCase();
    
    // Map common tech names to their icon representations
    const techIcons: Record<string, string> = {
      react: '⚛️',
      'react.js': '⚛️',
      nextjs: '▲',
      'next.js': '▲',
      typescript: '📘',
      ts: '📘',
      javascript: '📜',
      js: '📜',
      nodejs: '🟢',
      'node.js': '🟢',
      express: '🚂',
      'express.js': '🚂',
      mongodb: '🍃',
      mongo: '🍃',
      mysql: '🐬',
      postgresql: '🐘',
      firebase: '🔥',
      docker: '🐳',
      aws: '☁️',
      tailwindcss: '🎨',
      tailwind: '🎨',
      bootstrap: '🎨',
      git: '📝',
      github: '🐙',
      html: '🌐',
      html5: '🌐',
      css: '🎨',
      css3: '🎨',
      python: '🐍',
      java: '☕',
      csharp: '🔷',
      php: '🐘',
      ruby: '💎',
      go: '🐹',
      rust: '🦀',
      swift: '🍎',
      kotlin: '🔶',
      angular: '🅰️',
      vue: '💚',
      vuejs: '💚',
      'vue.js': '💚',
      svelte: '🟠',
      redux: '🟣',
      graphql: '🟢',
      apollo: '🚀',
      webpack: '📦',
      babel: '🐠',
      jest: '🃏',
      cypress: '🌲',
      selenium: '🔍',
      redis: '🔴',
      nginx: '🟢',
      kubernetes: '☸️',
      azure: '🔵',
      gcp: '🔵',
      vercel: '▲',
      netlify: '🌐',
    };

    return techIcons[techLower] || '💻';
  };

  return (
    <div className="flex flex-wrap gap-2">
      {techStack.map((tech: string, index: number) => (
        <div
          key={index}
          className="group relative flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary-200 bg-primary-200/10 rounded cursor-pointer hover:bg-primary-200/20 transition-colors"
          title={tech}
        >
          <span className="text-sm">{getTechIcon(tech)}</span>
          <span className="hidden sm:inline">{tech}</span>
          <div className="tech-tooltip">
            {tech}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;