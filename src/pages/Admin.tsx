import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Star, X, Megaphone, Check, XCircle, Upload, Users, Settings, Eye, Zap, Mail, Copy, Bug, AlertTriangle, Download, Loader } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useCategories, useTools, usePrompts, useAds, useUsers, useSettings, useUseCases, useNewsletterSubscriptions } from "@/hooks/useQueries";
import { useCreateTool, useUpdateTool, useDeleteTool, useCreatePrompt, useUpdatePrompt, useDeletePrompt, useCreateAd, useUpdateAd, useDeleteAd, useApproveToolMutation, useRejectToolMutation, useApprovePromptMutation, useRejectPromptMutation, useUpdateSettings, useUpdateToolCoupon, useCreateUseCase, useUpdateUseCase, useDeleteUseCase, useUpdateNewsletterFrequency, useUnsubscribeNewsletter, useDeleteNewsletterSubscription, useGetBugReports, useGetAdRequests, useDeleteBugReport, useDeleteAdRequest, useUpdateBugStatus, useGetContactMessages, useDeleteContactMessage, useUpdateContactMessageStatus } from "@/api/mutations";
import { usePendingTools, usePendingPrompts } from "@/hooks/useQueries";
import { useApp } from "@/contexts/AppContext";
import type { AITool, Prompt, Ad } from "@/data/tools";
import { handleImport, getImportHistory, clearAndReimport } from "@/api/importHandler";
import { seedPromptsDatabase } from "@/api/promptSeeder";

const emptyTool: AITool = {
  id: "", name: "", description: "", category: "chat", pricing: "Free",
  logo: "", url: "", featured: false, trending: false,
  features: [], easeOfUse: "Easy", mainFunctionality: "", freePlan: true, rating: 4.0, reviewCount: 0,
  tags: [], couponCode: "", isNew: false, isPremium: false, views: 0, clicks: 0,
};

type AdminTab = "approvals" | "tools" | "prompts" | "ads" | "users" | "settings" | "usecases" | "newsletter" | "bugs" | "adRequests" | "messages" | "imports";
type ToolView = "all" | "pending";

