import type { DateRange } from "react-day-picker";

export interface Transaction {
  id: string;
  date: string; // ISO 8601 format "YYYY-MM-DD"
  description: string;
  category: string;
  amount: number;
}

export interface AnomalousTransaction {
  id: string;
  reason: string;
}

export interface FiltersState {
  category: string | undefined;
  dateRange: DateRange | undefined;
  amountMin: number | undefined;
  amountMax: number | undefined;
  searchTerm: string | undefined;
}
