import { useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { queryClient } from '../lib/queryClient';
import type { AITool, Prompt, Ad } from '../data/tools';

// Helper function to generate IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ============ Tool Mutations ============
export const useCreateTool = () => {
  return useMutation({
    mutationFn: async (tool: any) => {
      try {
        const toolWithId = { 
          ...tool, 
          id: generateId(),
          // Provide defaults for required database fields not in the form
          easeofuse: 0,
          mainfunctionality: tool.description || '',
          freeplan: tool.pricing === 'Free' || tool.pricing === 'Freemium',
          rating: 0,
          reviewcount: 0,
          isnew: true,
          ispremium: tool.pricing === 'Paid',
          features: [],
          usecase: [],
          tags: [],
          views: 0,
          clicks: 0,
        };
        console.log('🔧 Creating tool:', toolWithId);
        
        // First, try insert without .single() to see raw response
        const insertResponse = await supabase
          .from('tools')
          .insert([toolWithId])
          .select('id,name,description,category,pricing,logo,url,featured,trending,features,easeofuse,mainfunctionality,freeplan,rating,reviewcount,isnew,ispremium,usecase,tags,couponcode,views,clicks,created_at,updated_at,status');
        
        console.log('📤 Insert response:', insertResponse);
        
        const { data, error, status } = insertResponse;
        
        if (error) {
          console.error('❌ Supabase error:', error);
          console.error('   Status:', status);
          console.error('   Error code:', error.code);
          console.error('   Error message:', error.message);
          throw new Error(`Database error: ${error.message} (${error.code})`);
        }
        
        if (!data || data.length === 0) {
          console.error('❌ No data returned from insert. This might be an RLS policy issue.');
          throw new Error('Insert succeeded but no data returned - check Supabase RLS policies');
        }
        
        console.log('✅ Tool created successfully:', data[0]);
        return data[0];
      } catch (err: any) {
        console.error('❌ Create tool mutation error:', err);
        console.error('   Error type:', err.constructor.name);
        console.error('   Full error:', JSON.stringify(err, null, 2));
        throw err;
      }
    },
    onSuccess: () => {
      console.log('🔄 Tool created, refetching tools query');
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.refetchQueries({ queryKey: ['tools'] });
    },
    onError: (error: any) => {
      console.error('❌ Tool creation error:', error?.message || error);
    },
  });
};

export const useUpdateTool = () => {
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AITool> & { id: string }) => {
      // Map camelCase field names to lowercase database column names
      const fieldMap: Record<string, string> = {
        easeOfUse: 'easeofuse',
        mainFunctionality: 'mainfunctionality',
        freePlan: 'freeplan',
        reviewCount: 'reviewcount',
        isNew: 'isnew',
        isPremium: 'ispremium',
        useCase: 'usecase',
        couponCode: 'couponcode',
      };
      
      // Transform updates to use correct column names
      const filteredUpdates: any = {};
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          const dbFieldName = fieldMap[key] || key;
          filteredUpdates[dbFieldName] = value;
        }
      }
      
      const { data, error } = await supabase
        .from('tools')
        .update(filteredUpdates)
        .eq('id', id)
        .select('id,name,description,category,pricing,logo,url,featured,trending,features,easeofuse,mainfunctionality,freeplan,rating,reviewcount,isnew,ispremium,usecase,tags,couponcode,views,clicks,status')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['tool', data.id] });
      queryClient.refetchQueries({ queryKey: ['tools'] });
    },
  });
};

export const useDeleteTool = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.refetchQueries({ queryKey: ['tools'] });
    },
  });
};

// ============ Prompt Mutations ============
export const useCreatePrompt = () => {
  return useMutation({
    mutationFn: async (prompt: any) => {
      try {
        // Build object with only the fields that exist in the prompts table
        const promptWithId = {
          id: generateId(),
          title: prompt.title,
          prompt: prompt.prompt,
          category: prompt.category,
          beforeimage: prompt.beforeImage,
          afterimage: prompt.afterImage,
          author: prompt.author || 'Anonymous',
          instagram: prompt.instagram || '',
          featured: prompt.featured || false,
          status: prompt.status || 'pending',
        };
        
        console.log('🔧 Creating prompt:', promptWithId);
        const { data, error } = await supabase
          .from('prompts')
          .insert([promptWithId])
          .select('id,title,prompt,category,beforeimage,afterimage,author,instagram,featured,status')
          .single();
        
        if (error) {
          console.error('❌ Error creating prompt:', error);
          throw error;
        }
        console.log('✅ Prompt created successfully:', data);
        return data;
      } catch (err) {
        console.error('❌ Create prompt mutation error:', err);
        throw err;
      }
    },
    onSuccess: () => {
      console.log('🔄 Prompt created, refetching prompts query');
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.refetchQueries({ queryKey: ['prompts'] });
    },
    onError: (error) => {
      console.error('❌ Prompt creation error:', error);
    },
  });
};

