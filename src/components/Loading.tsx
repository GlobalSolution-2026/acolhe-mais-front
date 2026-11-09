export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 animate-fade-in">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-slate-500">
        Carregando informações...
      </p>
    </div>
  );
}