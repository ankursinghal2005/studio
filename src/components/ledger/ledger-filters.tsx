"use client";

import React, { useState, useEffect } from 'react';
import type { FiltersState } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DateIcon, SearchIcon, FilterIcon, ClearIcon, CategoryIcon, AmountIcon } from './icons';
import type { DateRange } from 'react-day-picker';
import { Label } from '../ui/label';

interface LedgerFiltersProps {
  allCategories: string[];
  onFiltersChange: (filters: FiltersState) => void;
  initialFilters: FiltersState;
}

export function LedgerFilters({ allCategories, onFiltersChange, initialFilters }: LedgerFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialFilters.dateRange);
  const [amountMin, setAmountMin] = useState<string>(initialFilters.amountMin?.toString() || '');
  const [amountMax, setAmountMax] = useState<string>(initialFilters.amountMax?.toString() || '');

  useEffect(() => {
    // Debounce filter changes or apply on button click
    const timeoutId = setTimeout(() => {
       handleApplyFilters();
    }, 500); // Apply filters after 500ms of inactivity, or remove for manual apply
    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, dateRange, amountMin, amountMax]);


  const handleApplyFilters = () => {
    onFiltersChange({
      searchTerm,
      category: selectedCategory,
      dateRange,
      amountMin: amountMin ? parseFloat(amountMin) : undefined,
      amountMax: amountMax ? parseFloat(amountMax) : undefined,
    });
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(undefined);
    setDateRange(undefined);
    setAmountMin('');
    setAmountMax('');
    onFiltersChange({
      searchTerm: undefined,
      category: undefined,
      dateRange: undefined,
      amountMin: undefined,
      amountMax: undefined,
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <FilterIcon className="mr-2 h-5 w-5" />
          Filter Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="searchTerm" className="flex items-center"><SearchIcon className="mr-2 h-4 w-4 text-muted-foreground" />Search Description</Label>
          <Input
            id="searchTerm"
            placeholder="Search by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="flex items-center"><CategoryIcon className="mr-2 h-4 w-4 text-muted-foreground" />Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category" className="bg-background">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center"><DateIcon className="mr-2 h-4 w-4 text-muted-foreground" />Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-background hover:bg-accent/10"
              >
                <DateIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center"><AmountIcon className="mr-2 h-4 w-4 text-muted-foreground" />Amount Range</Label>
          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Min amount"
              value={amountMin}
              onChange={(e) => setAmountMin(e.target.value)}
              className="bg-background"
              aria-label="Minimum amount"
            />
            <Input
              type="number"
              placeholder="Max amount"
              value={amountMax}
              onChange={(e) => setAmountMax(e.target.value)}
              className="bg-background"
              aria-label="Maximum amount"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClearFilters} className="hover:bg-destructive/10 hover:text-destructive">
            <ClearIcon className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
          {/* Apply button could be used if debouncing is removed */}
          {/* <Button onClick={handleApplyFilters}>
            <FilterIcon className="mr-2 h-4 w-4" /> Apply Filters
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}

// Added Card, CardHeader, CardTitle, CardContent to imports
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
