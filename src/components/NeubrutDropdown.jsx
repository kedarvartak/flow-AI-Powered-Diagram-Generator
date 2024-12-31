import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const NeubrutDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full px-6 py-4 text-left bg-white 
                  border-4 border-black rounded-xl
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                  transition-all duration-200
                  font-bold text-xl
                  flex items-center justify-between
                  group"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-3">
          <span className="w-3 h-3 bg-black rounded-full group-hover:bg-[#93CAED] transition-colors" />
          {options.find(opt => opt.value === value)?.label || 'Select type'}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="w-6 h-6" />
        ) : (
          <ChevronDownIcon className="w-6 h-6" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white 
                     border-4 border-black rounded-xl
                     shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     overflow-hidden"
            role="listbox"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-6 py-3 text-left
                          font-medium text-lg
                          hover:bg-[#93CAED]/10
                          border-b-2 border-black last:border-b-0
                          flex items-center gap-3
                          transition-colors"
                role="option"
                aria-selected={value === option.value}
                tabIndex={0}
              >
                <span className={`w-2 h-2 rounded-full transition-colors
                                ${value === option.value ? 'bg-[#93CAED]' : 'bg-gray-300'}`} 
                />
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeubrutDropdown;