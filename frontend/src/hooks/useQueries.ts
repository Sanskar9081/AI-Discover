import { useQuery, useQueries } from '@tanstack/react-query';
import { toolsAPI } from '../api/tools';
import { categoriesAPI } from '../api/categories';
import { promptsAPI } from '../api/prompts';
import { savedAPI } from '../api/saved';
import client from '../api/client';
import type { AITool, Prompt, Ad, Category } from '../data/tools';

const transformTool = (dbTool: any): AITool => ({
  id: dbTool._id || dbTool.id,
  name: dbTool.name,
  description: dbTool.description,
  category: typeof dbTool.category === 'object' && dbTool.category !== null ? (dbTool.category.name || dbTool.category._id || String(dbTool.category)) : (dbTool.category || ''),
  pricing: dbTool.pricing,
  logo: dbTool.logo,
  url: dbTool.url,
  featured: dbTool.featured,
  trending: dbTool.trending,
  features: Array.isArray(dbTool.features) ? dbTool.features : (typeof dbTool.features === 'string' ? dbTool.features.split(',').map((s: string) => s.trim()) : []),
  easeOfUse: dbTool.easeOfUse,
  mainFunctionality: dbTool.mainFunctionality,
  freePlan: dbTool.freePlan,
  rating: dbTool.rating || 0,
  reviewCount: dbTool.reviewCount || 0,
  isNew: dbTool.isNew,
  isPremium: dbTool.isPremium,
  useCase: Array.isArray(dbTool.useCase) ? dbTool.useCase : (typeof dbTool.useCase === 'string' ? dbTool.useCase.split(',').map((s: string) => s.trim()) : []),
  tags: Array.isArray(dbTool.tags) ? dbTool.tags : (typeof dbTool.tags === 'string' ? dbTool.tags.split(',').map((s: string) => s.trim()) : []),
  couponCode: dbTool.couponCode,
  views: dbTool.views,
  clicks: dbTool.clicks,
  status: dbTool.status,
});

const transformPrompt = (dbPrompt: any): Prompt => ({
  id: dbPrompt._id || dbPrompt.id,
  title: dbPrompt.title,
  prompt: dbPrompt.prompt,
  category: typeof dbPrompt.category === 'object' && dbPrompt.category !== null ? (dbPrompt.category.name || dbPrompt.category._id || String(dbPrompt.category)) : (dbPrompt.category || ''),
  beforeImage: dbPrompt.beforeImage,
  afterImage: dbPrompt.afterImage,
  author: dbPrompt.author,
  instagram: dbPrompt.instagram,
  featured: dbPrompt.featured,
  suggestedTool: dbPrompt.suggestedTool,
  suggestedToolId: dbPrompt.suggestedToolId,
  status: dbPrompt.status,
});

export const useTools = () => {
  return useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      try {
        const data = await toolsAPI.getTools();
        // Assume API returns tools, filter for approved might be done backend or frontend
        // Assuming backend returns all for now, we filter status approved or undefined (legacy)
        return (data || []).filter((t: any) => !t.status || t.status === 'approved').map(transformTool);
      } catch (err) {
        throw err;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useToolById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['tool', id],
    queryFn: async () => {
      if (!id) return null;
      const data = await toolsAPI.getToolById(id);
      return transformTool(data);
    },
    enabled: !!id,
    retry: 1,
  });
};

export const usePrompts = () => {
  return useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      const data = await promptsAPI.getPrompts();
      return (data || []).filter((p: any) => !p.status || p.status === 'approved').map(transformPrompt);
    },
    retry: 1,
  });
};

export const useAds = () => {
  return useQuery({
    queryKey: ['ads'],
    queryFn: async () => {
      const data: any = await client.get('/admin/ads').catch(() => ([]));
      return (data || []).map((a: any) => ({ ...a, id: a._id || a.id })) as Ad[];
    },
    retry: 1,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const data = await categoriesAPI.getCategories();
        return (data || []).map((c: any) => ({
          id: c._id || c.id,
          name: c.name,
          icon: c.icon,
          color: c.color,
        })) as Category[];
      } catch (err) {
        return [];
      }
    },
    retry: 1,
  });
};

export const useSavedTools = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['savedTools', userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await savedAPI.getSavedItems();
      return data.filter((item: any) => item.itemType === 'tool').map((item: any) => item.tool._id);
    },
    enabled: !!userId,
    retry: 1,
  });
};

export const useSavedPrompts = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['savedPrompts', userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await savedAPI.getSavedItems();
      return data.filter((item: any) => item.itemType === 'prompt').map((item: any) => item.prompt._id);
    },
    enabled: !!userId,
    retry: 1,
  });
};

export const useRecentlyViewed = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['recentlyViewed', userId],
    queryFn: async () => {
      if (!userId) return [];
      const data: any = await client.get('/recently-viewed').catch(() => ([]));
      return (data || []).map((item: any) => item.tool?._id || item.tool);
    },
    enabled: !!userId,
    retry: 1,
  });
};

export const useToolsByIds = (ids: (string | undefined)[] | undefined) => {
  const validIds = ids?.filter(id => !!id) || [];
  return useQueries({
    queries: validIds.map(id => ({
      queryKey: ['tool', id],
      queryFn: async () => {
        const data = await toolsAPI.getToolById(id!);
        return transformTool(data);
      },
      retry: 1,
    })),
  });
};

export const usePendingTools = () => {
  return useQuery({
    queryKey: ['toolsPending'],
    queryFn: async () => {
      const data = await toolsAPI.getTools();
      return (data || []).filter((t: any) => t.status === 'pending').map(transformTool);
    },
    retry: 1,
  });
};

export const usePendingPrompts = () => {
  return useQuery({
    queryKey: ['promptsPending'],
    queryFn: async () => {
      const data = await promptsAPI.getPrompts();
      return (data || []).filter((p: any) => p.status === 'pending').map(transformPrompt);
    },
    retry: 1,
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const data = await client.get('/admin/users').catch(() => ([]));
      return data || [];
    },
    retry: 1,
  });
};

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const data = await client.get('/settings').catch(() => ([]));
      return data || [];
    },
    retry: 1,
  });
};

export const useMaintenance = () => {
  return useQuery({
    queryKey: ['maintenanceMode'],
    queryFn: async () => false,
    retry: 1,
  });
};

export const useUseCases = () => {
  return useQuery({
    queryKey: ['useCases'],
    queryFn: async () => {
      const data = await client.get('/use-cases').catch(() => ([]));
      return data || [];
    },
    retry: 1,
  });
};

export const useNewsletterSubscriptions = () => {
  return useQuery({
    queryKey: ['newsletterSubscriptions'],
    queryFn: async () => {
      const data = await client.get('/newsletter').catch(() => ([]));
      return data || [];
    },
    retry: 1,
  });
};

export const useBugReports = () => {
  return useQuery({
    queryKey: ['bugReports'],
    queryFn: async () => {
      const data = await client.get('/admin/bug-reports').catch(() => ([]));
      return data || [];
    },
    retry: 1,
  });
};

export const useAdRequests = () => {
  return useQuery({
    queryKey: ['adRequests'],
    queryFn: async () => {
      const data = await client.get('/admin/ad-requests').catch(() => ([]));
      return data || [];
    },
    retry: 1,
  });
};

export const useContactMessages = () => {
  return useQuery({
    queryKey: ['contactMessages'],
    queryFn: async () => {
      const data = await client.get('/admin/contact-messages').catch(() => ([]));
      return data || [];
    },
    retry: 1,
  });
};
