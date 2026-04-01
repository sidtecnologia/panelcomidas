import { useEffect, useState, useRef } from 'react';
import { Search, Plus, Edit, Trash2, Box } from 'lucide-react';
import useProductos from '../../hooks/useProductos';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { CONFIG, formatCurrency } from '../../lib/config';

const ProductosTab = ({ api, token }) => {
  const { products, load, save, remove } = useProductos(api);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const fileInput = fileInputRef.current;
    const files = fileInput?.files && fileInput.files.length > 0 ? fileInput.files : null;

    const payload = {
      id: editing?.id,
      name: fd.get('name'),
      price: Number(fd.get('price')),
      stock: Number(fd.get('stock')),
      category: fd.get('category'),
      description: fd.get('description'),
      featured: !!fd.get('featured'),
      isOffer: !!fd.get('isOffer'),
      bestSeller: !!fd.get('bestSeller'),
      image: editing?.image
    };

    await save(payload, files, token);
    setModalOpen(false);
    setEditing(null);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 outline-none transition-all" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => { setEditing({ featured: false, isOffer: false, bestSeller: false, image: [] }); setModalOpen(true); }} className="aspect-square p-0 w-12 h-12">
          <Plus size={24} />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(p => (
          <Card key={p.id} className="p-3">
            <div className="flex gap-4 items-center">
              <img src={p.image?.[0] || CONFIG.DEFAULT_IMG} className="w-20 h-20 rounded-xl object-cover bg-slate-800 border border-slate-700" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate text-lg">{p.name}</h4>
                <p className="text-amber-500 font-bold">{formatCurrency(p.price)}</p>
                <div className="flex flex-col gap-1 mt-1 text-xs font-bold uppercase tracking-wider">
                  <span className="text-slate-500 truncate">{p.category}</span>
                  <div className="flex items-center gap-1">
                    <Box size={14} className={p.stock > 0 ? 'text-emerald-500' : 'text-red-500'} />
                    <span className={p.stock > 0 ? 'text-slate-400' : 'text-red-500'}>Stock: {p.stock}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => { setEditing(p); setModalOpen(true); }} className="p-3 bg-slate-800 rounded-xl text-amber-500 hover:bg-slate-700"><Edit size={20}/></button>
                <button onClick={() => remove(p.id)} className="p-3 bg-red-950 rounded-xl text-red-500 hover:bg-red-900"><Trash2 size={20}/></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <Modal title={editing?.id ? 'Editar Producto' : 'Nuevo Producto'} onClose={() => { setModalOpen(false); setEditing(null); }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" defaultValue={editing?.name} placeholder="Nombre del producto" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none"/>
            <input name="category" defaultValue={editing?.category} placeholder="Categoría" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none"/>
            <div className="grid grid-cols-2 gap-3">
              <input name="price" type="number" defaultValue={editing?.price} placeholder="Precio" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none"/>
              <input name="stock" type="number" defaultValue={editing?.stock} placeholder="Stock" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none"/>
            </div>
            <textarea name="description" defaultValue={editing?.description} placeholder="Descripción breve" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none h-24"/>
            
            <div className="grid grid-cols-1 gap-2 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="featured" defaultChecked={!!editing?.featured} className="w-5 h-5 rounded border-slate-800 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-950"/>
                <span className="text-sm font-bold text-slate-400 group-hover:text-white uppercase tracking-wider">Destacado</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isOffer" defaultChecked={!!editing?.isOffer} className="w-5 h-5 rounded border-slate-800 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-950"/>
                <span className="text-sm font-bold text-slate-400 group-hover:text-white uppercase tracking-wider">En Oferta</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="bestSeller" defaultChecked={!!editing?.bestSeller} className="w-5 h-5 rounded border-slate-800 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-950"/>
                <span className="text-sm font-bold text-slate-400 group-hover:text-white uppercase tracking-wider">Más Vendido</span>
              </label>
            </div>

            <div className="space-y-2 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subir Imágenes</label>
              <input ref={fileInputRef} type="file" name="imageFiles" multiple accept="image/*" className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-slate-800 file:text-amber-500 hover:file:bg-slate-700"/>
            </div>
            <Button type="submit" className="w-full py-4 mt-4 text-lg">Guardar Producto</Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ProductosTab;