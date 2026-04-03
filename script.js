 * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial; }

body { display: flex; min-height: 100vh; background: #05070a; color: white; }

.background-fixo {
  position: fixed;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e40af, #7c3aed);
  opacity: 0.5;
  z-index: -1;
}

.sidebar {
  width: 250px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar button {
  padding: 12px;
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  border-radius: 10px;
  cursor: pointer;
}

.conteudo { flex: 1; padding: 20px; }

.aba { display: none; }
.aba.active { display: block; }

.input-box { display: flex; gap: 10px; margin-top: 10px; }

input, textarea {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
}

button {
  background: #7c3aed;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 10px;
}

/* CHAT BONITO */
#chat-box {
  display: flex;
  flex-direction: column;
  height: 400px;
}

#feed-forum {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: #e5ddd5;
  border-radius: 10px;
}

.msg {
  padding: 8px;
  margin: 5px;
  border-radius: 10px;
  max-width: 70%;
}

.me {
  background: #dcf8c6;
  margin-left: auto;
  color: black;
}

.outro {
  background: white;
  color: black;
  margin-right: auto;
      }