export const useUpdatePrompt = () => {
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Prompt> & { id: string }) => {
      const { data, error } = await supabase
        .from('prompts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.refetchQueries({ queryKey: ['prompts'] });
    },
  });
};

export const useDeletePrompt = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.refetchQueries({ queryKey: ['prompts'] });
    },
  });
};

// ============ Ad Mutations ============
export const useCreateAd = () => {
  return useMutation({
    mutationFn: async (ad: Omit<Ad, 'id'>) => {
      try {
        const adWithId = { ...ad, id: generateId() };
        console.log('Creating ad with payload:', adWithId);
        const { data, error } = await supabase
          .from('ads')
          .insert([adWithId])
          .select('id,name,description,image,video,url,type,placement')
          .single();
        
        if (error) {
          console.error('Supabase error creating ad:', error);
          throw error;
        }
        console.log('Ad created successfully:', data);
        return data;
      } catch (err) {
        console.error('Create ad mutation error:', err);
        throw err;
      }
    },
    onSuccess: () => {
      console.log('Ad created, refetching ads query');
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      queryClient.refetchQueries({ queryKey: ['ads'] });
    },
    onError: (error) => {
      console.error('Ad creation failed:', error);
    },
  });
};

export const useUpdateAd = () => {
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Ad> & { id: string }) => {
      const { data, error } = await supabase
        .from('ads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      queryClient.refetchQueries({ queryKey: ['ads'] });
    },
  });
};

export const useDeleteAd = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      queryClient.refetchQueries({ queryKey: ['ads'] });
    },
  });
};

// ============ User Saved Items Mutations ============
export const useSaveToolMutation = () => {
  return useMutation({
    mutationFn: async ({ userId, toolId }: { userId: string; toolId: string }) => {
      // Check if already saved
      const { data: existing } = await supabase
        .from('user_saved_items')
        .select('id')
        .eq('user_id', userId)
        .eq('tool_id', toolId)
        .eq('item_type', 'tool')
        .single();
      
      if (existing) {
        // Remove if exists
        const { error } = await supabase
          .from('user_saved_items')
          .delete()
          .eq('user_id', userId)
          .eq('tool_id', toolId)
          .eq('item_type', 'tool');
        
        if (error) throw error;
        return { saved: false };
      } else {
        // Add new
        const { error } = await supabase
          .from('user_saved_items')
          .insert([{ user_id: userId, tool_id: toolId, item_type: 'tool' }]);
        
        if (error) throw error;
        return { saved: true };
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['savedTools', userId] });
    },
  });
};

export const useSavePromptMutation = () => {
  return useMutation({
    mutationFn: async ({ userId, promptId }: { userId: string; promptId: string }) => {
      const { data: existing } = await supabase
        .from('user_saved_items')
        .select('id')
        .eq('user_id', userId)
        .eq('prompt_id', promptId)
        .eq('item_type', 'prompt')
        .single();
      
      if (existing) {
        const { error } = await supabase
          .from('user_saved_items')
          .delete()
          .eq('user_id', userId)
          .eq('prompt_id', promptId)
          .eq('item_type', 'prompt');
        
        if (error) throw error;
        return { saved: false };
      } else {
        const { error } = await supabase
          .from('user_saved_items')
          .insert([{ user_id: userId, prompt_id: promptId, item_type: 'prompt' }]);
        
        if (error) throw error;
        return { saved: true };
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['savedPrompts', userId] });
    },
  });
};

// ============ Recently Viewed Mutations ============
export const useAddRecentlyViewedMutation = () => {
  return useMutation({
    mutationFn: async ({ userId, toolId }: { userId: string; toolId: string }) => {
      const { error } = await supabase
        .from('user_recently_viewed')
        .insert([{ user_id: userId, tool_id: toolId, viewed_at: new Date().toISOString() }]);
      
      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['recentlyViewed', userId] });
    },
  });
};

// ============ Approval Mutations ============
export const useApproveToolMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('tools')
        .update({ status: 'approved' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['toolsPending'] });
    },
  });
};

export const useRejectToolMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('tools')
        .update({ status: 'rejected' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['toolsPending'] });
    },
  });
};

export const useApprovePromptMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('prompts')
        .update({ status: 'approved' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['promptsPending'] });
    },
  });
};

export const useRejectPromptMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('prompts')
        .update({ status: 'rejected' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['promptsPending'] });
    },
  });
};

