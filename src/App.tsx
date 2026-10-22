import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles, 
  Trash2, 
  Edit3,
  X,
  ChevronRight,
  TrendingUp,
  Layers,
  Database
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  dueDate: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: 'active' | 'away' | 'busy';
  activeTasks: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team' | 'analytics' | 'settings'>('overview');
  
  // Persistent tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('new_titan_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      { id: 't-1', title: 'Optimize Quantum Core Telemetry', description: 'Refactor telemetry data ingestion pipeline for sub-millisecond latency.', status: 'in_progress', priority: 'high', assignee: 'Elena Vance', dueDate: '2026-10-28' },
      { id: 't-2', title: 'Orbital Docking Protocol Audit', description: 'Review security compliance and cryptographic keys for automated docking.', status: 'review', priority: 'urgent', assignee: 'Marcus Chen', dueDate: '2026-10-25' },
      { id: 't-3', title: 'Atmospheric Shield Calibration', description: 'Run stress simulations on magnetic barrier generator under peak radiation.', status: 'backlog', priority: 'medium', assignee: 'Sarah Jenkins', dueDate: '2026-11-02' },
      { id: 't-4', title: 'Autonomous Navigation Mesh v4', description: 'Deploy updated pathfinding weights to sector 7 reconnaissance drones.', status: 'completed', priority: 'high', assignee: 'Alex Mercer', dueDate: '2026-10-20' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('new_titan_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Team members state
  const [teamMembers] = useState<TeamMember[]>([
    { id: 'm-1', name: 'Elena Vance', role: 'Chief Systems Architect', department: 'Engineering', email: 'elena.v@titan.io', status: 'active', activeTasks: 3 },
    { id: 'm-2', name: 'Marcus Chen', role: 'Security Director', department: 'Operations', email: 'marcus.c@titan.io', status: 'busy', activeTasks: 2 },
    { id: 'm-3', name: 'Sarah Jenkins', role: 'Lead Propulsion Engineer', department: 'Research', email: 'sarah.j@titan.io', status: 'active', activeTasks: 4 },
    { id: 'm-4', name: 'Alex Mercer', role: 'AI Neural Specialist', department: 'Intelligence', email: 'alex.m@titan.io', status: 'away', activeTasks: 1 },
  ]);

  // Task filtering & creation modal state
  const [taskSearch, setTaskSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState(teamMembers[0].name);
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Editing task state
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? {
        ...t,
        title: newTaskTitle,
        description: newTaskDesc,
        priority: newTaskPriority,
        assignee: newTaskAssignee,
        dueDate: newTaskDueDate || t.dueDate
      } : t));
      setEditingTask(null);
    } else {
      const newTask: Task = {
        id: `t-${Date.now()}`,
        title: newTaskTitle,
        description: newTaskDesc,
        status: 'backlog',
        priority: newTaskPriority,
        assignee: newTaskAssignee,
        dueDate: newTaskDueDate || new Date().toISOString().split('T')[0]
      };
      setTasks([newTask, ...tasks]);
    }

    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsNewTaskModalOpen(false);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDesc(task.description);
    setNewTaskPriority(task.priority);
    setNewTaskAssignee(task.assignee);
    setNewTaskDueDate(task.dueDate);
    setIsNewTaskModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: Task['status']) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  // Filtered tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(taskSearch.toLowerCase()) || 
                          t.description.toLowerCase().includes(taskSearch.toLowerCase()) ||
                          t.assignee.toLowerCase().includes(taskSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Stats calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar Contract (Zone 1: Brand, Zone 2: Nav, Zone 3: Primary Action) */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
            N
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            New Titan
          </span>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'tasks' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'team' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            Team
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setEditingTask(null);
              setNewTaskTitle('');
              setNewTaskDesc('');
              setIsNewTaskModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </header>

      {/* Mobile Navigation bar for smaller viewports */}
      <div className="md:hidden flex items-center justify-around bg-slate-900 border-b border-slate-800 py-2 px-4">
        <button onClick={() => setActiveTab('overview')} className={`p-2 rounded-lg ${activeTab === 'overview' ? 'text-indigo-400 bg-slate-800' : 'text-slate-400'}`}>
          <LayoutDashboard className="w-5 h-5" />
        </button>
        <button onClick={() => setActiveTab('tasks')} className={`p-2 rounded-lg ${activeTab === 'tasks' ? 'text-indigo-400 bg-slate-800' : 'text-slate-400'}`}>
          <CheckSquare className="w-5 h-5" />
        </button>
        <button onClick={() => setActiveTab('team')} className={`p-2 rounded-lg ${activeTab === 'team' ? 'text-indigo-400 bg-slate-800' : 'text-slate-400'}`}>
          <Users className="w-5 h-5" />
        </button>
        <button onClick={() => setActiveTab('analytics')} className={`p-2 rounded-lg ${activeTab === 'analytics' ? 'text-indigo-400 bg-slate-800' : 'text-slate-400'}`}>
          <BarChart3 className="w-5 h-5" />
        </button>
        <button onClick={() => setActiveTab('settings')} className={`p-2 rounded-lg ${activeTab === 'settings' ? 'text-indigo-400 bg-slate-800' : 'text-slate-400'}`}>
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Banner / Welcome */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-slate-800 p-8 shadow-xl">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-400">
                  <span>Workspace Tier: Enterprise</span>
                  <span aria-hidden="true">·</span>
                  <span>Region: US-East-Primary</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Mission Control & Operations Dashboard
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Monitor active team projects, task throughput, and real-time telemetry across all operational clusters. All systems operating at nominal efficiency.
                </p>
              </div>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-4 text-slate-700 pointer-events-none">
                <Layers className="w-32 h-32 opacity-10 text-indigo-400" />
              </div>
            </div>

            {/* KPI Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-2">
                <span className="text-xs text-slate-400 font-medium">Total Tasks</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold tabular-nums text-white">{totalTasks}</span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" /> +12% this week
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-2">
                <span className="text-xs text-slate-400 font-medium">Completion Rate</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold tabular-nums text-white">{completionRate}%</span>
                  <span className="text-xs text-indigo-400 font-medium">
                    {completedTasks} of {totalTasks} finished
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-2">
                <span className="text-xs text-slate-400 font-medium">In Progress</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold tabular-nums text-white">{inProgressTasks}</span>
                  <span className="text-xs text-amber-400 font-medium">Active sprints</span>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-2">
                <span className="text-xs text-slate-400 font-medium">System Uptime</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold tabular-nums text-emerald-400">99.98%</span>
                  <span className="text-xs text-slate-400 font-medium">Stable</span>
                </div>
              </div>
            </div>

            {/* Recent Tasks & Quick Team Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Tasks Column */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white">Recent Operations</h2>
                  <button 
                    onClick={() => setActiveTab('tasks')} 
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                  >
                    View all tasks <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {tasks.slice(0, 4).map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800/50 rounded-xl hover:border-slate-700 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{task.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                            task.priority === 'urgent' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            task.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{task.assignee}</span>
                          <span aria-hidden="true">·</span>
                          <span>Due {task.dueDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                          task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                          task.status === 'in_progress' ? 'bg-indigo-500/10 text-indigo-400' :
                          task.status === 'review' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Status Column */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white">Active Personnel</h2>
                  <button 
                    onClick={() => setActiveTab('team')} 
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                  >
                    Directory <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {teamMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{member.name}</div>
                          <div className="text-xs text-slate-400">{member.role}</div>
                        </div>
                      </div>
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        member.status === 'active' ? 'bg-emerald-500' :
                        member.status === 'busy' ? 'bg-rose-500' : 'bg-amber-500'
                      }`} title={member.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tasks by title, description or assignee..."
                    value={taskSearch}
                    onChange={(e) => setTaskSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="backlog">Backlog</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Task List Table */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-medium">
                    <tr>
                      <th className="px-6 py-4">Task Name</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4">Assignee</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                          No tasks found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map(task => (
                        <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-white text-sm">{task.title}</div>
                            <div className="text-slate-400 text-xs mt-0.5 max-w-md truncate">{task.description}</div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                            >
                              <option value="backlog">Backlog</option>
                              <option value="in_progress">In Progress</option>
                              <option value="review">Review</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              task.priority === 'urgent' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                              task.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-300 font-medium">{task.assignee}</td>
                          <td className="px-6 py-4 text-slate-400 tabular-nums">{task.dueDate}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(task)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                title="Edit Task"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                                title="Delete Task"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === 'team' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Titan Personnel Directory</h2>
                <p className="text-sm text-slate-400">Engineering, operations and intelligence units deployed to this workspace.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map(member => (
                <div key={member.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      member.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                      member.status === 'busy' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {member.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="font-semibold text-white text-base">{member.name}</div>
                    <div className="text-xs text-indigo-400">{member.role}</div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Department</span>
                      <span className="text-slate-200 font-medium">{member.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Active Tasks</span>
                      <span className="text-slate-200 font-medium tabular-nums">{member.activeTasks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email</span>
                      <span className="text-slate-200 font-medium truncate max-w-[150px]">{member.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-white">System Analytics & Throughput</h2>
              <p className="text-sm text-slate-400">Telemetry and performance metrics across deployment clusters.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-6">
                <h3 className="text-base font-semibold text-white">Task Distribution by Status</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Completed', count: tasks.filter(t => t.status === 'completed').length, color: 'bg-emerald-500' },
                    { label: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length, color: 'bg-indigo-500' },
                    { label: 'Review', count: tasks.filter(t => t.status === 'review').length, color: 'bg-amber-500' },
                    { label: 'Backlog', count: tasks.filter(t => t.status === 'backlog').length, color: 'bg-slate-700' },
                  ].map(item => {
                    const pct = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;
                    return (
                      <div key={item.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium">{item.label}</span>
                          <span className="text-slate-400 tabular-nums">{item.count} tasks ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-6">
                <h3 className="text-base font-semibold text-white">Operational Telemetry</h3>
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800/50 rounded-xl">
                    <span className="text-slate-400">CPU Load Average</span>
                    <span className="font-mono text-emerald-400 tabular-nums">14.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800/50 rounded-xl">
                    <span className="text-slate-400">Memory Allocation</span>
                    <span className="font-mono text-indigo-400 tabular-nums">4.8 GB / 16 GB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800/50 rounded-xl">
                    <span className="text-slate-400">Network Latency</span>
                    <span className="font-mono text-emerald-400 tabular-nums">12 ms</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800/50 rounded-xl">
                    <span className="text-slate-400">Security Protocols</span>
                    <span className="font-mono text-emerald-400">AES-256 Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-white">Workspace Configuration</h2>
              <p className="text-sm text-slate-400">Manage environment variables, security keys, and workspace preferences.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-6 max-w-2xl">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Workspace Name</label>
                  <input
                    type="text"
                    defaultValue="New Titan Operations"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Default Region</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500">
                    <option>US East (Primary)</option>
                    <option>EU Central (Frankfurt)</option>
                    <option>AP Southeast (Singapore)</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-end">
                  <button
                    onClick={() => alert('Settings saved successfully!')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* New / Edit Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calibrate sensor array"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide brief operational details..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Assignee</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
