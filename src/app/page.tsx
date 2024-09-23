import TodoList from './components/TodoList'; 

export default function Home() {
  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        
        <TodoList />
      </div>
    </div>
  );
}

