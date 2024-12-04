import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { CommandEditor } from './components/admin/CommandEditor';
import { ThesisHeader } from './components/ThesisHeader';
import { ChapterList } from './components/ChapterList';
import { CommandInput } from './components/CommandInput';
import { CommandOutput } from './components/CommandOutput';
import { Sidebar } from './components/Sidebar';
import { LogOut, Loader2 } from 'lucide-react';

// Protected Route Component
function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(userRole || '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Main Dashboard Component
function Dashboard() {
  const { user, signOut, userRole } = useAuth();
  const [commandOutputs, setCommandOutputs] = React.useState<Array<{
    id: string;
    success: boolean;
    message: string;
  }>>([]);

  const handleCommandResult = (result: { success: boolean; message: string }) => {
    setCommandOutputs(prev => [...prev, { ...result, id: crypto.randomUUID() }]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Thesis Manager</h2>
              <button
                onClick={() => signOut()}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Sidebar onCommandSelect={() => {}} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Command Input Area */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <CommandInput onCommandResult={handleCommandResult} />
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <ThesisHeader metadata={null} />
              <CommandOutput outputs={commandOutputs} />
              <ChapterList
                chapters={[]}
                onEditChapter={() => {}}
                onDeleteChapter={() => {}}
                onReorderChapter={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginForm />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterForm />} />
      <Route
        path="/admin/commands"
        element={
          <ProtectedRoute roles={['admin']}>
            <CommandEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute roles={['admin', 'teacher', 'user']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Redirect any unknown routes */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}