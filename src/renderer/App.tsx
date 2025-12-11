import React, { useEffect, useState } from 'react';
import { TitleBar } from './components/TitleBar';
import { ProjectCard } from './components/ProjectCard';
import { CreateProjectDialog } from './components/CreateProjectDialog';
import { useProjectStore } from './stores/project-store';

const App: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [view, setView] = useState<'list' | 'detail'>('list');
  const { projects, fetchProjects, isLoading, error, selectedProjectId, selectProject } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const statusCounts = {
    active: projects.filter(p => p.status === 'active').length,
    'on-hold': projects.filter(p => p.status === 'on-hold').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  return (
    <div className="h-full flex flex-col">
      <TitleBar />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Stats Bar */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-xs text-white/50">{statusCounts.active} Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-xs text-white/50">{statusCounts['on-hold']} On Hold</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-white/50">{statusCounts.completed} Done</span>
            </div>
          </div>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Project List */}
        <main className="flex-1 overflow-auto">
          {error && (
            <div className="mx-4 mt-4 p-3 glass rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {isLoading && projects.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-12 h-12 mb-3 rounded-full glass flex items-center justify-center">
                <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-sm text-white/40 mb-3">No projects yet</p>
              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className="text-xs px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                Add your first project
              </button>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </main>

        {/* Bottom Bar - Quick Add */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px]">N</kbd>
              New
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px]">Q</kbd>
              Quick Add
            </span>
          </div>
        </div>
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

export default App;
