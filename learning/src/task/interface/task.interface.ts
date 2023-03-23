export interface Task {
  id?: string;
  name: string;
  completed?: boolean;
  description?: string;
  owner?: string;
  duration?: number;
}
