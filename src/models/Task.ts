export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  assignee: string;
  created_at: Date;
  updated_at: Date;
}