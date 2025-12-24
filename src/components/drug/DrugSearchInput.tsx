import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useDrugSearch } from '../../hooks/useDrugs';
import { useApp } from '../../context/AppContext';
import type { Drug, HepatotoxicityGrade } from '../../types';

const gradeColors: Record<HepatotoxicityGrade, string> = {
  A: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  B: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  C: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  D: 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300',
  E: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

export default function DrugSearchInput() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { results, isSearching } = useDrugSearch(query);
  const { state, addDrug } = useApp();

  // Filter out already selected drugs
  const filteredResults = results.filter(
    drug => !state.selectedDrugs.some(d => d.id === drug.id)
  );

  const handleSelect = useCallback((drug: Drug) => {
    addDrug(drug);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }, [addDrug]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredResults.length) {
          handleSelect(filteredResults[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  // Open dropdown when query changes
  useEffect(() => {
    if (query.trim()) {
      setIsOpen(true);
      setHighlightedIndex(-1);
    } else {
      setIsOpen(false);
    }
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <label htmlFor="drug-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        약물 검색
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          id="drug-search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="약물명, 상품명, 성분명 검색..."
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <ul
          ref={listRef}
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-auto"
        >
          {filteredResults.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              {isSearching ? '검색 중...' : '검색 결과가 없습니다'}
            </li>
          ) : (
            filteredResults.map((drug, index) => (
              <li
                key={drug.id}
                onClick={() => handleSelect(drug)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  index === highlightedIndex
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {drug.name_kr}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${gradeColors[drug.hepatotoxicity.grade]}`}>
                        {drug.hepatotoxicity.grade}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {drug.name_en}
                      {drug.brand_names_en && drug.brand_names_en.length > 0 && (
                        <span className="ml-1 text-gray-400 dark:text-gray-500">
                          ({drug.brand_names_en.slice(0, 2).join(', ')})
                        </span>
                      )}
                    </div>
                    {drug.brand_names_kr.length > 0 && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                        {drug.brand_names_kr.slice(0, 3).join(', ')}
                        {drug.brand_names_kr.length > 3 && ' ...'}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        한글명, 영문명, 상품명으로 검색할 수 있습니다
      </p>
    </div>
  );
}
