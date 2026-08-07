import React, { useState } from 'react';
import { CheckSquare, Square, CheckCircle2, ClipboardCheck, ArrowRight } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const StaffTaskChecklist = () => {
  const { setCurrentView, setSelectedCategoryFilter } = useInventory();
  
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review urgent low-stock & reorder alerts', completed: false, tag: 'High Priority', actionView: 'inventory', filter: 'Low Stock' },
    { id: 2, text: 'Verify hardware serial numbers for recent intake', completed: true, tag: 'Audit' },
    { id: 3, text: 'Check out-of-stock items and update supplier status', completed: false, tag: 'Urgent', actionView: 'inventory', filter: 'Out of Stock' },
    { id: 4, text: 'Perform category balance audit for Networking & Telecom', completed: false, tag: 'Routine' },
    { id: 5, text: 'Log end-of-day stock count report', completed: false, tag: 'End of Day' },
  ]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <ClipboardCheck className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
              Daily Operational Tasks
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Daily staff checklist for inventory maintenance
            </p>
          </div>
        </div>
        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
          {completedCount}/{tasks.length} Done ({progressPercent}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2 pt-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              task.completed
                ? 'bg-slate-50/80 border-slate-200/60 text-slate-400'
                : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <button className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0">
                {task.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300" />
                )}
              </button>
              <span className={`text-xs font-semibold truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                {task.text}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                task.tag === 'High Priority' || task.tag === 'Urgent'
                  ? 'bg-rose-50 text-rose-700 border border-rose-100'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {task.tag}
              </span>

              {task.actionView && !task.completed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (task.filter) setSelectedCategoryFilter('All Categories');
                    setCurrentView(task.actionView);
                  }}
                  className="text-emerald-600 hover:text-emerald-800 text-[11px] font-bold flex items-center gap-0.5"
                >
                  Go <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
