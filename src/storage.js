// Persistencia local (por dispositivo). Mantem a mesma forma assincrona
// que o app ja usava, mas por baixo grava no localStorage do navegador.
export const storage = {
  async get(key) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? null : { value: v };
    } catch {
      return null;
    }
  },
  async set(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  },
  async remove(key) {
    try { localStorage.removeItem(key); } catch {}
  },
};
