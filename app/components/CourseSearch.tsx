'use client';

import { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react"; 
// @ts-ignore
import debounce from 'lodash/debounce'; 

interface CourseSearchProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export function CourseSearch({ onSearch, placeholder = "Search courses..." }: CourseSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Debounce the search to avoid too many API calls
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            onSearch(query);
        }, 300),
        [onSearch]
    );

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        debouncedSearch(query);
    };

    const clearSearch = () => {
        setSearchQuery('');
        onSearch('');
    };

    return (
        <div className="relative flex w-full max-w-sm items-center space-x-2">
            <div className="relative w-full">
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={placeholder}
                    className="pl-10 pr-10"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                        onClick={clearSearch}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
} 