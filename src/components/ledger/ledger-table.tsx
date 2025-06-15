"use client";

import React from 'react';
import type { Transaction, AnomalousTransaction } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { AnomalyIcon, DateIcon, DescriptionIcon, CategoryIcon, AmountIcon } from './icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LedgerTableProps {
  transactions: Transaction[];
  anomalies: AnomalousTransaction[];
}

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export function LedgerTable({ transactions, anomalies }: LedgerTableProps) {
  const getAnomalyReason = (transactionId: string): string | undefined => {
    return anomalies.find(a => a.id === transactionId)?.reason;
  };

  if (transactions.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No transactions match the current filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
       <CardHeader>
        <CardTitle className="text-xl">Transaction Ledger</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]"><DateIcon className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Date</TableHead>
                  <TableHead><DescriptionIcon className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Description</TableHead>
                  <TableHead><CategoryIcon className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Category</TableHead>
                  <TableHead className="text-right"><AmountIcon className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Amount</TableHead>
                  <TableHead className="w-[50px] text-center">Anomaly</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const anomalyReason = getAnomalyReason(transaction.id);
                  const isAnomalous = !!anomalyReason;
                  return (
                    <TableRow
                      key={transaction.id}
                      className={isAnomalous ? 'bg-destructive/10 hover:bg-destructive/20 transition-colors duration-300' : 'hover:bg-muted/50 transition-colors duration-300'}
                      aria-live="polite" // For screen readers when anomalies are detected
                      aria-atomic="true"
                    >
                      <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="whitespace-nowrap">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell className={`text-right font-mono ${transaction.amount < 0 ? 'text-destructive' : 'text-accent-foreground'}`}>
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        {isAnomalous && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button aria-label={`Anomaly detected: ${anomalyReason}`}>
                                <AnomalyIcon className="h-5 w-5 text-destructive" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-destructive text-destructive-foreground">
                              <p>{anomalyReason}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
