import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Spinner from './components/Spinner';
import Cart from './pages/Cart';
import Catalog from './pages/Catalog';
import Home from './pages/Home';
import InfoPage from './pages/InfoPage';
import NotFound from './pages/NotFound';
import ProductPage from './pages/ProductPage';

// O painel é carregado sob demanda: não pesa no carregamento do catálogo.
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const RequireAdmin = lazy(() => import('./components/admin/RequireAdmin'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Products = lazy(() => import('./pages/admin/Products'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const Brands = lazy(() => import('./pages/admin/Brands'));
const Banners = lazy(() => import('./pages/admin/Banners'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalog />} />
          <Route path="catalogo/:categoria" element={<Catalog />} />
          <Route path="produto/:slug" element={<ProductPage />} />
          <Route path="carrinho" element={<Cart />} />
          <Route path="sobre" element={<InfoPage kind="sobre" />} />
          <Route path="privacidade" element={<InfoPage kind="privacidade" />} />
          <Route path="condicoes-de-compra" element={<InfoPage kind="condicoes" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin/login" element={<Login />} />
        <Route path="admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<Dashboard />} />
          <Route path="produtos" element={<Products />} />
          <Route path="produtos/novo" element={<ProductForm />} />
          <Route path="produtos/:id" element={<ProductForm />} />
          <Route path="categorias" element={<Categories />} />
          <Route path="marcas" element={<Brands />} />
          <Route path="banners" element={<Banners />} />
          <Route path="pedidos" element={<Orders />} />
          <Route path="configuracoes" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