const Admin = () => {
  const { isAdminUser } = useApp();
  const [tab, setTab] = useState<AdminTab>("tools");
  const [showForm, setShowForm] = useState(false);
  const [showAdForm, setShowAdForm] = useState(false);
  const [editing, setEditing] = useState<AITool | null>(null);
  const [form, setForm] = useState<AITool>({ ...emptyTool });
  const [toolView, setToolView] = useState<ToolView>("all");
  const [featuresText, setFeaturesText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [adMediaUrl, setAdMediaUrl] = useState<string>("");
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [adFormData, setAdFormData] = useState({ title: "", description: "", url: "", placement: "featured" as Ad["placement"] });
  const [selectedPendingTool, setSelectedPendingTool] = useState<AITool | null>(null);
  const [selectedPendingPrompt, setSelectedPendingPrompt] = useState<Prompt | null>(null);
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [promptForm, setPromptForm] = useState<Partial<Prompt>>({});
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [promptFormData, setPromptFormData] = useState({
    title: "",
    prompt: "",
    category: "",
    author: "",
    instagram: "",
    suggestedToolId: "",
  });
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  
  // Settings state
  const [statsData, setStatsData] = useState({ total_tools: '100+', categories: '10+', update_freq: 'Daily', pricing: 'Free', maintenance_mode: 'false' as any });
  const [editingStats, setEditingStats] = useState(false);
  const [selectedFeaturedTools, setSelectedFeaturedTools] = useState<string[]>([]);
  const [selectedFeaturedPrompts, setSelectedFeaturedPrompts] = useState<string[]>([]);
  const [toolOfTheDayId, setToolOfTheDayId] = useState<string>("");
  const [promptOfTheDayId, setPromptOfTheDayId] = useState<string>("");
  const [editingCoupon, setEditingCoupon] = useState<{ toolId: string; code: string } | null>(null);
  const [newCouponData, setNewCouponData] = useState<{ toolId: string; code: string }>({ toolId: '', code: '' });
  
  // Use cases state
  const [editingUseCase, setEditingUseCase] = useState<any | null>(null);
  const [useCaseForm, setUseCaseForm] = useState({ key: '', label: '', icon: 'Zap', order_index: 0 });
  const [showUseCaseForm, setShowUseCaseForm] = useState(false);
  const [toolUseCases, setToolUseCases] = useState<string[]>([]);
  
  // Newsletter state
  const [newsletterFilterFreq, setNewsletterFilterFreq] = useState<"all" | "weekly" | "bi-weekly" | "monthly" | "inactive">("all");
  
  // Contact messages state
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [selectedContactMessage, setSelectedContactMessage] = useState<any | null>(null);

  // Import management state
  const [importHistory, setImportHistory] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string>("");
  
  // Prompt seeding state
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string>("");
  const [seedResult, setSeedResult] = useState<any>(null);

  // Fetch data from Supabase
  const { data: categories = [] } = useCategories();
  const { data: toolList = [] } = useTools() as any;
  const { data: promptList = [] } = usePrompts() as any;
  const { data: useCasesList = [] } = useUseCases();
  const { data: adList = [] } = useAds();
  const { data: userList = [] } = useUsers();
  const { data: pendingTools = [] } = usePendingTools();
  const { data: pendingPrompts = [] } = usePendingPrompts();
  const { data: settings = [] } = useSettings();
  const { data: newsletters = [] } = useNewsletterSubscriptions();

  // Debug logging
  useEffect(() => {
    console.log('📊 Admin Panel Data:');
    console.log('  - Approved Tools:', toolList.length);
    console.log('  - Pending Tools:', pendingTools.length, pendingTools);
    console.log('  - Approved Prompts:', promptList.length);
    console.log('  - Pending Prompts:', pendingPrompts.length);
  }, [toolList, pendingTools, promptList, pendingPrompts]);

  // Load import history when imports tab is opened
  useEffect(() => {
    if (tab === "imports") {
      const loadHistory = async () => {
        const history = await getImportHistory();
        setImportHistory(history);
      };
      loadHistory();
    }
  }, [tab]);

  // Mutation hooks
  const createToolMutation = useCreateTool();
  const updateToolMutation = useUpdateTool();
  const deleteToolMutation = useDeleteTool();
  const createPromptMutation = useCreatePrompt();
  const updatePromptMutation = useUpdatePrompt();
  const deletePromptMutation = useDeletePrompt();
  const createAdMutation = useCreateAd();
  const updateAdMutation = useUpdateAd();
  const deleteAdMutation = useDeleteAd();
  const approveToolMutation = useApproveToolMutation();
  const rejectToolMutation = useRejectToolMutation();
  const approvePromptMutation = useApprovePromptMutation();
  const rejectPromptMutation = useRejectPromptMutation();
  const updateSettingsMutation = useUpdateSettings();
  const updateToolCouponMutation = useUpdateToolCoupon();
  const createUseCaseMutation = useCreateUseCase();
  const updateUseCaseMutation = useUpdateUseCase();
  const deleteUseCaseMutation = useDeleteUseCase();
  const updateNewsletterFrequencyMutation = useUpdateNewsletterFrequency();
  const unsubscribeNewsletterMutation = useUnsubscribeNewsletter();
  const deleteNewsletterMutation = useDeleteNewsletterSubscription();
  const getContactMessagesMutation = useGetContactMessages();
  const deleteContactMessageMutation = useDeleteContactMessage();
  const updateContactMessageStatusMutation = useUpdateContactMessageStatus();

  if (!isAdminUser) return <Navigate to="/" />;

  const openAdd = () => {
    setForm({ ...emptyTool });
    setFeaturesText("");
    setTagsText("");
    setAdMediaUrl("");
    setToolUseCases([]);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (tool: AITool) => {
    setForm(tool);
    setFeaturesText(tool.features.join("\n"));
    setTagsText(tool.tags.join(","));
    setToolUseCases(tool.useCase || []);
    setEditing(tool);
    setShowForm(true);
  };

  const saveTool = async () => {
    if (!form.name.trim()) {
      alert('Please enter a tool name');
      return;
    }
    
    // Build tool object with all fields that exist in the database
    const toolData: Record<string, any> = {
      name: form.name,
      description: form.description,
      category: form.category,
      pricing: form.pricing,
      logo: form.logo,
      url: form.url,
      featured: form.featured,
      trending: form.trending,
      features: featuresText.split("\n").map(f => f.trim()).filter(Boolean),
      easeofuse: form.easeOfUse,
      mainfunctionality: form.mainFunctionality,
      freeplan: form.freePlan,
      rating: form.rating || 4.0,
      reviewcount: form.reviewCount || 0,
    };
    
    // Add optional fields with values
    if (form.isNew) toolData.isnew = form.isNew;
    if (form.isPremium) toolData.ispremium = form.isPremium;
    toolData.views = form.views || 0;
    toolData.clicks = form.clicks || 0;
    
    const tagsArray = tagsText.split(",").map(t => t.trim()).filter(Boolean);
    if (tagsArray.length > 0) toolData.tags = tagsArray;
    
    if (form.couponCode) toolData.couponcode = form.couponCode;
    
    // Add use cases
    if (toolUseCases.length > 0) toolData.usecase = toolUseCases;
    
    // Add status for admin creation
    if (!editing) {
      toolData.status = 'approved';
    }
    
    try {
      console.log('Saving tool:', toolData);
      if (editing) {
        await updateToolMutation.mutateAsync({ id: editing.id, ...toolData });
        alert('Tool updated successfully!');
      } else {
        await createToolMutation.mutateAsync(toolData);
        alert('Tool created successfully!');
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving tool:', error);
      alert(`Error saving tool: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  const deleteTool = async (id: string) => {
    try {
      await deleteToolMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };

  const savePrompt = async () => {
    if (!promptFormData.title.trim() || !promptFormData.prompt.trim() || !promptFormData.category) {
      alert('Please fill in required fields: title, prompt, and category');
      return;
    }

    if (!beforePreview || !afterPreview) {
      alert('Please upload both Before and After images');
      return;
    }

    try {
      console.log('📤 Creating prompt in admin:', { title: promptFormData.title, category: promptFormData.category });
      const promptData: Record<string, any> = {
        title: promptFormData.title,
        prompt: promptFormData.prompt,
        category: promptFormData.category,
        author: promptFormData.author || "Anonymous",
        instagram: promptFormData.instagram || "",
        beforeimage: beforePreview,
        afterimage: afterPreview,
        featured: false,
        suggestedtoolid: promptFormData.suggestedToolId || "",
        status: 'approved', // Admin-created prompts are auto-approved
      };

      await createPromptMutation.mutateAsync(promptData as any);
      alert('Prompt created successfully!');
      setShowPromptForm(false);
      setPromptFormData({ title: "", prompt: "", category: "", author: "", instagram: "", suggestedToolId: "" });
      setBeforePreview(null);
      setAfterPreview(null);
    } catch (error) {
      console.error('Error creating prompt:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  const handlePromptImageUpload = (setter: (v: string | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  
  const handleAdMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setAdMediaUrl(dataUrl);
        console.log('Media uploaded as data URL, size:', dataUrl.length);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFeatured = async (id: string) => {
    const tool = toolList.find(t => t.id === id);
    if (tool) {
      try {
        await updateToolMutation.mutateAsync({ id, featured: !tool.featured });
      } catch (error) {
        console.error('Error updating tool:', error);
      }
    }
  };

  // Prompt management
  const togglePromptFeatured = async (id: string) => {
    const prompt = promptList.find(p => p.id === id);
    if (prompt) {
      try {
        await updatePromptMutation.mutateAsync({ id, featured: !prompt.featured });
      } catch (error) {
        console.error('Error updating prompt:', error);
      }
    }
  };
  const deletePrompt = async (id: string) => {
    try {
      await deletePromptMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  const deleteAd = async (id: string) => {
    try {
      await deleteAdMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  };

  const openEditAd = (ad: Ad) => {
    setEditingAd(ad);
    setAdFormData({
      title: ad.name,
      description: ad.description,
      url: ad.url,
      placement: ad.placement,
    });
    setAdMediaUrl(ad.image || ad.video || "");
    setShowAdForm(true);
  };

  const saveAd = async (e: React.FormEvent, fd: FormData) => {
    e.preventDefault();
    if (!adMediaUrl) {
      alert('Please upload an image or video');
      return;
    }
    try {
      if (editingAd) {
        // Update existing ad
        await updateAdMutation.mutateAsync({
          ...editingAd,
          name: adFormData.title,
          description: adFormData.description,
          url: adFormData.url,
          placement: adFormData.placement,
          type: adMediaUrl.startsWith('data:video') ? "video" : "image",
          image: adMediaUrl.startsWith('data:video') ? undefined : adMediaUrl,
          video: adMediaUrl.startsWith('data:video') ? adMediaUrl : undefined,
        });
        alert('Ad updated successfully!');
      } else {
        // Create new ad
        await createAdMutation.mutateAsync({
          name: adFormData.title,
          description: adFormData.description,
          url: adFormData.url,
          type: adMediaUrl.startsWith('data:video') ? "video" : "image",
          placement: adFormData.placement,
          image: adMediaUrl.startsWith('data:video') ? undefined : adMediaUrl,
          video: adMediaUrl.startsWith('data:video') ? adMediaUrl : undefined,
        } as Omit<Ad, 'id'>);
        alert('Ad created successfully!');
      }
      setAdMediaUrl("");
      setAdFormData({ title: "", description: "", url: "", placement: "featured" });
      setEditingAd(null);
      setShowAdForm(false);
    } catch (error) {
      console.error('Error saving ad:', error);
      alert(`Error saving ad: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const approveTool = async (id: string) => {
    try {
      await approveToolMutation.mutateAsync(id);
      alert('Tool approved!');
    } catch (error) {
      console.error('Error approving tool:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const rejectTool = async (id: string) => {
    try {
      await rejectToolMutation.mutateAsync(id);
      alert('Tool rejected!');
    } catch (error) {
      console.error('Error rejecting tool:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const approveAllTools = async () => {
    if (pendingTools.length === 0) return;
    if (!confirm(`Approve all ${pendingTools.length} pending tools?`)) return;
    
    let approved = 0;
    for (const tool of pendingTools) {
      try {
        await approveToolMutation.mutateAsync(tool.id);
        approved++;
      } catch (error) {
        console.error(`Error approving tool ${tool.id}:`, error);
      }
    }
    alert(`${approved}/${pendingTools.length} tools approved!`);
  };

  const rejectAllTools = async () => {
    if (pendingTools.length === 0) return;
    if (!confirm(`Reject all ${pendingTools.length} pending tools?`)) return;
    
    let rejected = 0;
    for (const tool of pendingTools) {
      try {
        await rejectToolMutation.mutateAsync(tool.id);
        rejected++;
      } catch (error) {
        console.error(`Error rejecting tool ${tool.id}:`, error);
      }
    }
    alert(`${rejected}/${pendingTools.length} tools rejected!`);
  };

  const approvePrompt = async (id: string) => {
    try {
      await approvePromptMutation.mutateAsync(id);
      alert('Prompt approved!');
    } catch (error) {
      console.error('Error approving prompt:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const rejectPrompt = async (id: string) => {
    try {
      await rejectPromptMutation.mutateAsync(id);
      alert('Prompt rejected!');
    } catch (error) {
      console.error('Error rejecting prompt:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const approveAllPrompts = async () => {
    if (pendingPrompts.length === 0) return;
    if (!confirm(`Approve all ${pendingPrompts.length} pending prompts?`)) return;
    
    let approved = 0;
    for (const prompt of pendingPrompts) {
      try {
        await approvePromptMutation.mutateAsync(prompt.id);
        approved++;
      } catch (error) {
        console.error(`Error approving prompt ${prompt.id}:`, error);
      }
    }
    alert(`${approved}/${pendingPrompts.length} prompts approved!`);
  };

  const rejectAllPrompts = async () => {
    if (pendingPrompts.length === 0) return;
    if (!confirm(`Reject all ${pendingPrompts.length} pending prompts?`)) return;
    
    let rejected = 0;
    for (const prompt of pendingPrompts) {
      try {
        await rejectPromptMutation.mutateAsync(prompt.id);
        rejected++;
      } catch (error) {
        console.error(`Error rejecting prompt ${prompt.id}:`, error);
      }
    }
    alert(`${rejected}/${pendingPrompts.length} prompts rejected!`);
  };

  const savePromptChanges = async () => {
    if (!selectedPendingPrompt) return;
    
    try {
      // Only send fields that should be updated - use database column names (lowercase)
      const updatedPrompt = {
        id: selectedPendingPrompt.id,
        title: promptForm.title || selectedPendingPrompt.title,
        prompt: promptForm.prompt || selectedPendingPrompt.prompt,
        category: promptForm.category || selectedPendingPrompt.category,
        author: promptForm.author || selectedPendingPrompt.author,
        instagram: promptForm.instagram || selectedPendingPrompt.instagram,
        featured: promptForm.featured !== undefined ? promptForm.featured : selectedPendingPrompt.featured,
        suggestedtoolid: promptForm.suggestedToolId !== undefined ? promptForm.suggestedToolId : (selectedPendingPrompt.suggestedToolId || ''),
        beforeimage: selectedPendingPrompt.beforeImage,
        afterimage: selectedPendingPrompt.afterImage,
        status: selectedPendingPrompt.status,
      };
      
      console.log('📤 Updating prompt:', updatedPrompt);
      await updatePromptMutation.mutateAsync(updatedPrompt as any);
      alert('Prompt updated successfully!');
      setEditingPrompt(false);
      setSelectedPendingPrompt(selectedPendingPrompt);
      setPromptForm({});
    } catch (error) {
      console.error('Error updating prompt:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Settings management functions
  const saveHomepageStats = async () => {
    if (!statsData.total_tools.trim() || !statsData.categories.trim() || !statsData.update_freq.trim() || !statsData.pricing.trim()) {
      alert('All fields are required');
      return;
    }
    try {
      console.log('Saving homepage stats:', statsData);
      const settingsToUpdate = [
        { key: 'homepage_total_tools', value: statsData.total_tools },
        { key: 'homepage_categories', value: statsData.categories },
        { key: 'homepage_update_freq', value: statsData.update_freq },
        { key: 'homepage_pricing', value: statsData.pricing },
      ];
      
      // Add Tool of the Day and Prompt of the Day (including empty values to clear them)
      settingsToUpdate.push({ key: 'tool_of_the_day', value: toolOfTheDayId });
      settingsToUpdate.push({ key: 'prompt_of_the_day', value: promptOfTheDayId });
      
      const result = await updateSettingsMutation.mutateAsync(settingsToUpdate);
      console.log('Settings saved successfully:', result);
      alert('Homepage stats updated successfully!');
      setEditingStats(false);
    } catch (error) {
      console.error('Error updating stats:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Save Tool of the Day immediately when changed
  const saveToolOfDay = async (id: string) => {
    try {
      setToolOfTheDayId(id);
      console.log('Saving Tool of the Day:', id);
      await updateSettingsMutation.mutateAsync([{ key: 'tool_of_the_day', value: id }]);
      console.log('Tool of the Day saved successfully');
    } catch (error) {
      console.error('Error saving Tool of the Day:', error);
    }
  };

  // Save Prompt of the Day immediately when changed
  const savePromptOfDay = async (id: string) => {
    try {
      setPromptOfTheDayId(id);
      console.log('Saving Prompt of the Day:', id);
      await updateSettingsMutation.mutateAsync([{ key: 'prompt_of_the_day', value: id }]);
      console.log('Prompt of the Day saved successfully');
    } catch (error) {
      console.error('Error saving Prompt of the Day:', error);
    }
  };

  const saveToolCoupon = async (toolId: string, couponCode: string) => {
    if (!couponCode.trim()) {
      alert('Please enter a coupon code');
      return;
    }
    try {
      await updateToolCouponMutation.mutateAsync({ id: toolId, couponCode });
      alert('Coupon saved successfully!');
      setEditingCoupon(null);
      setNewCouponData({ toolId: '', code: '' });
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Initialize stats from settings
  useEffect(() => {
    if (settings.length > 0) {
      const settingMap = new Map(settings.map((s: any) => [s.key, s.value]));
      setStatsData({
        total_tools: settingMap.get('homepage_total_tools') || '100+',
        categories: settingMap.get('homepage_categories') || '10+',
        update_freq: settingMap.get('homepage_update_freq') || 'Daily',
        pricing: settingMap.get('homepage_pricing') || 'Free',
        maintenance_mode: settingMap.get('maintenance_mode') || 'false',
      });
      setToolOfTheDayId(settingMap.get('tool_of_the_day') || "");
      setPromptOfTheDayId(settingMap.get('prompt_of_the_day') || "");
    }
  }, [settings]);

  const inputClass = "px-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border/60 focus:border-accent/40";
  const tabClass = (t: AdminTab) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`;

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Admin Dashboard</h1>
            <p className="mt-2 text-body text-muted-foreground">Manage tools, prompts, ads, users, and settings.</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 flex-wrap">
          <button onClick={() => setTab("approvals")} className={tabClass("approvals")}>
            Approvals {pendingTools.length + pendingPrompts.length > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold">{pendingTools.length + pendingPrompts.length}</span>}
          </button>
          <button onClick={() => setTab("tools")} className={tabClass("tools")}>Tools</button>
          <button onClick={() => setTab("prompts")} className={tabClass("prompts")}>Prompts</button>
          <button onClick={() => setTab("ads")} className={tabClass("ads")}>Ads</button>
          <button onClick={() => setTab("users")} className={tabClass("users")}>Users</button>
          <button onClick={() => setTab("settings")} className={tabClass("settings")}>Settings</button>
          <button onClick={() => setTab("usecases")} className={tabClass("usecases")}>Use Cases</button>
          <button onClick={() => setTab("newsletter")} className={tabClass("newsletter")}>Newsletter</button>
          <button onClick={() => setTab("bugs")} className={tabClass("bugs")}>Bug Reports</button>
          <button onClick={() => setTab("adRequests")} className={tabClass("adRequests")}>Ad Requests</button>
          <button onClick={() => setTab("messages")} className={tabClass("messages")}>Contact Messages</button>
          <button onClick={() => setTab("imports")} className={tabClass("imports")}>
            <Download className="w-4 h-4 inline mr-2" />
            Data Import
          </button>
        </div>

        {/* APPROVALS TAB */}
        {tab === "approvals" && (
          <>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Pending Submissions</h2>
                {(pendingTools.length > 0 || pendingPrompts.length > 0) && (
                  <div className="flex gap-2">
                    <button
                      onClick={approveAllTools}
                      disabled={pendingTools.length === 0}
                      className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-700 text-sm font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" /> Approve All Tools
                    </button>
                    <button
                      onClick={rejectAllTools}
                      disabled={pendingTools.length === 0}
                      className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" /> Reject All Tools
                    </button>
                    <button
                      onClick={approveAllPrompts}
                      disabled={pendingPrompts.length === 0}
                      className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-700 text-sm font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" /> Approve All Prompts
                    </button>
                    <button
                      onClick={rejectAllPrompts}
                      disabled={pendingPrompts.length === 0}
                      className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" /> Reject All Prompts
                    </button>
                  </div>
                )}
              </div>
              
              {pendingTools.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-foreground mb-4">Tools ({pendingTools.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingTools.map((tool) => (
                      <div 
                        key={tool.id} 
                        onClick={() => setSelectedPendingTool(tool)}
                        className="bg-card rounded-2xl border border-border/60 shadow-card p-5 cursor-pointer hover:border-accent/40 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="h-10 w-10 rounded-lg bg-secondary p-1 border border-border/30 overflow-hidden shrink-0">
                              <img src={tool.logo} alt="" className="h-full w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{tool.name}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{tool.category}</p>
                            </div>
                          </div>
                          <div className="bg-yellow-500/10 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-lg">Pending</div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{tool.description}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); approveTool(tool.id); }}
                            className="flex-1 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-700 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); rejectTool(tool.id); }}
                            className="flex-1 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pendingPrompts.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Prompts ({pendingPrompts.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingPrompts.map((prompt) => (
                      <div key={prompt.id} onClick={() => setSelectedPendingPrompt(prompt)} className="bg-card rounded-2xl border border-border/60 shadow-card p-5 cursor-pointer hover:shadow-lg hover:border-accent/40 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{prompt.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">by {prompt.author || "Anonymous"} • {prompt.category}</p>
                          </div>
                          <div className="bg-yellow-500/10 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-lg">Pending</div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{prompt.prompt}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              approvePrompt(prompt.id);
                            }}
                            className="flex-1 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-700 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              rejectPrompt(prompt.id);
                            }}
                            className="flex-1 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pendingTools.length === 0 && pendingPrompts.length === 0 && (
                <div className="text-center py-12 bg-card rounded-2xl border border-border/60">
                  <p className="text-muted-foreground">No pending submissions</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* TOOLS TAB */}
        {tab === "tools" && (
          <>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-2">
                <button onClick={() => setToolView("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${toolView === "all" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                  All ({toolList.length})
                </button>
                <button onClick={() => setToolView("pending")} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${toolView === "pending" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                  Pending (0)
                </button>
              </div>
              <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Plus className="h-4 w-4" strokeWidth={1.5} /> Add Tool
              </button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-6 bg-card rounded-2xl border border-border/60 shadow-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">{editing ? "Edit Tool" : "Add New Tool"}</h2>
                    <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Tool name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                    <input placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputClass} />
                    <input placeholder="Logo URL" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className={inputClass} />
                    <input placeholder="Main functionality" value={form.mainFunctionality} onChange={(e) => setForm({ ...form, mainFunctionality: e.target.value })} className={inputClass} />
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={form.pricing} onChange={(e) => setForm({ ...form, pricing: e.target.value as AITool["pricing"] })} className={inputClass}>
                      <option value="Free">Free</option><option value="Freemium">Freemium</option><option value="Paid">Paid</option>
                    </select>
                    <select value={form.easeOfUse} onChange={(e) => setForm({ ...form, easeOfUse: e.target.value as AITool["easeOfUse"] })} className={inputClass}>
                      <option value="Easy">Easy</option><option value="Moderate">Moderate</option><option value="Advanced">Advanced</option>
                    </select>
                    <input placeholder="Coupon code" value={form.couponCode || ""} onChange={(e) => setForm({ ...form, couponCode: e.target.value })} className={inputClass} />
                    <input placeholder="Rating (0-5)" type="number" min="0" max="5" step="0.1" value={form.rating || 4.0} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 4.0 })} className={inputClass} />
                    <input placeholder="Review count" type="number" min="0" value={form.reviewCount || 0} onChange={(e) => setForm({ ...form, reviewCount: parseInt(e.target.value) || 0 })} className={inputClass} />
                    <input placeholder="Views" type="number" min="0" value={form.views || 0} onChange={(e) => setForm({ ...form, views: parseInt(e.target.value) || 0 })} className={inputClass} />
                    <input placeholder="Clicks" type="number" min="0" value={form.clicks || 0} onChange={(e) => setForm({ ...form, clicks: parseInt(e.target.value) || 0 })} className={inputClass} />
                    <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`md:col-span-2 ${inputClass} min-h-[80px] resize-none`} />
                    <textarea placeholder="Features (one per line)" value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} className={`${inputClass} min-h-[80px] resize-none`} />
                    <textarea placeholder="Tags (comma separated)" value={tagsText} onChange={(e) => setTagsText(e.target.value)} className={`${inputClass} min-h-[80px] resize-none`} />
                  </div>
                  <div className="mt-4 flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" /> Featured</label>
                    <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} className="rounded" /> Trending</label>
                    <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.isNew || false} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="rounded" /> New</label>
                    <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.freePlan} onChange={(e) => setForm({ ...form, freePlan: e.target.checked })} className="rounded" /> Free Plan</label>
                  </div>
                  
                  {/* Use Cases Section */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-foreground mb-2">Add to Use Cases:</p>
                    <div className="flex gap-2 flex-wrap">
                      {useCasesList && useCasesList.length > 0 ? (
                        useCasesList.map((uc: any) => (
                          <label key={uc.id} className="flex items-center gap-2 text-sm text-foreground">
                            <input 
                              type="checkbox" 
                              checked={toolUseCases.includes(uc.key)} 
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setToolUseCases([...toolUseCases, uc.key]);
                                } else {
                                  setToolUseCases(toolUseCases.filter(k => k !== uc.key));
                                }
                              }}
                              className="rounded" 
                            /> 
                            {uc.label}
                          </label>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">No use cases found</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl bg-secondary text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                    <button onClick={saveTool} className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">{editing ? "Save Changes" : "Add Tool"}</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 bg-card rounded-2xl border border-border/60 shadow-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-ui-label text-muted-foreground">Tool</th>
                    <th className="text-left p-4 text-ui-label text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="text-left p-4 text-ui-label text-muted-foreground hidden md:table-cell">Pricing</th>
                    <th className="text-left p-4 text-ui-label text-muted-foreground hidden sm:table-cell">Featured</th>
                    <th className="text-right p-4 text-ui-label text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {toolList.map((tool) => (
                    <tr key={tool.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-secondary p-1 border border-border/30 overflow-hidden">
                            <img src={tool.logo} alt="" className="h-full w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          </div>
                          <span className="text-sm font-medium text-foreground">{tool.name}</span>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{tool.category}</span></td>
                      <td className="p-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{tool.pricing}</span></td>
                      <td className="p-4 hidden sm:table-cell">
                        <button onClick={() => toggleFeatured(tool.id)}>
                          <Star className={`h-4 w-4 ${tool.featured ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} strokeWidth={1.5} />
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(tool)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Pencil className="h-4 w-4" strokeWidth={1.5} /></button>
                          <button onClick={() => deleteTool(tool.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" strokeWidth={1.5} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* PROMPTS TAB */}
        {tab === "prompts" && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{promptList.filter(p => p.status === 'approved').length} approved prompts</p>
              <button onClick={() => setShowPromptForm(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Plus className="h-4 w-4" /> Submit Prompt
              </button>
            </div>

            {/* PROMPT FORM */}
            <AnimatePresence>
              {showPromptForm && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 bg-card rounded-2xl border border-border/60 shadow-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">Create New Prompt</h2>
                    <button onClick={() => { setShowPromptForm(false); setPromptFormData({ title: "", prompt: "", category: "", author: "", instagram: "", suggestedToolId: "" }); setBeforePreview(null); setAfterPreview(null); }} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="space-y-4">
                    <input placeholder="Prompt title *" value={promptFormData.title} onChange={(e) => setPromptFormData({ ...promptFormData, title: e.target.value })} className={inputClass} />
                    <textarea placeholder="Your prompt text... *" rows={4} value={promptFormData.prompt} onChange={(e) => setPromptFormData({ ...promptFormData, prompt: e.target.value })} className={`${inputClass} min-h-[120px] py-3 resize-none`} />
                    <select value={promptFormData.category} onChange={(e) => setPromptFormData({ ...promptFormData, category: e.target.value })} className={inputClass}>
                      <option value="">Select category *</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <select value={promptFormData.suggestedToolId} onChange={(e) => setPromptFormData({ ...promptFormData, suggestedToolId: e.target.value })} className={inputClass}>
                      <option value="">Select suggested tool (optional)</option>
                      {toolList.map((t: any) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Before Image *</label>
                        <label className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary border border-border/60 border-dashed cursor-pointer hover:bg-secondary/80 transition-colors">
                          {beforePreview ? (
                            <img src={beforePreview} alt="Before" className="h-20 w-full object-cover rounded-lg" />
                          ) : (
                            <><Upload className="h-5 w-5 text-muted-foreground" /><span className="text-[11px] text-muted-foreground">Upload</span></>
                          )}
                          <input type="file" accept="image/*" onChange={handlePromptImageUpload(setBeforePreview)} className="hidden" />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">After Image *</label>
                        <label className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary border border-border/60 border-dashed cursor-pointer hover:bg-secondary/80 transition-colors">
                          {afterPreview ? (
                            <img src={afterPreview} alt="After" className="h-20 w-full object-cover rounded-lg" />
                          ) : (
                            <><Upload className="h-5 w-5 text-muted-foreground" /><span className="text-[11px] text-muted-foreground">Upload</span></>
                          )}
                          <input type="file" accept="image/*" onChange={handlePromptImageUpload(setAfterPreview)} className="hidden" />
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Author name" value={promptFormData.author} onChange={(e) => setPromptFormData({ ...promptFormData, author: e.target.value })} className={inputClass} />
                      <input placeholder="Instagram handle" value={promptFormData.instagram} onChange={(e) => setPromptFormData({ ...promptFormData, instagram: e.target.value })} className={inputClass} />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={() => { setShowPromptForm(false); setPromptFormData({ title: "", prompt: "", category: "", author: "", instagram: "", suggestedToolId: "" }); setBeforePreview(null); setAfterPreview(null); }} className="flex-1 h-11 rounded-xl bg-secondary text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                      <button onClick={savePrompt} className="flex-1 h-11 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Create Prompt</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-card rounded-2xl border border-border/60 shadow-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-ui-label text-muted-foreground">Title</th>
                    <th className="text-left p-4 text-ui-label text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="text-left p-4 text-ui-label text-muted-foreground hidden md:table-cell">Author</th>
                    <th className="text-left p-4 text-ui-label text-muted-foreground hidden sm:table-cell">Featured</th>
                    <th className="text-right p-4 text-ui-label text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promptList.filter(p => p.status === 'approved').map((p) => (
                    <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="p-4"><span className="text-sm font-medium text-foreground cursor-pointer hover:text-accent" onClick={() => setSelectedPendingPrompt(p)}>{p.title}</span></td>
                      <td className="p-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{p.category}</span></td>
                      <td className="p-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{p.author}</span></td>
                      <td className="p-4 hidden sm:table-cell">
                        <button onClick={() => togglePromptFeatured(p.id)}>
                          <Star className={`h-4 w-4 ${p.featured ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} strokeWidth={1.5} />
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setSelectedPendingPrompt(p)} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-muted-foreground hover:text-blue-600 transition-colors" title="View Full">
                            <Eye className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                          <button onClick={() => deletePrompt(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADS TAB */}
        {tab === "ads" && (
          <div className="mt-6">
            <div className="flex justify-end mb-4">
              <button onClick={() => { setEditingAd(null); setAdFormData({ title: "", description: "", url: "", placement: "featured" }); setAdMediaUrl(""); setShowAdForm(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Megaphone className="h-4 w-4" /> Create Ad
              </button>
            </div>

            <AnimatePresence>
              {showAdForm && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 bg-card rounded-2xl border border-border/60 shadow-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">{editingAd ? "Edit Ad" : "Create Ad"}</h2>
                    <button onClick={() => { setShowAdForm(false); setEditingAd(null); }} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
                  </div>
                  <form onSubmit={(e) => saveAd(e, new FormData(e.currentTarget))} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        placeholder="Ad title" 
                        value={adFormData.title}
                        onChange={(e) => setAdFormData({...adFormData, title: e.target.value})}
                        required 
                        className={inputClass} 
                      />
                      <input 
                        placeholder="Redirect URL" 
                        type="url" 
                        value={adFormData.url}
                        onChange={(e) => setAdFormData({...adFormData, url: e.target.value})}
                        required 
                        className={inputClass} 
                      />
                    </div>
                    <textarea 
                      placeholder="Description" 
                      value={adFormData.description}
                      onChange={(e) => setAdFormData({...adFormData, description: e.target.value})}
                      className={`${inputClass} w-full min-h-[60px] resize-none`} 
                    />
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Media Upload</label>
                      <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary border border-border/60 cursor-pointer hover:bg-secondary/80 transition-colors text-sm text-muted-foreground w-fit">
                        <Upload className="h-4 w-4" /> {adMediaUrl ? "Change media" : "Upload image/video"}
                        <input type="file" accept="image/*,video/*" onChange={handleAdMediaUpload} className="hidden" />
                      </label>
                      {adMediaUrl && <p className="text-xs text-muted-foreground mt-2">✓ Media uploaded</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <select 
                        value={adFormData.placement}
                        onChange={(e) => setAdFormData({...adFormData, placement: e.target.value as Ad["placement"]})}
                        className={inputClass}
                      >
                        <option value="featured">Homepage</option>
                        <option value="grid">Tools Page</option>
                      </select>
                      <select className={inputClass}>
                        <option value="top">Top</option>
                        <option value="middle">Middle</option>
                        <option value="grid">Grid (card-style)</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-foreground">
                      <input type="checkbox" defaultChecked className="rounded" /> Active
                    </label>
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={() => { setShowAdForm(false); setEditingAd(null); }} className="px-5 py-2.5 rounded-xl bg-secondary text-sm font-medium text-muted-foreground">Cancel</button>
                      <button type="submit" className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">{editingAd ? "Save Ad" : "Create Ad"}</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adList.map((ad) => (
                <div key={ad.id} className="bg-card rounded-2xl border border-border/60 shadow-card p-5">
                  {ad.image && <img src={ad.image} alt={ad.name} className="w-full h-32 object-cover rounded-xl mb-3" />}
                  <h3 className="text-sm font-semibold text-foreground">{ad.name}</h3>
                  <p className="text-[13px] text-muted-foreground mt-1">{ad.description}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-2">Placement: {ad.placement} • Type: {ad.type}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => openEditAd(ad)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => deleteAd(ad.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === "users" && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{userList.length} registered users</p>
            </div>
            <div className="bg-card rounded-2xl border border-border/60 shadow-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-ui-label text-muted-foreground">User</th>
                    <th className="text-left p-4 text-ui-label text-muted-foreground hidden md:table-cell">Email</th>
                    <th className="text-left p-4 text-ui-label text-muted-foreground hidden sm:table-cell">Contributions</th>
                    <th className="text-left p-4 text-ui-label text-muted-foreground hidden md:table-cell">Joined</th>
                    <th className="text-right p-4 text-ui-label text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.length > 0 ? userList.map((u: any) => (
                    <tr key={u.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">
                            {u.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                          </div>
                          <span className="text-sm font-medium text-foreground">{u.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{u.email || "N/A"}</span></td>
                      <td className="p-4 hidden sm:table-cell"><span className="text-sm text-muted-foreground">{u.contributions || 0}</span></td>
                      <td className="p-4 hidden md:table-cell"><span className="text-sm text-muted-foreground">{u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : "N/A"}</span></td>
                      <td className="p-4 text-right">
                        <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Eye className="h-4 w-4" strokeWidth={1.5} /></button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div className="mt-6 space-y-6">
            {/* Maintenance Mode */}
            <div className="bg-card rounded-2xl border border-border/60 shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Maintenance Mode</h3>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 border border-border/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Enable Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground mt-1">Show maintenance page to visitors during updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={statsData.maintenance_mode === 'true' || statsData.maintenance_mode === true}
                      onChange={(e) => {
                        const value = e.target.checked ? 'true' : 'false';
                        setStatsData({...statsData, maintenance_mode: value as any});
                        updateSettingsMutation.mutateAsync([{ key: 'maintenance_mode', value }]).catch(err => console.error('Error toggling maintenance mode:', err));
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Homepage Stats */}
            <div className="bg-card rounded-2xl border border-border/60 shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Homepage Stats</h3>
                <button onClick={() => setEditingStats(!editingStats)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-secondary">
                  <p className="text-ui-label text-muted-foreground mb-1">Total Tools</p>
                  <input 
                    value={statsData.total_tools} 
                    onChange={(e) => setStatsData({...statsData, total_tools: e.target.value})}
                    disabled={!editingStats}
                    className={`w-full bg-transparent text-sm font-semibold text-foreground outline-none ${editingStats ? 'bg-secondary border border-accent/40 px-2 py-1 rounded' : ''}`}
                  />
                </div>
                <div className="p-3 rounded-xl bg-secondary">
                  <p className="text-ui-label text-muted-foreground mb-1">Categories</p>
                  <input 
                    value={statsData.categories} 
                    onChange={(e) => setStatsData({...statsData, categories: e.target.value})}
                    disabled={!editingStats}
                    className={`w-full bg-transparent text-sm font-semibold text-foreground outline-none ${editingStats ? 'bg-secondary border border-accent/40 px-2 py-1 rounded' : ''}`}
                  />
                </div>
                <div className="p-3 rounded-xl bg-secondary">
                  <p className="text-ui-label text-muted-foreground mb-1">Update Freq</p>
                  <input 
                    value={statsData.update_freq} 
                    onChange={(e) => setStatsData({...statsData, update_freq: e.target.value})}
                    disabled={!editingStats}
                    className={`w-full bg-transparent text-sm font-semibold text-foreground outline-none ${editingStats ? 'bg-secondary border border-accent/40 px-2 py-1 rounded' : ''}`}
                  />
                </div>
                <div className="p-3 rounded-xl bg-secondary">
                  <p className="text-ui-label text-muted-foreground mb-1">Pricing</p>
                  <input 
                    value={statsData.pricing} 
                    onChange={(e) => setStatsData({...statsData, pricing: e.target.value})}
                    disabled={!editingStats}
                    className={`w-full bg-transparent text-sm font-semibold text-foreground outline-none ${editingStats ? 'bg-secondary border border-accent/40 px-2 py-1 rounded' : ''}`}
                  />
                </div>
              </div>
              {editingStats && (
                <div className="mt-4 flex gap-2">
                  <button onClick={saveHomepageStats} className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90">Save</button>
                  <button onClick={() => setEditingStats(false)} className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm font-medium">Cancel</button>
                </div>
              )}
            </div>

            {/* Featured Tools Section */}
            <div className="bg-card rounded-2xl border border-border/60 shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Featured Tools</h3>
                {toolList.filter(t => t.featured).length > 0 && (
                  <button 
                    onClick={() => {
                      toolList.filter(t => t.featured).forEach(t => toggleFeatured(t.id));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 text-xs font-medium transition-colors"
                  >
                    Remove All
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {toolList.filter(t => t.featured).length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {toolList.filter(t => t.featured).map(t => (
                      <span key={t.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium">
                        {t.name}
                        <button onClick={() => toggleFeatured(t.id)} className="text-accent-foreground hover:opacity-80">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">No featured tools selected</p>
                )}
                <div className="flex gap-2">
                  <select 
                    onChange={(e) => {
                      if (e.target.value && !toolList.find(t => t.id === e.target.value)?.featured) {
                        toggleFeatured(e.target.value);
                      }
                      e.target.value = '';
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border/60 outline-none focus:border-accent/40"
                  >
                    <option value="">Add featured tool...</option>
                    {toolList.filter(t => !t.featured).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Featured Prompts Section */}
            <div className="bg-card rounded-2xl border border-border/60 shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Featured Prompts</h3>
              </div>
              <div className="space-y-3">
                {promptList.filter(p => p.featured).length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {promptList.filter(p => p.featured).map(p => (
                      <span key={p.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium">
                        {p.title}
                        <button onClick={() => togglePromptFeatured(p.id)} className="text-accent-foreground hover:opacity-80">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">No featured prompts selected</p>
                )}
                <div className="flex gap-2">
                  <select 
                    onChange={(e) => {
                      if (e.target.value && !promptList.find(p => p.id === e.target.value)?.featured) {
                        togglePromptFeatured(e.target.value);
                      }
                      e.target.value = '';
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border/60 outline-none focus:border-accent/40"
                  >
                    <option value="">Add featured prompt...</option>
                    {promptList.filter(p => !p.featured).map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tool of the Day Section */}
            <div className="bg-card rounded-2xl border border-border/60 shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Tool of the Day</h3>
              </div>
              <div className="space-y-3">
                {toolOfTheDayId && toolList.find(t => t.id === toolOfTheDayId) && (
                  <div className="p-3 rounded-xl bg-secondary border border-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-background p-1 border border-border/30 overflow-hidden">
                        <img src={toolList.find(t => t.id === toolOfTheDayId)?.logo} alt="" className="h-full w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{toolList.find(t => t.id === toolOfTheDayId)?.name}</span>
                    </div>
                    <button onClick={() => saveToolOfDay("")} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {!toolOfTheDayId && <p className="text-sm text-muted-foreground mb-2">No tool selected</p>}
                <select 
                  value={toolOfTheDayId}
                  onChange={(e) => saveToolOfDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border/60 outline-none focus:border-accent/40"
                >
                  <option value="">Select tool of the day...</option>
                  {toolList.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prompt of the Day Section */}
            <div className="bg-card rounded-2xl border border-border/60 shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Prompt of the Day</h3>
              </div>
              <div className="space-y-3">
                {promptOfTheDayId && promptList.find(p => p.id === promptOfTheDayId) && (
                  <div className="p-3 rounded-xl bg-secondary border border-border/40 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{promptList.find(p => p.id === promptOfTheDayId)?.title}</span>
                    <button onClick={() => savePromptOfDay("")} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {!promptOfTheDayId && <p className="text-sm text-muted-foreground mb-2">No prompt selected</p>}
                <select 
                  value={promptOfTheDayId}
                  onChange={(e) => savePromptOfDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground border border-border/60 outline-none focus:border-accent/40"
                >
                  <option value="">Select prompt of the day...</option>
                  {promptList.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Coupons Section */}
            <div className="bg-card rounded-2xl border border-border/60 shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Coupons</h3>
              </div>
              <div className="space-y-3">
                {/* Existing Coupons */}
                {toolList.filter(t => t.couponCode).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border/40">
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.name}</p>
                      <code className="text-xs text-accent font-mono mt-1">{t.couponCode}</code>
                    </div>
                    <button onClick={() => setEditingCoupon({ toolId: t.id, code: t.couponCode || '' })} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-accent transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {/* Add New Coupon */}
                <div className="p-3 rounded-xl bg-secondary border-2 border-dashed border-border/40">
                  <div className="flex gap-2">
                    <select 
                      value={newCouponData.toolId} 
                      onChange={(e) => setNewCouponData({...newCouponData, toolId: e.target.value})}
                      className="flex-1 px-3 py-2 rounded-lg bg-background text-sm text-foreground border border-border/60 outline-none focus:border-accent/40"
                    >
                      <option value="">Select tool...</option>
                      {toolList.filter(t => !t.couponCode).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <input 
                      type="text"
                      placeholder="Enter coupon code"
                      value={newCouponData.code}
                      onChange={(e) => setNewCouponData({...newCouponData, code: e.target.value})}
                      className="flex-1 px-3 py-2 rounded-lg bg-background text-sm text-foreground border border-border/60 outline-none focus:border-accent/40"
                    />
                    <button 
                      onClick={() => {
                        if (newCouponData.toolId && newCouponData.code) {
                          saveToolCoupon(newCouponData.toolId, newCouponData.code);
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USE CASES TAB */}
        {tab === "usecases" && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Manage Use Cases</h2>
              <button 
                onClick={() => {
                  setShowUseCaseForm(true);
                  setEditingUseCase(null);
                  setUseCaseForm({ key: '', label: '', icon: 'Zap', order_index: 0 });
                }}
                className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Use Case
              </button>
            </div>

            {/* Use Cases List */}
            <div className="grid gap-4">
              {useCasesList && useCasesList.length > 0 ? (
                useCasesList.map((useCase: any) => (
                  <div key={useCase.id} className="p-4 rounded-xl bg-secondary border border-border/40">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Zap className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{useCase.label}</p>
                          <p className="text-xs text-muted-foreground">Key: {useCase.key}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingUseCase(useCase);
                            setUseCaseForm({ key: useCase.key, label: useCase.label, icon: useCase.icon, order_index: useCase.order_index });
                            setShowUseCaseForm(true);
                          }}
                          className="p-2 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteUseCaseMutation.mutate(useCase.id)}
                          className="p-2 rounded-lg hover:bg-background text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Tool Selector for Use Case */}
                    <div className="mt-4 pt-4 border-t border-border/40">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium text-muted-foreground">TOOLS FOR THIS USE CASE</p>
                      </div>
                      <select 
                        onChange={(e) => {
                          if (e.target.value) {
                            const selectedTool = toolList?.find(t => t.id === e.target.value);
                            if (selectedTool) {
                              // Add useCase ID to tool's useCase array if not already there
                              const updatedUseCases = selectedTool.useCase || [];
                              if (!updatedUseCases.includes(useCase.id)) {
                                updatedUseCases.push(useCase.id);
                                // Update the tool with the new useCase array
                                updateToolMutation.mutate({
                                  id: selectedTool.id,
                                  useCase: updatedUseCases
                                });
                              }
                            }
                            e.target.value = '';
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-background text-sm text-foreground border border-border/60 outline-none focus:border-accent/40"
                      >
                        <option value="">+ Add tool to this use case...</option>
                        {toolList && toolList.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      
                      {/* Display tools associated with this use case */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {toolList && toolList
                          .filter(t => t.useCase && t.useCase.includes(useCase.id))
                          .map(t => (
                            <div key={t.id} className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium flex items-center gap-2">
                              {t.name}
                              <button
                                onClick={() => {
                                  const updatedUseCases = t.useCase?.filter(uc => uc !== useCase.id) || [];
                                  updateToolMutation.mutate({
                                    id: t.id,
                                    useCase: updatedUseCases
                                  });
                                }}
                                className="hover:opacity-70"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No use cases found</p>
              )}
            </div>

            {/* Add/Edit Form */}
            {showUseCaseForm && (
              <div className="mt-6 p-4 rounded-xl bg-secondary border border-border/40">
                <h3 className="font-semibold text-foreground mb-4">{editingUseCase ? 'Edit Use Case' : 'Add New Use Case'}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <input 
                    type="text"
                    placeholder="Key (e.g., students)"
                    value={useCaseForm.key}
                    onChange={(e) => setUseCaseForm({...useCaseForm, key: e.target.value})}
                    className="px-3 py-2 rounded-lg bg-background text-sm text-foreground border border-border/60 outline-none focus:border-accent/40"
                  />
                  <input 
                    type="text"
                    placeholder="Label (e.g., For Students)"
                    value={useCaseForm.label}
                    onChange={(e) => setUseCaseForm({...useCaseForm, label: e.target.value})}
                    className="px-3 py-2 rounded-lg bg-background text-sm text-foreground border border-border/60 outline-none focus:border-accent/40"
                  />
                  <input 
                    type="number"
                    placeholder="Order"
                    value={useCaseForm.order_index}
                    onChange={(e) => setUseCaseForm({...useCaseForm, order_index: parseInt(e.target.value)})}
                    className="px-3 py-2 rounded-lg bg-background text-sm text-foreground border border-border/60 outline-none focus:border-accent/40"
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => {
                      if (editingUseCase) {
                        updateUseCaseMutation.mutate({ id: editingUseCase.id, ...useCaseForm });
                      } else {
                        createUseCaseMutation.mutate(useCaseForm);
                      }
                      setShowUseCaseForm(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90"
                  >
                    {editingUseCase ? 'Update' : 'Add'} Use Case
                  </button>
                  <button 
                    onClick={() => setShowUseCaseForm(false)}
                    className="px-4 py-2 rounded-lg bg-background text-foreground text-sm font-medium border border-border/60"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* NEWSLETTER TAB */}
        {tab === "newsletter" && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Newsletter Subscriptions</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage email subscribers and their preferences</p>
              </div>
              <div className="text-sm text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg">
                {newsletters.length} subscribers
              </div>
            </div>

            {/* Filter */}
            <div className="mb-6 flex gap-2 flex-wrap">
              {(['all', 'weekly', 'bi-weekly', 'monthly', 'inactive'] as const).map(freq => (
                <button
                  key={freq}
                  onClick={() => setNewsletterFilterFreq(freq)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    newsletterFilterFreq === freq
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-foreground hover:bg-background'
                  }`}
                >
                  {freq === 'all' ? 'All' : freq === 'inactive' ? 'Inactive' : freq.charAt(0).toUpperCase() + freq.slice(1)}
                </button>
              ))}
            </div>

            {/* Subscribers Table */}
            <div className="overflow-x-auto rounded-lg border border-border/40">
              <table className="w-full text-sm">
                <thead className="bg-secondary border-b border-border/40">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-foreground">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">Frequency</th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">Subscribed</th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">Last Email</th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletters
                    .filter(sub => 
                      newsletterFilterFreq === 'all' 
                        ? true 
                        : newsletterFilterFreq === 'inactive' 
                          ? !sub.is_active 
                          : sub.frequency === newsletterFilterFreq && sub.is_active
                    )
                    .map(sub => (
                      <tr key={sub.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 text-foreground">{sub.email}</td>
                        <td className="px-4 py-3">
                          <select 
                            value={sub.frequency}
                            onChange={(e) => updateNewsletterFrequencyMutation.mutate({ email: sub.email, frequency: e.target.value })}
                            className="px-2 py-1 rounded bg-background text-sm text-foreground border border-border/40 outline-none focus:border-accent/40 cursor-pointer"
                          >
                            <option value="weekly">Weekly</option>
                            <option value="bi-weekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="never">Never</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {new Date(sub.subscribed_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {sub.last_email_sent ? new Date(sub.last_email_sent).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            sub.is_active 
                              ? 'bg-green-500/10 text-green-700' 
                              : 'bg-red-500/10 text-red-700'
                          }`}>
                            <div className={`h-2 w-2 rounded-full ${sub.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                            {sub.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            {sub.is_active ? (
                              <button 
                                onClick={() => {
                                  if (confirm(`Unsubscribe ${sub.email}?`)) {
                                    unsubscribeNewsletterMutation.mutate(sub.email);
                                  }
                                }}
                                className="p-2 rounded-lg hover:bg-background text-muted-foreground hover:text-destructive transition-colors"
                                title="Unsubscribe"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => {
                                  if (confirm(`Delete ${sub.email}? This cannot be undone.`)) {
                                    deleteNewsletterMutation.mutate(sub.email);
                                  }
                                }}
                                className="p-2 rounded-lg hover:bg-background text-muted-foreground hover:text-destructive transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {newsletters.filter(sub => 
              newsletterFilterFreq === 'all' 
                ? true 
                : newsletterFilterFreq === 'inactive' 
                  ? !sub.is_active 
                  : sub.frequency === newsletterFilterFreq && sub.is_active
            ).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No subscribers found</p>
              </div>
            )}

            {/* Stats */}
            <div className="mt-8 grid grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-secondary border border-border/40">
                <p className="text-xs text-muted-foreground mb-1">Total Subscribers</p>
                <p className="text-2xl font-bold text-foreground">{newsletters.filter(s => s.is_active).length}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary border border-border/40">
                <p className="text-xs text-muted-foreground mb-1">Weekly</p>
                <p className="text-2xl font-bold text-foreground">{newsletters.filter(s => s.is_active && s.frequency === 'weekly').length}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary border border-border/40">
                <p className="text-xs text-muted-foreground mb-1">Bi-weekly</p>
                <p className="text-2xl font-bold text-foreground">{newsletters.filter(s => s.is_active && s.frequency === 'bi-weekly').length}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary border border-border/40">
                <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                <p className="text-2xl font-bold text-foreground">{newsletters.filter(s => s.is_active && s.frequency === 'monthly').length}</p>
              </div>
            </div>
          </div>
        )}

        {/* BUG REPORTS TAB */}
        {tab === "bugs" && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
                  <Bug className="h-6 w-6 text-destructive" />
                  Bug Reports
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Manage user-reported bugs</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border/40">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Page/Feature</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Severity</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* TODO: Fetch and display bug reports */}
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      Bug reports will appear here
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AD REQUESTS TAB */}
        {tab === "adRequests" && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
                  <Megaphone className="h-6 w-6 text-accent" />
                  Advertisement Requests
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Manage ad and sponsorship requests</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border/40">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Business</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Website</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Budget</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Contact Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* TODO: Fetch and display ad requests */}
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      Ad requests will appear here
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTACT MESSAGES TAB */}
        {tab === "messages" && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
                  <Mail className="h-6 w-6 text-blue-500" />
                  Contact Messages
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Manage inquiries from users</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const result = await getContactMessagesMutation.mutateAsync();
                    setContactMessages(result || []);
                    console.log('✅ Loaded contact messages:', result);
                  } catch (err) {
                    console.error('❌ Error fetching contact messages:', err);
                  }
                }}
                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
              >
                Refresh Messages
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border/40">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMessages.length > 0 ? (
                    contactMessages.map((msg: any) => (
                      <tr key={msg.id} className="border-b border-border/30 hover:bg-secondary/50 transition-colors">
                        <td className="px-6 py-3 text-sm">{msg.name}</td>
                        <td className="px-6 py-3 text-sm">{msg.email}</td>
                        <td className="px-6 py-3 text-sm">{msg.subject}</td>
                        <td className="px-6 py-3 text-sm text-muted-foreground">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <select
                            value={msg.status || 'new'}
                            disabled={updateContactMessageStatusMutation.isPending}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              console.log('🔄 Changing status to:', newStatus);
                              try {
                                await updateContactMessageStatusMutation.mutateAsync(
                                  { id: msg.id, status: newStatus }
                                );
                                console.log('✅ Status changed successfully');
                                setContactMessages(
                                  contactMessages.map((m: any) =>
                                    m.id === msg.id ? { ...m, status: newStatus } : m
                                  )
                                );
                              } catch (error) {
                                console.error('❌ Status change failed:', error);
                                alert('Failed to update status. Please try again.');
                              }
                            }}
                            className="px-2 py-1 rounded border border-border bg-background text-foreground text-sm disabled:opacity-50"
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="responded">Responded</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-3 text-sm flex items-center gap-2">
                          <button
                            onClick={() => setSelectedContactMessage(msg)}
                            className="p-1 hover:bg-blue-500/10 rounded text-blue-500 transition-colors"
                            title="View full message"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              deleteContactMessageMutation.mutate(msg.id, {
                                onSuccess: () => {
                                  setContactMessages(contactMessages.filter((m: any) => m.id !== msg.id));
                                }
                              });
                            }}
                            className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"
                            title="Delete message"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        No contact messages yet. Click "Refresh Messages" to load them.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL FOR PENDING TOOLS */}
      <AnimatePresence>
        {selectedPendingTool && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setSelectedPendingTool(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card p-8 shadow-xl"
            >
              <button onClick={() => setSelectedPendingTool(null)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {selectedPendingTool.logo && (
                      <img src={selectedPendingTool.logo} alt="" className="h-16 w-16 rounded-lg object-cover border border-border/30" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-foreground">{selectedPendingTool.name}</h2>
                      <p className="text-muted-foreground mt-1">{selectedPendingTool.category} • {selectedPendingTool.pricing}</p>
                      <a href={selectedPendingTool.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm mt-2 inline-block">{selectedPendingTool.url}</a>
                    </div>
                    <div className="bg-yellow-500/10 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-lg">Pending Review</div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Pricing Model</p>
                    <p className="font-semibold text-foreground">{selectedPendingTool.pricing}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Free Plan</p>
                    <p className="font-semibold text-foreground">{selectedPendingTool.freePlan ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Ease of Use</p>
                    <p className="font-semibold text-foreground">{selectedPendingTool.easeOfUse}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Trending</p>
                    <p className="font-semibold text-foreground">{selectedPendingTool.trending ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedPendingTool.description}</p>
                </div>

                {/* Features */}
                {selectedPendingTool.features && selectedPendingTool.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPendingTool.features.map((f, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-secondary text-sm text-foreground">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedPendingTool.tags && selectedPendingTool.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPendingTool.tags.map((t, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-accent/10 text-xs text-accent">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coupon Code */}
                {selectedPendingTool.couponCode && (
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-xs text-muted-foreground mb-1">Coupon Code</p>
                    <code className="font-mono text-sm text-emerald-600">{selectedPendingTool.couponCode}</code>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border/30">
                  <button
                    onClick={() => {
                      approveTool(selectedPendingTool.id);
                      setSelectedPendingTool(null);
                    }}
                    className="flex-1 px-4 py-3 rounded-lg bg-emerald-500/10 text-emerald-700 font-medium hover:bg-emerald-500/20 transition-colors"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => {
                      rejectTool(selectedPendingTool.id);
                      setSelectedPendingTool(null);
                    }}
                    className="flex-1 px-4 py-3 rounded-lg bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAIL MODAL FOR PENDING PROMPTS */}
      <AnimatePresence>
        {selectedPendingPrompt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => { setSelectedPendingPrompt(null); setEditingPrompt(false); setPromptForm({}); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card p-8 shadow-xl"
            >
              <div className="absolute top-4 right-4 flex gap-2">
                {editingPrompt && (
                  <button 
                    onClick={() => { setEditingPrompt(false); setPromptForm({}); }}
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                {!editingPrompt && (
                  <>
                    <button 
                      onClick={() => { setEditingPrompt(true); setPromptForm(selectedPendingPrompt); }}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button 
                      onClick={() => setSelectedPendingPrompt(null)}
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              <div className="space-y-6">
                {/* Header */}
                <div className="pr-24">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      {editingPrompt ? (
                        <>
                          <input
                            type="text"
                            placeholder="Prompt title"
                            value={promptForm.title || ''}
                            onChange={(e) => setPromptForm({...promptForm, title: e.target.value})}
                            className={inputClass}
                          />
                          <p className="text-muted-foreground mt-2">{promptForm.category} • by {promptForm.author || "Anonymous"}</p>
                        </>
                      ) : (
                        <>
                          <h2 className="text-2xl font-semibold text-foreground">{selectedPendingPrompt.title}</h2>
                          <p className="text-muted-foreground mt-1">{selectedPendingPrompt.category} • by {selectedPendingPrompt.author || "Anonymous"}</p>
                          {selectedPendingPrompt.instagram && (
                            <p className="text-accent hover:underline text-sm mt-2">@{selectedPendingPrompt.instagram}</p>
                          )}
                        </>
                      )}
                    </div>
                    <div className="bg-yellow-500/10 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-lg">Pending Review</div>
                  </div>
                </div>

                {/* Main Prompt */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Prompt</h3>
                  {editingPrompt ? (
                    <textarea
                      placeholder="Enter prompt text"
                      value={promptForm.prompt || ''}
                      onChange={(e) => setPromptForm({...promptForm, prompt: e.target.value})}
                      className={`${inputClass} h-32 resize-none`}
                    />
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-wrap">{selectedPendingPrompt.prompt}</p>
                  )}
                </div>

                {/* Before & After Images */}
                {!editingPrompt && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedPendingPrompt.beforeImage && (
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2">Before</h3>
                        <img src={selectedPendingPrompt.beforeImage} alt="Before" className="w-full rounded-lg border border-border/30 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    )}
                    {selectedPendingPrompt.afterImage && (
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2">After</h3>
                        <img src={selectedPendingPrompt.afterImage} alt="After" className="w-full rounded-lg border border-border/30 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    )}
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {editingPrompt ? (
                    <>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                        <input
                          type="text"
                          placeholder="Category"
                          value={promptForm.category || ''}
                          onChange={(e) => setPromptForm({...promptForm, category: e.target.value})}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Author</label>
                        <input
                          type="text"
                          placeholder="Author"
                          value={promptForm.author || ''}
                          onChange={(e) => setPromptForm({...promptForm, author: e.target.value})}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Instagram</label>
                        <input
                          type="text"
                          placeholder="@instagram"
                          value={promptForm.instagram || ''}
                          onChange={(e) => setPromptForm({...promptForm, instagram: e.target.value})}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Featured</label>
                        <select
                          value={promptForm.featured ? 'yes' : 'no'}
                          onChange={(e) => setPromptForm({...promptForm, featured: e.target.value === 'yes'})}
                          className={inputClass}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Suggested Tool</label>
                        <select
                          value={promptForm.suggestedToolId || ''}
                          onChange={(e) => setPromptForm({...promptForm, suggestedToolId: e.target.value})}
                          className={inputClass}
                        >
                          <option value="">None</option>
                          {toolList.map((t: any) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 rounded-xl bg-secondary/50">
                        <p className="text-xs text-muted-foreground mb-1">Category</p>
                        <p className="font-semibold text-foreground">{selectedPendingPrompt.category}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/50">
                        <p className="text-xs text-muted-foreground mb-1">Author</p>
                        <p className="font-semibold text-foreground">{selectedPendingPrompt.author || "Anonymous"}</p>
                      </div>
                      {selectedPendingPrompt.suggestedToolId && (
                        <div className="p-4 rounded-xl bg-secondary/50">
                          <p className="text-xs text-muted-foreground mb-1">Suggested Tool</p>
                          <p className="font-semibold text-foreground">{selectedPendingPrompt.suggestedTool || selectedPendingPrompt.suggestedToolId}</p>
                        </div>
                      )}
                      <div className="p-4 rounded-xl bg-secondary/50">
                        <p className="text-xs text-muted-foreground mb-1">Featured</p>
                        <p className="font-semibold text-foreground">{selectedPendingPrompt.featured ? 'Yes' : 'No'}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border/30">
                  {editingPrompt ? (
                    <>
                      <button
                        onClick={savePromptChanges}
                        className="flex-1 px-4 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-colors"
                      >
                        ✓ Save Changes
                      </button>
                      <button
                        onClick={() => { setEditingPrompt(false); setPromptForm({}); }}
                        className="flex-1 px-4 py-3 rounded-lg bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          approvePrompt(selectedPendingPrompt.id);
                          setSelectedPendingPrompt(null);
                        }}
                        className="flex-1 px-4 py-3 rounded-lg bg-emerald-500/10 text-emerald-700 font-medium hover:bg-emerald-500/20 transition-colors"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => {
                          rejectPrompt(selectedPendingPrompt.id);
                          setSelectedPendingPrompt(null);
                        }}
                        className="flex-1 px-4 py-3 rounded-lg bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors"
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COUPON EDIT MODAL */}
      <AnimatePresence>
        {editingCoupon && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setEditingCoupon(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm rounded-2xl border border-border/60 bg-card p-6 shadow-xl"
            >
              <button onClick={() => setEditingCoupon(null)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-lg font-semibold text-foreground mb-4">Edit Coupon</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Tool</label>
                  <p className="px-3 py-2 rounded-lg bg-secondary text-foreground text-sm">
                    {toolList.find(t => t.id === editingCoupon.toolId)?.name || 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Coupon Code</label>
                  <input
                    type="text"
                    value={editingCoupon.code}
                    onChange={(e) => setEditingCoupon({...editingCoupon, code: e.target.value})}
                    placeholder="Enter coupon code"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => saveToolCoupon(editingCoupon.toolId, editingCoupon.code)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCoupon(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* CONTACT MESSAGE DETAIL MODAL */}
        {selectedContactMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setSelectedContactMessage(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card p-8 shadow-xl"
            >
              <button onClick={() => setSelectedContactMessage(null)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">Message Details</h2>
                  <p className="text-sm text-muted-foreground">From {new Date(selectedContactMessage.created_at).toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Name</label>
                    <p className="px-3 py-2 rounded-lg bg-secondary/50 text-foreground text-sm">{selectedContactMessage.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                    <a href={`mailto:${selectedContactMessage.email}`} className="px-3 py-2 rounded-lg bg-secondary/50 text-accent hover:text-accent/80 text-sm hover:underline">
                      {selectedContactMessage.email}
                    </a>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Subject</label>
                  <p className="px-3 py-2 rounded-lg bg-secondary/50 text-foreground text-sm">{selectedContactMessage.subject}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Message</label>
                  <p className="px-3 py-2 rounded-lg bg-secondary/50 text-foreground text-sm whitespace-pre-wrap">{selectedContactMessage.message}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Status</label>
                  <select
                    value={selectedContactMessage.status || 'new'}
                    disabled={updateContactMessageStatusMutation.isPending}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      console.log('🔄 Changing status to:', newStatus);
                      try {
                        await updateContactMessageStatusMutation.mutateAsync(
                          { id: selectedContactMessage.id, status: newStatus }
                        );
                        console.log('✅ Status changed successfully');
                        setSelectedContactMessage({ ...selectedContactMessage, status: newStatus });
                        setContactMessages(
                          contactMessages.map((m: any) =>
                            m.id === selectedContactMessage.id ? { ...m, status: newStatus } : m
                          )
                        );
                      } catch (error) {
                        console.error('❌ Status change failed:', error);
                        alert('Failed to update status. Please try again.');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm disabled:opacity-50"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="responded">Responded</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={async () => {
                      try {
                        await deleteContactMessageMutation.mutateAsync(selectedContactMessage.id);
                        setContactMessages(contactMessages.filter((m: any) => m.id !== selectedContactMessage.id));
                        setSelectedContactMessage(null);
                      } catch (error) {
                        console.error('❌ Error deleting message:', error);
                        alert('Failed to delete message. Please try again.');
                      }
                    }}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors"
                  >
                    Delete Message
                  </button>
                  <button
                    onClick={() => setSelectedContactMessage(null)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* IMPORTS TAB */}
        {tab === "imports" && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Data Import Management</h2>
            
            {/* Import now section */}
            <div className="border border-border rounded-lg p-6 bg-card mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Run Import Now</h3>
              <p className="text-sm text-secondary-foreground mb-4">
                Click the button below to import AI tools from ProductHunt, GitHub, and HuggingFace. 
                This will aggregate tools from multiple sources and add them to the database.
              </p>
              <button
                onClick={async () => {
                  setIsImporting(true);
                  setImportMessage("Starting import process...");
                  try {
                    const result = await handleImport();
                    setImportMessage(`✅ ${result.message}`);
                    // Refresh import history
                    const history = await getImportHistory();
                    setImportHistory(history);
                  } catch (error) {
                    setImportMessage(`❌ Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  } finally {
                    setIsImporting(false);
                  }
                }}
                disabled={isImporting}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Start Import Process
                  </>
                )}
              </button>
              <button
                onClick={async () => {
                  if (!confirm('⚠️ This will DELETE all existing tools and reimport them fresh. Continue?')) {
                    return;
                  }
                  setIsImporting(true);
                  setImportMessage("Clearing all tools and reimporting...");
                  try {
                    const result = await clearAndReimport();
                    setImportMessage(`✅ ${result.message}`);
                    // Refresh import history
                    const history = await getImportHistory();
                    setImportHistory(history);
                  } catch (error) {
                    setImportMessage(`❌ Force reimport failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  } finally {
                    setIsImporting(false);
                  }
                }}
                disabled={isImporting}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    Force Reimport (Clear & Reset)
                  </>
                )}
              </button>
              {importMessage && (
                <div className="mt-4 p-4 rounded-lg bg-accent/10 text-accent text-sm">
                  {importMessage}
                </div>
              )}
            </div>

            {/* Seed Prompts section */}
            <div className="border border-border rounded-lg p-6 bg-card mb-6 mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Seed Prompts Database</h3>
              <p className="text-sm text-secondary-foreground mb-4">
                Click the button below to import pre-made AI prompts to your prompts library.
                This will add sample prompts from the database and set them to approved status.
              </p>
              <button
                onClick={async () => {
                  setIsSeeding(true);
                  setSeedMessage("Starting prompt seeding...");
                  try {
                    const result = await seedPromptsDatabase();
                    setSeedResult(result);
                    setSeedMessage(`✅ ${result.message}`);
                  } catch (error) {
                    setSeedMessage(`❌ Seeding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  } finally {
                    setIsSeeding(false);
                  }
                }}
                disabled={isSeeding}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {isSeeding ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Seeding...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Seed Prompts
                  </>
                )}
              </button>
              {seedMessage && (
                <div className="mt-4 p-4 rounded-lg bg-accent/10 text-accent text-sm">
                  {seedMessage}
                  {seedResult && (
                    <div className="mt-2 text-xs space-y-1">
                      <p>📊 Imported: {seedResult.imported}</p>
                      <p>⏭️ Skipped: {seedResult.skipped}</p>
                      {seedResult.errors && seedResult.errors.length > 0 && (
                        <p className="text-red-500">⚠️ Errors: {seedResult.errors.join(', ')}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Import history section */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Import History</h3>
              
              {importHistory.length === 0 ? (
                <p className="text-sm text-secondary-foreground">No imports yet. Run an import to see history.</p>
              ) : (
                <div className="space-y-4">
                  {importHistory.map((log, idx) => (
                    <div key={idx} className="border border-border/50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div>
                          <p className="text-xs text-secondary-foreground font-medium">Status</p>
                          <p className="text-sm font-semibold">
                            {log.status === 'success' ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <Check className="w-4 h-4" />
                                Success
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center gap-1">
                                <XCircle className="w-4 h-4" />
                                Failed
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-secondary-foreground font-medium">Imported</p>
                          <p className="text-sm font-semibold text-foreground">{log.imported_count}</p>
                        </div>
                        <div>
                          <p className="text-xs text-secondary-foreground font-medium">Processed</p>
                          <p className="text-sm font-semibold text-foreground">{log.total_processed}</p>
                        </div>
                        <div>
                          <p className="text-xs text-secondary-foreground font-medium">Duplicates</p>
                          <p className="text-sm font-semibold text-foreground">{log.duplicates_removed}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs text-secondary-foreground">
                          {new Date(log.created_at).toLocaleDateString()} at {new Date(log.created_at).toLocaleTimeString()}
                          {' • '}
                          Duration: {(log.duration_ms / 1000).toFixed(1)}s
                        </p>
                        {log.errors && log.errors.length > 0 && (
                          <p className="text-xs text-red-600 mt-2">
                            Errors: {log.errors.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Import sources info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-border rounded-lg p-4 bg-card/50">
                <h4 className="font-semibold text-foreground mb-2">ProductHunt</h4>
                <p className="text-sm text-secondary-foreground">Fetches trending and new AI tools daily from ProductHunt API</p>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card/50">
                <h4 className="font-semibold text-foreground mb-2">GitHub</h4>
                <p className="text-sm text-secondary-foreground">Aggregates curated tools from popular awesome-ai-tools repositories</p>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card/50">
                <h4 className="font-semibold text-foreground mb-2">HuggingFace</h4>
                <p className="text-sm text-secondary-foreground">Imports trending AI models and datasets with full metadata</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
