# ⚽ FIFA 22 // MOD MENU

App para Windows com cara de "mod menu" que dá superpoderes ao seu time no **FIFA 22 de PC, só em modos offline**
(Modo Carreira, Partida Rápida e Torneios). Não usa o controle: tudo é aplicado direto nos jogadores pelo
[FIFA 22 Live Editor](https://github.com/xAranaktu).

## Poderes

**Seu time**

| Poder | O que faz |
|---|---|
| Chute Teleguiado | Finalização, força do chute, chute de longe, curva, frieza e pênalti 99 |
| Drible Fantasma | Drible, controle, agilidade, equilíbrio e reação 99, 5 estrelas de drible e de perna ruim |
| Turbo Nitro | Aceleração, velocidade e fôlego 99 |
| Passe Laser | Passe curto/longo, visão e cruzamento 99 |
| Modo Tanque | Força, impulsão e cabeceio 99 |
| Zaga Blindada | Marcação, desarme e interceptação 99 |
| Goleiro Muralha | Seu goleiro 99 em tudo |
| Overall 99 (visual) | Mostra 99 de geral no elenco |
| Craques | Jogadores escolhidos ficam com 99 em todos os atributos |

**Sabotagem no adversário:** Goleiro Peneira, Zaga de Gelatina, Adversário Lesma e Perna de Pau.
Afeta todos os outros times ou só o time escolhido em "Só contra".

**Modo Carreira:** Vestiário em Festa (moral/forma/ritmo no máximo) e verba de transferências.

**Atalhos:** MODO DEUS, MODO DISCRETO (não fica tão na cara), SÓ SABOTAGEM e DESLIGAR TUDO.

Os sliders definem a força dos poderes (60–99) e o nível do adversário (1–70).

## Instalação

1. Tenha o Python 3 instalado (com tkinter, que já vem no instalador oficial).
2. Baixe o **FIFA 22 Live Editor** (grátis, do Aranaktu) e extraia.
3. Abra o app com `INICIAR.bat`. Opcional: `GERAR_EXE.bat` gera `FIFA22 Mod Menu.exe` e um atalho na área de trabalho.

## Como usar

1. No app, clique em **ABRIR LIVE EDITOR** (na primeira vez ele pergunta onde está o `Launcher.exe`). Depois abra o FIFA 22.
2. Entre num modo offline. Fora do Modo Carreira, escreva **SEU TIME** no app.
3. Ligue os poderes e clique em **▶ APLICAR NO JOGO**.
4. No jogo: **F11 → Lua Engine → File → Open → `ponte\FIFA22_MODMENU.lua` → Execute**.
   O console do app mostra a resposta do jogo.

Cada Execute deixa o jogo exatamente como está no app: o que você desligou volta ao valor original.
**DESLIGAR TUDO → APLICAR → Execute** devolve todo mundo ao normal. No Modo Carreira, salve o jogo depois
(e faça antes uma cópia do save, por segurança).

> ⚠️ Só para modos offline. Não use em Ultimate Team, Pro Clubs ou Temporadas online.

## Arquivos

- `app.pyw`: o app (Python + tkinter)
- `modelo_mod.lua`: modelo do script do Live Editor (o app gera `ponte/FIFA22_MODMENU.lua` a partir dele)
- `ponte/`: troca de arquivos entre o app e o jogo (`mods.lua`, `originais.lua`, `resultado.txt`, `elenco.csv`, `times.txt`)
