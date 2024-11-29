import { z } from 'zod';

const historyChatSchema = z.object({
  data: z.object({
    sessionID: z.string(),
    history: z.array(z.object({
        message: z.string(),
        bot: z.boolean(),
        timestamp: z.number(),
    })),
  }),
});

const historySearchSchema = z.object({
  data: z.object({
    sku: z.string().optional(),
    category: z.string().optional(),
    machine: z.string().optional(),
    brand: z.string().optional(),
    timestamp: z.number(),
  }),
});

// Discriminated union to validate based on the type field
export const historySchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('chat'),
    data: historyChatSchema.shape.data,
  }),
  z.object({
    type: z.literal('search'),
    data: historySearchSchema.shape.data,
  }),
]);

export type HistoryChat = z.infer<typeof historyChatSchema>;
export type HistorySearch = z.infer<typeof historySearchSchema>;
export type HistoryInputType = z.infer<typeof historySchema>;