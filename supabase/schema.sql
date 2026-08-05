-- Schema for KarirKu (SMAN 1 BAROS)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE curriculum_mode AS ENUM ('mode_1_mapel_pilihan', 'mode_2_penjurusan');

-- Profiles Table (Extends Supabase Auth Users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role DEFAULT 'student'::user_role NOT NULL,
    full_name TEXT NOT NULL,
    class_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Quiz Questions Table
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    dimension TEXT NOT NULL, -- e.g., 'R', 'I', 'A', 'S', 'E', 'C', 'Numeric', 'Verbal', 'Logic'
    weight FLOAT DEFAULT 1.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for quiz_questions
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active questions" ON quiz_questions FOR SELECT USING (is_active = true);
CREATE POLICY "Teachers and admins can manage questions" ON quiz_questions FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- Quiz Attempts Table
CREATE TABLE quiz_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    semester TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for quiz_attempts
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view their own attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert their own attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Teachers and admins can view all attempts" ON quiz_attempts FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- Quiz Answers Table
CREATE TABLE quiz_answers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES quiz_questions(id),
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for quiz_answers
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can manage their own answers" ON quiz_answers FOR ALL USING (
    EXISTS (SELECT 1 FROM quiz_attempts WHERE quiz_attempts.id = quiz_answers.attempt_id AND quiz_attempts.student_id = auth.uid())
);
CREATE POLICY "Teachers and admins can view all answers" ON quiz_answers FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- Recommendation Results Table
CREATE TABLE recommendation_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    riasec_scores JSONB NOT NULL,
    ai_recommendation JSONB NOT NULL,
    raw_ai_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for recommendation_results
ALTER TABLE recommendation_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view their own results" ON recommendation_results FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert their own results" ON recommendation_results FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Teachers and admins can view all results" ON recommendation_results FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- Subject Mappings Table
CREATE TABLE subject_mappings (
    id SERIAL PRIMARY KEY,
    dimension_or_major TEXT NOT NULL,
    recommended_subjects JSONB NOT NULL,
    curriculum_mode curriculum_mode DEFAULT 'mode_1_mapel_pilihan'::curriculum_mode,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for subject_mappings
ALTER TABLE subject_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view subject mappings" ON subject_mappings FOR SELECT USING (true);
CREATE POLICY "Teachers and admins can manage mappings" ON subject_mappings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- CV Data Table
CREATE TABLE cv_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    personal_info JSONB,
    skills JSONB,
    experiences JSONB,
    certifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for cv_data
ALTER TABLE cv_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can manage their own CV" ON cv_data FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Teachers and admins can view all CVs" ON cv_data FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- Trigger for updated_at in cv_data
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cv_data_updated_at
BEFORE UPDATE ON cv_data
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- =====================================================================================
-- TRIGGER UNTUK OTOMATIS MEMBUAT PROFIL SAAT USER MENDAFTAR (WAJIB ADA)
-- =====================================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Siswa SMAN 1 BAROS'), 
    'student'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
