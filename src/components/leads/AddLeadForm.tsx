import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/supabase/auth/auth-context';
import { useClientData } from '@/hooks/useClientData'; // Import the new hook
import { toast } from '@/components/ui/use-toast';
import { Lead } from '@/hooks/useLeads'; // Import the Lead type

// Define the form schema using Zod based on the Lead interface
const formSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required.' }),
  last_name: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }), // Basic validation
  notes: z.string().optional(),
  tags: z.string().optional(), // Input as comma-separated string, will be processed
});

type AddLeadFormValues = z.infer<typeof formSchema>;

interface AddLeadFormProps {
  onSuccess?: () => void; // Optional callback for successful submission
} // Added missing closing brace

export function AddLeadForm({ onSuccess }: AddLeadFormProps) {
  const { user } = useAuth();
  const { clientId, isLoading: isClientLoading, isError: isClientError } = useClientData(); // Use the hook
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed isLoading for clarity

  const form = useForm<AddLeadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      notes: '',
      tags: '',
    },
  });

  async function onSubmit(values: AddLeadFormValues) {
    if (!user || !clientId) {
      toast({
        title: 'Error',
        description: isClientError ? 'Could not load client information.' : 'You must be logged in and associated with a client to add a lead.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Process tags: split string by comma and trim whitespace
    const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    try {
      const { error } = await supabase.from('leads').insert([
        {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email || null, // Store null if empty
          phone: values.phone,
          notes: values.notes || '',
          tags: tagsArray,
          client_id: clientId, // Use the ID from the clients table
          // created_at, updated_at, id are handled by Supabase
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Lead added successfully.',
      });
      form.reset(); // Reset form fields
      onSuccess?.(); // Call the success callback if provided
    } catch (error: any) {
      console.error('Error adding lead:', error);
      toast({
        title: 'Error adding lead',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Disable form if client data is still loading or failed to load
  const formDisabled = isClientLoading || !clientId;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="tel" placeholder="555-123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="Interested, Follow-up" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Add any relevant notes here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={formDisabled || isSubmitting}>
          {isSubmitting ? 'Adding Lead...' : (formDisabled ? 'Loading Client...' : 'Add Lead')}
        </Button>
        {isClientError && <p className="text-sm text-red-500">Error loading client data. Cannot add lead.</p>}
      </form>
    </Form>
  );
}
