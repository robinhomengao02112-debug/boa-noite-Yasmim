"""FIFA 22 MOD MENU - app de mods offline para o FIFA 22 (PC).

O app guarda o que voce ligou e gera um script Lua para o
FIFA 22 Live Editor. Dentro do jogo: F11 > Lua Engine > Execute.
Nao usa controle, nao mexe no jogo online.
"""
import json
import os
import random
import subprocess
import sys
import time
import tkinter as tk
import webbrowser
from tkinter import filedialog, messagebox, ttk

APP = "FIFA 22 MOD MENU"
VERSAO = "1.0"

if getattr(sys, "frozen", False):
    BASE = os.path.dirname(sys.executable)
    RECURSOS = getattr(sys, "_MEIPASS", BASE)
else:
    BASE = os.path.dirname(os.path.abspath(__file__))
    RECURSOS = BASE

PONTE = os.path.join(BASE, "ponte")
CONFIG = os.path.join(BASE, "config.json")
MODELO = os.path.join(RECURSOS, "modelo_mod.lua")
SCRIPT = os.path.join(PONTE, "FIFA22_MODMENU.lua")

# ------------------------------------------------------------ visual
FUNDO = "#07090c"
PAINEL = "#0e1319"
BORDA = "#1c2a36"
NEON = "#39ff88"
NEON_ESCURO = "#0f5c33"
ROSA = "#ff3d7f"
AMARELO = "#ffd23d"
TEXTO = "#cfe8da"
APAGADO = "#5d7a6c"
FONTE = "Consolas"

BUFFS = [
    ("chute", "CHUTE TELEGUIADO", "Finalização, força, curva e frieza 99. Bateu, é gol."),
    ("drible", "DRIBLE FANTASMA", "Drible, controle, agilidade e equilíbrio 99 + 5 estrelas de drible e perna ruim."),
    ("turbo", "TURBO NITRO", "Aceleração, velocidade e fôlego 99. Ninguém te alcança."),
    ("passe", "PASSE LASER", "Passe curto, longo, visão e cruzamento 99."),
    ("tanque", "MODO TANQUE", "Força, impulsão e cabeceio 99. Ganha todas no corpo."),
    ("zaga", "ZAGA BLINDADA", "Marcação, desarme e interceptação 99 nos seus jogadores."),
    ("muralha", "GOLEIRO MURALHA", "Seu goleiro com reflexo, posição e mergulho 99."),
    ("ovr99", "OVERALL 99 (VISUAL)", "Mostra 99 de geral no seu time inteiro. Só aparência."),
]
SABOTAGENS = [
    ("peneira", "GOLEIRO PENEIRA", "Goleiro adversário não pega nada."),
    ("gelatina", "ZAGA DE GELATINA", "Zagueiros adversários sem marcação, desarme ou força."),
    ("lesma", "ADVERSÁRIO LESMA", "O time deles fica lento e demora a reagir."),
    ("pernadepau", "PERNA DE PAU", "Atacantes adversários erram passe, chute e drible."),
]
CARREIRA = [
    ("moral", "VESTIÁRIO EM FESTA", "Moral, forma e ritmo de jogo no máximo (só Modo Carreira)."),
]
PRESETS = {
    "MODO DEUS": ({k for k, *_ in BUFFS + SABOTAGENS}, 99, 10),
    "MODO DISCRETO": ({"chute", "drible", "peneira"}, 88, 45),
    "SÓ SABOTAGEM": ({k for k, *_ in SABOTAGENS}, 99, 20),
}
FRASES = [
    "calibrando o pé direito do camisa 10...",
    "ensinando o goleiro adversário a pular atrasado...",
    "passando sabão na chuteira da zaga...",
    "afiando a curva da bola...",
    "subornando a física do jogo...",
    "desligando o radar do zagueiro...",
]


