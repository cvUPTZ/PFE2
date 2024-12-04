import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Terminal, Save } from 'lucide-react';

export function CommandEditor() {
  const { user, userRole } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [handler, setHandler] = useState('');

  if (userRole !== 'admin') {
    return (
      <div className="p-4 text-center text-red-600">
        Access denied. Admin privileges required.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from('custom_commands').insert({
        name,
        description,
        handler,
        created_by: user!.id
      });

      if (error) throw error;

      toast.success('Command created successfully!');
      setName('');
      setDescription('');
      setHandler('');
    } catch (error) {
      toast.error('Failed to create command');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Terminal className="h-6 w-6 text-blue-500" />
        <h2 className="text-2xl font-bold">Create Custom Command</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Command Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Handler Function
          </label>
          <textarea
            value={handler}
            onChange={(e) => setHandler(e.target.value)}
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
            placeholder="async (args) => {
  // Command implementation
  return { success: true, message: 'Command executed' };
}"
            required
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-4 w-4" />
          Save Command
        </button>
      </form>
    </div>
  );
}