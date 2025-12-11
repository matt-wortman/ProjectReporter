import React, { useState, useRef, useEffect } from 'react';

interface UpdateInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

// Common people/contacts - can be extended or made configurable
const MENTIONS = [
  '@Team', '@Client', '@Manager', '@Dev', '@Design', '@QA',
  '@Marketing', '@Sales', '@Support', '@Legal', '@Finance', '@HR',
];

// Common tags
const TAGS = [
  '#bug', '#feature', '#urgent', '#blocked', '#review', '#done',
  '#meeting', '#feedback', '#idea', '#question', '#note', '#todo',
];

export const UpdateInput: React.FC<UpdateInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Add update...',
  disabled = false,
  autoFocus = false,
  className = '',
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [triggerChar, setTriggerChar] = useState<'@' | '#' | null>(null);
  const [triggerPosition, setTriggerPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Check for @ or # trigger
    const cursorPos = e.target.selectionStart || 0;
    const textBeforeCursor = newValue.slice(0, cursorPos);

    // Find the last @ or # before cursor
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    const lastHashIndex = textBeforeCursor.lastIndexOf('#');

    const lastTriggerIndex = Math.max(lastAtIndex, lastHashIndex);
    const lastTrigger = lastAtIndex > lastHashIndex ? '@' : '#';

    if (lastTriggerIndex >= 0) {
      const textAfterTrigger = textBeforeCursor.slice(lastTriggerIndex + 1);
      // Only show suggestions if there's no space after the trigger
      if (!textAfterTrigger.includes(' ')) {
        const searchTerm = textAfterTrigger.toLowerCase();
        const list = lastTrigger === '@' ? MENTIONS : TAGS;
        const filtered = list.filter(item =>
          item.toLowerCase().includes(searchTerm)
        );

        if (filtered.length > 0) {
          setSuggestions(filtered);
          setShowSuggestions(true);
          setSelectedIndex(0);
          setTriggerChar(lastTrigger);
          setTriggerPosition(lastTriggerIndex);
          return;
        }
      }
    }

    setShowSuggestions(false);
    setTriggerChar(null);
  };

  const insertSuggestion = (suggestion: string) => {
    if (triggerChar === null) return;

    const beforeTrigger = value.slice(0, triggerPosition);
    const afterCursor = value.slice(inputRef.current?.selectionStart || value.length);
    const newValue = beforeTrigger + suggestion + ' ' + afterCursor.trimStart();

    onChange(newValue);
    setShowSuggestions(false);
    setTriggerChar(null);

    // Focus back on input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newCursorPos = beforeTrigger.length + suggestion.length + 1;
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        insertSuggestion(suggestions[selectedIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowSuggestions(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey && !showSuggestions) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-2 py-1 text-xs bg-white/5 border border-white/10 rounded
                   text-white placeholder-white/20
                   focus:outline-none focus:border-white/20 ${className}`}
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
          {suggestions.map((suggestion, idx) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => insertSuggestion(suggestion)}
              className={`w-full px-3 py-1.5 text-left text-xs transition-colors
                        ${idx === selectedIndex
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:bg-white/5'}`}
            >
              {suggestion}
            </button>
          ))}
          <div className="px-3 py-1 text-[10px] text-white/30 border-t border-white/5">
            Tab to select · Esc to close
          </div>
        </div>
      )}
    </div>
  );
};
