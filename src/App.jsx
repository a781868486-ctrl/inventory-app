import { useEffect, useState } from 'react'
import './App.css'

export default function App() {
  const [page, setPage] = useState('الرئيسية')
  const [products, setProducts] = useState(() => { try { return JSON.parse(localStorage.getItem('inventory_products') || '[]') } catch { return [] } })
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')
  const [sales, setSales] = useState(() => { try { return JSON.parse(localStorage.getItem('inventory_sales') || '[]') } catch { return [] } })

  useEffect(() => { localStorage.setItem('inventory_products', JSON.stringify(products)) }, [products]);
  useEffect(() => { localStorage.setItem('inventory_sales', JSON.stringify(sales)) }, [sales]);
  const total = sales.reduce((s, x) => s + x.price, 0)
  const money = n => n.toLocaleString('en-US') + ' ر.ي'

  function addProduct(e) {
    e.preventDefault()
    if (!name.trim() || Number(price) <= 0 || Number(qty) < 0) return
    setProducts([...products, {id: Date.now(), name: name.trim(), price: Number(price), qty: Number(qty)}])
    setName('')
    setPrice('')
    setQty('')
  }

  function sell(p) {
    if (p.qty < 1) return alert('الكمية غير متوفرة')
    setProducts(products.map(x => x.id === p.id ? {...x, qty: x.qty - 1} : x))
    setSales([...sales, {id: Date.now(), name: p.name, price: p.price}])
  }

  return <main className="app" dir="rtl">
    <header><span className="logo">📦</span><div><h1>إدارة المخزون</h1><p>المبيعات والمستودعات</p></div></header>
    <section className="stats">
      <article><small>عدد الأصناف</small><strong>{products.length}</strong></article>
      <article><small>وحدات المخزون</small><strong>{products.reduce((s,p)=>s+p.qty,0)}</strong></article>
      <article><small>إجمالي المبيعات</small><strong>{money(total)}</strong></article>
    </section>
    <nav>{['الرئيسية','المنتجات','البيع','التقارير'].map(x=><button key={x} className={page===x?'active':''} onClick={()=>setPage(x)}>{x}</button>)}</nav>
    {page==='الرئيسية' && <section className="panel"><h2>مرحبًا بك 👋</h2><p>ابدأ بإضافة المنتجات، ثم سجّل المبيعات وتابع المخزون.</p><button className="primary" onClick={()=>setPage('المنتجات')}>إضافة منتج</button></section>}
    {page==='المنتجات' && <section className="panel"><h2>إضافة منتج</h2><form onSubmit={addProduct}><label>اسم المنتج<input value={name} onChange={e=>setName(e.target.value)} required placeholder="اسم الصنف"/></label><label>سعر البيع بالريال اليمني<input type="number" min="0.01" step="any" value={price} onChange={e=>setPrice(e.target.value)} required/></label><label>الكمية<input type="number" min="0" step="1" value={qty} onChange={e=>setQty(e.target.value)} required/></label><button className="primary">حفظ المنتج</button></form><h2>قائمة المنتجات</h2>{products.length===0?<p>لم تضف منتجات بعد.</p>:products.map(p=><div className="item" key={p.id}><div><b>{p.name}</b><p>{money(p.price)} · الكمية: {p.qty}</p></div><button className="danger" onClick={()=>setProducts(products.filter(x=>x.id!==p.id))}>حذف</button></div>)}</section>}
    {page==='البيع' && <section className="panel"><h2>تسجيل البيع</h2>{products.length===0?<p>أضف منتجات أولًا.</p>:products.map(p=><div className="item" key={p.id}><div><b>{p.name}</b><p>المتوفر: {p.qty} · {money(p.price)}</p></div><button className="primary" onClick={()=>sell(p)}>بيع وحدة</button></div>)}</section>}
    {page==='التقارير' && <section className="panel"><h2>تقرير المبيعات</h2><p>عدد عمليات البيع: {sales.length}</p><p>إجمالي المبيعات: {money(total)}</p>{[...sales].reverse().map(s=><div className="item" key={s.id}><b>{s.name}</b><span>{money(s.price)}</span></div>)}</section>}
    <footer>إدارة المخزون · نسخة تجريبية</footer>
  </main>
}
