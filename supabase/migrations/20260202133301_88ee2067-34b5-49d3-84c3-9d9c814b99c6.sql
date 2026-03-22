-- Create trains table for live train data
CREATE TABLE public.trains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  train_number TEXT NOT NULL,
  train_name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  current_location TEXT,
  last_station TEXT,
  next_station TEXT,
  scheduled_departure TIMESTAMP WITH TIME ZONE,
  actual_departure TIMESTAMP WITH TIME ZONE,
  scheduled_arrival TIMESTAMP WITH TIME ZONE,
  expected_arrival TIMESTAMP WITH TIME ZONE,
  delay_minutes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'on_time' CHECK (status IN ('on_time', 'delayed', 'cancelled', 'arrived', 'departed')),
  speed_kmh INTEGER,
  platform TEXT,
  zone TEXT,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table for disruption alerts
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  train_id UUID REFERENCES public.trains(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  alert_type TEXT NOT NULL,
  affected_routes TEXT[],
  is_active BOOLEAN DEFAULT true,
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'passengers', 'staff')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_ai_generated BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create ai_actions table for AI suggestions
CREATE TABLE public.ai_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type TEXT NOT NULL CHECK (action_type IN ('reroute', 'delay_notice', 'platform_change', 'cancellation', 'alternate_travel')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  train_id UUID REFERENCES public.trains(id) ON DELETE SET NULL,
  affected_trains TEXT[],
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  risk_score DECIMAL(3,2),
  weather_context JSONB,
  ai_reasoning TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'modified', 'dismissed')),
  modified_action TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create action_logs table for tracking all staff actions
CREATE TABLE public.action_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  ai_action_id UUID REFERENCES public.ai_actions(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weather_data table for caching weather info
CREATE TABLE public.weather_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  temperature DECIMAL(4,1),
  condition TEXT,
  visibility_km DECIMAL(4,1),
  wind_speed_kmh DECIMAL(4,1),
  humidity INTEGER,
  rain_probability INTEGER,
  fog_risk BOOLEAN DEFAULT false,
  flood_risk BOOLEAN DEFAULT false,
  raw_data JSONB,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(location)
);

-- Enable RLS on all tables
ALTER TABLE public.trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;

-- Public read access policies (passengers can view)
CREATE POLICY "Public can view trains" ON public.trains FOR SELECT USING (true);
CREATE POLICY "Public can view active alerts" ON public.alerts FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active announcements" ON public.announcements FOR SELECT USING (is_active = true AND (target_audience = 'all' OR target_audience = 'passengers'));
CREATE POLICY "Public can view approved actions" ON public.ai_actions FOR SELECT USING (status = 'approved');

-- Service role policies for edge functions to manage data
CREATE POLICY "Service role can manage trains" ON public.trains FOR ALL USING (true);
CREATE POLICY "Service role can manage alerts" ON public.alerts FOR ALL USING (true);
CREATE POLICY "Service role can manage announcements" ON public.announcements FOR ALL USING (true);
CREATE POLICY "Service role can manage ai_actions" ON public.ai_actions FOR ALL USING (true);
CREATE POLICY "Service role can manage action_logs" ON public.action_logs FOR ALL USING (true);
CREATE POLICY "Service role can manage weather_data" ON public.weather_data FOR ALL USING (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.trains;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_actions;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to trains table
CREATE TRIGGER update_trains_updated_at
  BEFORE UPDATE ON public.trains
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial train data
INSERT INTO public.trains (train_number, train_name, origin, destination, current_location, last_station, next_station, scheduled_departure, delay_minutes, status, speed_kmh, platform, zone, risk_level) VALUES
('12301', 'Rajdhani Express', 'New Delhi', 'Howrah', 'Near Kanpur', 'Kanpur Central', 'Allahabad Junction', now() - interval '2 hours', 15, 'delayed', 110, '1', 'Northern', 'medium'),
('12951', 'Mumbai Rajdhani', 'Mumbai Central', 'New Delhi', 'Near Vadodara', 'Vadodara Junction', 'Ratlam Junction', now() - interval '3 hours', 0, 'on_time', 130, '3', 'Western', 'low'),
('12259', 'Sealdah Duronto', 'Sealdah', 'New Delhi', 'Near Mughal Sarai', 'Mughal Sarai Junction', 'Allahabad Junction', now() - interval '4 hours', 45, 'delayed', 85, '2', 'Eastern', 'high'),
('12627', 'Karnataka Express', 'Bangalore', 'New Delhi', 'Near Bhopal', 'Bhopal Junction', 'Jhansi Junction', now() - interval '5 hours', 0, 'on_time', 95, '4', 'South Central', 'low'),
('12621', 'Tamil Nadu Express', 'Chennai Central', 'New Delhi', 'Near Nagpur', 'Nagpur Junction', 'Itarsi Junction', now() - interval '6 hours', 30, 'delayed', 75, '5', 'Southern', 'medium');

-- Insert initial alerts
INSERT INTO public.alerts (title, message, severity, alert_type, affected_routes, is_active) VALUES
('Fog Advisory - Northern Region', 'Dense fog expected in Delhi-Agra-Kanpur sector. Visibility below 50m. Trains may experience delays.', 'warning', 'weather', ARRAY['Delhi-Kanpur', 'Delhi-Agra'], true),
('Track Maintenance - Western Railway', 'Scheduled track maintenance between Vadodara and Surat from 02:00 to 06:00 IST.', 'info', 'maintenance', ARRAY['Mumbai-Ahmedabad'], true),
('Signal Failure - Howrah', 'Signal system under repair at Howrah Junction. Platform arrivals may be delayed by 15-20 minutes.', 'critical', 'technical', ARRAY['Howrah-bound trains'], true);

-- Insert initial AI suggestions
INSERT INTO public.ai_actions (action_type, title, description, priority, risk_score, ai_reasoning, status, affected_trains) VALUES
('reroute', 'Reroute via Alternate Track', 'Suggest rerouting Train 12259 Sealdah Duronto via alternate track to avoid signal failure zone at Howrah.', 'high', 0.85, 'Signal failure at Howrah Junction combined with fog conditions creates high delay risk. Alternate route via Barddhaman can save 25-30 minutes.', 'pending', ARRAY['12259']),
('delay_notice', 'Issue Delay Warning', 'Proactively notify passengers of Train 12301 Rajdhani about expected 30-minute delay due to fog.', 'medium', 0.65, 'Current 15-minute delay likely to increase to 30 minutes based on fog density forecast and historical patterns.', 'pending', ARRAY['12301']),
('platform_change', 'Platform Reassignment', 'Move Train 12627 Karnataka Express from Platform 4 to Platform 6 to optimize station flow.', 'low', 0.35, 'Platform 4 congestion expected due to maintenance work. Platform 6 provides better passenger flow.', 'pending', ARRAY['12627']);