-- ==================================================================
--  FIFA 22 MOD MENU  -  script do Live Editor (gerado pelo app)
--
--  No jogo (Live Editor aberto junto com o FIFA 22):
--    F11 > Lua Engine > File > Open > FIFA22_MODMENU.lua > Execute
--  Cada Execute deixa o jogo IGUAL ao que esta ligado no app:
--  o que foi ligado e aplicado, o que foi desligado volta ao original.
--  So use OFFLINE (Carreira, Partida Rapida, Torneios).
-- ==================================================================

local PONTE = [==[%%PONTE%%]==]

local function arq(nome) return PONTE .. "\\" .. nome end

local SAIDA = {}
local function log(fmt, ...)
  local s = string.format(fmt, ...)
  SAIDA[#SAIDA + 1] = s
  pcall(Log, "[MODMENU] " .. s)
end

-- ---------------------------------------------------------- arquivos
local function carregar(nome)
  local f = io.open(arq(nome), "r")
  if not f then return nil end
  local txt = f:read("a")
  f:close()
  local fn = load(txt, "=" .. nome, "t", {})
  if not fn then return nil end
  local ok, v = pcall(fn)
  if ok then return v end
  return nil
end

local function salvar(nome, texto)
  local f = io.open(arq(nome), "w")
  if not f then
    log("[X] nao consegui escrever %s", nome)
    return false
  end
  f:write(texto)
  f:close()
  return true
end

local function norm(s)
  -- tira os acentos ANTES do lower(): com locale do Windows o lower() estraga o UTF-8
  s = tostring(s or "")
  s = s:gsub("[\192-\255][\128-\191]*", function(c)
    local m = {
      ["\195\161"]="a",["\195\160"]="a",["\195\162"]="a",["\195\163"]="a",["\195\164"]="a",
      ["\195\169"]="e",["\195\168"]="e",["\195\170"]="e",["\195\171"]="e",
      ["\195\173"]="i",["\195\172"]="i",["\195\174"]="i",["\195\175"]="i",
      ["\195\179"]="o",["\195\178"]="o",["\195\180"]="o",["\195\181"]="o",["\195\182"]="o",
      ["\195\186"]="u",["\195\185"]="u",["\195\187"]="u",["\195\188"]="u",
      ["\195\167"]="c",["\195\177"]="n",
      ["\195\129"]="a",["\195\137"]="e",["\195\141"]="i",["\195\147"]="o",["\195\154"]="u",["\195\135"]="c",
    }
    return m[c] or ""
  end)
  s = s:gsub("[^\1-\127]", ""):lower()
  s = s:gsub("[^%w ]", " "):gsub("%s+", " "):gsub("^ ", ""):gsub(" $", "")
  return s
end

-- ---------------------------------------------------------- grupos
-- campos que nao existirem nesta versao do banco sao ignorados
local BUFFS = {
  chute  = { "finishing", "shotpower", "longshots", "volleys", "curve", "composure",
             "penalties", "freekickaccuracy", "positioning" },
  drible = { "dribbling", "ballcontrol", "agility", "balance", "reactions" },
  turbo  = { "acceleration", "sprintspeed", "stamina" },
  passe  = { "shortpassing", "longpassing", "vision", "crossing" },
  tanque = { "strength", "jumping", "headingaccuracy", "aggression" },
  zaga   = { "marking", "defensiveawareness", "standingtackle", "slidingtackle", "interceptions" },
}
local GK = { "gkdiving", "gkhandling", "gkkicking", "gkpositioning", "gkreflexes", "reactions" }
local SABOTAGEM = {
  gelatina   = { "marking", "defensiveawareness", "standingtackle", "slidingtackle",
                 "interceptions", "strength", "aggression" },
  lesma      = { "acceleration", "sprintspeed", "agility", "reactions", "stamina" },
  pernadepau = { "finishing", "shotpower", "longshots", "shortpassing", "ballcontrol", "dribbling" },
}
local TODOS_LINHA = {
  "crossing", "finishing", "headingaccuracy", "shortpassing", "volleys", "marking",
  "defensiveawareness", "standingtackle", "slidingtackle", "dribbling", "curve",
  "freekickaccuracy", "longpassing", "ballcontrol", "shotpower", "jumping", "stamina",
  "strength", "longshots", "acceleration", "sprintspeed", "agility", "reactions",
  "balance", "aggression", "composure", "interceptions", "positioning", "vision", "penalties",
}
local LIMITES = { skillmoves = { 0, 4 }, weakfootabilitytypecode = { 1, 5 } }

-- ---------------------------------------------------------- config do app
local M = carregar("mods.lua") or {}
local ON = M.ligados or {}
local FORCA = math.max(1, math.min(99, math.floor(M.forca or 99)))
local FRACO = math.max(1, math.min(99, math.floor(M.fraqueza or 20)))

-- ---------------------------------------------------------- banco do jogo
local EM_CM = false
pcall(function() EM_CM = IsInCM() and true or false end)
ReloadDB()
if EM_CM then pcall(ReloadPlayersManager) end

local POR_ID = {}
for _, r in ipairs(GetDBTableRows("players")) do
  local pid = math.floor(tonumber(r.playerid.value) or 0)
  if pid > 0 then POR_ID[pid] = r end
end

local TIMES_DE = {}   -- pid -> { teamid = true }
local JOGADORES_DE = {} -- teamid -> { pid, ... }
pcall(function()
  for _, l in ipairs(GetDBTableRows("teamplayerlinks")) do
    local pid = math.floor(tonumber(l.playerid.value) or 0)
    local tid = math.floor(tonumber(l.teamid.value) or -1)
    if pid > 0 and tid >= 0 then
      TIMES_DE[pid] = TIMES_DE[pid] or {}
      TIMES_DE[pid][tid] = true
      JOGADORES_DE[tid] = JOGADORES_DE[tid] or {}
      table.insert(JOGADORES_DE[tid], pid)
    end
  end
end)

local NOME_TIME = {}
local function nome_time(tid)
  if NOME_TIME[tid] == nil then
    local ok, n = pcall(GetTeamName, tid)
    NOME_TIME[tid] = (ok and n and tostring(n) ~= "") and tostring(n) or ("Time " .. tid)
  end
  return NOME_TIME[tid]
end

local function nome(pid)
  local ok, n = pcall(GetPlayerName, pid)
  if ok and n and tostring(n) ~= "" then return tostring(n) end
  return "#" .. pid
end

local function num(r, campo)
  local f = r and r[campo]
  if f == nil then return nil end
  return math.floor(tonumber(f.value) or 0)
end

local function eh_goleiro(r) return num(r, "preferredposition1") == 0 end

-- acha um time pelo nome (ou id)
local function achar_time(txt)
  if txt == nil or txt == "" then return -1 end
  if tonumber(txt) then return math.floor(tonumber(txt)) end
  local q = norm(txt)
  local melhor, mp, mtam = -1, 0, -1
  for tid, lista in pairs(JOGADORES_DE) do
    local n = norm(nome_time(tid))
    local p = 0
    if n == q then p = 3 elseif n:sub(1, #q) == q then p = 2 elseif n:find(q, 1, true) then p = 1 end
    -- desempate: elenco maior (time principal, nao o sub-23)
    if p > mp or (p == mp and p > 0 and #lista > mtam) then melhor, mp, mtam = tid, p, #lista end
  end
  return melhor
end

local function achar_jogador(txt, preferidos)
  local q = norm(txt)
  if q == "" then return nil end
  if tonumber(txt) and POR_ID[math.floor(tonumber(txt))] then return math.floor(tonumber(txt)) end
  local function busca(lista)
    local melhor, mp, mo = nil, 0, -1
    for _, pid in ipairs(lista) do
      local n = norm(nome(pid))
      local p = 0
      if n == q then p = 3 elseif (n:match("(%S+)$") or n) == q or n:sub(1, #q) == q then p = 2
      elseif n:find(q, 1, true) then p = 1 end
      local o = num(POR_ID[pid], "overallrating") or 0
      if p > mp or (p == mp and p > 0 and o > mo) then melhor, mp, mo = pid, p, o end
    end
    return melhor
  end
  local pid = preferidos and busca(preferidos)
  if pid then return pid end
  local todos = {}
  for id in pairs(POR_ID) do todos[#todos + 1] = id end
  return busca(todos)
end

-- ---------------------------------------------------------- times
local MEU = -1
if EM_CM then pcall(function() MEU = math.floor(GetUserTeamID() or -1) end) end
if MEU <= 0 and M.meu_time and M.meu_time ~= "" then MEU = achar_time(M.meu_time) end
local ADV = -1
if M.adversario and M.adversario ~= "" then ADV = achar_time(M.adversario) end

local function do_time(pid, tid) return tid > 0 and TIMES_DE[pid] ~= nil and TIMES_DE[pid][tid] == true end

local MEUS = {}
if MEU > 0 then for _, pid in ipairs(JOGADORES_DE[MEU] or {}) do if POR_ID[pid] then MEUS[#MEUS + 1] = pid end end end

local precisa_time = false
for _, k in ipairs({ "chute", "drible", "turbo", "passe", "tanque", "zaga", "muralha", "ovr99",
                     "peneira", "gelatina", "lesma", "pernadepau" }) do
  if ON[k] then precisa_time = true end
end

-- ---------------------------------------------------------- estado desejado
local DESEJO = {}  -- "pid:campo" -> valor
local function querer(pid, campo, valor)
  local r = POR_ID[pid]
  if not r or r[campo] == nil then return end
  local lim = LIMITES[campo] or { 1, 99 }
  DESEJO[pid .. ":" .. campo] = math.max(lim[1], math.min(lim[2], math.floor(valor)))
end
local function querer_lista(pid, campos, valor) for _, c in ipairs(campos) do querer(pid, c, valor) end end

local avisos = {}
if precisa_time and MEU <= 0 then
  avisos[#avisos + 1] = "[X] Nao sei qual e o seu time. Fora do Modo Carreira, escreva o nome do seu time no app."
else
  -- buffs no seu time
  for _, pid in ipairs(MEUS) do
    local r = POR_ID[pid]
    if eh_goleiro(r) then
      if ON.muralha then querer_lista(pid, GK, FORCA) end
    else
      for g, campos in pairs(BUFFS) do if ON[g] then querer_lista(pid, campos, FORCA) end end
      if ON.drible then
        querer(pid, "skillmoves", 4)
        querer(pid, "weakfootabilitytypecode", 5)
      end
    end
    if ON.ovr99 then querer(pid, "overallrating", 99) end
  end
  -- sabotagem nos outros times (ou so no adversario escolhido)
  if ON.peneira or ON.gelatina or ON.lesma or ON.pernadepau then
    for pid, r in pairs(POR_ID) do
      local alvo
      if ADV > 0 then alvo = do_time(pid, ADV) else alvo = TIMES_DE[pid] ~= nil and not do_time(pid, MEU) end
      if alvo and not do_time(pid, MEU) then
        if eh_goleiro(r) then
          if ON.peneira then querer_lista(pid, { "gkdiving", "gkhandling", "gkpositioning", "gkreflexes" }, FRACO) end
        else
          for g, campos in pairs(SABOTAGEM) do if ON[g] then querer_lista(pid, campos, FRACO) end end
        end
      end
    end
  end
end

-- craques individuais (funcionam mesmo sem time definido)
for _, txt in ipairs(M.craques or {}) do
  local pid = achar_jogador(txt, MEUS)
  if pid then
    local r = POR_ID[pid]
    if eh_goleiro(r) then querer_lista(pid, GK, 99) else querer_lista(pid, TODOS_LINHA, 99) end
    querer(pid, "overallrating", 99)
    querer(pid, "potential", 99)
    if not eh_goleiro(r) then
      querer(pid, "skillmoves", 4)
      querer(pid, "weakfootabilitytypecode", 5)
    end
    log("[CRAQUE] %s virou 99 em tudo.", nome(pid))
  else
    log("[X] Craque: nao achei ninguem chamado '%s'.", tostring(txt))
  end
end

-- ---------------------------------------------------------- aplicar
local ORIG = carregar("originais.lua") or {}   -- "pid:campo" -> valor original (texto)
local PLANO = {}
local function tem_plano(pid)
  if not EM_CM then return false end
  if PLANO[pid] == nil then
    local ok, v = pcall(PlayerHasDevelopementPlan, pid)
    PLANO[pid] = (ok and v) and true or false
  end
  return PLANO[pid]
end

local function gravar(pid, campo, valor_txt)
  local r = POR_ID[pid]
  if not r or r[campo] == nil then return false end
  if tostring(r[campo].value) == valor_txt then return false end
  r[campo].value = valor_txt
  EditDBTableField(r[campo])
  if campo ~= "skillmoves" and campo ~= "weakfootabilitytypecode" and campo ~= "potential" and tem_plano(pid) then
    pcall(PlayerSetValueInDevelopementPlan, pid, campo, math.floor(tonumber(valor_txt) or 0))
  end
  return true
end

local restaurados, alterados = 0, 0
-- 1) o que nao esta mais ligado volta ao original
for chave, original in pairs(ORIG) do
  if DESEJO[chave] == nil then
    local pid, campo = chave:match("^(%d+):(.+)$")
    pid = tonumber(pid)
    if pid and gravar(pid, campo, original) then restaurados = restaurados + 1 end
    ORIG[chave] = nil
  end
end
-- 2) aplica o que esta ligado (guardando o original na primeira vez)
for chave, valor in pairs(DESEJO) do
  local pid, campo = chave:match("^(%d+):(.+)$")
  pid = tonumber(pid)
  local r = POR_ID[pid]
  if ORIG[chave] == nil then ORIG[chave] = tostring(r[campo].value) end
  if gravar(pid, campo, string.format("%d", valor)) then alterados = alterados + 1 end
end

-- extras do Modo Carreira (nao tem como desfazer, sao como no jogo normal)
if ON.moral then
  if EM_CM and #MEUS > 0 then
    for _, pid in ipairs(MEUS) do
      pcall(SetPlayerForm, pid, 100)
      pcall(SetPlayerMorale, pid, 100)
      pcall(SetPlayerSharpness, pid, 100)
      pcall(SetPlayerFitness, pid, 100)
    end
    log("[OK] Moral, forma e ritmo no maximo para %d jogadores.", #MEUS)
  else
    log("[!] 'Vestiario em festa' so funciona no Modo Carreira.")
  end
end
if M.verba and tonumber(M.verba) and tonumber(M.verba) > 0 then
  if EM_CM then
    local ok, err = pcall(SetTransferBudget, math.floor(tonumber(M.verba)))
    if ok then log("[OK] Verba de transferencias: %d", math.floor(tonumber(M.verba)))
    else log("[X] verba: %s", tostring(err)) end
  else
    log("[!] Verba so funciona no Modo Carreira.")
  end
end

-- ---------------------------------------------------------- salvar estado e relatorio
local partes = {}
for k, v in pairs(ORIG) do partes[#partes + 1] = string.format("  [%q] = %q,", k, v) end
salvar("originais.lua", "return {\n" .. table.concat(partes, "\n") .. "\n}\n")

for _, a in ipairs(avisos) do log("%s", a) end
local ligados = {}
for k, v in pairs(ON) do if v then ligados[#ligados + 1] = k end end
table.sort(ligados)
log("Modos ligados: %s", #ligados > 0 and table.concat(ligados, ", ") or "nenhum")
log("Valores alterados agora: %d | devolvidos ao original: %d | guardados para desfazer: %d",
  alterados, restaurados, #partes)

-- elenco do seu time, para o app mostrar
if #MEUS > 0 then
  local l = { "id;nome;ovr;pot" }
  table.sort(MEUS, function(a, b) return (num(POR_ID[a], "overallrating") or 0) > (num(POR_ID[b], "overallrating") or 0) end)
  for _, pid in ipairs(MEUS) do
    local r = POR_ID[pid]
    l[#l + 1] = string.format("%d;%s;%d;%d", pid, (nome(pid):gsub(";", ",")),
      num(r, "overallrating") or 0, num(r, "potential") or 0)
  end
  salvar("elenco.csv", table.concat(l, "\n") .. "\n")
end

-- lista de times (para o app completar o nome)
do
  local l = {}
  for tid, lista in pairs(JOGADORES_DE) do
    if #lista >= 11 then l[#l + 1] = (nome_time(tid):gsub("[;\n]", " ")) end
  end
  table.sort(l)
  salvar("times.txt", table.concat(l, "\n") .. "\n")
end

local cab = {
  "ID " .. tostring(M.id or ""),
  "DATA " .. os.date("%Y-%m-%d %H:%M:%S"),
  "MODO " .. (EM_CM and "CARREIRA" or "FORA DA CARREIRA"),
  "MEU_TIME " .. (MEU > 0 and nome_time(MEU) or "?"),
  "ADVERSARIO " .. (ADV > 0 and nome_time(ADV) or "todos"),
  "---",
}
salvar("resultado.txt", table.concat(cab, "\n") .. "\n" .. table.concat(SAIDA, "\n") .. "\n")

pcall(MessageBox, "FIFA 22 MOD MENU",
  string.format("Mod aplicado!\n%d valores alterados, %d devolvidos ao original.\nSalve o jogo se estiver no Modo Carreira.",
    alterados, restaurados))
