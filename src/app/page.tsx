"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { Transaction, AnomalousTransaction, FiltersState } from '@/types';
import { Header } from '@/components/layout/header';
import { LedgerFilters } from '@/components/ledger/ledger-filters';
import { StatsOverview } from '@/components/ledger/stats-overview';
import { LedgerTable } from '@/components/ledger/ledger-table';
import { Button } from '@/components/ui/button';
import { highlightAnomalies, type HighlightAnomaliesInput } from '@/ai/flows/highlight-anomalies';
import { useToast } from "@/hooks/use-toast";
import { DetectAnomalyIcon, LoadingIcon } from '@/components/ledger/icons';
import { parseISO, isWithinInterval, isValid } from 'date-fns';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2024-01-15', description: 'Office Supplies Purchase', category: 'Office Expenses', amount: 125.50 },
  { id: '2', date: '2024-01-20', description: 'Consulting Services Rendered', category: 'Revenue', amount: 2500.00 },
  { id: '3', date: '2024-02-01', description: 'Software Subscription Renewal', category: 'Software', amount: 79.00 },
  { id: '4', date: '2024-02-10', description: 'Travel Expenses - Conference', category: 'Travel', amount: 450.75 },
  { id: '5', date: '2024-02-15', description: 'Utility Bill - Electricity', category: 'Utilities', amount: 180.20 },
  { id: '6', date: '2024-03-05', description: 'Client Payment Received', category: 'Revenue', amount: 1200.00 },
  { id: '7', date: '2024-03-10', description: 'Hardware Purchase - Laptop', category: 'Capital Expenditure', amount: 1500.00 },
  { id: '8', date: '2024-03-22', description: 'Office Rent', category: 'Office Expenses', amount: 1800.00 },
  { id: '9', date: '2024-04-01', description: 'Marketing Campaign Q2', category: 'Marketing', amount: 3000.00 },
  { id: '10', date: '2024-04-05', description: 'Catering for Event', category: 'Events', amount: 650.00 },
  { id: '11', date: '2024-04-18', description: 'Salaries - April', category: 'Payroll', amount: 15000.00 },
  { id: '12', date: '2024-05-02', description: 'Unusual Cash Withdrawal', category: 'Miscellaneous', amount: 5000.00 }, // Potentially anomalous
  { id: '13', date: '2024-05-10', description: 'Legal Consultation Fees', category: 'Legal Services', amount: 2200.00 },
  { id: '14', date: '2024-05-25', description: 'Office Cleaning Services', category: 'Office Expenses', amount: 150.00 },
  { id: '15', date: '2024-06-01', description: 'Grant Funding Received', category: 'Grants', amount: 50000.00 },
  { id: '16', date: '2024-06-15', description: 'Large Equipment Purchase', category: 'Capital Expenditure', amount: 25000.00 }, // Potentially anomalous
];


export default function Home() {
  const { toast } = useToast();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [filters, setFilters] = useState<FiltersState>({
    category: undefined,
    dateRange: undefined,
    amountMin: undefined,
    amountMax: undefined,
    searchTerm: undefined,
  });
  const [anomalies, setAnomalies] = useState<AnomalousTransaction[]>([]);
  const [isLoadingAnomalies, setIsLoadingAnomalies] = useState(false);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(allTransactions.map(t => t.category));
    return Array.from(categories).sort();
  }, [allTransactions]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      let pass = true;

      if (filters.searchTerm && !transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        pass = false;
      }
      if (filters.category && filters.category !== 'all' && transaction.category !== filters.category) {
        pass = false;
      }
      if (filters.dateRange?.from) {
        const transactionDate = parseISO(transaction.date);
        if (!isValid(transactionDate)) pass = false;
        else if (filters.dateRange.to) {
          if (!isWithinInterval(transactionDate, { start: filters.dateRange.from, end: filters.dateRange.to })) {
            pass = false;
          }
        } else { // Only from date is set
          if (transactionDate < filters.dateRange.from) {
            pass = false;
          }
        }
      }
      if (filters.amountMin !== undefined && transaction.amount < filters.amountMin) {
        pass = false;
      }
      if (filters.amountMax !== undefined && transaction.amount > filters.amountMax) {
        pass = false;
      }
      return pass;
    });
  }, [allTransactions, filters]);

  const handleFiltersChange = useCallback((newFilters: FiltersState) => {
    setFilters(newFilters);
  }, []);

  const handleDetectAnomalies = async () => {
    setIsLoadingAnomalies(true);
    setAnomalies([]); // Clear previous anomalies
    try {
      const input: HighlightAnomaliesInput = { transactions: allTransactions }; // Use all transactions for AI analysis
      const result = await highlightAnomalies(input);
      if (result && result.anomalousTransactions) {
        setAnomalies(result.anomalousTransactions);
        toast({
          title: "Anomaly Detection Complete",
          description: `${result.anomalousTransactions.length} potential anomalies found.`,
          variant: result.anomalousTransactions.length > 0 ? "default" : "default", // could be 'success' like
        });
      } else {
        toast({
          title: "Anomaly Detection",
          description: "No anomalies found or unexpected response.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error detecting anomalies:", error);
      toast({
        title: "Error",
        description: "Failed to detect anomalies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAnomalies(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <LedgerFilters
              allCategories={uniqueCategories}
              onFiltersChange={handleFiltersChange}
              initialFilters={filters}
            />
            <Button
              onClick={handleDetectAnomalies}
              disabled={isLoadingAnomalies}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base"
              aria-live="polite" 
              aria-busy={isLoadingAnomalies}
            >
              {isLoadingAnomalies ? (
                <>
                  <LoadingIcon className="mr-2 h-5 w-5 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <DetectAnomalyIcon className="mr-2 h-5 w-5" />
                  Detect Anomalies with AI
                </>
              )}
            </Button>
             {isLoadingAnomalies && <p className="text-sm text-muted-foreground text-center mt-2">AI analysis can take a few moments...</p>}
          </div>

          <div className="lg:col-span-3 space-y-8">
            <StatsOverview transactions={filteredTransactions} />
            <LedgerTable transactions={filteredTransactions} anomalies={anomalies} />
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        © {new Date().getFullYear()} Public Ledger Hub. All rights reserved.
      </footer>
    </div>
  );
}
