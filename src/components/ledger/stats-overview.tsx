"use client";

import React from 'react';
import type { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TotalTransactionsIcon, TotalAmountIcon, AverageAmountIcon } from './icons';

interface StatsOverviewProps {
  transactions: Transaction[];
}

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export function StatsOverview({ transactions }: StatsOverviewProps) {
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

  const stats = [
    {
      title: 'Total Transactions',
      value: totalTransactions.toLocaleString(),
      icon: <TotalTransactionsIcon className="h-6 w-6 text-primary" />,
      description: 'Total number of recorded transactions.',
    },
    {
      title: 'Total Amount',
      value: formatCurrency(totalAmount),
      icon: <TotalAmountIcon className="h-6 w-6 text-accent" />,
      description: 'Sum of all transaction amounts.',
    },
    {
      title: 'Average Transaction Amount',
      value: formatCurrency(averageAmount),
      icon: <AverageAmountIcon className="h-6 w-6 text-secondary-foreground" />, // A different color for variety
      description: 'Average value per transaction.',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-1 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground pt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
