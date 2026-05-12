/**
 * Mock Supabase client for offline development
 * Used when network is unavailable
 */

const mockData = {
  import_history: [] as any[],
  tools: [] as any[],
};

export const supabaseMock = {
  from: (table: string) => ({
    insert: async (data: any) => {
      if (table === 'import_history') {
        mockData.import_history.push({ id: Date.now(), ...data });
      }
      if (table === 'tools') {
        mockData.tools.push(...(Array.isArray(data) ? data : [data]));
      }
      return { data: Array.isArray(data) ? data : [data], error: null };
    },
    upsert: async (data: any, options?: any) => {
      if (table === 'tools') {
        mockData.tools.push(...(Array.isArray(data) ? data : [data]));
      }
      return { data: Array.isArray(data) ? data : [data], error: null };
    },
    select: async (columns?: string) => {
      return { data: Array.isArray(mockData[table as keyof typeof mockData]) ? mockData[table as keyof typeof mockData] : [], error: null };
    },
    delete: async () => {
      mockData[table as keyof typeof mockData] = [];
      return { data: null, error: null };
    },
    order: (column: string, options?: any) => ({
      limit: (count: number) => ({
        select: () => ({
          then: (callback: Function) => {
            const table_data = mockData[table as keyof typeof mockData];
            const results = Array.isArray(table_data) ? table_data.slice(0, count) : [];
            callback({ data: results, error: null });
            return Promise.resolve({ data: results, error: null });
          },
        }),
      }),
    }),
    neq: (column: string, value: any) => ({
      then: (callback: Function) => {
        callback({ data: null, error: null });
        return Promise.resolve({ data: null, error: null });
      },
    }),
  }),

  auth: {
    getSession: async () => ({
      data: { session: null },
      error: null,
    }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
};

console.warn('⚠️ Using MOCK Supabase (offline mode). Network is unavailable.');
console.log('📦 All data will be stored in memory only (lost on refresh)');

export default supabaseMock;
