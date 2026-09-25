import PedidoForm from '@/components/PedidoForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-red-50 via-white to-blue-50">
      <div className="mx-auto max-w-xl px-4 py-16">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-600">
            Cocina chilena
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Pedidos Exprés
          </h1>
          <p className="mt-3 text-slate-600">
            Ordena tus platillos chilenos favoritos y recíbelos recién preparados.
          </p>
        </header>

        <PedidoForm />

        <footer className="mt-10 text-center text-sm text-slate-400">
          Completo italiano, pastel de choclo, cazuela y mucho más.
        </footer>
      </div>
    </main>
  );
}