def ler_json(caminho, padrao):
    try:
        with open(caminho, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return padrao


def lua_str(s):
    s = str(s).replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")
    return '"' + s + '"'


class Toggle(tk.Canvas):
    """Chave liga/desliga desenhada (estilo mod menu)."""

    def __init__(self, master, var, cor=NEON, comando=None):
        super().__init__(master, width=46, height=22, bg=PAINEL, highlightthickness=0, cursor="hand2")
        self.var, self.cor, self.comando = var, cor, comando
        self.bind("<Button-1>", self._clique)
        var.trace_add("write", lambda *_: self._desenhar())
        self._desenhar()

    def _clique(self, _e=None):
        self.var.set(not self.var.get())
        if self.comando:
            self.comando()

    def _desenhar(self):
        self.delete("all")
        on = self.var.get()
        self.create_rectangle(2, 3, 44, 19, outline=self.cor if on else BORDA, width=2,
                              fill=NEON_ESCURO if (on and self.cor == NEON) else ("#4a1328" if on else FUNDO))
        x = 33 if on else 13
        self.create_rectangle(x - 8, 6, x + 8, 16, outline="", fill=self.cor if on else APAGADO)


class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title(f"{APP}  v{VERSAO}")
        self.configure(bg=FUNDO)
        self.geometry("1080x780")
        self.minsize(980, 740)
        icone = os.path.join(RECURSOS, "app.ico")
        if os.path.exists(icone):
            try:
                self.iconbitmap(icone)
            except Exception:
                pass
        os.makedirs(PONTE, exist_ok=True)
        self.cfg = ler_json(CONFIG, {})
        self.vars = {}
        self.ultimo_resultado = 0.0
        self._estilos()
        self._montar()
        self._carregar_cfg()
        self._atualizar_status()
        self.after(800, self._vigiar_resultado)
        self._piscar()
        self.protocol("WM_DELETE_WINDOW", self._fechar)

    # -------------------------------------------------------- layout
    def _estilos(self):
        st = ttk.Style(self)
        st.theme_use("clam")
        st.configure("TCombobox", fieldbackground=FUNDO, background=PAINEL, foreground=NEON,
                     arrowcolor=NEON, bordercolor=BORDA, lightcolor=BORDA, darkcolor=BORDA)
        st.map("TCombobox", fieldbackground=[("readonly", FUNDO)], foreground=[("readonly", NEON)])
        self.option_add("*TCombobox*Listbox.background", FUNDO)
        self.option_add("*TCombobox*Listbox.foreground", NEON)
        self.option_add("*TCombobox*Listbox.selectBackground", NEON_ESCURO)
        st.configure("Treeview", background=FUNDO, fieldbackground=FUNDO, foreground=TEXTO,
                     bordercolor=BORDA, rowheight=22, font=(FONTE, 9))
        st.configure("Treeview.Heading", background=PAINEL, foreground=NEON, font=(FONTE, 9, "bold"))
        st.map("Treeview", background=[("selected", NEON_ESCURO)])
        st.configure("Horizontal.TScale", background=PAINEL, troughcolor=FUNDO)

    def _painel(self, master, titulo, cor=NEON):
        f = tk.Frame(master, bg=PAINEL, highlightbackground=BORDA, highlightthickness=1)
        tk.Label(f, text=f"// {titulo}", bg=PAINEL, fg=cor, font=(FONTE, 11, "bold"),
                 anchor="w").pack(fill="x", padx=12, pady=(10, 4))
        return f

    def _linha_toggle(self, master, chave, nome, dica, cor=NEON):
        var = tk.BooleanVar(value=False)
        self.vars[chave] = var
        linha = tk.Frame(master, bg=PAINEL)
        linha.pack(fill="x", padx=12, pady=3)
        Toggle(linha, var, cor, comando=self._mudou).pack(side="left")
        txt = tk.Frame(linha, bg=PAINEL)
        txt.pack(side="left", fill="x", expand=True, padx=(10, 0))
        lb = tk.Label(txt, text=nome, bg=PAINEL, fg=TEXTO, font=(FONTE, 10, "bold"), anchor="w")
        lb.pack(fill="x")
        d = tk.Label(txt, text=dica, bg=PAINEL, fg=APAGADO, font=(FONTE, 8), anchor="w",
                     justify="left", wraplength=220)
        d.pack(fill="x")
        txt.bind("<Configure>", lambda ev: d.configure(wraplength=max(120, ev.width - 4)))
        var.trace_add("write", lambda *_: lb.configure(fg=cor if var.get() else TEXTO))

    def _botao(self, master, texto, cmd, cor=NEON, grande=False):
        b = tk.Label(master, text=texto, bg=FUNDO, fg=cor, cursor="hand2",
                     font=(FONTE, 13 if grande else 9, "bold"), padx=14, pady=10 if grande else 5,
                     highlightbackground=cor, highlightthickness=1)
        b.bind("<Button-1>", lambda _e: cmd())
        b.bind("<Enter>", lambda _e: b.configure(bg=cor, fg=FUNDO))
        b.bind("<Leave>", lambda _e: b.configure(bg=FUNDO, fg=cor))
        return b

    def _montar(self):
        # topo
        topo = tk.Frame(self, bg=FUNDO)
        topo.pack(fill="x", padx=16, pady=(14, 6))
        tk.Label(topo, text="⚽ FIFA 22 // MOD MENU", bg=FUNDO, fg=NEON,
                 font=(FONTE, 20, "bold")).pack(side="left")
        self.lb_pisca = tk.Label(topo, text="● OFFLINE ONLY", bg=FUNDO, fg=ROSA, font=(FONTE, 10, "bold"))
        self.lb_pisca.pack(side="left", padx=14, pady=(8, 0))
        self.lb_status = tk.Label(topo, text="", bg=FUNDO, fg=APAGADO, font=(FONTE, 9), justify="right")
        self.lb_status.pack(side="right")

        corpo = tk.Frame(self, bg=FUNDO)
        corpo.pack(fill="both", expand=True, padx=16, pady=6)
        corpo.columnconfigure(0, weight=1, uniform="c")
        corpo.columnconfigure(1, weight=1, uniform="c")
        corpo.columnconfigure(2, weight=1, uniform="c")
        corpo.rowconfigure(0, weight=1)

        # coluna 1: buffs
        c1 = self._painel(corpo, "SEU TIME: PODERES")
        c1.grid(row=0, column=0, sticky="nsew", padx=(0, 8))
        for k, n, d in BUFFS:
            self._linha_toggle(c1, k, n, d)
        self._slider(c1, "forca", "FORÇA DOS PODERES", 60, 99, 99, NEON)

        # coluna 2: sabotagem + carreira
        c2 = tk.Frame(corpo, bg=FUNDO)
        c2.grid(row=0, column=1, sticky="nsew", padx=8)
        s = self._painel(c2, "SABOTAGEM NO ADVERSÁRIO", ROSA)
        s.pack(fill="x")
        for k, n, d in SABOTAGENS:
            self._linha_toggle(s, k, n, d, ROSA)
        self._slider(s, "fraqueza", "NÍVEL DO ADVERSÁRIO (menor = pior)", 1, 70, 20, ROSA)

        car = self._painel(c2, "MODO CARREIRA", AMARELO)
        car.pack(fill="x", pady=(12, 0))
        for k, n, d in CARREIRA:
            self._linha_toggle(car, k, n, d, AMARELO)
        lin = tk.Frame(car, bg=PAINEL)
        lin.pack(fill="x", padx=12, pady=(4, 6))
        tk.Label(lin, text="VERBA ($):", bg=PAINEL, fg=TEXTO, font=(FONTE, 9, "bold")).pack(side="left")
        self.e_verba = self._entrada(lin, 14)
        self.e_verba.pack(side="left", padx=8)
        tk.Label(car, text="Deixe vazio para não mexer na verba.", bg=PAINEL, fg=APAGADO,
                 font=(FONTE, 8), anchor="w").pack(fill="x", padx=12, pady=(0, 10))

        # presets
        pre = self._painel(c2, "ATALHOS")
        pre.pack(fill="x", pady=(12, 0))
        lp = tk.Frame(pre, bg=PAINEL)
        lp.pack(fill="x", padx=12, pady=(2, 12))
        lp.columnconfigure(0, weight=1, uniform="p")
        lp.columnconfigure(1, weight=1, uniform="p")
        botoes = [(n, lambda n=n: self._preset(n), ROSA if n == "SÓ SABOTAGEM" else NEON) for n in PRESETS]
        botoes.append(("DESLIGAR TUDO", self._desligar, AMARELO))
        for i, (texto, cmd, cor) in enumerate(botoes):
            self._botao(lp, texto, cmd, cor).grid(row=i // 2, column=i % 2, padx=3, pady=3, sticky="ew")

        # coluna 3: times, craques, console
        c3 = tk.Frame(corpo, bg=FUNDO)
        c3.grid(row=0, column=2, sticky="nsew", padx=(8, 0))
        t = self._painel(c3, "TIMES")
        t.pack(fill="x")
        self.cb_meu = self._combo(t, "SEU TIME (fora da Carreira):")
        self.cb_adv = self._combo(t, "SÓ CONTRA (opcional, vazio = todos):")
        tk.Label(t, text="No Modo Carreira o seu time é detectado sozinho.", bg=PAINEL, fg=APAGADO,
                 font=(FONTE, 8), anchor="w").pack(fill="x", padx=12, pady=(0, 10))

        cq = self._painel(c3, "CRAQUES (99 EM TUDO)")
        cq.pack(fill="x", pady=(12, 0))
        self.e_craques = self._entrada(cq, 30)
        self.e_craques.pack(fill="x", padx=12, pady=(0, 2))
        tk.Label(cq, text="Nomes separados por vírgula. Ex.: Vinícius Jr, Neymar", bg=PAINEL, fg=APAGADO,
                 font=(FONTE, 8), anchor="w").pack(fill="x", padx=12, pady=(0, 10))
        self.e_craques.bind("<KeyRelease>", lambda _e: self._mudou())

        con = self._painel(c3, "CONSOLE")
        con.pack(fill="both", expand=True, pady=(12, 0))
        self.console = tk.Text(con, bg=FUNDO, fg=NEON, font=(FONTE, 9), height=8, bd=0,
                               insertbackground=NEON, wrap="word", highlightthickness=0)
        self.console.pack(fill="both", expand=True, padx=12, pady=(0, 12))
        self.console.tag_configure("rosa", foreground=ROSA)
        self.console.tag_configure("amarelo", foreground=AMARELO)
        self.console.tag_configure("apagado", foreground=APAGADO)

        # rodape
        rod = tk.Frame(self, bg=FUNDO)
        rod.pack(fill="x", padx=16, pady=(6, 14), side="bottom", before=corpo)
        self._botao(rod, "▶ APLICAR NO JOGO", self._aplicar, NEON, grande=True).pack(side="left")
        self.lb_pendente = tk.Label(rod, text="", bg=FUNDO, fg=AMARELO, font=(FONTE, 9, "bold"))
        self.lb_pendente.pack(side="left", padx=12)
        self._botao(rod, "COMO USAR", self._ajuda).pack(side="right")
        self._botao(rod, "SEU ELENCO", self._elenco).pack(side="right", padx=6)
        self._botao(rod, "ABRIR LIVE EDITOR", self._abrir_live).pack(side="right")
        self._botao(rod, "COPIAR CAMINHO DO SCRIPT", self._copiar).pack(side="right", padx=6)

    def _entrada(self, master, largura):
        return tk.Entry(master, width=largura, bg=FUNDO, fg=NEON, insertbackground=NEON, bd=0,
                        font=(FONTE, 10), highlightbackground=BORDA, highlightcolor=NEON, highlightthickness=1)

    def _combo(self, master, rotulo):
        tk.Label(master, text=rotulo, bg=PAINEL, fg=TEXTO, font=(FONTE, 9, "bold"),
                 anchor="w").pack(fill="x", padx=12, pady=(4, 2))
        cb = ttk.Combobox(master, font=(FONTE, 10))
        cb.pack(fill="x", padx=12, pady=(0, 6))
        cb.bind("<<ComboboxSelected>>", lambda _e: self._mudou())
        cb.bind("<KeyRelease>", lambda _e: self._mudou())
        return cb

    def _slider(self, master, chave, rotulo, de, ate, padrao, cor):
        var = tk.IntVar(value=padrao)
        self.vars[chave] = var
        lin = tk.Frame(master, bg=PAINEL)
        lin.pack(fill="x", padx=12, pady=(8, 12))
        lb = tk.Label(lin, text="", bg=PAINEL, fg=cor, font=(FONTE, 9, "bold"), anchor="w")
        lb.pack(fill="x")
        sc = tk.Scale(lin, from_=de, to=ate, orient="horizontal", variable=var, showvalue=False,
                      bg=cor, fg=cor, troughcolor=BORDA, highlightthickness=0, bd=0, width=12,
                      sliderlength=22, sliderrelief="flat", activebackground=TEXTO,
                      command=lambda _v: self._mudou())
        sc.pack(fill="x")
        atual = lambda *_: lb.configure(text=f"{rotulo}: {var.get()}")
        var.trace_add("write", atual)
        atual()

    # -------------------------------------------------------- estado
    def _estado(self):
        ligados = {k: bool(v.get()) for k, v in self.vars.items() if isinstance(v, tk.BooleanVar)}
        craques = [c.strip() for c in self.e_craques.get().split(",") if c.strip()]
        verba = "".join(ch for ch in self.e_verba.get() if ch.isdigit())
        return {
            "ligados": ligados,
            "forca": int(self.vars["forca"].get()),
            "fraqueza": int(self.vars["fraqueza"].get()),
            "meu_time": self.cb_meu.get().strip(),
            "adversario": self.cb_adv.get().strip(),
            "craques": craques,
            "verba": int(verba) if verba else 0,
        }

    def _carregar_cfg(self):
        e = self.cfg.get("estado", {})
        for k, v in e.get("ligados", {}).items():
            if k in self.vars:
                self.vars[k].set(bool(v))
        for k in ("forca", "fraqueza"):
            if k in e:
                self.vars[k].set(int(e[k]))
        self.cb_meu.set(e.get("meu_time", ""))
        self.cb_adv.set(e.get("adversario", ""))
        self.e_craques.insert(0, ", ".join(e.get("craques", [])))
        if e.get("verba"):
            self.e_verba.insert(0, str(e["verba"]))
        self._carregar_times()
        self.lb_pendente.configure(text="")
        self._log("mod menu pronto. ligue os poderes e clique em APLICAR NO JOGO.", "apagado")

    def _salvar_cfg(self):
        self.cfg["estado"] = self._estado()
        try:
            with open(CONFIG, "w", encoding="utf-8") as f:
                json.dump(self.cfg, f, ensure_ascii=False, indent=2)
        except OSError as ex:
            self._log(f"[X] não consegui salvar a configuração: {ex}", "rosa")

    def _mudou(self):
        self.lb_pendente.configure(text="● mudanças ainda não aplicadas")

    def _carregar_times(self):
        caminho = os.path.join(PONTE, "times.txt")
        try:
            with open(caminho, "r", encoding="utf-8", errors="replace") as f:
                times = [l.strip() for l in f if l.strip()]
        except OSError:
            times = []
        self.cb_meu["values"] = times
        self.cb_adv["values"] = [""] + times

    # -------------------------------------------------------- acoes
    def _preset(self, nome):
        ligar, forca, fraqueza = PRESETS[nome]
        for k, v in self.vars.items():
            if isinstance(v, tk.BooleanVar) and k != "moral":
                v.set(k in ligar)
        self.vars["forca"].set(forca)
        self.vars["fraqueza"].set(fraqueza)
        self._mudou()
        self._log(f"> preset {nome} carregado.", "amarelo")

    def _desligar(self):
        for v in self.vars.values():
            if isinstance(v, tk.BooleanVar):
                v.set(False)
        self.e_craques.delete(0, "end")
        self._mudou()
        self._log("> tudo desligado. Aplique para o jogo voltar ao normal.", "amarelo")

    def _aplicar(self):
        e = self._estado()
        poderes = [k for k, v in e["ligados"].items() if v and k != "moral"]
        if poderes and not e["meu_time"]:
            self._log("[!] Fora do Modo Carreira o script precisa saber o SEU TIME. "
                      "No Modo Carreira pode deixar vazio.", "amarelo")
        e["id"] = str(int(time.time()))
        try:
            with open(MODELO, "r", encoding="utf-8") as f:
                modelo = f.read()
            with open(SCRIPT, "w", encoding="utf-8") as f:
                f.write(modelo.replace("%%PONTE%%", PONTE))
            with open(os.path.join(PONTE, "mods.lua"), "w", encoding="utf-8") as f:
                f.write(self._lua(e))
        except OSError as ex:
            self._log(f"[X] erro ao gravar o mod: {ex}", "rosa")
            return
        self._salvar_cfg()
        self.lb_pendente.configure(text="● esperando o Execute no Live Editor")
        self._animar([random.choice(FRASES), random.choice(FRASES),
                      f"[OK] mod gravado ({len(poderes)} poder(es) ligado(s)).",
                      "AGORA NO JOGO: F11 > Lua Engine > abra FIFA22_MODMENU.lua > EXECUTE"])

    def _lua(self, e):
        lig = ", ".join(f"{k} = {'true' if v else 'false'}" for k, v in sorted(e["ligados"].items()))
        craques = ", ".join(lua_str(c) for c in e["craques"])
        return (
            "return {\n"
            f"  id = {lua_str(e['id'])},\n"
            f"  ligados = {{ {lig} }},\n"
            f"  forca = {e['forca']},\n"
            f"  fraqueza = {e['fraqueza']},\n"
            f"  meu_time = {lua_str(e['meu_time'])},\n"
            f"  adversario = {lua_str(e['adversario'])},\n"
            f"  craques = {{ {craques} }},\n"
            f"  verba = {e['verba']},\n"
            "}\n"
        )

    def _copiar(self):
        self.clipboard_clear()
        self.clipboard_append(SCRIPT)
        self._log(f"> caminho copiado: {SCRIPT}", "apagado")

    def _abrir_live(self):
        exe = self.cfg.get("live_editor", "")
        if not exe or not os.path.exists(exe):
            if messagebox.askyesno(APP, "Ainda não sei onde está o Live Editor.\n\n"
                                        "Já baixou? Clique SIM para escolher o Launcher.exe.\n"
                                        "Clique NÃO para abrir a página de download."):
                exe = filedialog.askopenfilename(title="Escolha o Launcher.exe do FIFA 22 Live Editor",
                                                 filetypes=[("Programa", "*.exe")])
                if not exe:
                    return
                self.cfg["live_editor"] = exe
                self._salvar_cfg()
            else:
                webbrowser.open("https://github.com/xAranaktu")
                return
        try:
            subprocess.Popen([exe], cwd=os.path.dirname(exe))
            self._log("> Live Editor aberto. Agora abra o FIFA 22.", "apagado")
        except OSError as ex:
            self._log(f"[X] não abriu o Live Editor: {ex}", "rosa")
        self._atualizar_status()

    def _elenco(self):
        caminho = os.path.join(PONTE, "elenco.csv")
        if not os.path.exists(caminho):
            messagebox.showinfo(APP, "O elenco aparece aqui depois do primeiro Execute no jogo.")
            return
        win = tk.Toplevel(self, bg=FUNDO)
        win.title("Seu elenco")
        win.geometry("460x520")
        tv = ttk.Treeview(win, columns=("nome", "ovr", "pot"), show="headings")
        for c, t, w in (("nome", "JOGADOR", 280), ("ovr", "GERAL", 70), ("pot", "POT", 70)):
            tv.heading(c, text=t)
            tv.column(c, width=w, anchor="w" if c == "nome" else "center")
        tv.pack(fill="both", expand=True, padx=10, pady=10)
        with open(caminho, "r", encoding="utf-8", errors="replace") as f:
            for i, linha in enumerate(f):
                p = linha.strip().split(";")
                if i == 0 or len(p) < 4:
                    continue
                tv.insert("", "end", values=(p[1], p[2], p[3]))
        lb = tk.Label(win, text="Clique duas vezes num jogador para torná-lo CRAQUE.", bg=FUNDO,
                      fg=APAGADO, font=(FONTE, 8))
        lb.pack(pady=(0, 8))

        def virar_craque(_e):
            sel = tv.selection()
            if not sel:
                return
            nome = tv.item(sel[0])["values"][0]
            atuais = [c.strip() for c in self.e_craques.get().split(",") if c.strip()]
            if nome not in atuais:
                atuais.append(str(nome))
                self.e_craques.delete(0, "end")
                self.e_craques.insert(0, ", ".join(atuais))
                self._mudou()
                self._log(f"> {nome} entrou na lista de craques.", "amarelo")
        tv.bind("<Double-1>", virar_craque)

    def _ajuda(self):
        messagebox.showinfo(APP, (
            "COMO USAR (só modos OFFLINE)\n\n"
            "1. Baixe o FIFA 22 Live Editor (grátis) e clique em ABRIR LIVE EDITOR.\n"
            "2. Abra o FIFA 22 e entre no Modo Carreira, Partida Rápida ou Torneio.\n"
            "3. Aqui no app: ligue os poderes e clique em APLICAR NO JOGO.\n"
            "4. No jogo: aperte F11 > Lua Engine > File > Open e abra\n"
            "   ponte\\FIFA22_MODMENU.lua (botão COPIAR CAMINHO ajuda).\n"
            "   Clique em EXECUTE. Pronto.\n\n"
            "Mudou algo no app? Clique APLICAR e depois EXECUTE de novo.\n"
            "DESLIGAR TUDO + APLICAR + EXECUTE devolve todos os jogadores ao normal.\n\n"
            "Fora do Modo Carreira, escolha SEU TIME no app (a lista aparece depois do\n"
            "primeiro Execute). No Modo Carreira, salve o jogo depois de aplicar.\n\n"
            "Não use em Ultimate Team, Clubs ou Temporadas online."))

    # -------------------------------------------------------- console / status
    def _log(self, texto, tag=None):
        self.console.insert("end", texto + "\n", tag or ())
        self.console.see("end")

    def _animar(self, linhas, i=0):
        if i >= len(linhas):
            return
        tag = "amarelo" if linhas[i].startswith("AGORA") else (None if linhas[i].startswith("[OK]") else "apagado")
        self._log(("> " if tag == "apagado" else "") + linhas[i], tag)
        self.after(260, lambda: self._animar(linhas, i + 1))

    def _vigiar_resultado(self):
        caminho = os.path.join(PONTE, "resultado.txt")
        try:
            mt = os.path.getmtime(caminho)
        except OSError:
            mt = 0
        if mt and mt != self.ultimo_resultado:
            primeira = self.ultimo_resultado == 0.0
            self.ultimo_resultado = mt
            if not primeira:
                try:
                    with open(caminho, "r", encoding="utf-8", errors="replace") as f:
                        linhas = f.read().splitlines()
                except OSError:
                    linhas = []
                self._log("──── resposta do jogo ────", "amarelo")
                for l in linhas:
                    if l.startswith(("ID ", "---")):
                        continue
                    self._log(l, "rosa" if l.startswith("[X]") else None)
                self.lb_pendente.configure(text="")
                self._carregar_times()
        self.after(1000, self._vigiar_resultado)

    def _atualizar_status(self):
        live = self.cfg.get("live_editor", "")
        txt_live = "Live Editor: OK" if live and os.path.exists(live) else "Live Editor: não configurado"
        jogo = "FIFA 22: encontrado" if os.path.exists(r"C:\Program Files\EA Games\FIFA 22\FIFA22.exe") else "FIFA 22: ?"
        self.lb_status.configure(text=f"{jogo}\n{txt_live}")

    def _piscar(self, on=True):
        self.lb_pisca.configure(fg=ROSA if on else FUNDO)
        self.after(700, lambda: self._piscar(not on))

    def _fechar(self):
        self._salvar_cfg()
        self.destroy()


if __name__ == "__main__":
    App().mainloop()
