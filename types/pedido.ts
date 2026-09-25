export interface CrearPedidoRequest {
  platillo: string;
  cantidad: number;
}

export interface CrearPedidoResponse {
  id: string;
  estado: 'RECIBIDO';
  platillo: string;
  cantidad: number;
}
