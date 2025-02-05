# 📜 Requisitos para Implementação do Jogo

## **1️⃣ Estrutura Básica do Jogo**
✅ **Número de Jogadores:** 6 jogadores  
✅ **Papéis no jogo:**  
   - **Radicais (1x)** → Sempre querem aprovar leis progressistas.  
   - **Moderados (3x)** → Jogam do lado dos progressistas, mas têm receio de causar crises.  
   - **Conservadores (2x)** → Querem aprovar leis conservadoras e sabotar os progressistas.  
✅ **Rodadas:** O jogo é dividido em rodadas cíclicas, onde cada jogador assume o papel de **Presidente Interino** uma vez antes de reiniciar a ordem.  

---

## **2️⃣ Condição de Vitória**
📌 **O jogo termina quando um time aprova 5 leis:**  
   - ✅ **Progressistas vencem** ao aprovar **6 leis progressistas** ou cassar **todos jogadores conservadores**.
   - ✅ **Conservadores vencem** ao cassar o **radical** ou aprovar **6 leis conservadoras**.

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
   - ✅ **Se a maioria aprovar →** A lei entra em vigor e seu efeito é ativado.  
   - ❌ **Se a maioria rejeitar →** Nenhuma das duas leis entra em vigor e a rodada termina.  

📌 **Se duas leis consecutivas forem rejeitadas, é gerada uma crise**.  

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

---

## **5️⃣ Efeitos das Crises**
- Sempre que uma crise for ativada, **o Presidente Interino recebe o efeito da crise em segredo**.  
- Ele pode escolher **revelar, mentir ou blefar sobre a crise**, já que ninguém mais saberá se ela realmente ocorreu.  
- **As crises sempre favorecem os conservadores.**  

---

## **6️⃣ Cassação de Jogadores**
📌 Se **três leis conservadoras forem aprovadas**, o Presidente Interino pode escolher **cassar um jogador**.  
📌 O jogador cassado **sai do jogo sem revelar sua identidade**.  

---

## **7️⃣ Baralho de Leis**
📌 As leis são divididas em **progressistas e conservadoras**.  
📌 **Todas as leis possuem um efeito no jogo**, além de contar para a vitória do time correspondente.  
📌 O baralho contém **8 leis progressistas, 8 conservadoras e 2 neutras**.  

---

## **8️⃣ Implementação de Componentes**
📌 **Estrutura de Dados (JSON ou Banco de Dados)**  
- Lista de jogadores, seus papéis e status (ativo/cassado).  
- Contador de leis aprovadas por facção.  
- Baralho de leis com efeitos associados.  
- Histórico de rodadas e crises ativadas.  

📌 **Regras de Exibição**  
- O **Presidente Interino** vê suas leis e a crise (se houver).  
- Os jogadores **veem apenas a proposta da lei e votam publicamente**.  
- **Os jogadores não sabem** quando uma crise ocorre, exceto o Presidente e os conservadores (se a crise for ativada por eles).  
- **Cassação de jogadores** remove um participante sem revelar sua identidade.  

📌 **Fluxo de Rodada (Resumido para Implementação)**  
1. **Seleciona Presidente Interino**  
2. **Distribui duas leis**  
3. **Presidente escolhe uma lei**  
4. **Todos votam publicamente**  
   - 📌 **Se rejeitada →** Nenhuma lei aprovada.  
   - 📌 **Se rejeitada duas vezes seguidas →** Próxima votação obrigatoriamente aprovada.  
5. **Se a segunda lei progressista consecutiva for aprovada, verifica ativação de crise**  
   - 📌 **Moderado puxa crise secretamente** OU  
   - 📌 **Se o moderado não puxar, os conservadores podem puxar** (caso permitido pelas regras).  
6. **Executa efeito da lei aprovada e da crise (se houver).**  
7. **A partir de 4 leis conservadoras aprovadas, o Presidente deve cassar um jogador toda rodada.**  
8. **Passa a vez para o próximo Presidente Interino.**  

---

### **📌 Conclusão**
✅ **Todas as regras organizadas na ordem ideal para implementação.**  
✅ **Foco na lógica do jogo antes da interface.**  
✅ **Fluxo bem definido para o desenvolvimento de cada etapa.**  

⚡ **Pronto para começar a implementação ou quer revisar algo antes?** 🚀

