import React, { useState } from 'react';
import type { ProjectWithUpdates } from '../../shared/types';
import { UpdateTimeline } from './UpdateTimeline';
import { EditProjectDialog } from './EditProjectDialog';
import { UpdateInput } from './UpdateInput';
import { useProjectStore } from '../stores/project-store';

interface ProjectCardProps {
  project: ProjectWithUpdates;
  index: number;
}

const statusColors: Record<string, { dot: string; bg: string }> = {
  'active': { dot: 'bg-red-400', bg: 'bg-red-500/10' },
  'on-hold': { dot: 'bg-yellow-400', bg: 'bg-yellow-500/10' },
  'completed': { dot: 'bg-green-400', bg: 'bg-green-500/10' },
  'archived': { dot: 'bg-gray-400', bg: 'bg-gray-500/10' },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [quickUpdate, setQuickUpdate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectProject, selectedProjectId, createUpdate } = useProjectStore();
  const isSelected = selectedProjectId === project.id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleCardClick = () => {
    if (isSelected) {
      setIsExpanded(!isExpanded);
    } else {
      selectProject(project.id);
      setIsExpanded(true);
    }
  };

  const handleQuickUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUpdate.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createUpdate({ projectId: project.id, content: quickUpdate.trim() });
      setQuickUpdate('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const colors = statusColors[project.status] || statusColors.archived;
  const cardStyle = project.color ? { backgroundColor: `${project.color}20` } : {};

  return (
    <div className="animate-fadeIn" data-project-index={index}>
      {/* Main Card */}
      <div
        className={`rounded-lg transition-all ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}`}
        style={cardStyle}
      >
        {/* Header Row - Clickable */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 cursor-pointer"
          onClick={handleCardClick}
        >
          {/* Hotkey Number */}
          {index < 9 && (
            <span className="text-[10px] text-white/20 w-3 flex-shrink-0">{index + 1}</span>
          )}

          {/* Status Dot */}
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />

          {/* Icon */}
          {project.icon && (
            <span className="text-base flex-shrink-0">{project.icon}</span>
          )}

          {/* Name & Time */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white truncate">{project.name}</span>
              <span className="text-[10px] text-white/30 flex-shrink-0">
                {project.lastUpdate ? formatDate(project.lastUpdate.createdAt) : formatDate(project.createdAt)}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditOpen(true);
            }}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          >
            <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {/* Expand Icon */}
          <svg
            className={`w-3 h-3 text-white/30 transition-transform ${isExpanded && isSelected ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Quick Update Input - Always visible under project name */}
        <div className="px-3 pb-2" onClick={e => e.stopPropagation()}>
          <UpdateInput
            value={quickUpdate}
            onChange={setQuickUpdate}
            onSubmit={() => handleQuickUpdate({ preventDefault: () => {} } as React.FormEvent)}
            placeholder="Quick update... (@ for mentions, # for tags)"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && isSelected && (
        <div className="ml-5 mr-2 mt-1 animate-slideDown" onClick={e => e.stopPropagation()}>
          {/* Description */}
          {project.description && (
            <p className="text-xs text-white/50 mb-3 pl-2 border-l border-white/10">
              {project.description}
            </p>
          )}

          {/* Last Update - Prominent */}
          {project.lastUpdate && (
            <div className="mb-3 p-2 rounded bg-white/5 border border-white/5">
              <p className="text-xs text-white/70">{project.lastUpdate.content}</p>
              <span className="text-[10px] text-white/30 mt-1 block">
                {formatDate(project.lastUpdate.createdAt)}
              </span>
            </div>
          )}

          {/* Update Timeline */}
          <UpdateTimeline updates={project.updates.slice(1)} />

          {/* Bottom Input - Auto-focused */}
          <div className="mt-3 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <UpdateInput
                  value={quickUpdate}
                  onChange={setQuickUpdate}
                  onSubmit={() => handleQuickUpdate({ preventDefault: () => {} } as React.FormEvent)}
                  placeholder="Add update... (@ for mentions, # for tags)"
                  disabled={isSubmitting}
                  autoFocus={true}
                  className="px-3 py-1.5 rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={() => handleQuickUpdate({ preventDefault: () => {} } as React.FormEvent)}
                disabled={!quickUpdate.trim() || isSubmitting}
                className="px-2 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs
                         hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed
                         transition-colors"
              >
                {isSubmitting ? '...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <EditProjectDialog
        project={project}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
};
