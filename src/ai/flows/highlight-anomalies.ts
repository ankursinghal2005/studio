'use server';

/**
 * @fileOverview Highlights potentially anomalous transactions in a ledger.
 *
 * - highlightAnomalies - A function that analyzes ledger data and highlights anomalous transactions.
 * - HighlightAnomaliesInput - The input type for the highlightAnomalies function.
 * - HighlightAnomaliesOutput - The return type for the highlightAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HighlightAnomaliesInputSchema = z.object({
  transactions: z.array(
    z.object({
      id: z.string().describe('The unique identifier for the transaction.'),
      category: z.string().describe('The category of the transaction.'),
      date: z.string().describe('The date of the transaction (ISO 8601 format).'),
      amount: z.number().describe('The amount of the transaction.'),
      description: z.string().describe('A description of the transaction.'),
    })
  ).describe('An array of transaction objects to analyze.'),
});

export type HighlightAnomaliesInput = z.infer<typeof HighlightAnomaliesInputSchema>;

const HighlightAnomaliesOutputSchema = z.object({
  anomalousTransactions: z.array(
    z.object({
      id: z.string().describe('The ID of the anomalous transaction.'),
      reason: z.string().describe('The reason why the transaction is considered anomalous.'),
    })
  ).describe('An array of anomalous transaction objects with their reasons.'),
});

export type HighlightAnomaliesOutput = z.infer<typeof HighlightAnomaliesOutputSchema>;

export async function highlightAnomalies(input: HighlightAnomaliesInput): Promise<HighlightAnomaliesOutput> {
  return highlightAnomaliesFlow(input);
}

const highlightAnomaliesPrompt = ai.definePrompt({
  name: 'highlightAnomaliesPrompt',
  input: {schema: HighlightAnomaliesInputSchema},
  output: {schema: HighlightAnomaliesOutputSchema},
  prompt: `You are an expert auditor tasked with identifying potentially anomalous transactions in a ledger.

  Analyze the following transactions and highlight any that appear to be anomalous, providing a reason for each anomaly.
  Focus on identifying transactions that deviate significantly from the norm based on amount, category, or description.

  Transactions:
  {{#each transactions}}
  - ID: {{id}}, Category: {{category}}, Date: {{date}}, Amount: {{amount}}, Description: {{description}}
  {{/each}}
  `,
});

const highlightAnomaliesFlow = ai.defineFlow(
  {
    name: 'highlightAnomaliesFlow',
    inputSchema: HighlightAnomaliesInputSchema,
    outputSchema: HighlightAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await highlightAnomaliesPrompt(input);
    return output!;
  }
);
