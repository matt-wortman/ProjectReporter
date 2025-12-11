import React, { useState } from 'react';
import type { ProjectWithUpdates } from '../../shared/types';
import { QuickUpdateInput } from './QuickUpdateInput';
import { UpdateTimeline } from './UpdateTimeline';
import { useProjectStore } from '../stores/project-store';

interface ProjectCardProps {
  project: ProjectWithUpdates;
}

const statusColors: Record<string, { dot: string; bg: string }> = {
  'active': { dot: 'bg-red-400', bg: 'bg-red-500/10' },
  'on-hold': { dot: 'bg-yellow-400', bg: 'bg-yellow-500/10' },
  'completed': { dot: 'bg-green-400', bg: 'bg-green-500/10' },
  'archived': { dot: 'bg-gray-400', bg: 'bg-gray-500/10' },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { selectProject, selectedProjectId, deleteProject, updateProject } = useProjectStore();
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

  const handleStatusChange = async (newStatus: string) => {
    await updateProject({ id: project.id, status: newStatus as 'active' | 'on-hold' | 'completed' | 'archived' });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this project?')) {
      await deleteProject(project.id);
    }
  };

  const colors = statusColors[project.status] || statusColors.archived;

  return (
    <div className="animate-fadeIn">
      {/* Main Card Row */}
      <div
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all
          ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}
        `}
        onClick={handleCardClick}
      >
        {/* Status Dot */}
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />

        {/* Icon */}
        {project.icon && (
          <span className="text-base flex-shrink-0">{project.icon}</span>
        )}

        {/* Name & Last Update */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white truncate">{project.name}</span>
            {project.updates.length > 0 && (
              <span className="text-[10px] text-white/30 flex-shrink-0">
                {project.updates.length} update{project.updates.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {project.lastUpdate && (
            <p className="text-xs text-white/40 truncate mt-0.5">
              {project.lastUpdate.content}
            </p>
          )}
        </div>

        {/* Time */}
        <span className="text-[10px] text-white/30 flex-shrink-0">
          {project.lastUpdate ? formatDate(project.lastUpdate.createdAt) : formatDate(project.createdAt)}
        </span>

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

      {/* Expanded Content */}
      {isExpanded && isSelected && (
        <div className="ml-5 mr-2 mt-1 animate-slideDown" onClick={e => e.stopPropagation()}>
          {/* Description */}
          {project.description && (
            <p className="text-xs text-white/50 mb-3 pl-2 border-l border-white/10">
              {project.description}
            </p>
          )}

          {/* Quick Update Input */}
          <QuickUpdateInput projectId={project.id} />

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5">
            <select
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60
                       focus:outline-none focus:border-white/20"
              onClick={e => e.stopPropagation()}
            >
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
            <div className="flex-1" />
            <button
              onClick={handleDelete}
              className="text-[10px] text-red-400/60 hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          </div>

          {/* Update Timeline */}
          <UpdateTimeline updates={project.updates} />
        </div>
      )}
    </div>
  );
};
