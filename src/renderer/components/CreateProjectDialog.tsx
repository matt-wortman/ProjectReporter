import React, { useState } from 'react';
import { useProjectStore } from '../stores/project-store';

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const emojiOptions = ['', '🚀', '💡', '📊', '🎯', '🔧', '📱', '🌐', '🎨', '📝', '⚡'];

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [status, setStatus] = useState<'active' | 'on-hold' | 'completed' | 'archived'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProject } = useProjectStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createProject({
        name: name.trim(),
        description: description.trim(),
        icon: icon || undefined,
        status,
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setIcon('');
    setStatus('active');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative glass rounded-xl w-full max-w-sm animate-fadeIn">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-sm font-medium text-white">New Project</h2>
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

            {/* Icon Selection */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Icon</label>
              <div className="flex flex-wrap gap-1.5">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji || 'none'}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm
                              transition-all border
                              ${icon === emoji
                                ? 'border-red-400/50 bg-red-500/20'
                                : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                  >
                    {emoji || <span className="text-white/30 text-xs">-</span>}
                  </button>
                ))}
              </div>
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
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
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
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
