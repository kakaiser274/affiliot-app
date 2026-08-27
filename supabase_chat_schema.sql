-- 1. Create the Chat Sessions Table
CREATE TABLE public.ai_chat_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL DEFAULT 'New Chat',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Chat Messages Table
CREATE TABLE public.ai_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid REFERENCES public.ai_chat_sessions ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Sessions
CREATE POLICY "Users can view their own chat sessions" 
  ON public.ai_chat_sessions FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own chat sessions" 
  ON public.ai_chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" 
  ON public.ai_chat_sessions FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own chat sessions" 
  ON public.ai_chat_sessions FOR DELETE USING (auth.uid() = user_id);

-- 5. Create Policies for Messages
CREATE POLICY "Users can view their own messages" 
  ON public.ai_messages FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own messages" 
  ON public.ai_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
