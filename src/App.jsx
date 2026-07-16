import React, { useState, useEffect, useMemo } from "react";
import {
  User, Handshake, Store, Plus, Trash2, Package, Calculator,
  Receipt, Percent, Droplet, TrendingUp, TrendingDown, Wallet, ShoppingBag, Tag, Link2, Layers,
  FileText, Download, Filter, ChevronDown, Image as ImageIcon, Save, Upload, X, Calendar, FileSpreadsheet,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { storage } from "./storage.js";
import { Capacitor } from "@capacitor/core";

/* ---------- constantes ---------- */
const KEY = "bottons-sistema-v3";
const KEY_V2 = "bottons-sistema-v2";
const PALETA = ["#F97316", "#F43F5E", "#8B5CF6", "#06B6D4", "#EAB308", "#10B981", "#EC4899", "#3B82F6"];
const LOGO = "data:image/webp;base64,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";

/* Faixas Shopee — vigentes desde março/2026 */
const FAIXAS = [
  { max: 79.99, com: 0.20, fixa: 4, nome: "1" },
  { max: 99.99, com: 0.14, fixa: 16, nome: "2" },
  { max: 199.99, com: 0.14, fixa: 20, nome: "3" },
  { max: Infinity, com: 0.14, fixa: 26, nome: "4" },
];

/* ---------- helpers ---------- */
const brl = (n) => (isFinite(n) ? n : 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const num = (e) => {
  const v = parseFloat(String(e.target.value).replace(",", "."));
  return isNaN(v) ? 0 : v;
};
const faixaDe = (p) => FAIXAS.find((f) => p <= f.max) || FAIXAS[FAIXAS.length - 1];

function taxaShopee(valor, g) {
  const f = faixaDe(valor);
  const com = f.com;
  const fixa = f.fixa + (g.shopeeCPFAlto ? 3 : 0);
  return { com, fixa, faixa: f, taxa: valor * com + fixa };
}

/* custo de um ITEM (matéria-prima + papel + tinta + custos globais) */
function custoItem(item, g) {
  if (!item) return { custo: 0, matUn: 0, papelUn: 0, tintaUn: 0, custosUn: 0 };
  const papelUn = item.bpf > 0 ? (g.papelValor / Math.max(1, g.papelFolhas)) / item.bpf : 0;
  const tintaUn = item.bpf > 0 ? (g.tintaValor / Math.max(1, g.tintaRendimento)) / item.bpf : 0;
  const matUn = item.matQtd > 0 ? item.matValor / item.matQtd : 0;
  const custosUn = (g.custos || []).reduce((s, c) => s + (c.qtd > 0 ? (c.valor || 0) / c.qtd : 0), 0);
  return { custo: matUn + papelUn + tintaUn + custosUn, matUn, papelUn, tintaUn, custosUn };
}

/* preços de um PRODUTO (deriva o custo do item + margens próprias) */
function precosProduto(prod, itens, g) {
  const item = itens.find((i) => i.id === prod.itemId);
  const base = custoItem(item, g).custo;
  const mult = prod.tipo === "kit" ? Math.max(1, prod.qtd || 1) : 1;
  const custo = base * mult;
  const normal = custo * (1 + prod.margemNormal / 100);
  const atacado = custo * (1 + prod.margemAtacado / 100);
  const precoShopee = custo * (1 + prod.margemShopee / 100);
  const tx = taxaShopee(precoShopee, g);
  const dev = g.shopeeDevolucaoFacil ? 0.49 : 0;
  const ganho = precoShopee - tx.taxa - dev; // preço final − comissão − taxa fixa − devolução fácil
  return {
    item, custo, base, mult, normal, atacado,
    shopee: { preco: precoShopee, taxa: tx.taxa, dev, faixa: tx.faixa, ganho, lucro: ganho - custo },
  };
}

/* ---------- estado inicial + migração ---------- */
const DEFAULT = {
  global: {
    papelFolhas: 50, papelValor: 30,
    tintaValor: 155, tintaRendimento: 7500,
    shopeeCPFAlto: false, shopeeDevolucaoFacil: false,
    tags: [],
    custos: [],
  },
  itens: [] /*SEED_ITENS*/,
  produtos: [] /*SEED_PRODUTOS*/,
  vendas: [],
  despesas: [],
};

function migrarV3(old) {
  const g = old.global || {};
  const itens = [];
  const produtos = [];
  (old.produtos || []).forEach((p) => {
    const iid = "i_" + p.id;
    itens.push({
      id: iid, nome: p.nome, cor: p.cor || "#F97316",
      matQtd: p.tipo === "kit" ? 1 : (p.matQtd || 0),
      matValor: p.tipo === "kit" ? (p.custoManual || 0) : (p.matValor || 0),
      bpf: p.tipo === "kit" ? 0 : (p.bpf || 0),
    });
    produtos.push({
      id: p.id, nome: p.nome, itemId: iid, tipo: "unidade", qtd: 1, vendeAtacado: true,
      margemNormal: g.margemNormal ?? 60, margemAtacado: g.margemAtacado ?? 35, margemShopee: g.margemShopee ?? 30,
    });
  });
  return {
    global: {
      papelFolhas: g.papelFolhas ?? 50, papelValor: g.papelValor ?? 30,
      tintaValor: g.tintaValor ?? 155, tintaRendimento: g.tintaRendimento ?? 7500,
      shopeeCPFAlto: !!g.shopeeCPFAlto, shopeeDevolucaoFacil: !!g.shopeeDevolucaoFacil,
    },
    itens: itens.length ? itens : DEFAULT.itens,
    produtos, vendas: old.vendas || [],
  };
}

/* ---------- átomos de UI ---------- */
const Card = ({ children, className = "" }) => (
  <div className={`bg-stone-900 border border-stone-800 rounded-2xl ${className}`}>{children}</div>
);

const Mono = ({ children, className = "" }) => (
  <span className={`tabular-nums ${className}`} style={{ fontFamily: "'Space Mono', monospace" }}>{children}</span>
);

function Chip({ cor, size = 40, kit = false }) {
  return (
    <div
      style={{ width: size, height: size, background: cor || "#57534e", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.25), 0 3px 6px rgba(0,0,0,.5)" }}
      className="rounded-full shrink-0 flex items-center justify-center"
    >
      {kit && <Layers size={size * 0.42} color="rgba(255,255,255,.9)" strokeWidth={2.5} />}
    </div>
  );
}

function In({ value, onChange, prefix, suffix, placeholder, w = "w-full", type = "number", ...rest }) {
  return (
    <div className={`relative ${w}`}>
      {prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-500 pointer-events-none">{prefix}</span>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full bg-stone-800 border border-stone-700 rounded-lg py-1.5 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60 focus:border-orange-500/60 ${prefix ? "pl-7" : "pl-2.5"} ${suffix ? "pr-8" : "pr-2.5"}`}
        {...rest}
      />
      {suffix && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-500 pointer-events-none">{suffix}</span>}
    </div>
  );
}

function Seg({ options, value, onChange, sm = false }) {
  return (
    <div className={`inline-flex bg-stone-800 border border-stone-700 rounded-lg p-0.5 ${sm ? "text-xs" : "text-sm"}`}>
      {options.map((o) => (
        <button
          key={o.v} onClick={() => onChange(o.v)}
          className={`px-2.5 py-1 rounded-md transition-colors ${value === o.v ? "bg-orange-500 text-white font-semibold" : "text-stone-400 hover:text-stone-200"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function PrecoEditavel({ valor, custo, onMargem }) {
  const [foco, setFoco] = useState(false);
  const [txt, setTxt] = useState("");
  const fmt = (n) => (n > 0 ? n.toFixed(2).replace(".", ",") : "");
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-base font-bold text-stone-500" style={{ fontFamily: "'Space Mono', monospace" }}>R$</span>
      <input
        type="text" inputMode="decimal"
        value={foco ? txt : fmt(valor)}
        onFocus={() => { setTxt(fmt(valor)); setFoco(true); }}
        onBlur={() => setFoco(false)}
        onChange={(e) => {
          const v = e.target.value;
          setTxt(v);
          const p = parseFloat(v.replace(",", "."));
          if (custo > 0 && !isNaN(p)) onMargem(Math.round((p / custo - 1) * 10000) / 100);
        }}
        className="w-full min-w-0 bg-transparent border-0 border-b border-dashed border-stone-600 focus:border-orange-500 outline-none text-lg font-bold text-stone-100 tabular-nums px-0 py-0"
        style={{ fontFamily: "'Space Mono', monospace" }}
      />
    </div>
  );
}

function PriceCell({ label, icon: Icon, valor, sub, tint = false, subClass = "text-emerald-400/80", editavel = false, custo = 0, onMargem }) {
  return (
    <div className={`p-3 ${tint ? "bg-orange-500/[0.06]" : ""}`}>
      <div className="flex items-center gap-1 text-[11px] text-stone-400 mb-1">{Icon && <Icon size={12} />}<span>{label}</span></div>
      {editavel && custo > 0
        ? <PrecoEditavel valor={valor} custo={custo} onMargem={onMargem} />
        : <Mono className="text-lg font-bold text-stone-100">{brl(valor)}</Mono>}
      {sub && <div className={`text-[10px] mt-0.5 ${subClass}`}>{sub}</div>}
    </div>
  );
}

function Stat({ label, valor, cor = "text-stone-100", icon: Icon }) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mb-1">{Icon && <Icon size={13} />}{label}</div>
      <Mono className={`text-xl font-bold ${cor}`}>{valor}</Mono>
    </Card>
  );
}

/* ---------- ABA CUSTO (itens-base com matéria-prima) ---------- */
function ItemCusto({ item, g, upd, remover, aberto, onToggle }) {
  const d = custoItem(item, g);
  const vazio = d.custo <= 0;

  if (!aberto) {
    return (
      <Card className="overflow-hidden">
        <button onClick={onToggle} className="w-full flex items-center gap-2.5 p-3 text-left hover:bg-stone-800/40 transition-colors">
          <Chip cor={item.cor} size={34} />
          <span className="flex-1 font-semibold text-sm text-stone-100 truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.nome || <span className="text-stone-600 font-normal">Sem nome</span>}</span>
          <ChevronDown size={16} className="text-stone-500 shrink-0" />
        </button>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden ring-1 ring-orange-500/30">
      <div className="p-3 flex items-center gap-2.5 border-b border-stone-800">
        <Chip cor={item.cor} size={36} />
        <input
          value={item.nome} onChange={(e) => upd(item.id, { nome: e.target.value })}
          className="flex-1 bg-transparent text-stone-100 font-semibold text-sm focus:outline-none focus:bg-stone-800 rounded px-1.5 py-1 min-w-0"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        />
        <button onClick={remover} className="text-stone-600 hover:text-rose-400 p-1"><Trash2 size={15} /></button>
        <button onClick={onToggle} className="text-stone-500 hover:text-stone-300 p-1"><ChevronDown size={16} className="rotate-180" /></button>
      </div>

      <div className="px-3 py-3 bg-black/20 space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <label className="block"><span className="text-[11px] text-stone-400">Matéria-prima: qtd</span><In value={item.matQtd || ""} placeholder="ex: 100" onChange={(e) => upd(item.id, { matQtd: num(e) })} w="mt-1" /></label>
          <label className="block"><span className="text-[11px] text-stone-400">Matéria-prima: valor</span><In value={item.matValor || ""} prefix="R$" placeholder="ex: 80" onChange={(e) => upd(item.id, { matValor: num(e) })} w="mt-1" /></label>
        </div>
        <div className="flex items-end justify-between gap-3">
          <label className="block flex-1"><span className="text-[11px] text-stone-400">Bottons por folha</span><In value={item.bpf || ""} placeholder="ex: 18" onChange={(e) => upd(item.id, { bpf: num(e) })} w="mt-1 max-w-[140px]" /></label>
          <div className="flex gap-1 pb-1.5">
            {PALETA.map((c) => (
              <button key={c} onClick={() => upd(item.id, { cor: c })} style={{ background: c }}
                className={`w-4 h-4 rounded-full transition-transform ${item.cor === c ? "ring-2 ring-offset-1 ring-offset-stone-900 ring-white scale-110" : ""}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="px-3 py-3 border-t border-stone-800">
        <div className="text-[10px] uppercase tracking-wide text-stone-500 mb-1">Custo unitário</div>
        <Mono className={`text-2xl font-bold ${vazio ? "text-stone-600" : "text-emerald-400"}`}>{brl(d.custo)}</Mono>
        {!vazio && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-stone-500">
            <span>matéria-prima <Mono className="text-stone-300">{brl(d.matUn)}</Mono></span>
            <span>papel <Mono className="text-stone-300">{brl(d.papelUn)}</Mono></span>
            <span>tinta <Mono className="text-stone-300">{brl(d.tintaUn)}</Mono></span>
            {d.custosUn > 0 && <span>custos globais <Mono className="text-stone-300">{brl(d.custosUn)}</Mono></span>}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-stone-800">
        <button onClick={onToggle} className="w-full py-2 rounded-lg bg-stone-800 text-stone-300 text-sm font-medium hover:bg-stone-700 transition-colors">Pronto</button>
      </div>
    </Card>
  );
}

function CustoTab({ data, g, setG, updItem, addItem, delItem }) {
  const [abertoId, setAbertoId] = useState(null);
  const custos = g.custos || [];
  const totalCustoUn = custos.reduce((s, c) => s + (c.qtd > 0 ? (c.valor || 0) / c.qtd : 0), 0);
  const addCusto = () => setG({ ...g, custos: [...custos, { id: "c" + Date.now(), nome: "", qtd: 0, valor: 0 }] });
  const updCusto = (id, patch) => setG({ ...g, custos: custos.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  const delCusto = (id) => setG({ ...g, custos: custos.filter((c) => c.id !== id) });
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-stone-300 mb-1 flex items-center gap-2"><Droplet size={15} className="text-orange-500" />Insumos (entram no custo de todos)</h3>
        <p className="text-[11px] text-stone-500 mb-3">Papel fotográfico e tinta. O custo por botton depende de quantos saem por folha.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label className="block"><span className="text-[11px] text-stone-400">Papel: nº de folhas</span><In value={g.papelFolhas} onChange={(e) => setG({ ...g, papelFolhas: num(e) })} w="mt-1" /></label>
          <label className="block"><span className="text-[11px] text-stone-400">Papel: valor pago</span><In value={g.papelValor} prefix="R$" onChange={(e) => setG({ ...g, papelValor: num(e) })} w="mt-1" /></label>
          <label className="block"><span className="text-[11px] text-stone-400">Tinta: valor (kit refil)</span><In value={g.tintaValor} prefix="R$" onChange={(e) => setG({ ...g, tintaValor: num(e) })} w="mt-1" /></label>
          <label className="block"><span className="text-[11px] text-stone-400">Tinta: rendimento (págs)</span><In value={g.tintaRendimento} onChange={(e) => setG({ ...g, tintaRendimento: num(e) })} w="mt-1" /></label>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-stone-300 mb-1 flex items-center gap-2"><Layers size={15} className="text-orange-500" />Custos globais (entram no custo de todos)</h3>
        <p className="text-[11px] text-stone-500 mb-3">Outros insumos por unidade (ex: saquinho, verniz, tag). Informe quanto rende e quanto pagou; o custo por unidade é somado a cada produto.</p>
        <div className="space-y-2">
          {custos.map((c) => (
            <div key={c.id} className="bg-black/20 rounded-xl p-2.5">
              <div className="flex items-center gap-2">
                <input value={c.nome} onChange={(e) => updCusto(c.id, { nome: e.target.value })} placeholder="Nome (ex: saquinho, verniz)"
                  className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60 placeholder:text-stone-600 min-w-0" />
                <button onClick={() => delCusto(c.id)} className="text-stone-600 hover:text-rose-400 p-1 shrink-0"><Trash2 size={15} /></button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <label className="block"><span className="text-[11px] text-stone-400">Rende (un)</span><In value={c.qtd || ""} placeholder="ex: 100" onChange={(e) => updCusto(c.id, { qtd: num(e) })} w="mt-1" /></label>
                <label className="block"><span className="text-[11px] text-stone-400">Preço pago</span><In value={c.valor || ""} prefix="R$" placeholder="ex: 10" onChange={(e) => updCusto(c.id, { valor: num(e) })} w="mt-1" /></label>
              </div>
              <div className="text-[10px] text-stone-500 mt-1.5">por unidade: <Mono className="text-stone-300">{brl(c.qtd > 0 ? (c.valor || 0) / c.qtd : 0)}</Mono></div>
            </div>
          ))}
        </div>
        <button onClick={addCusto} className="w-full mt-2 py-2.5 rounded-xl border border-dashed border-stone-700 text-stone-400 hover:text-orange-400 hover:border-orange-500/50 transition-colors flex items-center justify-center gap-2 text-sm">
          <Plus size={15} />Adicionar custo
        </button>
        {custos.length > 0 && (
          <div className="mt-3 pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Somado a cada produto</span>
            <Mono className="text-emerald-400 font-bold">{brl(totalCustoUn)} <span className="text-stone-500 font-normal">/un</span></Mono>
          </div>
        )}
      </Card>

      <div className="space-y-2">
        {data.itens.map((it) => (
          <ItemCusto key={it.id} item={it} g={g} upd={updItem} remover={() => delItem(it.id)}
            aberto={abertoId === it.id} onToggle={() => setAbertoId((cur) => (cur === it.id ? null : it.id))} />
        ))}
      </div>

      <button onClick={() => setAbertoId(addItem())} className="w-full py-3 rounded-xl border border-dashed border-stone-700 text-stone-400 hover:text-orange-400 hover:border-orange-500/50 transition-colors flex items-center justify-center gap-2 text-sm">
        <Plus size={16} />Novo item
      </button>
    </div>
  );
}

/* ---------- ABA PRODUTOS (derivam de um item + margens próprias) ---------- */
function ProdutoCard({ prod, itens, g, upd, remover, aberto, onToggle }) {
  const pr = precosProduto(prod, itens, g);
  const semItem = !pr.item;
  const semCusto = pr.custo <= 0;
  const kit = prod.tipo === "kit";

  if (!aberto) {
    return (
      <Card className="overflow-hidden">
        <button onClick={onToggle} className="w-full flex items-center gap-2.5 p-3 text-left hover:bg-stone-800/40 transition-colors">
          <Chip cor={pr.item?.cor} size={34} kit={kit} />
          <span className="flex-1 font-semibold text-sm text-stone-100 truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{prod.nome || <span className="text-stone-600 font-normal">Sem nome</span>}</span>
          <ChevronDown size={16} className="text-stone-500 shrink-0" />
        </button>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden ring-1 ring-orange-500/30">
      <div className="p-3 flex items-center gap-2.5 border-b border-stone-800">
        <Chip cor={pr.item?.cor} size={38} kit={kit} />
        <input
          value={prod.nome} onChange={(e) => upd(prod.id, { nome: e.target.value })}
          placeholder="Nome do produto"
          className="flex-1 bg-transparent text-stone-100 font-semibold text-sm focus:outline-none focus:bg-stone-800 rounded px-1.5 py-1 min-w-0 placeholder:text-stone-600"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        />
        <button onClick={remover} className="text-stone-600 hover:text-rose-400 p-1"><Trash2 size={15} /></button>
        <button onClick={onToggle} className="text-stone-500 hover:text-stone-300 p-1"><ChevronDown size={16} className="rotate-180" /></button>
      </div>

      <div className="px-3 py-3 bg-black/20 border-b border-stone-800 space-y-3">
        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <span className="text-[11px] text-stone-400 block mb-1">Tipo</span>
            <Seg sm options={[{ v: "unidade", label: "Unidade" }, { v: "kit", label: "Kit" }]} value={kit ? "kit" : "unidade"} onChange={(v) => upd(prod.id, { tipo: v })} />
          </div>
          {kit && (
            <label className="block">
              <span className="text-[11px] text-stone-400 block mb-1">Qtd no kit</span>
              <In value={prod.qtd || ""} placeholder="ex: 10" onChange={(e) => upd(prod.id, { qtd: Math.max(1, Math.round(num(e))) })} w="max-w-[90px]" />
            </label>
          )}
        </div>

        <label className="block">
          <span className="text-[11px] text-stone-400 flex items-center gap-1"><Link2 size={11} />{kit ? "Kit de qual item" : "Derivado do item"}</span>
          <select
            value={prod.itemId} onChange={(e) => upd(prod.id, { itemId: e.target.value })}
            className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-2 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60"
          >
            <option value="">— selecione um item —</option>
            {itens.map((i) => <option key={i.id} value={i.id}>{i.nome}</option>)}
          </select>
          {!semItem && (
            <span className="text-[11px] text-stone-500 mt-1 block">
              {kit && pr.base > 0 ? (
                <>custo do kit: <Mono className="text-stone-200 font-bold">{brl(pr.custo)}</Mono> <span className="text-stone-600">({brl(pr.base)} × {pr.mult})</span></>
              ) : (
                <>custo: <Mono className="text-stone-200 font-bold">{brl(pr.custo)}</Mono></>
              )}
              {semCusto && <span className="text-amber-300/70"> · defina a matéria-prima na aba Custo</span>}
            </span>
          )}
        </label>

        <label className="flex items-center gap-2 text-[11px] text-stone-400 cursor-pointer w-fit">
          <input type="checkbox" checked={!!prod.vendeAtacado} onChange={(e) => upd(prod.id, { vendeAtacado: e.target.checked })} className="accent-orange-500" />
          Vendido em atacado
        </label>

        <div className={`grid gap-2 ${prod.vendeAtacado ? "grid-cols-3" : "grid-cols-2"}`}>
          <label className="block"><span className="text-[10px] text-stone-400 flex items-center gap-0.5"><User size={11} />Normal</span><In value={prod.margemNormal} suffix="%" onChange={(e) => upd(prod.id, { margemNormal: num(e) })} w="mt-1" /></label>
          {prod.vendeAtacado && (
            <label className="block"><span className="text-[10px] text-stone-400 flex items-center gap-0.5"><Handshake size={11} />Atacado</span><In value={prod.margemAtacado} suffix="%" onChange={(e) => upd(prod.id, { margemAtacado: num(e) })} w="mt-1" /></label>
          )}
          <label className="block"><span className="text-[10px] text-stone-400 flex items-center gap-0.5"><Store size={11} />Shopee</span><In value={prod.margemShopee} suffix="%" onChange={(e) => upd(prod.id, { margemShopee: num(e) })} w="mt-1" /></label>
        </div>
      </div>

      {semItem ? (
        <div className="p-3 text-xs text-stone-600 text-center">selecione um item pra ver os preços</div>
      ) : (
        <div className={`grid divide-x divide-stone-800 ${prod.vendeAtacado ? "grid-cols-3" : "grid-cols-2"}`}>
          <PriceCell editavel custo={pr.custo} onMargem={(m) => upd(prod.id, { margemNormal: m })}
            label={`Normal ${Math.round(prod.margemNormal)}%`} icon={User} valor={pr.normal} sub={`lucro ${brl(pr.normal - pr.custo)}`} />
          {prod.vendeAtacado && (
            <PriceCell editavel custo={pr.custo} onMargem={(m) => upd(prod.id, { margemAtacado: m })}
              label={`Atacado ${Math.round(prod.margemAtacado)}%`} icon={Handshake} valor={pr.atacado} sub={`lucro ${brl(pr.atacado - pr.custo)}`} />
          )}
          <PriceCell tint editavel custo={pr.custo} onMargem={(m) => upd(prod.id, { margemShopee: m })}
            label={`Shopee ${Math.round(prod.margemShopee)}%`} icon={Store} valor={pr.shopee.preco}
            sub={`recebo ${brl(pr.shopee.ganho)}`}
            subClass={pr.shopee.ganho < 0 ? "text-rose-400" : "text-emerald-400/80"} />
        </div>
      )}

      <div className="p-3 border-t border-stone-800">
        <button onClick={onToggle} className="w-full py-2 rounded-lg bg-stone-800 text-stone-300 text-sm font-medium hover:bg-stone-700 transition-colors">Pronto</button>
      </div>
    </Card>
  );
}

function ProdutosTab({ data, g, setG, updProd, addProd, delProd }) {
  const [abertoId, setAbertoId] = useState(null);
  return (
    <div className="space-y-4">
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-[11px] text-stone-400 font-semibold flex items-center gap-1"><Store size={12} />Shopee (afeta todos):</span>
          <label className="flex items-center gap-2 text-xs text-stone-400 cursor-pointer"><input type="checkbox" checked={g.shopeeDevolucaoFacil} onChange={(e) => setG({ ...g, shopeeDevolucaoFacil: e.target.checked })} className="accent-orange-500" />Devolução Fácil (+R$0,49/pedido)</label>
          <label className="flex items-center gap-2 text-xs text-stone-400 cursor-pointer"><input type="checkbox" checked={g.shopeeCPFAlto} onChange={(e) => setG({ ...g, shopeeCPFAlto: e.target.checked })} className="accent-orange-500" />CPF +450 pedidos/90d (+R$3/item)</label>
        </div>
      </Card>

      <div className="space-y-2">
        {data.produtos.map((p) => (
          <ProdutoCard key={p.id} prod={p} itens={data.itens} g={g} upd={updProd} remover={() => delProd(p.id)}
            aberto={abertoId === p.id} onToggle={() => setAbertoId((cur) => (cur === p.id ? null : p.id))} />
        ))}
      </div>

      <button onClick={() => setAbertoId(addProd())} className="w-full py-3 rounded-xl border border-dashed border-stone-700 text-stone-400 hover:text-orange-400 hover:border-orange-500/50 transition-colors flex items-center justify-center gap-2 text-sm">
        <Plus size={16} />Novo produto
      </button>
    </div>
  );
}

/* ---------- ABA FINANCEIRO ---------- */
/* ---------- ABA FINANCEIRO ---------- */
const toYMD = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function noFiltro(dateISO, f) {
  const d = new Date(dateISO);
  if (f.modo === "ano") return d.getFullYear() === +f.ano;
  if (f.modo === "mes") {
    if (!f.mes) return true;
    const [y, m] = f.mes.split("-");
    return d.getFullYear() === +y && d.getMonth() + 1 === +m;
  }
  if (f.modo === "dia") return f.dia ? toYMD(d) === f.dia : true;
  if (f.modo === "periodo") {
    const t = d.getTime();
    if (f.de && t < new Date(f.de + "T00:00:00").getTime()) return false;
    if (f.ate && t > new Date(f.ate + "T23:59:59").getTime()) return false;
    return true;
  }
  return true; // tudo
}

function rotuloFiltro(f) {
  if (f.modo === "ano") return `ano de ${f.ano}`;
  if (f.modo === "mes") return f.mes ? f.mes.split("-").reverse().join("/") : "mês";
  if (f.modo === "dia") return f.dia ? f.dia.split("-").reverse().join("/") : "dia";
  if (f.modo === "periodo") {
    const a = f.de ? f.de.split("-").reverse().join("/") : "início";
    const b = f.ate ? f.ate.split("-").reverse().join("/") : "hoje";
    return `${a} até ${b}`;
  }
  return "todas as vendas";
}

function VendasTab({ data, g, setData }) {
  const anoAtual = new Date().getFullYear();
  const [form, setForm] = useState({ produtoId: data.produtos[0]?.id || "", canal: "presencial", tier: "normal", qtd: 1, tema: "", custoExtraNome: "", custoExtra: 0, hoje: true, data: toYMD(new Date()), obs: "" });
  const [filtro, setFiltro] = useState({ modo: "tudo", ano: anoAtual, mes: "", dia: "", de: "", ate: "" });
  const prod = data.produtos.find((p) => p.id === form.produtoId);
  const tags = data.global.tags || [];

  const preview = useMemo(() => {
    if (!prod) return null;
    const pr = precosProduto(prod, data.itens, g);
    const custoUn = pr.custo;
    let precoUn, tier;
    if (form.canal === "shopee") {
      precoUn = pr.shopee.preco; tier = "shopee";
    } else {
      tier = form.tier === "atacado" && prod.vendeAtacado ? "atacado" : "normal";
      precoUn = tier === "atacado" ? pr.atacado : pr.normal;
    }
    const qtd = Math.max(1, form.qtd || 1);
    const receita = precoUn * qtd;
    const tx = form.canal === "shopee" ? taxaShopee(precoUn, g) : null;
    const taxaItens = tx ? tx.taxa * qtd : 0;
    const dev = tx && g.shopeeDevolucaoFacil ? 0.49 : 0;
    const taxa = taxaItens + dev;
    const extra = Math.max(0, form.custoExtra || 0);
    const extraNome = (form.custoExtraNome || "").trim();
    const receitaLiq = receita - taxa - extra;
    return { precoUn, custoUn, qtd, receita, custoTotal: custoUn * qtd, taxa, taxaItens, dev, txCom: tx ? tx.com : 0, txFixa: tx ? tx.fixa : 0, extra, extraNome, receitaLiq, lucro: receitaLiq - custoUn * qtd, tier };
  }, [prod, form, g, data.itens]);

  function registrar() {
    if (!prod || !preview) return;
    const item = data.itens.find((i) => i.id === prod.itemId);
    const tema = form.tema.trim();
    const v = {
      id: Date.now().toString(),
      produtoId: prod.id, nome: prod.nome, cor: item?.cor, tipoProd: prod.tipo,
      canal: form.canal, tier: preview.tier, qtd: preview.qtd, tema,
      precoUnit: preview.precoUn, custoUnit: preview.custoUn,
      receita: preview.receita, taxa: preview.taxa, custoExtra: preview.extra, custoExtraNome: preview.extraNome, receitaLiq: preview.receitaLiq, lucro: preview.lucro,
      data: form.hoje ? new Date().toISOString() : new Date((form.data || toYMD(new Date())) + "T12:00:00").toISOString(), obs: form.obs.trim(),
    };
    setData((d) => {
      const cur = d.global.tags || [];
      const tagsNovas = tema && !cur.includes(tema) ? [...cur, tema] : cur;
      return { ...d, global: { ...d.global, tags: tagsNovas }, vendas: [v, ...d.vendas] };
    });
    setForm((f) => ({ ...f, qtd: 1, custoExtraNome: "", custoExtra: 0, obs: "" }));
  }

  const excluir = (id) => setData((d) => ({ ...d, vendas: d.vendas.filter((v) => v.id !== id) }));
  const removerTema = (t) => {
    setData((d) => ({ ...d, global: { ...d.global, tags: (d.global.tags || []).filter((x) => x !== t) } }));
    setForm((f) => (f.tema === t ? { ...f, tema: "" } : f));
  };
  const vendasFiltradas = useMemo(() => data.vendas.filter((v) => noFiltro(v.data, filtro)), [data.vendas, filtro]);
  const anos = useMemo(() => {
    const s = new Set(data.vendas.map((v) => new Date(v.data).getFullYear()));
    s.add(anoAtual);
    return [...s].sort((a, b) => b - a);
  }, [data.vendas, anoAtual]);

  const dateInput = "bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60";
  const semVendas = data.vendas.length === 0;

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-stone-300 flex items-center gap-2"><Receipt size={15} className="text-orange-500" />Registrar venda</h3>
        {data.produtos.length === 0 ? (
          <p className="text-xs text-stone-500">Cadastre um produto na aba Produtos primeiro.</p>
        ) : (
          <>
            <label className="block">
              <span className="text-[11px] text-stone-400">Produto</span>
              <select value={form.produtoId} onChange={(e) => setForm((f) => ({ ...f, produtoId: e.target.value }))}
                className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-2 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60">
                {data.produtos.map((p) => <option key={p.id} value={p.id}>{p.nome}{p.tipo === "kit" ? " (kit)" : ""}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] text-stone-400">Tema (opcional)</span>
              <input list="lista-temas" value={form.tema} onChange={(e) => setForm((f) => ({ ...f, tema: e.target.value }))} placeholder="escolha uma tag ou crie uma (ex: rock nacional)"
                className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-2 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60 placeholder:text-stone-600" />
              <datalist id="lista-temas">{tags.map((t) => <option key={t} value={t} />)}</datalist>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {tags.map((t) => (
                    <span key={t} className={`inline-flex items-center rounded border text-[10px] transition-colors ${form.tema === t ? "bg-orange-500 border-orange-500 text-white" : "border-stone-700 text-stone-400"}`}>
                      <button type="button" onClick={() => setForm((f) => ({ ...f, tema: t }))} className="pl-1.5 pr-1 py-0.5 hover:opacity-80">{t}</button>
                      <button type="button" onClick={() => removerTema(t)} title="Remover tema" className={`pr-1 py-0.5 ${form.tema === t ? "text-white/70 hover:text-white" : "text-stone-600 hover:text-rose-400"}`}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              )}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="text-[11px] text-stone-400">Canal</span><div className="mt-1"><Seg options={[{ v: "presencial", label: "Presencial" }, { v: "shopee", label: "Shopee" }]} value={form.canal} onChange={(v) => setForm((f) => ({ ...f, canal: v }))} /></div></label>
              <label className="block"><span className="text-[11px] text-stone-400">Quantidade</span><In value={form.qtd} onChange={(e) => setForm((f) => ({ ...f, qtd: Math.max(1, Math.round(num(e))) }))} w="mt-1 max-w-[110px]" /></label>
            </div>
            {form.canal === "presencial" && prod?.vendeAtacado && (
              <label className="block"><span className="text-[11px] text-stone-400">Preço</span><div className="mt-1"><Seg options={[{ v: "normal", label: "Normal" }, { v: "atacado", label: "Atacado" }]} value={form.tier} onChange={(v) => setForm((f) => ({ ...f, tier: v }))} /></div></label>
            )}
            <label className="block">
              <span className="text-[11px] text-stone-400">Data da venda</span>
              <div className="mt-1 flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-1.5 text-sm text-stone-300 cursor-pointer select-none">
                  <input type="checkbox" checked={form.hoje} onChange={(e) => setForm((f) => ({ ...f, hoje: e.target.checked, data: e.target.checked ? toYMD(new Date()) : f.data }))} className="accent-orange-500 w-4 h-4" />
                  Hoje
                </label>
                {!form.hoje && (
                  <input type="date" value={form.data} onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
                    className="bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60" />
                )}
              </div>
            </label>
            <div className="grid grid-cols-[1fr_110px] gap-3">
              <label className="block">
                <span className="text-[11px] text-stone-400">Custo extra (opcional)</span>
                <input value={form.custoExtraNome} onChange={(e) => setForm((f) => ({ ...f, custoExtraNome: e.target.value }))} placeholder="ex: frete, brinde, embalagem"
                  className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-2 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60 placeholder:text-stone-600" />
              </label>
              <label className="block"><span className="text-[11px] text-stone-400">Valor</span><In value={form.custoExtra || ""} prefix="R$" placeholder="0" onChange={(e) => setForm((f) => ({ ...f, custoExtra: num(e) }))} w="mt-1" /></label>
            </div>
            <label className="block">
              <span className="text-[11px] text-stone-400">Observação (opcional)</span>
              <textarea value={form.obs} onChange={(e) => setForm((f) => ({ ...f, obs: e.target.value }))} rows={2} placeholder="ex: cliente da feira, encomenda personalizada..."
                className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-2 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60 resize-none" />
            </label>

            {preview && (
              <div className="bg-black/20 rounded-xl p-3 grid grid-cols-2 gap-y-1.5 gap-x-3 text-xs">
                {(preview.taxa > 0 || preview.qtd > 1 || preview.extra > 0) && (<>
                  <div className="text-stone-400">Preço unitário</div><div className="text-right"><Mono className="text-stone-100">{brl(preview.precoUn)}</Mono></div>
                </>)}
                {preview.qtd > 1 && (<>
                  <div className="text-stone-400">Subtotal ({preview.qtd}×)</div><div className="text-right"><Mono className="text-stone-100">{brl(preview.receita)}</Mono></div>
                </>)}
                {preview.taxaItens > 0 && (<>
                  <div className="text-stone-400">Taxa Shopee ({Math.round(preview.txCom * 100)}% + {brl(preview.txFixa)}{preview.qtd > 1 ? ` ×${preview.qtd}` : ""})</div><div className="text-right"><Mono className="text-rose-400">−{brl(preview.taxaItens)}</Mono></div>
                </>)}
                {preview.dev > 0 && (<>
                  <div className="text-stone-400">Devolução Fácil (por pedido)</div><div className="text-right"><Mono className="text-rose-400">−{brl(preview.dev)}</Mono></div>
                </>)}
                {preview.extra > 0 && (<>
                  <div className="text-stone-400 truncate">{preview.extraNome || "Custo extra"}</div><div className="text-right"><Mono className="text-rose-400">−{brl(preview.extra)}</Mono></div>
                </>)}
                <div className="text-stone-200 font-semibold pt-1.5 border-t border-stone-800">Você recebe</div><div className="text-right pt-1.5 border-t border-stone-800"><Mono className="text-emerald-400 font-bold">{brl(preview.receitaLiq)}</Mono></div>
              </div>
            )}

            <button onClick={registrar} disabled={!preview}
              className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Plus size={16} />Registrar venda
            </button>
          </>
        )}
      </Card>

      {semVendas ? (
        <Card className="p-8 text-center text-stone-600 text-sm">Nenhuma venda registrada ainda.</Card>
      ) : (
        <>
          <Card className="p-3 space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-stone-400 font-semibold flex items-center gap-1"><Filter size={12} />Período</span>
              <Seg sm value={filtro.modo} onChange={(v) => setFiltro((f) => ({ ...f, modo: v }))}
                options={[{ v: "tudo", label: "Tudo" }, { v: "ano", label: "Ano" }, { v: "mes", label: "Mês" }, { v: "dia", label: "Dia" }, { v: "periodo", label: "Intervalo" }]} />
            </div>
            {filtro.modo === "ano" && (
              <select value={filtro.ano} onChange={(e) => setFiltro((f) => ({ ...f, ano: +e.target.value }))} className={`${dateInput} max-w-[130px]`}>
                {anos.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            )}
            {filtro.modo === "mes" && <input type="month" value={filtro.mes} onChange={(e) => setFiltro((f) => ({ ...f, mes: e.target.value }))} className={`${dateInput} max-w-[180px]`} />}
            {filtro.modo === "dia" && <input type="date" value={filtro.dia} onChange={(e) => setFiltro((f) => ({ ...f, dia: e.target.value }))} className={`${dateInput} max-w-[180px]`} />}
            {filtro.modo === "periodo" && (
              <div className="flex items-center gap-2 flex-wrap text-xs text-stone-400">
                <span>de</span><input type="date" value={filtro.de} onChange={(e) => setFiltro((f) => ({ ...f, de: e.target.value }))} className={dateInput} />
                <span>até</span><input type="date" value={filtro.ate} onChange={(e) => setFiltro((f) => ({ ...f, ate: e.target.value }))} className={dateInput} />
              </div>
            )}
            <p className="text-[10px] text-stone-500">Mostrando: <span className="text-stone-400">{rotuloFiltro(filtro)}</span> · {vendasFiltradas.length} venda{vendasFiltradas.length === 1 ? "" : "s"}</p>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold text-stone-300 mb-3">Vendas ({vendasFiltradas.length})</h3>
            {vendasFiltradas.length === 0 ? (
              <p className="text-xs text-stone-600 text-center py-3">Nenhuma venda nesse período.</p>
            ) : (
              <div className="space-y-2">
                {vendasFiltradas.map((v) => {
                  const cur = data.produtos.find((p) => p.id === v.produtoId);
                  const item = cur ? data.itens.find((i) => i.id === cur.itemId) : null;
                  const nome = cur?.nome || v.nome;
                  const cor = item?.cor || v.cor;
                  const kit = (cur?.tipo || v.tipoProd) === "kit";
                  const dt = new Date(v.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
                  const canalLabel = v.canal === "shopee" ? "Shopee" : `Presencial · ${v.tier}`;
                  return (
                    <div key={v.id} className="flex items-center gap-3 p-2.5 bg-black/20 rounded-xl">
                      <Chip cor={cor} size={30} kit={kit} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-stone-200 truncate">{nome} <span className="text-[10px] text-stone-500">×{v.qtd}</span></div>
                        <div className="text-[10px] text-stone-500 flex items-center gap-1.5 flex-wrap">
                          <span>{canalLabel} · {dt}</span>
                          {v.tema && <span className="inline-flex items-center gap-0.5 text-orange-300/90 bg-orange-500/10 rounded px-1.5 py-[1px]"><Tag size={9} />{v.tema}</span>}
                          {v.custoExtra > 0 && <span className="inline-flex items-center gap-0.5 text-rose-300/90 bg-rose-500/10 rounded px-1.5 py-[1px]">−{brl(v.custoExtra)}{v.custoExtraNome ? ` · ${v.custoExtraNome}` : ""}</span>}
                        </div>
                        {v.obs && <div className="text-[10px] italic text-amber-300/70 truncate">{v.obs}</div>}
                      </div>
                      <div className="text-right shrink-0">
                        <Mono className="text-sm text-emerald-400 font-bold">{brl(v.receitaLiq)}</Mono>
                        {v.taxa > 0 && <div className="text-[10px] text-stone-500">bruto {brl(v.receita)}</div>}
                      </div>
                      <button onClick={() => excluir(v.id)} className="text-stone-600 hover:text-rose-400 p-1 shrink-0"><Trash2 size={14} /></button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function FinanceiroTab({ data, g }) {
  const anoAtual = new Date().getFullYear();
  const [filtro, setFiltro] = useState({ modo: "tudo", ano: anoAtual, mes: "", dia: "", de: "", ate: "" });

  const vendasFiltradas = useMemo(() => data.vendas.filter((v) => noFiltro(v.data, filtro)), [data.vendas, filtro]);
  const despesasFiltradas = useMemo(() => (data.despesas || []).filter((e) => noFiltro(e.data, filtro)), [data.despesas, filtro]);
  const anos = useMemo(() => {
    const s = new Set([...data.vendas.map((v) => new Date(v.data).getFullYear()), ...(data.despesas || []).map((e) => new Date(e.data).getFullYear())]);
    s.add(anoAtual);
    return [...s].sort((a, b) => b - a);
  }, [data.vendas, data.despesas, anoAtual]);

  const K = useMemo(() => {
    const vs = vendasFiltradas;
    const recebido = vs.reduce((s, v) => s + v.receitaLiq, 0);
    const custoProd = vs.reduce((s, v) => s + (v.custoUnit || 0) * v.qtd, 0);
    const lucroBruto = recebido - custoProd;
    const despesas = despesasFiltradas.reduce((s, e) => s + (e.valor || 0), 0);
    const resultado = lucroBruto - despesas;
    const nVendas = vs.length;
    const itens = vs.reduce((s, v) => s + v.qtd, 0);
    const ticket = nVendas ? recebido / nVendas : 0;
    const margem = recebido > 0 ? (resultado / recebido) * 100 : 0;
    const porCanal = { presencial: { recebido: 0, n: 0 }, shopee: { recebido: 0, n: 0 } };
    vs.forEach((v) => { const c = porCanal[v.canal] || porCanal.presencial; c.recebido += v.receitaLiq; c.n += v.qtd; });
    const mapP = {};
    vs.forEach((v) => { const nome = data.produtos.find((p) => p.id === v.produtoId)?.nome || v.nome; mapP[nome] = mapP[nome] || { nome, qtd: 0, recebido: 0 }; mapP[nome].qtd += v.qtd; mapP[nome].recebido += v.receitaLiq; });
    const porProduto = Object.values(mapP).sort((a, b) => b.qtd - a.qtd);
    const mapT = {};
    vs.forEach((v) => { const t = (v.tema || "").trim(); if (!t) return; mapT[t] = mapT[t] || { tema: t, qtd: 0, recebido: 0 }; mapT[t].qtd += v.qtd; mapT[t].recebido += v.receitaLiq; });
    const porTema = Object.values(mapT).sort((a, b) => b.qtd - a.qtd);
    const mapM = {};
    const addM = (iso, campo, val) => { const d = new Date(iso); const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; mapM[k] = mapM[k] || { mes: k, receita: 0, despesa: 0 }; mapM[k][campo] += val; };
    vs.forEach((v) => addM(v.data, "receita", v.receitaLiq));
    despesasFiltradas.forEach((e) => addM(e.data, "despesa", e.valor || 0));
    const porMes = Object.values(mapM).sort((a, b) => a.mes.localeCompare(b.mes)).map((m) => ({ ...m, label: m.mes.split("-").reverse().join("/").slice(0, 5) }));
    return { recebido, custoProd, lucroBruto, despesas, resultado, nVendas, itens, ticket, margem, porCanal, porProduto, porTema, porMes };
  }, [vendasFiltradas, despesasFiltradas, data.produtos]);

  const tt = { backgroundColor: "#1c1917", border: "1px solid #44403c", borderRadius: 10, fontSize: 12, color: "#e7e5e4" };
  const dateInput = "bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60";
  const vazio = data.vendas.length === 0 && (data.despesas || []).length === 0;

  const [gerando, setGerando] = useState(null);
  const [erroRel, setErroRel] = useState("");

  async function novoDoc(titulo) {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    let y = 16;
    const ls = 18;
    const lp = await logoPNG(120);
    if (lp) { doc.addImage(lp, "PNG", (pageW - ls) / 2, y, ls, ls); y += ls + 4; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(15); doc.setTextColor(4, 44, 83);
    doc.text("Bottons do Lucas", pageW / 2, y, { align: "center" }); y += 5.5;
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(120, 120, 120);
    doc.text(titulo, pageW / 2, y, { align: "center" }); y += 4.5;
    doc.setFontSize(8); doc.setTextColor(140, 140, 140);
    doc.text("Período: " + rotuloFiltro(filtro) + "   ·   gerado em " + new Date().toLocaleDateString("pt-BR"), pageW / 2, y, { align: "center" }); y += 8;
    return { doc, pageW, pageH, y };
  }

  async function relGerencial() {
    setErroRel(""); setGerando("ger");
    try {
      const r = await novoDoc("Relatório gerencial");
      const doc = r.doc, pageW = r.pageW, pageH = r.pageH, M = 14;
      let y = r.y;
      const ensure = (h) => { if (y + h > pageH - M) { doc.addPage(); y = 16; } };
      const sec = (t) => { ensure(11); doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(4, 44, 83); doc.text(t, M, y); y += 2; doc.setDrawColor(210, 210, 210); doc.setLineWidth(0.3); doc.line(M, y, pageW - M, y); y += 5; };
      const linha = (label, valor, bold) => { ensure(6); doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(9.5); doc.setTextColor(bold ? 4 : 70, bold ? 44 : 70, bold ? 83 : 70); doc.text(label, M + 1, y); doc.text(valor, pageW - M, y, { align: "right" }); y += 5.5; };
      const tab = (col1, rows) => {
        const cVal = pageW - M, cQtd = cVal - 26;
        ensure(7);
        doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(41, 140, 205);
        doc.text(col1.toUpperCase(), M + 1, y); doc.text("QTD", cQtd, y, { align: "right" }); doc.text("RECEBIDO", cVal, y, { align: "right" });
        y += 2; doc.setDrawColor(230, 230, 230); doc.setLineWidth(0.3); doc.line(M, y, pageW - M, y); y += 4.5;
        rows.forEach((rw) => {
          ensure(5.5);
          doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(60, 60, 60);
          doc.text(String(rw.a).slice(0, 46), M + 1, y);
          doc.text(rw.b, cQtd, y, { align: "right" });
          doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(4, 44, 83);
          doc.text(rw.c, cVal, y, { align: "right" });
          y += 5.5;
        });
        y += 3;
      };

      sec("Resumo financeiro");
      linha("Recebido", moneyPDF(K.recebido));
      linha("Custo dos produtos", "-" + moneyPDF(K.custoProd));
      linha("Despesas", "-" + moneyPDF(K.despesas));
      linha("Lucro", moneyPDF(K.resultado), true);
      y += 1.5;
      linha("Margem", K.margem.toFixed(1) + "%");
      linha("Ticket médio", moneyPDF(K.ticket));
      linha("Vendas (pedidos)", String(K.nVendas));
      linha("Itens vendidos", String(K.itens));
      y += 3;

      sec("Vendas por canal");
      linha("Presencial", moneyPDF(K.porCanal.presencial.recebido) + "     " + K.porCanal.presencial.n + " un");
      linha("Shopee", moneyPDF(K.porCanal.shopee.recebido) + "     " + K.porCanal.shopee.n + " un");
      y += 3;

      if (K.porProduto.length) { sec("Produtos mais vendidos"); tab("Produto", K.porProduto.map((p) => ({ a: p.nome, b: p.qtd + " un", c: moneyPDF(p.recebido) }))); }
      if (K.porTema.length) { sec("Temas mais vendidos"); tab("Tema", K.porTema.map((t) => ({ a: t.tema, b: t.qtd + " un", c: moneyPDF(t.recebido) }))); }

      const dc = {};
      despesasFiltradas.forEach((e) => { dc[e.categoria] = (dc[e.categoria] || 0) + (e.valor || 0); });
      const dcArr = Object.entries(dc).map(([cat, total]) => ({ cat, total })).sort((a, b) => b.total - a.total);
      if (dcArr.length) { sec("Despesas por categoria"); dcArr.forEach((c) => linha(c.cat, "-" + moneyPDF(c.total))); linha("Total de despesas", "-" + moneyPDF(K.despesas), true); }

      await entregar(doc.output("blob"), "relatorio-gerencial-bottons-do-lucas-" + ym() + ".pdf");
    } catch (e) { setErroRel("Não consegui gerar o relatório (" + (e && e.message ? e.message : "erro") + ")."); }
    finally { setGerando(null); }
  }

  async function relVendas() {
    setErroRel(""); setGerando("vendas");
    try {
      const vs = [...vendasFiltradas].sort((a, b) => new Date(a.data) - new Date(b.data));
      if (!vs.length) { setErroRel("Nenhuma venda no período."); setGerando(null); return; }
      const r = await novoDoc("Relatório de vendas");
      const doc = r.doc, pageW = r.pageW, pageH = r.pageH, M = 14;
      let y = r.y;
      const cLucro = pageW - M, cReceb = cLucro - 26, cQtd = cReceb - 22, xData = M, xProd = M + 16;
      const cab = () => {
        doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(41, 140, 205);
        doc.text("DATA", xData, y); doc.text("PRODUTO", xProd, y);
        doc.text("QTD", cQtd, y, { align: "right" }); doc.text("RECEBIDO", cReceb, y, { align: "right" }); doc.text("LUCRO", cLucro, y, { align: "right" });
        y += 2; doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.3); doc.line(M, y, pageW - M, y); y += 4.5;
      };
      cab();
      const ensure = (h) => { if (y + h > pageH - M) { doc.addPage(); y = 16; cab(); } };
      vs.forEach((v) => {
        ensure(5.5);
        const dt = new Date(v.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
        const canal = v.canal === "shopee" ? "Shopee" : "Presencial";
        doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(120, 120, 120);
        doc.text(dt, xData, y);
        doc.setFontSize(8.5); doc.setTextColor(55, 55, 55);
        doc.text(((v.nome || "") + "  (" + canal + ")").slice(0, 52), xProd, y);
        doc.setTextColor(120, 120, 120); doc.setFontSize(8);
        doc.text(String(v.qtd), cQtd, y, { align: "right" });
        doc.setTextColor(20, 120, 80);
        doc.text(moneyPDF(v.receitaLiq), cReceb, y, { align: "right" });
        doc.setFont("helvetica", "bold");
        doc.setTextColor((v.lucro || 0) < 0 ? 200 : 4, (v.lucro || 0) < 0 ? 40 : 44, (v.lucro || 0) < 0 ? 40 : 83);
        doc.text(moneyPDF(v.lucro || 0), cLucro, y, { align: "right" });
        y += 5.5;
      });
      y += 1; doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.3); doc.line(M, y, pageW - M, y); y += 5;
      const tR = vs.reduce((s, v) => s + v.receitaLiq, 0), tL = vs.reduce((s, v) => s + (v.lucro || 0), 0), tQ = vs.reduce((s, v) => s + v.qtd, 0);
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(4, 44, 83);
      doc.text("Total (" + vs.length + " vendas)", xProd, y);
      doc.text(String(tQ), cQtd, y, { align: "right" });
      doc.setTextColor(20, 120, 80); doc.text(moneyPDF(tR), cReceb, y, { align: "right" });
      doc.setTextColor(4, 44, 83); doc.text(moneyPDF(tL), cLucro, y, { align: "right" });

      await entregar(doc.output("blob"), "relatorio-vendas-bottons-do-lucas-" + ym() + ".pdf");
    } catch (e) { setErroRel("Não consegui gerar o relatório (" + (e && e.message ? e.message : "erro") + ")."); }
    finally { setGerando(null); }
  }

  async function relDespesas() {
    setErroRel(""); setGerando("desp");
    try {
      const es = [...despesasFiltradas].sort((a, b) => new Date(a.data) - new Date(b.data));
      if (!es.length) { setErroRel("Nenhuma despesa no período."); setGerando(null); return; }
      const r = await novoDoc("Relatório de despesas");
      const doc = r.doc, pageW = r.pageW, pageH = r.pageH, M = 14;
      let y = r.y;
      const ensure0 = (h) => { if (y + h > pageH - M) { doc.addPage(); y = 16; } };
      const dc = {};
      es.forEach((e) => { dc[e.categoria] = (dc[e.categoria] || 0) + (e.valor || 0); });
      const dcArr = Object.entries(dc).map(([cat, total]) => ({ cat, total })).sort((a, b) => b.total - a.total);
      ensure0(11); doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(4, 44, 83); doc.text("Por categoria", M, y); y += 2; doc.setDrawColor(210, 210, 210); doc.setLineWidth(0.3); doc.line(M, y, pageW - M, y); y += 5;
      dcArr.forEach((c) => { ensure0(6); doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(70, 70, 70); doc.text(c.cat, M + 1, y); doc.text("-" + moneyPDF(c.total), pageW - M, y, { align: "right" }); y += 5.5; });
      ensure0(6); doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(4, 44, 83); doc.text("Total", M + 1, y); doc.text("-" + moneyPDF(es.reduce((s, e) => s + (e.valor || 0), 0)), pageW - M, y, { align: "right" }); y += 9;

      const cTot = pageW - M, cUnit = cTot - 26, cQtd = cUnit - 20, xData = M, xCat = M + 16;
      const cab = () => {
        doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(41, 140, 205);
        doc.text("DATA", xData, y); doc.text("CATEGORIA", xCat, y);
        doc.text("QTD", cQtd, y, { align: "right" }); doc.text("UNIT.", cUnit, y, { align: "right" }); doc.text("TOTAL", cTot, y, { align: "right" });
        y += 2; doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.3); doc.line(M, y, pageW - M, y); y += 4.5;
      };
      ensure0(11); doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(4, 44, 83); doc.text("Lançamentos", M, y); y += 6;
      cab();
      const ensure = (h) => { if (y + h > pageH - M) { doc.addPage(); y = 16; cab(); } };
      es.forEach((e) => {
        ensure(5.5);
        const dt = new Date(e.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
        const q = e.qtd || 1;
        doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(120, 120, 120);
        doc.text(dt, xData, y);
        doc.setFontSize(8.5); doc.setTextColor(55, 55, 55);
        doc.text((e.categoria + (e.obs ? " - " + e.obs : "")).slice(0, 50), xCat, y);
        doc.setTextColor(120, 120, 120); doc.setFontSize(8);
        doc.text(q > 1 ? String(q) : "-", cQtd, y, { align: "right" });
        doc.text(q > 1 ? moneyPDF(e.valor / q) : "-", cUnit, y, { align: "right" });
        doc.setFont("helvetica", "bold"); doc.setTextColor(180, 40, 40);
        doc.text("-" + moneyPDF(e.valor), cTot, y, { align: "right" });
        y += 5.5;
      });

      await entregar(doc.output("blob"), "relatorio-despesas-bottons-do-lucas-" + ym() + ".pdf");
    } catch (e) { setErroRel("Não consegui gerar o relatório (" + (e && e.message ? e.message : "erro") + ")."); }
    finally { setGerando(null); }
  }

  return (
    <div className="space-y-4">
      <Card className="p-3 space-y-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-stone-400 font-semibold flex items-center gap-1"><Filter size={12} />Período</span>
          <Seg sm value={filtro.modo} onChange={(v) => setFiltro((f) => ({ ...f, modo: v }))}
            options={[{ v: "tudo", label: "Tudo" }, { v: "ano", label: "Ano" }, { v: "mes", label: "Mês" }, { v: "dia", label: "Dia" }, { v: "periodo", label: "Intervalo" }]} />
        </div>
        {filtro.modo === "ano" && (
          <select value={filtro.ano} onChange={(e) => setFiltro((f) => ({ ...f, ano: +e.target.value }))} className={`${dateInput} max-w-[130px]`}>
            {anos.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        )}
        {filtro.modo === "mes" && <input type="month" value={filtro.mes} onChange={(e) => setFiltro((f) => ({ ...f, mes: e.target.value }))} className={`${dateInput} max-w-[180px]`} />}
        {filtro.modo === "dia" && <input type="date" value={filtro.dia} onChange={(e) => setFiltro((f) => ({ ...f, dia: e.target.value }))} className={`${dateInput} max-w-[180px]`} />}
        {filtro.modo === "periodo" && (
          <div className="flex items-center gap-2 flex-wrap text-xs text-stone-400">
            <span>de</span><input type="date" value={filtro.de} onChange={(e) => setFiltro((f) => ({ ...f, de: e.target.value }))} className={dateInput} />
            <span>até</span><input type="date" value={filtro.ate} onChange={(e) => setFiltro((f) => ({ ...f, ate: e.target.value }))} className={dateInput} />
          </div>
        )}
        <p className="text-[10px] text-stone-500">Mostrando: <span className="text-stone-400">{rotuloFiltro(filtro)}</span></p>
      </Card>

      {vazio ? (
        <Card className="p-8 text-center text-stone-600 text-sm">Lance vendas e despesas pra ver os indicadores aqui.</Card>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            <Stat label="Recebido" icon={Wallet} valor={brl(K.recebido)} cor="text-emerald-400" />
            <Stat label="Lucro" icon={TrendingUp} valor={brl(K.resultado)} cor={K.resultado >= 0 ? "text-emerald-400" : "text-rose-400"} />
            <Stat label="Despesas" icon={TrendingDown} valor={brl(K.despesas)} cor="text-rose-400" />
            <Stat label="Ticket médio" icon={Receipt} valor={brl(K.ticket)} />
            <Stat label="Margem" icon={Percent} valor={K.margem.toFixed(0) + "%"} cor={K.margem >= 0 ? "text-stone-100" : "text-rose-400"} />
            <Stat label="Vendas" icon={ShoppingBag} valor={`${K.nVendas} · ${K.itens} un`} />
          </div>

          <Card className="p-3 bg-black/20">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
              <span className="text-stone-400">Recebido</span><span className="text-right"><Mono className="text-emerald-400">{brl(K.recebido)}</Mono></span>
              <span className="text-stone-400">− Custo dos produtos</span><span className="text-right"><Mono className="text-stone-300">{brl(K.custoProd)}</Mono></span>
              <span className="text-stone-400">− Despesas</span><span className="text-right"><Mono className="text-rose-400">{brl(K.despesas)}</Mono></span>
              <span className="text-stone-200 font-semibold pt-1 border-t border-stone-800">= Lucro</span><span className="text-right pt-1 border-t border-stone-800"><Mono className={`font-bold ${K.resultado >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{brl(K.resultado)}</Mono></span>
            </div>
          </Card>

          {K.porMes.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-stone-300 mb-1">Receita × Despesa por mês</h3>
              <div className="flex items-center gap-3 mb-2 text-[10px] text-stone-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#34d399" }} />Receita</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#fb7185" }} />Despesa</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={K.porMes} margin={{ top: 5, right: 5, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={{ stroke: "#44403c" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} width={46} tickFormatter={(v) => "R$" + v} />
                  <Tooltip contentStyle={tt} cursor={{ fill: "#ffffff08" }} formatter={(v, n) => [brl(v), n === "receita" ? "Receita" : "Despesa"]} />
                  <Bar dataKey="receita" fill="#34d399" radius={[3, 3, 0, 0]} name="receita" />
                  <Bar dataKey="despesa" fill="#fb7185" radius={[3, 3, 0, 0]} name="despesa" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {K.nVendas > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {[{ k: "presencial", label: "Presencial", icon: ShoppingBag }, { k: "shopee", label: "Shopee", icon: Store }].map(({ k, label, icon: Icon }) => {
                const top = K.porCanal.presencial.n === K.porCanal.shopee.n ? null : (K.porCanal.presencial.n > K.porCanal.shopee.n ? "presencial" : "shopee");
                return (
                  <Card key={k} className={`p-3 ${top === k ? "ring-1 ring-orange-500/40" : ""}`}>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-2"><Icon size={13} />{label} <span className="text-stone-600">· {K.porCanal[k].n} un</span>{top === k && <span className="text-[9px] text-orange-400 font-semibold ml-auto">MAIS VENDIDO</span>}</div>
                    <div className="flex justify-between text-xs"><span className="text-stone-500">recebido</span><Mono className="text-emerald-400 font-semibold">{brl(K.porCanal[k].recebido)}</Mono></div>
                  </Card>
                );
              })}
            </div>
          )}

          {K.porProduto.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-stone-300 mb-3">Produtos mais vendidos</h3>
              <ResponsiveContainer width="100%" height={Math.max(120, K.porProduto.length * 38)}>
                <BarChart data={K.porProduto} layout="vertical" margin={{ left: 0, right: 44 }}>
                  <CartesianGrid horizontal={false} stroke="#292524" />
                  <XAxis type="number" allowDecimals={false} tick={{ fill: "#78716c", fontSize: 11 }} />
                  <YAxis type="category" dataKey="nome" width={120} tick={{ fill: "#a8a29e", fontSize: 11 }} />
                  <Tooltip contentStyle={tt} cursor={{ fill: "#ffffff08" }} formatter={(v, n, p) => [`${v} un · ${brl(p.payload.recebido)}`, "vendido"]} />
                  <Bar dataKey="qtd" radius={[0, 5, 5, 0]}>
                    {K.porProduto.map((_, i) => <Cell key={i} fill={PALETA[i % PALETA.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          <Card className="p-4">
            <h3 className="text-sm font-semibold text-stone-300 mb-3 flex items-center gap-1.5"><Tag size={14} className="text-orange-500" />Temas mais vendidos</h3>
            {K.porTema.length > 0 ? (
              <ResponsiveContainer width="100%" height={Math.max(120, K.porTema.length * 38)}>
                <BarChart data={K.porTema} layout="vertical" margin={{ left: 0, right: 44 }}>
                  <CartesianGrid horizontal={false} stroke="#292524" />
                  <XAxis type="number" allowDecimals={false} tick={{ fill: "#78716c", fontSize: 11 }} />
                  <YAxis type="category" dataKey="tema" width={120} tick={{ fill: "#a8a29e", fontSize: 11 }} />
                  <Tooltip contentStyle={tt} cursor={{ fill: "#ffffff08" }} formatter={(v, n, p) => [`${v} un · ${brl(p.payload.recebido)}`, "vendido"]} />
                  <Bar dataKey="qtd" radius={[0, 5, 5, 0]}>
                    {K.porTema.map((_, i) => <Cell key={i} fill={PALETA[(i + 3) % PALETA.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-stone-600">Nenhuma venda com tema neste período.</p>
            )}
          </Card>

          <Card className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-stone-300 flex items-center gap-1.5"><FileText size={14} className="text-orange-500" />Relatórios</h3>
            <p className="text-[11px] text-stone-500 -mt-1">Gera um PDF com os dados do período selecionado acima ({rotuloFiltro(filtro)}).</p>
            <div className="grid gap-2">
              <button onClick={relGerencial} disabled={!!gerando}
                className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <Download size={15} />{gerando === "ger" ? "Gerando…" : "Relatório gerencial (completo)"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={relVendas} disabled={!!gerando}
                  className="py-2.5 rounded-xl bg-stone-800 text-stone-200 font-medium text-sm hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
                  <ShoppingBag size={14} />{gerando === "vendas" ? "Gerando…" : "Vendas"}
                </button>
                <button onClick={relDespesas} disabled={!!gerando}
                  className="py-2.5 rounded-xl bg-stone-800 text-stone-200 font-medium text-sm hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
                  <TrendingDown size={14} />{gerando === "desp" ? "Gerando…" : "Despesas"}
                </button>
              </div>
            </div>
            {erroRel && <p className="text-[11px] text-rose-400">{erroRel}</p>}
          </Card>
        </>
      )}
    </div>
  );
}

/* ---------- ABA RELATÓRIOS (tabela de preços) ---------- */
const CAT_ORDER = [
  { key: "unitarios", label: "Bottons unitários" },
  { key: "kits", label: "Kits" },
  { key: "chaveiros", label: "Chaveiros e abridores" },
  { key: "espelho", label: "Espelho" },
];

function categoria(prod, itens) {
  if (prod.tipo === "kit") return "kits";
  const item = itens.find((i) => i.id === prod.itemId);
  const txt = ((item?.nome || "") + " " + (prod.nome || "")).toLowerCase();
  if (txt.includes("espelho")) return "espelho";
  if (txt.includes("chaveiro") || txt.includes("abridor")) return "chaveiros";
  return "unitarios";
}

function tabelaPrecos(data, g) {
  const linhas = data.produtos
    .map((p) => {
      const pr = precosProduto(p, data.itens, g);
      return { nome: (p.nome || "").trim(), cat: categoria(p, data.itens), normal: pr.normal, atacado: pr.atacado, vendeAtacado: !!p.vendeAtacado, custo: pr.custo };
    })
    .filter((l) => l.nome && l.custo > 0);
  const grupos = (filtro, campo) =>
    CAT_ORDER.map((c) => ({ ...c, itens: linhas.filter((l) => l.cat === c.key && filtro(l)).map((l) => ({ nome: l.nome, preco: l[campo] })) })).filter((gr) => gr.itens.length);
  return { varejo: grupos(() => true, "normal"), atacado: grupos((l) => l.vendeAtacado, "atacado") };
}

function tabelaCustos(data, g) {
  const linhas = data.produtos.map((p) => {
    const item = data.itens.find((i) => i.id === p.itemId);
    const ci = custoItem(item, g);
    const mult = p.tipo === "kit" ? Math.max(1, p.qtd || 1) : 1;
    return {
      nome: (p.nome || "").trim(),
      cat: categoria(p, data.itens),
      tipo: p.tipo, mult,
      mat: ci.matUn * mult, papel: ci.papelUn * mult, tinta: ci.tintaUn * mult, glob: ci.custosUn * mult, custo: ci.custo * mult,
    };
  }).filter((l) => l.nome && l.custo > 0);
  return CAT_ORDER.map((c) => ({ ...c, itens: linhas.filter((l) => l.cat === c.key) })).filter((gr) => gr.itens.length);
}

const moneyPDF = (n) => brl(n).replace(/\u00A0/g, " ");


/* ---------- tabela de preços: imagem + PDF ---------- */
const WA = "(13) 97416-5655";
const IG = "@bottonsdolucas";
const TAGLINE = "Peça o seu no WhatsApp";
const NOTA_DESCONTO = "A partir de 10 unidades: 15% de desconto";

function loadImg(src) {
  return new Promise((res) => {
    try { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }
    catch { res(null); }
  });
}

async function logoPNG(size) {
  const img = await loadImg(LOGO);
  if (!img) return null;
  const c = document.createElement("canvas");
  c.width = size; c.height = size;
  try { c.getContext("2d").drawImage(img, 0, 0, size, size); return c.toDataURL("image/png"); }
  catch { return null; }
}

async function ensureFonts() {
  try {
    if (document.fonts) {
      await Promise.all([
        document.fonts.load('700 48px "Space Grotesk"'),
        document.fonts.load('400 27px "Inter"'),
        document.fonts.load('600 27px "Inter"'),
        document.fonts.load('700 27px "Inter"'),
      ]);
      await document.fonts.ready;
    }
  } catch {}
}

function ym() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
}

function canvasBlob(c, type, quality) {
  return new Promise((res) => c.toBlob(res, type, quality));
}

function blobToBase64(blob) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onloadend = () => res(String(r.result).split(",")[1] || "");
    r.onerror = rej;
    r.readAsDataURL(blob);
  });
}

// Entrega um arquivo: na web faz download; no app Android abre a folha de
// compartilhamento (mandar pro WhatsApp, salvar, etc.).
async function entregar(blob, filename) {
  if (Capacitor.isNativePlatform()) {
    const b64 = await blobToBase64(blob);
    const { Filesystem, Directory } = await import("@capacitor/filesystem");
    const { Share } = await import("@capacitor/share");
    await Filesystem.writeFile({ path: filename, data: b64, directory: Directory.Cache });
    const { uri } = await Filesystem.getUri({ path: filename, directory: Directory.Cache });
    try { await Share.share({ title: filename, files: [uri] }); } catch {}
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/* Desenha o pôster (mesmo layout pro PDF, story e feed). Escala o corpo pra caber. */
function drawPoster(ctx, W, H, logo, varejo, atacado) {
  const k = W / 1080;
  ctx.save();
  ctx.scale(k, k);
  const CW = 1080;
  const CH = H / k;
  const PX = 74;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CW, CH);

  const stripe = ["#378ADD", "#639922", "#E24B4A", "#EF9F27"];
  const sw = CW / stripe.length;
  stripe.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(i * sw, 0, sw + 1, 14); });

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  let hy = 14 + 34;
  const LS = 150;
  if (logo) { try { ctx.drawImage(logo, CW / 2 - LS / 2, hy, LS, LS); } catch {} }
  hy += LS + 34;
  ctx.font = '700 48px "Space Grotesk", "Inter", sans-serif';
  ctx.fillStyle = "#042C53";
  ctx.fillText("Bottons do Lucas", CW / 2, hy);
  hy += 30;
  ctx.font = '600 22px "Inter", sans-serif';
  ctx.fillStyle = "#185FA5";
  try { ctx.letterSpacing = "3px"; } catch {}
  ctx.fillText("TABELA DE PREÇOS", CW / 2, hy);
  try { ctx.letterSpacing = "0px"; } catch {}
  hy += 30;
  ctx.font = '400 20px "Inter", sans-serif';
  ctx.fillStyle = "#9a9a94";
  ctx.fillText("válida a partir de " + new Date().toLocaleDateString("pt-BR"), CW / 2, hy);
  const headerBottom = hy + 24;

  const FH = 104;
  const fy = CH - FH;
  ctx.fillStyle = "#042C53";
  ctx.fillRect(0, fy, CW, FH);
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = '500 22px "Inter", sans-serif';
  ctx.fillText("WhatsApp " + WA + "      ·      Instagram " + IG, CW / 2, fy + 46);
  ctx.fillStyle = "#B5D4F4";
  ctx.font = '400 18px "Inter", sans-serif';
  ctx.fillText(TAGLINE, CW / 2, fy + 76);

  const barH = 56, barR = 12, barFont = 26;
  const notH = 50, notR = 10, notFont = 24;
  const catFont = 27, catH = 34, catGap = 6;
  const rowFont = 27, rowH = 48;
  const gapCat = 22, gapSec = 34, gapBar = 16, gapNot = 18;

  const measure = () => {
    let h = barH + gapBar + notH + gapNot;
    varejo.forEach((gr, i) => { h += catH + catGap + gr.itens.length * rowH; if (i < varejo.length - 1) h += gapCat; });
    if (atacado.length) {
      h += gapSec + barH + gapBar;
      atacado.forEach((gr, i) => { h += catH + catGap + gr.itens.length * rowH; if (i < atacado.length - 1) h += gapCat; });
    }
    return h;
  };
  const availTop = headerBottom + 6;
  const availH = (fy - 22) - availTop;
  const Hb = measure();
  const S = Math.min(1, availH / Hb);
  let y = availTop + Math.max(0, (availH - Hb * S) / 2);

  const drawBar = (label, right) => {
    const h = barH * S;
    roundRectPath(ctx, PX, y, CW - 2 * PX, h, barR * S);
    ctx.fillStyle = "#042C53"; ctx.fill();
    ctx.textBaseline = "middle"; ctx.textAlign = "left";
    ctx.font = "600 " + (barFont * S) + 'px "Inter", sans-serif';
    ctx.fillStyle = "#ffffff";
    try { ctx.letterSpacing = (2 * S) + "px"; } catch {}
    ctx.fillText(label.toUpperCase(), PX + 20 * S, y + h / 2);
    try { ctx.letterSpacing = "0px"; } catch {}
    if (right) {
      ctx.textAlign = "right";
      ctx.font = "400 " + ((barFont - 5) * S) + 'px "Inter", sans-serif';
      ctx.fillStyle = "#B5D4F4";
      ctx.fillText(right, CW - PX - 20 * S, y + h / 2);
    }
    ctx.textBaseline = "alphabetic";
    y += h + gapBar * S;
  };
  const drawNotice = (txt) => {
    const h = notH * S;
    roundRectPath(ctx, PX, y, CW - 2 * PX, h, notR * S);
    ctx.fillStyle = "#EAF3DE"; ctx.fill();
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = "600 " + (notFont * S) + 'px "Inter", sans-serif';
    ctx.fillStyle = "#3B6D11";
    ctx.fillText(txt, CW / 2, y + h / 2);
    ctx.textBaseline = "alphabetic";
    y += h + gapNot * S;
  };
  const drawGroups = (groups) => {
    groups.forEach((gr, gi) => {
      ctx.textAlign = "left";
      ctx.font = "600 " + (catFont * S) + 'px "Inter", sans-serif';
      ctx.fillStyle = "#185FA5";
      ctx.fillText(gr.label, PX, y + catFont * S);
      y += catH * S + catGap * S;
      gr.itens.forEach((it) => {
        const fs = rowFont * S;
        const by = y + fs * 0.78;
        ctx.textAlign = "left";
        ctx.font = "400 " + fs + 'px "Inter", sans-serif';
        ctx.fillStyle = "#3d3d3a";
        ctx.fillText(it.nome, PX, by);
        const nameW = ctx.measureText(it.nome).width;
        const precoStr = moneyPDF(it.preco);
        ctx.font = "700 " + fs + 'px "Inter", sans-serif';
        ctx.fillStyle = "#042C53";
        const pw = ctx.measureText(precoStr).width;
        const priceX = CW - PX - pw;
        ctx.fillText(precoStr, priceX, by);
        const ds = PX + nameW + 12, de = priceX - 12;
        if (de - ds > 16) {
          ctx.save();
          ctx.strokeStyle = "#cbcbc6";
          ctx.lineWidth = Math.max(1, 1.4 * S);
          ctx.setLineDash([2, 6]);
          ctx.beginPath();
          ctx.moveTo(ds, by - fs * 0.28);
          ctx.lineTo(de, by - fs * 0.28);
          ctx.stroke();
          ctx.restore();
        }
        y += rowH * S;
      });
      if (gi < groups.length - 1) y += gapCat * S;
    });
  };

  drawBar("Varejo", null);
  drawNotice(NOTA_DESCONTO);
  drawGroups(varejo);
  if (atacado.length) {
    y += gapSec * S;
    drawBar("Atacado", "acima de 20 unidades");
    drawGroups(atacado);
  }

  ctx.restore();
}

function RelatoriosTab({ data, g, setData }) {
  const [gerando, setGerando] = useState(null);
  const [erro, setErro] = useState("");
  const { varejo, atacado } = useMemo(() => tabelaPrecos(data, g), [data, g]);
  const vazio = varejo.length === 0;
  const custos = useMemo(() => tabelaCustos(data, g), [data, g]);
  const vazioCustos = custos.length === 0;
  const [previewUrl, setPreviewUrl] = useState("");
  const [bkMsg, setBkMsg] = useState(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      if (vazio) { setPreviewUrl(""); return; }
      try {
        const c = await montar(1080, 1350);
        if (cancel) return;
        setPreviewUrl(c.toDataURL("image/png"));
      } catch { if (!cancel) setPreviewUrl(""); }
    })();
    return () => { cancel = true; };
  }, [varejo, atacado, vazio]);

  async function montar(W, H) {
    await ensureFonts();
    const logo = await loadImg(LOGO);
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    drawPoster(c.getContext("2d"), W, H, logo, varejo, atacado);
    return c;
  }

  async function baixarImagem(rw, rh, suf) {
    setErro(""); setGerando(suf);
    try {
      const W = 1080, H = Math.round((W * rh) / rw);
      const c = await montar(W, H);
      const blob = await canvasBlob(c, "image/png");
      await entregar(blob, "tabela-precos-bottons-do-lucas-" + ym() + "-" + suf + ".png");
    } catch { setErro("Não consegui gerar a imagem agora. Tente de novo."); }
    finally { setGerando(null); }
  }

  async function baixarPDF() {
    setErro(""); setGerando("pdf");
    try {
      const W = 1240, H = Math.round(W * Math.SQRT2);
      const c = await montar(W, H);
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pw = doc.internal.pageSize.getWidth();
      const ph = doc.internal.pageSize.getHeight();
      doc.addImage(c.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, pw, ph);
      await entregar(doc.output("blob"), "tabela-precos-bottons-do-lucas-" + ym() + ".pdf");
    } catch (e) { setErro("Não consegui gerar o PDF (" + (e && e.message ? e.message : "erro") + ")."); }
    finally { setGerando(null); }
  }

  async function baixarCustoPDF() {
    setErro(""); setGerando("custo");
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const M = 14;
      let y = 16;

      const ls = 20;
      const lp = await logoPNG(120);
      if (lp) { doc.addImage(lp, "PNG", (pageW - ls) / 2, y, ls, ls); y += ls + 5; }
      doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(4, 44, 83);
      doc.text("Bottons do Lucas", pageW / 2, y, { align: "center" }); y += 6;
      doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(120, 120, 120);
      doc.text("Tabela de Custos", pageW / 2, y, { align: "center" }); y += 4.5;
      doc.setFontSize(8); doc.text(new Date().toLocaleDateString("pt-BR"), pageW / 2, y, { align: "center" }); y += 5;
      doc.setFontSize(7.5); doc.setTextColor(150, 150, 150);
      doc.text("Insumos: papel " + moneyPDF(g.papelValor) + " / " + g.papelFolhas + " folhas  ·  tinta " + moneyPDF(g.tintaValor) + " (~" + g.tintaRendimento + " pág.)", pageW / 2, y, { align: "center" }); y += 7;

      const temGlobais = (g.custos || []).some((c) => c.qtd > 0 && c.valor > 0);
      const cCusto = pageW - M;
      const cGlob = temGlobais ? cCusto - 26 : null;
      const cTinta = (temGlobais ? cGlob : cCusto) - 26;
      const cPapel = cTinta - (temGlobais ? 24 : 26);
      const cMat = cPapel - (temGlobais ? 24 : 26);
      const nameX = M;

      const cab = () => {
        doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(41, 140, 205);
        doc.text("PRODUTO", nameX, y);
        doc.text("MAT.-PRIMA", cMat, y, { align: "right" });
        doc.text("PAPEL", cPapel, y, { align: "right" });
        doc.text("TINTA", cTinta, y, { align: "right" });
        if (temGlobais) doc.text("GLOBAIS", cGlob, y, { align: "right" });
        doc.text("CUSTO UN.", cCusto, y, { align: "right" });
        y += 2;
        doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.3); doc.line(M, y, pageW - M, y);
        y += 4.5;
      };
      cab();
      const ensure = (h) => { if (y + h > pageH - M) { doc.addPage(); y = 16; cab(); } };

      let temKit = false;
      custos.forEach((gr) => {
        ensure(11);
        doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(4, 44, 83);
        doc.text(gr.label, nameX, y); y += 5.5;
        gr.itens.forEach((it) => {
          if (it.tipo === "kit") temKit = true;
          ensure(6);
          doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(60, 60, 60);
          doc.text(it.nome, nameX + 1, y);
          doc.setFontSize(8.5); doc.setTextColor(95, 95, 95);
          doc.text(moneyPDF(it.mat), cMat, y, { align: "right" });
          doc.text(moneyPDF(it.papel), cPapel, y, { align: "right" });
          doc.text(moneyPDF(it.tinta), cTinta, y, { align: "right" });
          if (temGlobais) doc.text(moneyPDF(it.glob), cGlob, y, { align: "right" });
          doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(4, 44, 83);
          doc.text(moneyPDF(it.custo), cCusto, y, { align: "right" });
          y += 5.5;
        });
        y += 2.5;
      });

      if (temKit) {
        ensure(6);
        doc.setFont("helvetica", "italic"); doc.setFontSize(7.5); doc.setTextColor(150, 150, 150);
        doc.text("Kits: custo já multiplicado pela quantidade de bottons.", nameX, y);
      }

      const blob = doc.output("blob");
      await entregar(blob, "tabela-de-custos-bottons-do-lucas-" + ym() + ".pdf");
    } catch (e) { setErro("Não consegui gerar o PDF de custos (" + (e && e.message ? e.message : "erro") + ")."); }
    finally { setGerando(null); }
  }

  async function exportarBackup() {
    setBkMsg(null);
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      await entregar(blob, "backup-bottons-do-lucas-" + ym() + ".json");
      setBkMsg({ tipo: "ok", txt: Capacitor.isNativePlatform() ? "Backup gerado — escolha onde salvar." : "Backup exportado." });
    } catch { setBkMsg({ tipo: "erro", txt: "Não consegui exportar agora." }); }
  }

  function importarBackup(e) {
    setBkMsg(null);
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (!d || typeof d !== "object" || !Array.isArray(d.produtos)) throw new Error("inválido");
        if (!window.confirm("Isso vai substituir os dados atuais deste aparelho. Continuar?")) return;
        d.global = { ...DEFAULT.global, ...(d.global || {}) };
        if (!d.itens || !d.itens.length) d.itens = DEFAULT.itens;
        d.produtos = (d.produtos || []).map((p) => ({ tipo: "unidade", qtd: 1, vendeAtacado: true, ...p }));
        if (!d.vendas) d.vendas = [];
        if (!d.despesas) d.despesas = [];
        setData(d);
        setBkMsg({ tipo: "ok", txt: "Backup importado com sucesso." });
      } catch { setBkMsg({ tipo: "erro", txt: "Arquivo inválido. Use um backup .json exportado aqui." }); }
    };
    r.readAsText(file);
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-stone-300 mb-1 flex items-center gap-2"><FileText size={15} className="text-orange-500" />Tabela de preços</h3>
        <p className="text-[11px] text-stone-500 mb-3">Tabela pro cliente com os preços de venda por categoria (sem custo nem Shopee). Sai em PDF (A4) e em duas imagens prontas pra compartilhar.</p>
        <div className="space-y-2">
          <button onClick={baixarPDF} disabled={!!gerando || vazio}
            className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <Download size={16} />{gerando === "pdf" ? "Gerando…" : "Baixar PDF (A4)"}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => baixarImagem(9, 16, "story")} disabled={!!gerando || vazio}
              className="py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 font-semibold text-sm hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <ImageIcon size={15} />{gerando === "story" ? "Gerando…" : "Imagem · Story"}
            </button>
            <button onClick={() => baixarImagem(4, 5, "feed")} disabled={!!gerando || vazio}
              className="py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 font-semibold text-sm hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <ImageIcon size={15} />{gerando === "feed" ? "Gerando…" : "Imagem · Feed"}
            </button>
          </div>
        </div>
        <p className="text-[11px] text-stone-500 mt-2">Story 9:16 pro status do WhatsApp e stories · Feed 4:5 pro post do Instagram.</p>
        {vazio && <p className="text-[11px] text-stone-600 mt-2 text-center">Cadastre produtos com custo definido pra montar a tabela.</p>}
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-stone-300 mb-1 flex items-center gap-2"><Calculator size={15} className="text-orange-500" />Tabela de custos</h3>
        <p className="text-[11px] text-stone-500 mb-3">PDF interno com o custo de cada produto e a composição (matéria-prima, papel, tinta). Só pra você — não gera imagem.</p>
        <button onClick={baixarCustoPDF} disabled={!!gerando || vazioCustos}
          className="w-full py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 font-semibold text-sm hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Download size={16} />{gerando === "custo" ? "Gerando…" : "Baixar custos (PDF)"}
        </button>
        {vazioCustos && <p className="text-[11px] text-stone-600 mt-2 text-center">Cadastre produtos com custo definido pra montar a tabela.</p>}
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-stone-300 mb-1 flex items-center gap-2"><Save size={15} className="text-orange-500" />Backup dos dados</h3>
        <p className="text-[11px] text-stone-500 mb-3">Os dados ficam salvos só neste aparelho. Exporte de vez em quando (e pra passar pra outro celular). Importar substitui o que está aqui.</p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={exportarBackup}
            className="py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 font-semibold text-sm hover:bg-stone-700 transition-colors flex items-center justify-center gap-2">
            <Download size={15} />Exportar
          </button>
          <label className="py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 font-semibold text-sm hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <Upload size={15} />Importar
            <input type="file" accept="application/json,.json" onChange={importarBackup} className="hidden" />
          </label>
        </div>
        {bkMsg && <p className={"text-[11px] mt-2 text-center " + (bkMsg.tipo === "ok" ? "text-emerald-400" : "text-rose-400")}>{bkMsg.txt}</p>}
      </Card>

      {!vazio && previewUrl && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-stone-300 mb-3">Prévia</h3>
          <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950 flex justify-center p-3">
            <img src={previewUrl} alt="Prévia da tabela de preços" className="h-auto rounded-md" style={{ width: "100%", maxWidth: 340 }} />
          </div>
          <p className="text-[11px] text-stone-600 mt-2 text-center">Prévia no formato feed (4:5). O PDF e o story usam o mesmo desenho.</p>
        </Card>
      )}

      {erro && <p className="text-[11px] text-rose-400 text-center">{erro}</p>}
    </div>
  );
}

/* ---------- APP ---------- */
function DespesasTab({ data, setData }) {
  const CATS = ["Embalagem", "Envelope de postagem", "Fita adesiva", "Insumos", "Etiquetas", "Frete", "Outros"];
  const [form, setForm] = useState({ categoria: "", valor: 0, qtd: 1, hoje: true, data: toYMD(new Date()), obs: "" });
  const [per, setPer] = useState("mes");

  const inPer = (iso) => {
    if (per === "tudo") return true;
    const d = new Date(iso), now = new Date();
    if (per === "ano") return d.getFullYear() === now.getFullYear();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  };

  function registrar() {
    const cat = form.categoria.trim();
    if (!cat || !(form.valor > 0)) return;
    const iso = form.hoje ? new Date().toISOString() : new Date((form.data || toYMD(new Date())) + "T12:00:00").toISOString();
    const q = Math.max(1, Math.round(form.qtd || 1));
    const e = { id: Date.now().toString(), categoria: cat, valor: form.valor, qtd: q, data: iso, obs: form.obs.trim() };
    setData((d) => ({ ...d, despesas: [e, ...(d.despesas || [])] }));
    setForm((f) => ({ ...f, valor: 0, qtd: 1, obs: "" }));
  }
  const excluir = (id) => setData((d) => ({ ...d, despesas: (d.despesas || []).filter((x) => x.id !== id) }));

  const despFiltradas = useMemo(
    () => (data.despesas || []).filter((e) => inPer(e.data)).sort((a, b) => new Date(b.data) - new Date(a.data)),
    [data.despesas, per]
  );
  const despesaPer = despFiltradas.reduce((s, e) => s + (e.valor || 0), 0);

  const porCategoria = useMemo(() => {
    const m = {};
    despFiltradas.forEach((e) => { m[e.categoria] = (m[e.categoria] || 0) + (e.valor || 0); });
    return Object.entries(m).map(([cat, total]) => ({ cat, total })).sort((a, b) => b.total - a.total);
  }, [despFiltradas]);
  const maxCat = Math.max(1, ...porCategoria.map((c) => c.total));

  const dateInput = "bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60";
  const rotPer = per === "mes" ? "este mês" : per === "ano" ? "este ano" : "tudo";

  return (
    <div className="space-y-4">
      {/* registrar despesa */}
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-stone-300 flex items-center gap-2"><TrendingDown size={15} className="text-orange-500" />Registrar despesa</h3>
        <label className="block">
          <span className="text-[11px] text-stone-400">Categoria</span>
          <input list="lista-cats" value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))} placeholder="ex: embalagem, envelope, fita..."
            className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-2 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60 placeholder:text-stone-600" />
          <datalist id="lista-cats">{CATS.map((c) => <option key={c} value={c} />)}</datalist>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {CATS.map((c) => (
              <button key={c} type="button" onClick={() => setForm((f) => ({ ...f, categoria: c }))}
                className={`text-[10px] rounded px-1.5 py-0.5 border transition-colors ${form.categoria === c ? "bg-orange-500 border-orange-500 text-white" : "border-stone-700 text-stone-400 hover:text-stone-200"}`}>{c}</button>
            ))}
          </div>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="text-[11px] text-stone-400">Valor total</span><In value={form.valor || ""} prefix="R$" placeholder="ex: 33,50" onChange={(e) => setForm((f) => ({ ...f, valor: num(e) }))} w="mt-1" /></label>
          <label className="block"><span className="text-[11px] text-stone-400">Quantidade</span><In value={form.qtd || ""} placeholder="ex: 50" onChange={(e) => setForm((f) => ({ ...f, qtd: Math.max(0, Math.round(num(e))) }))} w="mt-1" /></label>
        </div>
        {form.qtd > 1 && form.valor > 0 && (
          <p className="text-[11px] text-stone-400 bg-black/20 rounded-lg px-2.5 py-1.5">Custo unitário: <Mono className="text-stone-200">{brl(form.valor / form.qtd)}</Mono> <span className="text-stone-500">· {form.qtd} un</span></p>
        )}
        <label className="block">
          <span className="text-[11px] text-stone-400">Data</span>
          <div className="mt-1 flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-1.5 text-sm text-stone-300 cursor-pointer select-none">
              <input type="checkbox" checked={form.hoje} onChange={(e) => setForm((f) => ({ ...f, hoje: e.target.checked, data: e.target.checked ? toYMD(new Date()) : f.data }))} className="accent-orange-500 w-4 h-4" />
              Hoje
            </label>
            {!form.hoje && (
              <input type="date" value={form.data} onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))} className={dateInput} />
            )}
          </div>
        </label>
        <label className="block">
          <span className="text-[11px] text-stone-400">Descrição (opcional)</span>
          <input value={form.obs} onChange={(e) => setForm((f) => ({ ...f, obs: e.target.value }))} placeholder="ex: 100 saquinhos, rolo de fita..."
            className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-2 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60 placeholder:text-stone-600" />
        </label>
        <button onClick={registrar} disabled={!form.categoria.trim() || !(form.valor > 0)}
          className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          Adicionar despesa
        </button>
      </Card>

      {/* período */}
      <div className="flex items-center justify-between">
        <Seg options={[{ v: "tudo", label: "Tudo" }, { v: "ano", label: "Este ano" }, { v: "mes", label: "Este mês" }]} value={per} onChange={setPer} />
        <span className="text-[11px] text-stone-500">{rotPer}</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Despesas" icon={TrendingDown} valor={brl(despesaPer)} cor="text-rose-400" />
        <Stat label="Lançamentos" icon={Receipt} valor={String(despFiltradas.length)} />
      </div>

      {/* despesas por categoria */}
      {porCategoria.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-stone-300 mb-3">Despesas por categoria <span className="text-[11px] font-normal text-stone-500">· {rotPer}</span></h3>
          <div className="space-y-2.5">
            {porCategoria.map((c) => (
              <div key={c.cat}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-300">{c.cat}</span>
                  <Mono className="text-stone-300">{brl(c.total)}</Mono>
                </div>
                <div className="h-1.5 bg-stone-800 rounded mt-1 overflow-hidden">
                  <div className="h-full bg-rose-400/70 rounded" style={{ width: (c.total / maxCat) * 100 + "%" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* lista de despesas */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-stone-300 mb-3">Lançamentos <span className="text-[11px] font-normal text-stone-500">· {rotPer}</span></h3>
        {despFiltradas.length === 0 ? (
          <p className="text-xs text-stone-600 text-center py-3">Nenhuma despesa nesse período. Adicione seus gastos com embalagem, postagem, insumos, etc.</p>
        ) : (
          <div className="space-y-1.5">
            {despFiltradas.map((e) => {
              const dt = new Date(e.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
              const q = e.qtd || 1;
              return (
                <div key={e.id} className="flex items-center gap-2 bg-black/20 rounded-lg px-2.5 py-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-stone-200 truncate">{e.categoria}{q > 1 ? <span className="text-stone-500"> ×{q}</span> : null}{e.obs ? <span className="text-stone-500"> · {e.obs}</span> : null}</div>
                    <div className="text-[10px] text-stone-500">{dt}{q > 1 ? ` · ${brl(e.valor / q)}/un` : ""}</div>
                  </div>
                  <Mono className="text-rose-400 text-sm shrink-0">−{brl(e.valor)}</Mono>
                  <button onClick={() => excluir(e.id)} className="text-stone-600 hover:text-rose-400 p-1 shrink-0"><Trash2 size={14} /></button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---------- ABA SHOPEE (alteração em massa) ---------- */
function ShopeeTab({ data, g }) {
  const [fileName, setFileName] = useState("");
  const [wb, setWb] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [erro, setErro] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [gerando, setGerando] = useState(false);

  const produtos = data.produtos;
  const precoDe = (pid) => {
    const p = produtos.find((x) => x.id === pid);
    if (!p) return null;
    return precosProduto(p, data.itens, g).shopee.preco;
  };

  const detectarTipo = (nome) => {
    const n = (nome || "").toLowerCase();
    if (n.includes("abridor")) return { tipo: "chaveiro_abridor", label: "Chaveiro abridor de garrafas" };
    if (n.includes("chaveiro")) return { tipo: "chaveiro_botton", label: "Chaveiro botton" };
    if (n.includes("espelho")) return { tipo: "espelho", label: "Espelho" };
    if (/kit\s*10/.test(n)) return { tipo: "kit10", label: "Kit 10 bottons" };
    if (/kit\s*5/.test(n)) return { tipo: "kit5", label: "Kit 5 bottons" };
    if (/kit\s*3/.test(n)) return { tipo: "kit3", label: "Kit 3 bottons" };
    return { tipo: "avulso", label: "Botton avulso" };
  };

  const palpiteProduto = (tipo) => {
    const has = (p, s) => (p.nome || "").toLowerCase().includes(s);
    const uni = (p) => p.tipo === "unidade";
    let f = null;
    if (tipo === "chaveiro_abridor") f = produtos.find((p) => has(p, "abridor"));
    else if (tipo === "chaveiro_botton") f = produtos.find((p) => has(p, "chaveiro") && !has(p, "abridor"));
    else if (tipo === "espelho") f = produtos.find((p) => has(p, "espelho"));
    else if (tipo === "kit10") f = produtos.find((p) => p.tipo === "kit" && (p.qtd || 0) === 10);
    else if (tipo === "kit5") f = produtos.find((p) => p.tipo === "kit" && (p.qtd || 0) === 5);
    else if (tipo === "kit3") f = produtos.find((p) => p.tipo === "kit" && (p.qtd || 0) === 3);
    else if (tipo === "avulso") f = produtos.find((p) => uni(p) && (has(p, "botton") || has(p, "boton")) && !has(p, "chaveiro") && !has(p, "abridor") && !has(p, "espelho")) || produtos.find((p) => uni(p));
    return f ? f.id : "";
  };

  const fmtPreco = (n) => (n != null && isFinite(n) ? Number(n).toFixed(2) : "");

  async function carregar(file) {
    setErro(""); setOkMsg(""); setGrupos([]); setWb(null); setFileName("");
    try {
      const buf = await file.arrayBuffer();
      const workbook = XLSX.read(buf, { type: "array" });
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      if (!ws || !ws["!ref"]) throw new Error("planilha vazia");
      const a1 = ws["A1"] ? String(ws["A1"].v || "") : "";
      if (a1.indexOf("et_title") !== 0) throw new Error("não parece a planilha de alteração em massa da Shopee");
      const range = XLSX.utils.decode_range(ws["!ref"]);
      const getv = (r0, c) => { const cc = ws[XLSX.utils.encode_cell({ r: r0, c })]; return cc == null ? "" : cc.v; };
      const byTipo = {};
      for (let r0 = 6; r0 <= range.e.r; r0++) {
        const pid = getv(r0, 0);
        if (pid === "" || pid == null) continue;
        const nome = String(getv(r0, 1) || "");
        const preco = getv(r0, 6);
        const det = detectarTipo(nome);
        if (!byTipo[det.tipo]) byTipo[det.tipo] = { tipo: det.tipo, label: det.label, rows: [], listings: new Set(), precos: {}, exemplo: nome };
        const grp = byTipo[det.tipo];
        grp.rows.push(r0);
        grp.listings.add(pid);
        const pk = String(preco);
        grp.precos[pk] = (grp.precos[pk] || 0) + 1;
      }
      const ordem = ["avulso", "kit3", "kit5", "kit10", "chaveiro_botton", "chaveiro_abridor", "espelho"];
      const gs = Object.values(byTipo).sort((a, b) => (ordem.indexOf(a.tipo) - ordem.indexOf(b.tipo)));
      if (!gs.length) throw new Error("nenhum anúncio encontrado (os dados começam na linha 7)");
      const gruposIni = gs.map((grp) => {
        const precoAtual = Object.entries(grp.precos).sort((a, b) => b[1] - a[1])[0][0];
        const pid = palpiteProduto(grp.tipo);
        return {
          tipo: grp.tipo, label: grp.label, nAnuncios: grp.listings.size, nRows: grp.rows.length,
          rows: grp.rows, precoAtual, exemplo: grp.exemplo,
          produtoId: pid, preco: pid ? fmtPreco(precoDe(pid)) : "", estoque: "",
        };
      });
      setWb(workbook); setFileName(file.name); setGrupos(gruposIni);
    } catch (e) {
      setErro("Não consegui ler o arquivo: " + (e && e.message ? e.message : "erro") + ".");
    }
  }

  const setProduto = (i, pid) => setGrupos((gs) => gs.map((x, j) => (j === i ? { ...x, produtoId: pid, preco: pid ? fmtPreco(precoDe(pid)) : "" } : x)));
  const setPreco = (i, v) => setGrupos((gs) => gs.map((x, j) => (j === i ? { ...x, preco: v } : x)));
  const setEstoque = (i, v) => setGrupos((gs) => gs.map((x, j) => (j === i ? { ...x, estoque: v } : x)));

  const limpar = () => { setWb(null); setGrupos([]); setFileName(""); setErro(""); setOkMsg(""); };

  async function gerar() {
    setErro(""); setOkMsg(""); setGerando(true);
    try {
      if (!wb) throw new Error("suba um arquivo primeiro");
      const ws = wb.Sheets[wb.SheetNames[0]];
      let mudou = 0;
      grupos.forEach((grp) => {
        const precoNum = parseFloat(String(grp.preco).replace(",", "."));
        const precoTxt = !isNaN(precoNum) && precoNum > 0 ? precoNum.toFixed(2) : null;
        const estStr = String(grp.estoque).trim();
        const estTxt = estStr !== "" && !isNaN(parseInt(estStr, 10)) ? String(Math.max(0, parseInt(estStr, 10))) : null;
        grp.rows.forEach((r0) => {
          if (precoTxt != null) { ws[XLSX.utils.encode_cell({ r: r0, c: 6 })] = { t: "s", v: precoTxt }; mudou++; }
          if (estTxt != null) { ws[XLSX.utils.encode_cell({ r: r0, c: 8 })] = { t: "s", v: estTxt }; }
        });
      });
      if (!mudou) throw new Error("nenhum preço definido");
      const out = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      await entregar(blob, fileName || "shopee-precos.xlsx");
      setOkMsg("Planilha gerada! Confira e suba no Seller Center da Shopee.");
    } catch (e) {
      setErro("Não consegui gerar: " + (e && e.message ? e.message : "erro") + ".");
    } finally {
      setGerando(false);
    }
  }

  const totalAnuncios = grupos.reduce((s, x) => s + x.nAnuncios, 0);

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-stone-300 flex items-center gap-2"><FileSpreadsheet size={15} className="text-orange-500" />Alteração em massa Shopee</h3>
        <p className="text-[11px] text-stone-500 -mt-1">Baixe a planilha de "alteração em massa de preço/estoque" no Seller Center, suba aqui, ajuste pelos seus produtos e gere o arquivo pronto pra subir de volta.</p>
        <label className="block">
          <input type="file" accept=".xlsx"
            onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) carregar(f); e.target.value = ""; }}
            className="block w-full text-xs text-stone-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:font-semibold file:text-xs hover:file:bg-orange-400 file:cursor-pointer" />
        </label>
        {fileName && (
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="text-stone-400 truncate">Arquivo: <span className="text-stone-300">{fileName}</span></span>
            <button onClick={limpar} className="text-stone-500 hover:text-rose-400 shrink-0 flex items-center gap-1"><X size={12} />limpar</button>
          </div>
        )}
        {erro && grupos.length === 0 && <p className="text-[11px] text-rose-400">{erro}</p>}
      </Card>

      {grupos.length > 0 && (
        <>
          <Card className="p-3">
            <p className="text-[11px] text-stone-400">Encontrei <span className="text-stone-200 font-semibold">{totalAnuncios} anúncios</span> em {grupos.length} grupo(s). Confira o produto e o preço de cada grupo — o preço vem da aba Produtos, mas dá pra editar aqui:</p>
          </Card>

          {grupos.map((grp, i) => (
            <Card key={grp.tipo} className="p-3 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-stone-200">{grp.label}</span>
                <span className="text-[10px] text-stone-500 shrink-0">{grp.nAnuncios} anúncios · atual {brl(Number(String(grp.precoAtual).replace(",", ".")) || 0)}</span>
              </div>
              <p className="text-[10px] text-stone-600 truncate">ex: {grp.exemplo}</p>
              <label className="block">
                <span className="text-[11px] text-stone-400">Produto (puxa o preço)</span>
                <select value={grp.produtoId} onChange={(e) => setProduto(i, e.target.value)}
                  className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-2 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60">
                  <option value="">— escolher produto —</option>
                  {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome}{p.tipo === "kit" ? " (kit)" : ""}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="text-[11px] text-stone-400">Novo preço</span><In value={grp.preco} prefix="R$" placeholder="—" onChange={(e) => setPreco(i, e.target.value)} w="mt-1" /></label>
                <label className="block"><span className="text-[11px] text-stone-400">Estoque</span><In value={grp.estoque} placeholder="manter" onChange={(e) => setEstoque(i, e.target.value)} w="mt-1" /></label>
              </div>
            </Card>
          ))}

          <button onClick={gerar} disabled={gerando}
            className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <Download size={16} />{gerando ? "Gerando…" : "Gerar planilha"}
          </button>
          {okMsg && <p className="text-[11px] text-emerald-400 text-center">{okMsg}</p>}
          {erro && <p className="text-[11px] text-rose-400 text-center">{erro}</p>}
          <p className="text-[10px] text-stone-600 text-center">O arquivo sai idêntico ao original (mesmos códigos e formato), só com preço/estoque trocados. Teste subir na Shopee antes de confiar 100%.</p>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("produtos");

  useEffect(() => {
    let done = false;
    const aplicar = (d) => {
      if (done) return;
      done = true;
      try {
        d.global = { ...DEFAULT.global, ...(d.global || {}) };
        if (!d.itens?.length) d.itens = DEFAULT.itens;
        d.produtos = (d.produtos || []).map((p) => ({ tipo: "unidade", qtd: 1, vendeAtacado: true, ...p }));
        if (!d.vendas) d.vendas = [];
        if (!d.despesas) d.despesas = [];
      } catch {}
      setData(d);
    };
    const t = setTimeout(() => aplicar(DEFAULT), 2500);
    (async () => {
      let d = null;
      try { const r = await storage.get(KEY); if (r) d = JSON.parse(r.value); } catch {}
      if (!d) { try { const r2 = await storage.get(KEY_V2); if (r2) d = migrarV3(JSON.parse(r2.value)); } catch {} }
      clearTimeout(t);
      aplicar(d || DEFAULT);
    })();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { if (data) storage.set(KEY, JSON.stringify(data)).catch(() => {}); }, [data]);

  if (!data) return <div style={{ background: "#0f0d0c", minHeight: "100vh" }} className="flex flex-col items-center justify-center gap-3"><img src={LOGO} alt="Bottons do Lucas" className="w-24 h-24 opacity-90" /><span className="text-stone-600 text-sm">carregando…</span></div>;

  const g = data.global;
  const setG = (ng) => setData((d) => ({ ...d, global: ng }));

  const updItem = (id, patch) => setData((d) => ({ ...d, itens: d.itens.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));
  const addItem = () => {
    const id = "i" + Date.now();
    setData((d) => ({ ...d, itens: [...d.itens, { id, nome: "Novo item", cor: PALETA[d.itens.length % PALETA.length], matQtd: 0, matValor: 0, bpf: 0 }] }));
    return id;
  };
  const delItem = (id) => setData((d) => ({ ...d, itens: d.itens.filter((i) => i.id !== id) }));

  const updProd = (id, patch) => setData((d) => ({ ...d, produtos: d.produtos.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  const addProd = () => {
    const id = "p" + Date.now();
    setData((d) => ({ ...d, produtos: [...d.produtos, { id, nome: "", itemId: "", tipo: "unidade", qtd: 1, vendeAtacado: false, margemNormal: 60, margemAtacado: 35, margemShopee: 30 }] }));
    return id;
  };
  const delProd = (id) => setData((d) => ({ ...d, produtos: d.produtos.filter((p) => p.id !== id) }));

  const tabs = [
    { id: "produtos", label: "Produtos", icon: Package },
    { id: "custo", label: "Custo", icon: Calculator },
    { id: "vendas", label: "Vendas", icon: ShoppingBag },
    { id: "despesas", label: "Despesas", icon: TrendingDown },
    { id: "financeiro", label: "Financeiro", icon: Wallet },
    { id: "relatorios", label: "Tabela de preços", icon: FileText },
    { id: "shopee", label: "Shopee", icon: FileSpreadsheet },
  ];

  return (
    <div style={{ background: "#0f0d0c", minHeight: "100vh", colorScheme: "dark" }} className="text-stone-200">

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <header className="pt-6 pb-4">
          <div className="flex items-center gap-2.5">
            <img src={LOGO} alt="Bottons do Lucas" className="w-12 h-12 shrink-0" />
            <div>
              <h1 className="text-lg font-bold text-stone-100 leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Bottons do Lucas</h1>
              <p className="text-[11px] text-stone-500 mt-0.5">custo · preços · vendas</p>
            </div>
          </div>
        </header>

        <nav className="grid grid-cols-3 md:grid-cols-6 gap-1 bg-stone-900 border border-stone-800 rounded-xl p-1 mb-5 sticky top-2 z-10">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 rounded-lg transition-colors ${tab === t.id ? "bg-orange-500 text-white font-semibold" : "text-stone-400 hover:text-stone-200"}`}>
                <Icon size={16} className="shrink-0" /><span className="text-[10px] leading-none truncate max-w-full">{t.label}</span>
              </button>
            );
          })}
        </nav>

        {tab === "produtos" && <ProdutosTab data={data} g={g} setG={setG} updProd={updProd} addProd={addProd} delProd={delProd} />}
        {tab === "custo" && <CustoTab data={data} g={g} setG={setG} updItem={updItem} addItem={addItem} delItem={delItem} />}
        {tab === "vendas" && <VendasTab data={data} g={g} setData={setData} />}
        {tab === "despesas" && <DespesasTab data={data} setData={setData} />}
        {tab === "financeiro" && <FinanceiroTab data={data} g={g} />}
        {tab === "relatorios" && <RelatoriosTab data={data} g={g} setData={setData} />}
        {tab === "shopee" && <ShopeeTab data={data} g={g} />}
      </div>
    </div>
  );
}
