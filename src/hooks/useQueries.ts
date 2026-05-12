import { useQuery, useQueries } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { AITool, Prompt, Ad, Category } from '../data/tools';

// Helper to transform lowercase database columns to camelCase
const transformTool = (dbTool: any): AITool => ({
  id: dbTool.id,
  name: dbTool.name,
  description: dbTool.description,
  category: dbTool.category,
  pricing: dbTool.pricing,
  logo: dbTool.logo,
  url: dbTool.url,
  featured: dbTool.featured,
  trending: dbTool.trending,
  features: dbTool.features || [],
  easeOfUse: dbTool.easeofuse,
  mainFunctionality: dbTool.mainfunctionality,
  freePlan: dbTool.freeplan,
  rating: dbTool.rating || 0,
  reviewCount: dbTool.reviewcount || 0,
  isNew: dbTool.isnew,
  isPremium: dbTool.ispremium,
  useCase: dbTool.usecase,
  tags: dbTool.tags,
  couponCode: dbTool.couponcode,
  views: dbTool.views,
  clicks: dbTool.clicks,
  status: dbTool.status,
});

// Helper to transform prompt lowercase database columns to camelCase
const transformPrompt = (dbPrompt: any): Prompt => ({
  id: dbPrompt.id,
  title: dbPrompt.title,
  prompt: dbPrompt.prompt,
  category: dbPrompt.category,
  beforeImage: dbPrompt.beforeimage,
  afterImage: dbPrompt.afterimage,
  author: dbPrompt.author,
  instagram: dbPrompt.instagram,
  featured: dbPrompt.featured,
  suggestedTool: dbPrompt.suggestedtool,
  suggestedToolId: dbPrompt.suggestedtoolid,
  status: dbPrompt.status,
});

