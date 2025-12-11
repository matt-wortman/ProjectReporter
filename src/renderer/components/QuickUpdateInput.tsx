import React, { useState } from 'react';
import { useProjectStore } from '../stores/project-store';

interface QuickUpdateInputProps {
  projectId: string;
}

export const QuickUpdateInput: React.FC<QuickUpdateInputProps> = ({ projectId }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createUpdate } = useProjectStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createUpdate({ projectId, content: content.trim() });
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add update..."
          className="flex-1 px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg
                   text-white placeholder-white/30
                   focus:outline-none focus:border-white/20"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="px-2 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs
                   hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed
                   transition-colors"
        >
          {isSubmitting ? '...' : 'Add'}
        </button>
      </div>
    </form>
  );
};
