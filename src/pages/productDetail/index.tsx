import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Producto } from '../../services/ecommerce/productos.services';
import { productosService } from '../../services/ecommerce/productos.services';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);
        if (id) {
          const productoData = await productosService.obtenerProductoPorId(parseInt(id));
          setProducto(productoData);
        }
      } catch (err) {
        console.error('Error al obtener el producto:', err);
        setError('No se pudo cargar el producto. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddCart = () => {
    if (producto) {
      console.log('Agregar al carrito:', producto);
      // Aquí iría la lógica para agregar al carrito
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Producto no encontrado'}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Volver a productos
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Botón de volver */}
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate('/')}>
        ← Volver a productos
      </button>

      {/* Detalle del producto */}
      <div className="row">
        {/* Imagen */}
        <div className="col-lg-6 mb-4">
          <div style={{ height: '500px', overflow: 'hidden', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            {!imageError && producto.imagen ? (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                style={{ height: '100%', objectFit: 'cover', width: '100%' }}
                onError={handleImageError}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                <span className="text-muted">Sin imagen disponible</span>
              </div>
            )}
          </div>
        </div>

        {/* Información del producto */}
        <div className="col-lg-6">
          <h1 className="mb-3">{producto.nombre}</h1>

          {/* Categoría */}
          <div className="mb-3">
            <span className="badge bg-info text-capitalize p-2">
              {producto.categoria || 'Sin categoría'}
            </span>
          </div>

          {/* Precio */}
          <div className="mb-4">
            <h2 className="text-primary">${producto.precio.toFixed(2)}</h2>
          </div>

          {/* Stock */}
          <div className="mb-4">
            <span className={`badge p-2 ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
              {producto.stock > 0 ? `${producto.stock} en stock` : 'Agotado'}
            </span>
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <h5>Descripción</h5>
            <p className="text-muted">{producto.descripcion}</p>
          </div>

          {/* Botones de acción */}
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddCart}
              disabled={producto.stock === 0}
            >
              {producto.stock > 0 ? 'Agregar al carrito' : 'Producto agotado'}
            </button>
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={() => navigate('/')}
            >
              Continuar comprando
            </button>
          </div>

          {/* Información adicional */}
          <div className="mt-5 pt-4 border-top">
            <h5>Información del producto</h5>
            <div className="table-responsive">
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <td className="fw-bold">ID del producto:</td>
                    <td>{producto.id}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Categoría:</td>
                    <td className="text-capitalize">{producto.categoria || 'No especificada'}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Precio:</td>
                    <td>${producto.precio.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Stock disponible:</td>
                    <td>{producto.stock}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