// ============ Settings Mutations ============
export const useUpdateSettings = () => {
  return useMutation({
    mutationFn: async (settings: { key: string; value: string }[]) => {
      try {
        console.log('Updating settings:', settings);
        // Update multiple settings sequentially
        for (const s of settings) {
          const { data, error } = await supabase
            .from('settings')
            .upsert({ key: s.key, value: s.value }, { onConflict: 'key' })
            .select();
          
          if (error) {
            console.error('Error upserting setting:', s.key, error);
            throw new Error(`Failed to update ${s.key}: ${error.message}`);
          }
          console.log('Updated setting:', s.key, data);
        }
        
        // Fetch fresh settings after update
        const { data: freshData, error: fetchError } = await supabase
          .from('settings')
          .select('*')
          .order('key', { ascending: true });
        
        if (fetchError) throw fetchError;
        console.log('Fresh settings from DB:', freshData);
        return freshData;
      } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Settings mutation succeeded, invalidating cache');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.setQueryData(['settings'], data);
    },
  });
};

// ============ Coupon Mutations ============
export const useUpdateToolCoupon = () => {
  return useMutation({
    mutationFn: async ({ id, couponCode }: { id: string; couponCode: string }) => {
      const { data, error } = await supabase
        .from('tools')
        .update({ couponcode: couponCode })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },
  });
};

// ============ Use Cases ============
export const useCreateUseCase = () => {
  return useMutation({
    mutationFn: async (data: { key: string; label: string; icon: string; order_index: number }) => {
      const { data: result, error } = await supabase
        .from('use_cases')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useCases'] });
    },
  });
};

export const useUpdateUseCase = () => {
  return useMutation({
    mutationFn: async ({ id, key, label, icon, order_index }: { id: string; key: string; label: string; icon: string; order_index: number }) => {
      const { data, error } = await supabase
        .from('use_cases')
        .update({ key, label, icon, order_index })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useCases'] });
    },
  });
};

export const useDeleteUseCase = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('use_cases')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useCases'] });
    },
  });
};

// ============ Newsletter Mutations ============
export const useUpdateNewsletterFrequency = () => {
  return useMutation({
    mutationFn: async ({ email, frequency }: { email: string; frequency: string }) => {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ frequency, updated_at: new Date().toISOString() })
        .eq('email', email);
      
      if (error) {
        console.error('❌ Update frequency error:', error);
        throw error;
      }
      console.log('✅ Frequency updated for', email, 'to', frequency);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletterSubscriptions'] });
      console.log('✅ Newsletter query invalidated');
    },
    onError: (error) => {
      console.error('🔴 Mutation error:', error);
    },
  });
};

export const useUnsubscribeNewsletter = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('email', email);
      
      if (error) {
        console.error('❌ Unsubscribe error:', error);
        throw error;
      }
      console.log('✅ Unsubscribed', email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletterSubscriptions'] });
      console.log('✅ Newsletter query invalidated');
    },
    onError: (error) => {
      console.error('🔴 Mutation error:', error);
    },
  });
};

export const useDeleteNewsletterSubscription = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('email', email);
      
      if (error) {
        console.error('❌ Delete error:', error);
        throw error;
      }
      console.log('✅ Deleted', email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletterSubscriptions'] });
      console.log('✅ Newsletter query invalidated');
    },
    onError: (error) => {
      console.error('🔴 Mutation error:', error);
    },
  });
};

// ============ Bug Report & Ad Request Mutations ============
export const useGetBugReports = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('bug_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Fetch bug reports error:', error);
        throw error;
      }
      return data;
    },
  });
};

export const useGetAdRequests = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('ad_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Fetch ad requests error:', error);
        throw error;
      }
      return data;
    },
  });
};

export const useUpdateBugStatus = () => {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('bug_reports')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        console.error('❌ Update bug status error:', error);
        throw error;
      }
      console.log('✅ Bug status updated');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugReports'] });
    },
  });
};

export const useDeleteBugReport = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bug_reports')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Delete bug report error:', error);
        throw error;
      }
      console.log('✅ Bug report deleted');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugReports'] });
    },
  });
};

export const useDeleteAdRequest = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ad_requests')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Delete ad request error:', error);
        throw error;
      }
      console.log('✅ Ad request deleted');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adRequests'] });
    },
  });
};

// ============ Contact Messages Mutations ============
export const useGetContactMessages = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Fetch contact messages error:', error);
        throw error;
      }
      return data;
    },
  });
};

export const useDeleteContactMessage = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Delete contact message error:', error);
        throw error;
      }
      console.log('✅ Contact message deleted');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
    },
  });
};

