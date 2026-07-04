# Guess Who! — Web Edition

A fully playable **real-time 2-player Guess Who!** game running in the browser with WebSocket multiplayer. Both players see the same board of 24 characters, each secretly assigned one, and take turns asking yes/no questions to identify their opponent's character.

## Features
- **Real-Time Multiplayer**: Instant state synchronization via Socket.io.
- **Dynamic Categories**: 12 different character categories (Superheroes, Pixel, Avatars, Monsters, etc.) powered by Dicebear.
- **Lobby System**: Host creates a 4-character room code that guests can use to join.
- **Turn-based Logic**: Enforced turn-based 15-second Q&A messaging system.
- **Neo-Brutalism UI**: Clean, engaging, responsive aesthetic with interactive hover states and cursors.
- **Rematch System**: Quick rematches without needing to create new lobbies.

## Screenshots
*(Add your screenshots here)*

## Project Structure
```
Guess-who-website/
├── client/              React + Vite frontend
│   └── src/
│       ├── App.jsx              State machine + socket events
│       ├── index.css            Global styles (Neo-Brutalism)
│       ├── components/          UI Components (GameScreen, Lobby, etc.)
│       └── data/characters.js   Dynamic category generator
└── server/              Node.js + Express + Socket.io backend
    ├── index.js                 Socket events entry point
    └── gameLogic.js             Game state management
```

## How to Run

### Requirements
- Node.js v16+
- npm or yarn

### 1. Start the Server
```bash
cd server
npm install
node index.js
```
The server will start on port `3002`.

### 2. Start the Client
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
The client will start on port `5173`.

Open your browser to `http://localhost:5173`.

## Environment Variables (.env)
A `.env` file can be configured in both `server/` and `client/` directories for advanced setup.
- **Server `server/.env`**:
  `PORT=3002`
  `CLIENT_ORIGIN=http://localhost:5173`
- **Client `client/.env`**:
  `VITE_SERVER_URL=http://localhost:3002`

## License
MIT
