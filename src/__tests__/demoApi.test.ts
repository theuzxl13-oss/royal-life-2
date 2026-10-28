import { beforeEach, describe, expect, it } from 'vitest';
import { DEMO_ADMIN, demoApi, resetDemoData } from '../services/demoApi';

beforeEach(async () => {
  sessionStorage.clear();
  localStorage.clear();
  resetDemoData();
});

describe('demoApi', () => {
  it('bloqueia escrita sem login (permissão)', async () => {
    await expect(demoApi.deleteProduct('prod-sauvage-dior')).rejects.toThrow(/login/);
    await expect(demoApi.listOrders()).rejects.toThrow(/login/);
  });

  it('rejeita senha errada e aceita a correta', async () => {
    await expect(demoApi.signIn(DEMO_ADMIN.email, 'errada')).rejects.toThrow();
    await expect(demoApi.signIn(DEMO_ADMIN.email, DEMO_ADMIN.password)).resolves.toMatchObject({ isAdmin: true });
  });

  it('CRUD de produto', async () => {
    await demoApi.signIn(DEMO_ADMIN.email, DEMO_ADMIN.password);
    const created = await demoApi.saveProduct({
      name: 'Teste', slug: 'teste', brand_id: null, category_id: null, volume: '50 ml', short_description: null,
      description: null, details: null, price: 10, promo_price: null, stock: 2, images: [], featured: false, is_new: false, active: true,
    });
    expect((await demoApi.getProductBySlug('teste'))?.name).toBe('Teste');
    await demoApi.saveProduct({ ...created, name: 'Teste 2' }, created.id);
    expect((await demoApi.getProduct(created.id))?.name).toBe('Teste 2');
    await expect(demoApi.saveProduct({ ...created, slug: 'teste' })).rejects.toThrow(/slug/);
    await demoApi.deleteProduct(created.id);
    expect(await demoApi.getProduct(created.id)).toBeNull();
  });

  it('pedido usa preço do catálogo e respeita estoque', async () => {
    const products = await demoApi.listProducts();
    const promo = products.find((p) => p.name === 'Khamrah')!;
    const order = await demoApi.createOrder('Cliente', '', [{ productId: promo.id, quantity: 2 }]);
    expect(order.total).toBeCloseTo(599.8);
    await expect(demoApi.createOrder('Cliente', '', [{ productId: promo.id, quantity: promo.stock + 1 }])).rejects.toThrow(/indisponível/);
    await expect(demoApi.createOrder('', '', [{ productId: promo.id, quantity: 1 }])).rejects.toThrow(/nome/);
    await demoApi.signIn(DEMO_ADMIN.email, DEMO_ADMIN.password);
    const orders = await demoApi.listOrders();
    expect(orders[0].code).toBe(order.code);
    await demoApi.updateOrderStatus(order.id, 'confirmado');
    expect((await demoApi.listOrders())[0].status).toBe('confirmado');
  });
});