// ============ Tools ============
export const useTools = () => {
  return useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching approved tools...');
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('status', 'approved')
          .order('id', { ascending: true });
        
        if (error) {
          console.error('❌ Error fetching tools:', error);
          throw error;
        }
        console.log('✅ Fetched approved tools:', data?.length || 0, 'tools');
        return (data || []).map(transformTool);
      } catch (err) {
        console.error('❌ useTools query error:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

export const useToolById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['tool', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      console.log('Fetched tool by ID:', data);
      return transformTool(data);
    },
    enabled: !!id,
    retry: 1,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// ============ Prompts ============
export const usePrompts = () => {
  return useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching approved prompts...');
        const { data, error } = await supabase
          .from('prompts')
          .select('*')
          .eq('status', 'approved')
          .order('id', { ascending: true });
        
        if (error) {
          console.error('❌ Error fetching prompts:', error);
          throw error;
        }
        console.log('✅ Fetched approved prompts:', data?.length || 0, 'prompts');
        return (data || []).map(transformPrompt);
      } catch (err) {
        console.error('❌ usePrompts query error:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// ============ Ads ============
export const useAds = () => {
  return useQuery({
    queryKey: ['ads'],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching ads...');
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) {
          console.error('❌ Error fetching ads:', error);
          throw error;
        }
        console.log('✅ Fetched ads:', data?.length || 0, 'ads');
        return (data || []) as Ad[];
      } catch (err) {
        console.error('❌ useAds query error:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// ============ Categories ============
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching categories from database...');
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) {
          console.warn('⚠️ Error fetching categories from DB (returning empty):', error);
          return [] as Category[];
        }
        
        if (data && data.length > 0) {
          console.log('✅ Fetched categories from database:', data?.length || 0, 'categories');
          return (data || []) as Category[];
        }
        
        console.log('⚠️ No categories found in database, will use defaults');
        return [] as Category[];
      } catch (err) {
        console.error('❌ useCategories query error:', err);
        console.warn('⚠️ Returning empty array so page can use defaults');
        return [] as Category[];
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// ============ User Saved Items ============
export const useSavedTools = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['savedTools', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_saved_items')
        .select('tool_id')
        .eq('user_id', userId)
        .eq('item_type', 'tool');
      
      if (error) throw error;
      console.log('Fetched saved tools:', data);
      return data ? data.map(item => item.tool_id) : [];
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useSavedPrompts = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['savedPrompts', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_saved_items')
        .select('prompt_id')
        .eq('user_id', userId)
        .eq('item_type', 'prompt');
      
      if (error) throw error;
      console.log('Fetched saved prompts:', data);
      return data ? data.map(item => item.prompt_id) : [];
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useRecentlyViewed = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['recentlyViewed', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_recently_viewed')
        .select('tool_id')
        .eq('user_id', userId)
        .order('viewed_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      console.log('Fetched recently viewed:', data);
      return data ? data.map(item => item.tool_id) : [];
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// ============ Multiple Tool Lookups (for Compare page) ============
export const useToolsByIds = (ids: (string | undefined)[] | undefined) => {
  const validIds = ids?.filter(id => !!id) || [];
  
  return useQueries({
    queries: validIds.map(id => ({
      queryKey: ['tool', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        console.log('Fetched tool by ID in useToolsByIds:', data);
        return transformTool(data);
      },
      retry: 1,
      staleTime: 0,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    })),
  });
};

// ============ Pending Items (for Admin) ============
export const usePendingTools = () => {
  return useQuery({
    queryKey: ['toolsPending'],
    queryFn: async () => {
      console.log('🔍 Querying for pending tools...');
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching pending tools:', error);
        throw error;
      }
      console.log('✅ Fetched pending tools:', data);
      console.log('📊 Pending tools count:', data?.length || 0);
      return (data || []).map(transformTool);
    },
    retry: 1,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const usePendingPrompts = () => {
  return useQuery({
    queryKey: ['promptsPending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Fetched pending prompts:', data);
      return (data || []).map(transformPrompt);
    },
    retry: 1,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// ============ Registered Users (for Admin) ============
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        // First try to fetch from profiles table (if it exists)
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, mobile, joinedAt, contributions')
          .order('joinedAt', { ascending: false });
        
        if (error) {
          console.warn('Error fetching profiles:', error);
          throw error;
        }
        
        console.log('Fetched users:', data);
        return (data || []) as any[];
      } catch (err) {
        console.error('Error fetching users:', err);
        // Return empty array if source doesn't work
        return [];
      }
    },
    retry: 1,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// ============ Settings ============
export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .order('key', { ascending: true });
        
        if (error) {
          console.warn('Error fetching settings:', error);
          // Return default settings if table doesn't exist
          return [
            { key: 'homepage_total_tools', value: '100+' },
            { key: 'homepage_categories', value: '10+' },
            { key: 'homepage_update_freq', value: 'Daily' },
            { key: 'homepage_pricing', value: 'Free' },
            { key: 'tool_of_the_day', value: '' },
            { key: 'prompt_of_the_day', value: '' }
          ];
        }
        
        // Fill in defaults for missing settings
        const settingMap = new Map(data?.map(s => [s.key, s.value]) || []);
        const defaults = [
          { key: 'homepage_total_tools', value: '100+' },
          { key: 'homepage_categories', value: '10+' },
          { key: 'homepage_update_freq', value: 'Daily' },
          { key: 'homepage_pricing', value: 'Free' },
          { key: 'tool_of_the_day', value: '' },
          { key: 'prompt_of_the_day', value: '' }
        ];
        
        return defaults.map(d => ({
          key: d.key,
          value: settingMap.get(d.key) || d.value
        }));
      } catch (err) {
        console.error('Error fetching settings:', err);
        return [
          { key: 'homepage_total_tools', value: '100+' },
          { key: 'homepage_categories', value: '10+' },
          { key: 'homepage_update_freq', value: 'Daily' },
          { key: 'homepage_pricing', value: 'Free' },
          { key: 'tool_of_the_day', value: '' },
          { key: 'prompt_of_the_day', value: '' }
        ];
      }
    },
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ============ Maintenance Mode ============
export const useMaintenance = () => {
  return useQuery({
    queryKey: ['maintenanceMode'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'maintenance_mode')
          .single();
        
        if (error || !data) {
          return false; // Default: no maintenance mode
        }
        
        return data.value === 'true' || data.value === true;
      } catch (err) {
        console.warn('Error fetching maintenance mode:', err);
        return false;
      }
    },
    retry: 1,
    staleTime: 10 * 1000, // Refresh every 10 seconds for quick updates
    gcTime: 5 * 60 * 1000,
  });
};

// ============ Use Cases ============
export const useUseCases = () => {
  return useQuery({
    queryKey: ['useCases'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('use_cases')
          .select('*')
          .order('order_index', { ascending: true });
        
        if (error) {
          console.warn('Error fetching use cases:', error);
          // Return default use cases if table doesn't exist
          return [
            { id: '1', key: 'students', label: 'For Students', icon: 'GraduationCap', order_index: 0 },
            { id: '2', key: 'developers', label: 'For Developers', icon: 'Code', order_index: 1 },
            { id: '3', key: 'creators', label: 'For Creators', icon: 'PenTool', order_index: 2 }
          ];
        }
        
        return data || [];
      } catch (err) {
        console.error('Error fetching use cases:', err);
        return [
          { id: '1', key: 'students', label: 'For Students', icon: 'GraduationCap', order_index: 0 },
          { id: '2', key: 'developers', label: 'For Developers', icon: 'Code', order_index: 1 },
          { id: '3', key: 'creators', label: 'For Creators', icon: 'PenTool', order_index: 2 }
        ];
      }
    },
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ============ Newsletter Subscriptions ============
export const useNewsletterSubscriptions = () => {
  return useQuery({
    queryKey: ['newsletterSubscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching newsletter subscriptions:', error);
        throw error;
      }
      return data || [];
    },
    retry: 1,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
