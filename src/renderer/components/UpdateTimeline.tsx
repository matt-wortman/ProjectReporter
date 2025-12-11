import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Update } from '../../shared/types';
import { useProjectStore } from '../stores/project-store';

interface UpdateTimelineProps {
  updates: Update[];
}

export const UpdateTimeline: React.FC<UpdateTimelineProps> = ({ updates }) => {
  const { deleteUpdate } = useProjectStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this update?')) {
      await deleteUpdate(id);
    }
  };

  if (updates.length === 0) {
    return (
      <div className="py-4 text-center text-xs text-white/30">
        No updates yet
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      {updates.slice(0, 5).map((update) => (
        <div
          key={update.id}
          className="group flex items-start gap-2 text-xs"
        >
          <span className="text-white/20 flex-shrink-0 w-12 text-[10px] pt-0.5">
            {formatDate(update.createdAt)}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-white/60 prose prose-invert prose-xs max-w-none [&>p]:m-0 [&>p]:leading-relaxed">
              <ReactMarkdown>{update.content}</ReactMarkdown>
            </div>
          </div>
          <button
            onClick={() => handleDelete(update.id)}
            className="opacity-0 group-hover:opacity-100 text-red-400/50 hover:text-red-400 transition-all text-[10px]"
          >
            x
          </button>
        </div>
      ))}
      {updates.length > 5 && (
        <div className="text-[10px] text-white/30 text-center pt-2">
          +{updates.length - 5} more updates
        </div>
      )}
    </div>
  );
};
