'use client';

import { FormEvent, useState } from 'react';
import { CrearPedidoRequest, CrearPedidoResponse } from '@/types/pedido';

const PLATILLOS_CHILENOS = [
  'Completo italiano',
  'Churrasco italiano',
  'Barros luco',
  'Pastel de choclo',
  'Empanada de pino',
  'Cazuela de vacuno',
  'Chorrillana',
  'Humitas',
  'Porotos granados',
  'Mote con huesillo',
];

async function extraerMensajeError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(data.message)) {
      return data.message.join(', ');
    }
    if (typeof data.message === 'string') {
      return data.message;
    }
  } catch {
    // El cuerpo de la respuesta no es JSON; se usa el mensaje por defecto.
  }
  return `Error del servidor (${response.status})`;
}

export default function PedidoForm() {
  const [platillo, setPlatillo] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [pedido, setPedido] = useState<CrearPedidoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCargando(true);
    setError(null);
    setPedido(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || 'https://pedidos-back.onrender.com';
      const body: CrearPedidoRequest = { platillo, cantidad };
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(await extraerMensajeError(response));
      }

      const data = (await response.json()) as CrearPedidoResponse;
      setPedido(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el pedido.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="mt-10 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
      <div className="border-b border-slate-100 bg-red-50 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Nuevo pedido</h2>
        <p className="text-sm text-slate-500">
          Completa los datos y enviaremos tu orden a la cocina.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
        <div>
          <label htmlFor="platillo" className="block text-sm font-medium text-slate-700">
            Platillo
          </label>
          <input
            id="platillo"
            name="platillo"
            type="text"
            required
            list="platillos-chilenos"
            value={platillo}
            onChange={(event) => setPlatillo(event.target.value)}
            placeholder="Ej. Completo italiano"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <datalist id="platillos-chilenos">
            {PLATILLOS_CHILENOS.map((nombre) => (
              <option key={nombre} value={nombre} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="cantidad" className="block text-sm font-medium text-slate-700">
            Cantidad
          </label>
          <input
            id="cantidad"
            name="cantidad"
            type="number"
            required
            min={1}
            value={cantidad}
            onChange={(event) => setCantidad(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando ? 'Enviando...' : 'Enviar Pedido'}
        </button>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </p>
        )}

        {pedido && (
          <div className="rounded-lg bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200">
            <p className="text-sm font-semibold text-emerald-800">Pedido recibido con éxito</p>
            <p className="mt-1 text-sm text-emerald-700">
              ID del pedido: <span className="font-mono font-semibold">{pedido.id}</span>
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              {pedido.platillo} x{pedido.cantidad} — {pedido.estado}
            </p>
          </div>
        )}
      </form>
    </section>
  );
}
