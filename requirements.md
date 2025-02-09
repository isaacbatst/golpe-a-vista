# 🎜 Requisitos para Implementação do Jogo

Neste jogo, os jogadores assumem papéis de **radical**, **moderados** e **conservadores** em um cenário político fictício. O objetivo é aprovar leis progressistas ou conservadoras e cassar os oponentes para vencer o jogo.

## **1️⃣ Estrutura Básica do Jogo**
✅ **Número de Jogadores:** 6 jogadores  
✅ **Papéis no jogo:**  
   - **Moderados (3x)** → Seu objetivo é aprovar leis progressistas, mas tem receio de gerar crises caso muitas leis progressistas sejam aprovadas em sequência.
   - **Conservadores (2x)** → Seu objetivo é aprovar leis conservadoras e cassar o radical. Sabem quem são os outros conservadores.
   - **Radical (1x)** → Seu objetivo é tomar o controle do governo, cassando os conservadores ou radicalizando os moderados.

✅ **Rodadas:** O jogo é dividido em rodadas cíclicas, onde cada jogador assume o papel de **Presidente Interino** uma vez antes de reiniciar a ordem.  

---

## **2️⃣ Condição de Vitória**
📌 **O jogo termina quando um time atinge um dos objetivos:** 
   - ✅ **Moderados vencem** ao aprovar **6 leis progressistas** 
   - ✅ **Radical vence** se cassar **todos os conservadores** ou radicalizar a **maioria dos moderados**.
   - ✅ **Conservadores vencem** ao cassar **o radical** ou aprovar **7 leis conservadoras**.  

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

## **4️⃣ Crises**

Crises ativam vários efeitos no jogo que podem ser benéficos ou prejudiciais para os jogadores. 

📌 **Ativação**

   ✅  **"Receio"** dos Moderados  
      - Se um **moderado aprovar a partir da segunda lei progressista consecutiva**, **uma crise é ativada**.

   ✅  **Sabotagem** dos Conservadores  
      - Sempre que uma lei progressista for aprovada, os **conservadores podem ativar uma crise**
      - Os conservadores não podem sabotar duas rodadas seguidas.
      - Os conservadores recebem 3 cartas de crise e escolhem uma para ativar.
      - Caso uma crise fosse ser ativada pelo receio de um moderado, a crise escolhida pelos conservadores é priorizada.

📌 **Efeito das Crises:**  
✅ **A crise tem efeito apenas na próxima rodada.**
✅ **Alguns efeitos são públicos, outros apenas os jogadores envolvidos sabem.**
---

## **5️⃣ Cassação**
📌 A cada 3 crises, o presidente deverá propor uma cassação.
📌 A cassação é realizada mediante votação. Caso aprovada, o jogador cassado **sai do jogo sem revelar sua identidade**.  
📌 Se a cassação for rejeitada, uma lei conservadora é aprovada.


---

## **6️⃣ Dossiê**
📌 **Antes a votação da lei, o ex-Presidente escolhe quem receberá o Dossiê.**  
📌 O ex-Presidente **não pode escolher a si mesmo nem um jogador que tenha recebido o Dossiê na rodada anterior**.  
📌 O jogador escolhido recebe **informação privada** sobre as leis do Presidente atual, exceto sobre a lei descartada.  
📌 O jogador pode **falar a verdade ou mentir sobre o conteúdo do Dossiê**.  

🔥 **Isso cria um jogo de confiança e manipulação, onde os jogadores precisam conquistar credibilidade para receber informações valiosas.**

---

## **7️⃣ Poderes do Radical**

📌 **Revolução Armada**
   - **Ativação:** O radical pode ativar a Revolução Armada caso o alvo da cassação seja um conservador, ao menos um conservador esteja cassado e um moderado esteja radicalizado.
   - **Efeito:** A cassação é aprovada automaticamente, sem votação.

📌 **Radicalização**
   - **Ativação:** O radical tentar radicalizar um jogador
   - **Efeito:** O jogador radicalizado passa a jogar do lado do radical, sem revelar sua identidade. Se o radicalizado for um conservador, nada acontece. Apenas o radical e o radicalizado sabem da mudança.
   - **Restrição:** Apenas se houver uma **crise ativa** e pelo menos **4 leis progressistas aprovadas** ou **4 leis conservadoras aprovadas**. 
   
---

## **8️⃣ Baralho de Leis**
📌 As leis são divididas em **progressistas e conservadoras**.  
📌 **As leis não têm efeito direto, apenas contam para a vitória do time correspondente.**  
📌 O baralho contém **7 leis progressistas e 13 conservadoras**.  

---

## **9️⃣ Implementação**
📌 **Estrutura de Dados (JSON ou Banco de Dados)**  
- Lista de jogadores, seus papéis e status (ativo/cassado).  
- Contador de leis aprovadas por facção.  
- Baralho de leis.  
- Histórico de rodadas e crises ativadas.  

📌 **Fluxo de Rodada (Resumido para Implementação)**  
1. **Seleciona Presidente Interino**
2. **Cassação**
   a. **Presidente propõe cassação, se aplicável**
   b. **Jogadores votam, se aprovada, jogador é cassado**
3. **Presidente recebe crise, se aplicável**
4. **Legislação**
   a. **Presidente recebe 3 leis, veta uma e escolhe outra para votação**
   b. **Todos votam publicamente**  
   c. **Se aprovada, incrementa contador de leis**
5. **Dossiê**
   a. **Presidente escolhe Relator da próxima rodada**
   b. **Se houver Relator, recebe Dossiê**
6. **Conservadores podem sabotar, ativando crise**
7. **Radical pode radicalizar jogador, se aplicável**
8. **Próxima rodada**

---

### **📌 Pronto para iniciar a implementação? Algum ajuste final?** 🚀

