import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';


const supabaseUrl = 'https://nsaiwusvmsvfqeiesyfv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYWl3dXN2bXN2ZnFlaWVzeWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNTc3OTcsImV4cCI6MjA0ODgzMzc5N30.ZIocHudhi9HxmdT7ZhCVbUEjTqfkmzuB8oa0JGOVfjY';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);