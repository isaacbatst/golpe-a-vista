# 🎜 Requisitos para Implementação do Jogo

Neste jogo, os jogadores assumem papéis de **progressistas** e **conservadores** em um cenário político fictício. Os progressistas buscam aprovar leis progressistas, enquanto os conservadores devem cassar o radical ou aprovando leis conservadoras. 

## **1️⃣ Estrutura Básica do Jogo**
✅ **Número de Jogadores:** 6 jogadores  
✅ **Papéis no jogo:**  
   - **Radical (1x)** → Sempre quer aprovar leis progressistas e deve evitar ser cassado.  
   - **Moderados (3x)** → Jogam do lado dos progressistas, tem receio de gerar crises.
   - **Conservadores (2x)** → Querem aprovar leis conservadoras e cassar o radical.

✅ **Rodadas:** O jogo é dividido em rodadas cíclicas, onde cada jogador assume o papel de **Presidente Interino** uma vez antes de reiniciar a ordem.  

---

## **2️⃣ Condição de Vitória**
📌 **O jogo termina quando um time atinge um dos objetivos:**  
   - ✅ **Progressistas vencem** ao aprovar **6 leis progressistas** ou cassar **todos os conservadores**. 
   - ✅ **Conservadores vencem** ao cassar o **radical** ou aprovar **7 leis conservadoras**.  

---

## **3️⃣ Turno do Presidente Interino**
Cada rodada segue a seguinte estrutura:

1️⃣ **Definir o Presidente Interino**  
   - O **Presidente Interino** é rotacionado a cada rodada, sem repetir antes que todos tenham assumido o cargo.  

2️⃣ **Distribuir Leis**  
   - O Presidente recebe **três leis aleatórias** do baralho e veta uma, descartando-a.  

3️⃣ **Escolha da Lei e Debate**  
   - O Presidente escolhe **uma das leis**, sem revelá-la.  
   - Ele pode argumentar e tentar convencer os outros jogadores a aprová-la.  

4️⃣ **Votação Pública**  
   - Todos os jogadores **votam publicamente** se aprovam ou rejeitam a lei.  
   - ✅ **Se a maioria aprovar** → A lei entra em vigor e conta para a vitória do time correspondente.  
   - ❌ **Se a maioria rejeitar** → Nenhuma das duas leis entra em vigor e a rodada termina.  

📌 **Leis rejeitadas geram uma crise.**  

---

## **4️⃣ Mecânica de Crises**
Crises adicionam tensão e blefe ao jogo. Elas podem ser ativadas de duas formas:

📌 **1️⃣ Pelo "Receio" de um Moderado**  
   - Se um **moderado aprovar a partir da segunda lei progressista consecutiva**, **uma crise é ativada**.
   - **Somente o Presidente Interino saberá que a crise aconteceu** e poderá blefar sobre sua existência.  

📌 **2️⃣ Pela Sabotagem dos Conservadores**  
   - Se **uma lei progressista for aprovada**, os **conservadores podem ativar uma crise**.  
   - **Somente os conservadores saberão da crise**, permitindo que manipulem a narrativa.  
   - Os conservadores recebem 3 cartas de crise e escolhem uma para ativar.

📌 **Regra Extra:**  
✅ **Os conservadores NÃO podem ativar duas crises seguidas.**  

📌 **Efeito das Crises:**  
✅ **A crise tem efeito apenas na próxima rodada.**  
---

## **5️⃣ Cassação de Jogadores**
📌 A partir da quarta lei conservadora e a cada lei conservadora subsequente, além de a cada 3 crises, o presidente deverá propor uma cassação.
📌 A cassação é realizada mediante votação. Caso aprovada, o jogador cassado **sai do jogo sem revelar sua identidade**.  
📌 Se a cassação for rejeitada, uma lei conservadora é aprovada.


---

## **6️⃣ Mecânica do Dossiê**
📌 **Antes a votação da lei, o ex-Presidente escolhe quem receberá o Dossiê.**  
📌 O ex-Presidente **não pode escolher a si mesmo nem um jogador que tenha recebido o Dossiê na rodada anterior**.  
📌 O jogador escolhido recebe **informação privada** sobre as leis do Presidente atual, exceto sobre a lei descartada.  
📌 O jogador pode **falar a verdade ou mentir sobre o conteúdo do Dossiê**.  

🔥 **Isso cria um jogo de confiança e manipulação, onde os jogadores precisam conquistar credibilidade para receber informações valiosas.**

---

## **7️⃣ Baralho de Leis**
📌 As leis são divididas em **progressistas e conservadoras**.  
📌 **As leis não têm efeito direto, apenas contam para a vitória do time correspondente.**  
📌 O baralho contém **7 leis progressistas e 13 conservadoras**.  

---

## **8️⃣ Implementação de Componentes**
📌 **Estrutura de Dados (JSON ou Banco de Dados)**  
- Lista de jogadores, seus papéis e status (ativo/cassado).  
- Contador de leis aprovadas por facção.  
- Baralho de leis.  
- Histórico de rodadas e crises ativadas.  

📌 **Fluxo de Rodada (Resumido para Implementação)**  
1. **Seleciona Presidente Interino**
2. **Presidente cassa jogador, se aplicável**
3. **Presidente recebe crise, se aplicável**
4. **Presidente recebe 3 leis, veta uma e escolhe outra para votação**
4. **Todos votam publicamente**  
5. **Se aprovada, incrementa contador de leis**
6. **Relator recebe Dossiê**
7. **O presidente escolhe o Relator da próxima rodada**
8. **Conservadores podem sabotar, ativando crise**
9. **Próxima rodada**

---

### **📌 Pronto para iniciar a implementação? Algum ajuste final?** 🚀

