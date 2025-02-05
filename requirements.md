# 🎜 Requisitos para Implementação do Jogo

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
   - ✅ **Conservadores vencem** ao cassar o **radical** ou aprovar **10 leis conservadoras**.  

---

## **3️⃣ Turno do Presidente Interino**
Cada rodada segue a seguinte estrutura:

1️⃣ **Definir o Presidente Interino**  
   - O **Presidente Interino** é rotacionado a cada rodada, sem repetir antes que todos tenham assumido o cargo.  

2️⃣ **Distribuir Leis**  
   - O Presidente recebe **duas leis aleatórias** do baralho.  

3️⃣ **Escolha da Lei e Debate**  
   - O Presidente escolhe **uma das leis**, sem revelá-la.  
   - Ele pode argumentar e tentar convencer os outros jogadores a aprová-la.  

4️⃣ **Votação Pública**  
   - Todos os jogadores **votam publicamente** se aprovam ou rejeitam a lei.  
   - ✅ **Se a maioria aprovar** → A lei entra em vigor e conta para a vitória do time correspondente.  
   - ❌ **Se a maioria rejeitar** → Nenhuma das duas leis entra em vigor e a rodada termina.  

📌 **Se duas leis consecutivas forem rejeitadas, é gerada uma crise.**  

---

## **4️⃣ Mecânica de Crises**
Crises adicionam tensão e blefe ao jogo. Elas podem ser ativadas de duas formas:

📌 **1️⃣ Pelo "Receio" de um Moderado**  
   - Se um **moderado aprovar a segunda lei progressista consecutiva**, ele **puxa uma carta de crise**.  
   - **Somente o Presidente Interino saberá que a crise aconteceu** e poderá blefar sobre sua existência.  

📌 **2️⃣ Pela Sabotagem dos Conservadores**  
   - Se **duas leis progressistas consecutivas forem aprovadas** e **nenhuma crise foi ativada pelo moderado**, os **conservadores podem ativar uma crise**.  
   - **Somente os conservadores saberão da crise**, permitindo que manipulem a narrativa.  

📌 **Regra Extra:**  
✅ **Os conservadores NÃO podem ativar duas crises seguidas.**  

📌 **Efeito das Crises:**  
✅ **A crise tem efeito apenas na próxima rodada.**  
✅ **O próximo Presidente Interino será obrigado a escolher uma lei conservadora.**  
✅ **Somente o Presidente Interino saberá da crise, podendo blefar ou revelar a informação.**  

---

## **5️⃣ Cassação de Jogadores**
📌 A cada **três leis conservadoras forem aprovadas**, ou **três crises**, é acionado o direito de cassar um jogador.  
📌 **A cada duas cassacoes negadas, uma lei conservadora é automaticamente aprovada.**  
📌 O jogador cassado **sai do jogo sem revelar sua identidade**.  
📌 **A cassacão precisa ser aprovada por votação pública**.  

---

## **6️⃣ Mecânica do Dossiê**
📌 **Após a votação da lei, o ex-Presidente escolhe quem receberá o Dossiê.**  
📌 O ex-Presidente **não pode escolher a si mesmo nem um jogador que tenha recebido o Dossiê na rodada anterior**.  
📌 O jogador escolhido recebe **informação privada** sobre as leis do Presidente atual.  
📌 O jogador pode **falar a verdade ou mentir sobre o conteúdo do Dossiê**.  

🔥 **Isso cria um jogo de confiança e manipulação, onde os jogadores precisam conquistar credibilidade para receber informações valiosas.**

---

## **7️⃣ Baralho de Leis**
📌 As leis são divididas em **progressistas e conservadoras**.  
📌 **As leis não têm efeito direto, apenas contam para a vitória do time correspondente.**  
📌 O baralho contém **10 leis progressistas e 10 conservadoras**.  

---

## **8️⃣ Implementação de Componentes**
📌 **Estrutura de Dados (JSON ou Banco de Dados)**  
- Lista de jogadores, seus papéis e status (ativo/cassado).  
- Contador de leis aprovadas por facção.  
- Baralho de leis.  
- Histórico de rodadas e crises ativadas.  

📌 **Fluxo de Rodada (Resumido para Implementação)**  
1. **Seleciona Presidente Interino**  
2. **Distribui duas leis**  
3. **Presidente escolhe uma lei**  
4. **Todos votam publicamente**  
5. **Verifica ativação de crise**  
6. **Executa efeito da crise (se houver) na próxima rodada.**  
7. **Verifica condição de cassacão e votação**  
8. **Passa a vez para o próximo Presidente Interino.**  

---

### **📌 Pronto para iniciar a implementação? Algum ajuste final?** 🚀