export const useUpdateContactMessageStatus = () => {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      console.log('🔄 Updating contact message status:', { id, status });
      
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('❌ Update contact message status error:', error);
        console.error('   Error code:', error.code);
        console.error('   Error message:', error.message);
        throw error;
      }
      
      console.log('✅ Contact message status updated:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('✅ Status update successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
    },
    onError: (error) => {
      console.error('❌ Mutation failed:', error);
    }
  });
};

// ============ Rating Mutations ============
export const useSubmitRating = () => {
  return useMutation({
    mutationFn: async ({ toolId, rating }: { toolId: string; rating: number }) => {
      console.log('⭐ Submitting rating:', { toolId, rating });
      
      const userId = `user-${Math.random().toString(36).substr(2, 9)}`;
      
      // Upsert: try update first, then insert if not found
      const { data: existingRating } = await supabase
        .from('ratings')
        .select('id')
        .eq('tool_id', toolId)
        .eq('user_id', userId)
        .single();

      let result;
      
      if (existingRating) {
        // Update existing rating
        result = await supabase
          .from('ratings')
          .update({ rating, updated_at: new Date().toISOString() })
          .eq('tool_id', toolId)
          .eq('user_id', userId)
          .select();
      } else {
        // Insert new rating
        result = await supabase
          .from('ratings')
          .insert([{ tool_id: toolId, user_id: userId, rating }])
          .select();
      }
      
      const { data, error } = result;
      
      if (error) {
        console.error('❌ Rating error:', error);
        throw error;
      }
      
      console.log('✅ Rating submitted:', data);
      
      // Wait for trigger to execute, then refetch
      setTimeout(() => {
        console.log('🔄 Refetching updated tool data...');
        queryClient.refetchQueries({ queryKey: ['tool', toolId] });
        queryClient.refetchQueries({ queryKey: ['tools'] });
      }, 500);
      
      return data;
    },
    onError: (error: any) => {
      console.error('❌ Rating submission error:', error);
    }
  });
};

export const useIncrementViews = () => {
  return useMutation({
    mutationFn: async (toolId: string) => {
      console.log('👁️ Incrementing views for:', toolId);
      
      try {
        // Try using RPC first
        const { data, error } = await supabase
          .rpc('increment_tool_views', { tool_id: toolId });
        
        if (!error) {
          console.log('✅ Views incremented via RPC');
          
          // Refetch tools queries to update UI
          setTimeout(() => {
            queryClient.refetchQueries({ queryKey: ['tool', toolId] });
            queryClient.refetchQueries({ queryKey: ['tools'] });
          }, 300);
          
          return data;
        }
      } catch (rpcError) {
        console.log('⚠️ RPC not available, using direct update');
      }
      
      // Fallback: Direct update
      const { data: tool } = await supabase
        .from('tools')
        .select('views')
        .eq('id', toolId)
        .single();
      
      if (tool) {
        const { data, error } = await supabase
          .from('tools')
          .update({ views: (tool.views || 0) + 1, updated_at: new Date().toISOString() })
          .eq('id', toolId)
          .select();
        
        if (error) throw error;
        console.log('✅ Views incremented via direct update');
        
        // Refetch tools queries to update UI
        setTimeout(() => {
          queryClient.refetchQueries({ queryKey: ['tool', toolId] });
          queryClient.refetchQueries({ queryKey: ['tools'] });
        }, 300);
        
        return data;
      }
    },
    onError: (error: any) => {
      console.error('❌ Views increment error:', error);
    }
  });
};

export const useIncrementClicks = () => {
  return useMutation({
    mutationFn: async (toolId: string) => {
      console.log('🖱️ Incrementing clicks for:', toolId);
      
      try {
        // Try using RPC first
        const { data, error } = await supabase
          .rpc('increment_tool_clicks', { tool_id: toolId });
        
        if (!error) {
          console.log('✅ Clicks incremented via RPC');
          queryClient.invalidateQueries({ queryKey: ['tool', toolId] });
          return data;
        }
      } catch (rpcError) {
        console.log('⚠️ RPC not available, using direct update');
      }
      
      // Fallback: Direct update
      const { data: tool } = await supabase
        .from('tools')
        .select('clicks')
        .eq('id', toolId)
        .single();
      
      if (tool) {
        const { data, error } = await supabase
          .from('tools')
          .update({ clicks: (tool.clicks || 0) + 1, updated_at: new Date().toISOString() })
          .eq('id', toolId)
          .select();
        
        if (error) throw error;
        console.log('✅ Clicks incremented via direct update');
        queryClient.invalidateQueries({ queryKey: ['tool', toolId] });
        return data;
      }
    },
    onError: (error: any) => {
      console.error('❌ Clicks increment error:', error);
    }
  });
};
