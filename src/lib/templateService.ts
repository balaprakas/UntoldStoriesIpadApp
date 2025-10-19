import { supabase } from './supabase'

export const templateService = {
  // Get all active templates
  async getTemplates() {
    if (!supabase) return []
    
    const { data } = await supabase
      .from('story_templates')
      .select('*')
      .eq('is_active', true);
    return data;
  },

  // Get template by ID
  async getTemplate(id: string) {
    if (!supabase) return null
    
    const { data } = await supabase
      .from('story_templates')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  },

  // Create story from template
  async createStoryFromTemplate(templateId: string, userId: string) {
    if (!supabase) return null
    
    const template = await this.getTemplate(templateId);
    if (!template) return null

    const newStory = {
      id: crypto.randomUUID(),
      user_id: userId,
      title: 'Untitled Story',
      template_id: templateId,
      template_data: template.template_data, // Original template
      book_data: template.template_data, // User's copy (will be modified)
      created_at: new Date().toISOString(),
      last_modified_at: new Date().toISOString()
    };

    const { data } = await supabase
      .from('stories')
      .insert(newStory)
      .select()
      .single();

    return data;
  }
};
