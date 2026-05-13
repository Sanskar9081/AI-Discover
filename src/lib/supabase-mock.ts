/**
 * Mock Supabase client for offline development
 * Used when network is unavailable
 */

const mockData = {
  import_history: [] as any[],
  tools: [] as any[],
};

// Query builder chain support
class QueryBuilder {
  private table: string;
  private filters: any[] = [];
  private orderBy: { column: string; ascending: boolean } | null = null;
  private limitCount: number | null = null;
  private offsetCount: number | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select(columns?: string) {
    return this;
  }

  order(column: string, options?: any) {
    this.orderBy = { column, ascending: options?.ascending !== false };
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  offset(count: number) {
    this.offsetCount = count;
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ type: 'eq', column, value });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push({ type: 'neq', column, value });
    return this;
  }

  gt(column: string, value: any) {
    this.filters.push({ type: 'gt', column, value });
    return this;
  }

  lt(column: string, value: any) {
    this.filters.push({ type: 'lt', column, value });
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push({ type: 'gte', column, value });
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push({ type: 'lte', column, value });
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push({ type: 'in', column, values });
    return this;
  }

  async then(callback: Function) {
    return callback(await this.execute());
  }

  private async execute() {
    let data = mockData[this.table as keyof typeof mockData] || [];
    
    // Apply filters
    for (const filter of this.filters) {
      data = data.filter((row: any) => {
        switch (filter.type) {
          case 'eq': return row[filter.column] === filter.value;
          case 'neq': return row[filter.column] !== filter.value;
          case 'gt': return row[filter.column] > filter.value;
          case 'lt': return row[filter.column] < filter.value;
          case 'gte': return row[filter.column] >= filter.value;
          case 'lte': return row[filter.column] <= filter.value;
          case 'in': return filter.values.includes(row[filter.column]);
          default: return true;
        }
      });
    }

    // Apply ordering
    if (this.orderBy) {
      data.sort((a: any, b: any) => {
        const aVal = a[this.orderBy!.column];
        const bVal = b[this.orderBy!.column];
        if (aVal < bVal) return this.orderBy!.ascending ? -1 : 1;
        if (aVal > bVal) return this.orderBy!.ascending ? 1 : -1;
        return 0;
      });
    }

    // Apply offset
    if (this.offsetCount !== null) {
      data = data.slice(this.offsetCount);
    }

    // Apply limit
    if (this.limitCount !== null) {
      data = data.slice(0, this.limitCount);
    }

    return { data, error: null };
  }
}

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
    select: (columns?: string) => {
      return new QueryBuilder(table);
    },
    delete: async () => {
      mockData[table as keyof typeof mockData] = [];
      return { data: null, error: null };
    },
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
