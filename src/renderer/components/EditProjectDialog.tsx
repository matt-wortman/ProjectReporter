import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../stores/project-store';
import type { ProjectWithUpdates } from '../../shared/types';

interface EditProjectDialogProps {
  project: ProjectWithUpdates | null;
  isOpen: boolean;
  onClose: () => void;
}

const emojiOptions = [
  '', '🚀', '💡', '📊', '🎯', '🔧', '📱', '🌐', '🎨', '📝', '⚡',
  '🔥', '💎', '🎮', '🎬', '📸', '🎵', '💻', '🖥️', '⌨️', '🖱️',
  '📁', '📂', '🗂️', '📋', '📌', '🔖', '🏷️', '✅', '❌', '⭐',
  '💰', '💳', '🛒', '🏠', '🏢', '🏭', '🚗', '✈️', '🚢', '🚁',
  '🔬', '🔭', '💊', '🩺', '🧪', '🧬', '🤖', '👾', '🎲', '♟️',
];

const colorOptions = [
  '', '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e',
];

export const EditProjectDialog: React.FC<EditProjectDialogProps> = ({ project, isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('');
  const [status, setStatus] = useState<'active' | 'on-hold' | 'completed' | 'archived'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateProject, deleteProject } = useProjectStore();

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || '');
      setIcon(project.icon || '');
      setColor(project.color || '');
      setStatus(project.status as typeof status);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updateProject({
        id: project.id,
        name: name.trim(),
        description: description.trim() || undefined,
        icon: icon || undefined,
        color: color || undefined,
        status,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    if (confirm('Delete this project and all its updates?')) {
      await deleteProject(project.id);
      onClose();
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative glass rounded-xl w-full max-w-sm animate-fadeIn max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-medium text-white">Edit Project</h2>
            <button
              type="button"
              onClick={handleDelete}
              className="text-[10px] text-red-400/60 hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          </div>

          {/* Content */}
          <div className="px-4 py-4 space-y-4">
            {/* Project Name */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10
                         text-sm text-white placeholder-white/30
                         focus:outline-none focus:border-white/20"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description (optional)"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10
                         text-sm text-white placeholder-white/30
                         focus:outline-none focus:border-white/20"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10
                         text-sm text-white
                         focus:outline-none focus:border-white/20"
              >
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Icon</label>
              <div className="max-h-20 overflow-y-auto">
                <div className="flex flex-wrap gap-1">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji || 'none'}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`w-7 h-7 rounded flex items-center justify-center text-sm
                                transition-all border
                                ${icon === emoji
                                  ? 'border-red-400/50 bg-red-500/20'
                                  : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                    >
                      {emoji || <span className="text-white/30 text-[10px]">-</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Background Color</label>
              <div className="flex flex-wrap gap-1">
                {colorOptions.map((c) => (
                  <button
                    key={c || 'none'}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded flex items-center justify-center
                              transition-all border
                              ${color === c
                                ? 'border-white ring-2 ring-white/30'
                                : 'border-white/10 hover:border-white/30'}`}
                    style={{ backgroundColor: c || 'transparent' }}
                  >
                    {!c && <span className="text-white/30 text-[10px]">-</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white/70 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium
                       hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed
                       transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
