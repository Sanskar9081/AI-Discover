import { useMutation } from '@tanstack/react-query';
import client from './client';
import { queryClient } from '../lib/queryClient';
import { toolsAPI } from './tools';
import { promptsAPI } from './prompts';

export const useCreateTool = () => {
  return useMutation({
    mutationFn: async (tool: any) => {
      const data = await toolsAPI.createTool(tool);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },
  });
};

export const useUpdateTool = () => {
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const data = await toolsAPI.updateTool(id, updates);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['tool', data.id] });
    },
  });
};

export const useDeleteTool = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await toolsAPI.deleteTool(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },
  });
};

export const useCreatePrompt = () => {
  return useMutation({
    mutationFn: async (prompt: any) => {
      const data = await client.post('/prompts', prompt);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
};

export const useUpdatePrompt = () => {
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const data = await client.patch(`/prompts/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
};

export const useDeletePrompt = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/prompts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
};

export const useCreateAd = () => {
  return useMutation({
    mutationFn: async (ad: any) => {
      const data = await client.post('/admin/ads', ad);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ads'] })
  });
};

export const useUpdateAd = () => {
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const data = await client.patch(`/admin/ads/${id}`, updates);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ads'] })
  });
};

export const useDeleteAd = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/admin/ads/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ads'] })
  });
};

export const useSaveToolMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await client.post('/saved', { toolId: id, itemType: 'tool' });
    }
  });
};

export const useSavePromptMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await client.post('/saved', { promptId: id, itemType: 'prompt' });
    }
  });
};

export const useAddRecentlyViewedMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await client.post(`/recently-viewed/${id}`);
    }
  });
};

export const useApproveToolMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await client.patch(`/tools/${id}`, { status: 'approved' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['toolsPending'] });
    }
  });
};

export const useRejectToolMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await client.patch(`/tools/${id}`, { status: 'rejected' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['toolsPending'] });
    }
  });
};

export const useApprovePromptMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await client.patch(`/prompts/${id}`, { status: 'approved' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['promptsPending'] });
    }
  });
};

export const useRejectPromptMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await client.patch(`/prompts/${id}`, { status: 'rejected' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['promptsPending'] });
    }
  });
};

export const useUpdateSettings = () => {
  return useMutation({
    mutationFn: async ({ key, value }: { key: string, value: any }) => {
      const data = await client.patch(`/settings/${key}`, { value });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] })
  });
};

export const useUpdateToolCoupon = () => {
  return useMutation({
    mutationFn: async ({ id, couponCode }: { id: string, couponCode: string }) => {
      await client.patch(`/tools/${id}`, { couponCode });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tools'] })
  });
};

export const useCreateUseCase = () => {
  return useMutation({
    mutationFn: async (useCase: any) => {
      const data = await client.post('/use-cases', useCase);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['useCases'] })
  });
};

export const useUpdateUseCase = () => {
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const data = await client.patch(`/use-cases/${id}`, updates);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['useCases'] })
  });
};

export const useDeleteUseCase = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/use-cases/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['useCases'] })
  });
};

export const useUpdateNewsletterFrequency = () => {
  return useMutation({
    mutationFn: async ({ id, frequency }: { id: string, frequency: string }) => {
      await client.patch(`/newsletter/${id}/frequency`, { frequency });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['newsletterSubscriptions'] })
  });
};

export const useUnsubscribeNewsletter = () => {
  return useMutation({
    mutationFn: async (token: string) => {
      await client.post('/newsletter/unsubscribe', { token });
    }
  });
};

export const useDeleteNewsletterSubscription = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/newsletter/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['newsletterSubscriptions'] })
  });
};

export const useGetBugReports = () => {
  return useMutation({
    mutationFn: async () => {
      const data = await client.get('/admin/bug-reports');
      return data;
    }
  });
};

export const useGetAdRequests = () => {
  return useMutation({
    mutationFn: async () => {
      const data = await client.get('/admin/ad-requests');
      return data;
    }
  });
};

export const useUpdateBugStatus = () => {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await client.patch(`/admin/bug-reports/${id}/status`, { status });
    }
  });
};

export const useDeleteBugReport = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/admin/bug-reports/${id}`);
    }
  });
};

export const useDeleteAdRequest = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/admin/ad-requests/${id}`);
    }
  });
};

export const useGetContactMessages = () => {
  return useMutation({
    mutationFn: async () => {
      const data = await client.get('/admin/contact-messages');
      return data;
    }
  });
};

export const useDeleteContactMessage = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/admin/contact-messages/${id}`);
    }
  });
};

export const useUpdateContactMessageStatus = () => {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await client.patch(`/admin/contact-messages/${id}/status`, { status });
    }
  });
};

export const useSubmitRating = () => {
  return useMutation({ 
    mutationFn: async ({ toolId, rating }: { toolId: string, rating: number }) => {
      const data = await client.post('/ratings', { toolId, rating });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tool', variables.toolId] });
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    }
  });
};

export const useIncrementClicks = () => {
  return useMutation({ 
    mutationFn: async (id: string) => {
      await client.post(`/tools/${id}/click`);
    }
  });
};

export const useIncrementViews = () => {
  return useMutation({ 
    mutationFn: async (id: string) => {
      await client.post(`/tools/${id}/view`);
    }
  });
};
