const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// In-memory data store
const rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_teacher', ({ name, roomCode }) => {
    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        teacher: null,
        students: [],
        currentWord: '',
        wordHistory: []
      };
    }
    
    // Assign teacher
    rooms[roomCode].teacher = {
      id: socket.id,
      name
    };
    
    socket.join(roomCode);
    console.log(`Teacher ${name} joined room ${roomCode}`);
    
    // Notify teacher of current room state
    socket.emit('room_state_update', rooms[roomCode]);
  });

  socket.on('join_student', ({ name, roomCode }) => {
    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        teacher: null,
        students: [],
        currentWord: '',
        wordHistory: []
      };
    }
    
    const newStudent = {
      id: socket.id,
      name,
      status: 'Conectado'
    };
    
    // Remove if already exists
    rooms[roomCode].students = rooms[roomCode].students.filter(s => s.id !== socket.id);
    
    rooms[roomCode].students.push(newStudent);
    socket.join(roomCode);
    console.log(`Student ${name} joined room ${roomCode}`);
    
    // Notify room of state change
    io.to(roomCode).emit('room_state_update', rooms[roomCode]);
    
    // Send current word to new student
    socket.emit('word_update', rooms[roomCode].currentWord);
  });

  socket.on('student_ready', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (room) {
      const student = room.students.find(s => s.id === socket.id);
      if (student) {
        student.status = 'Pronto para aprender';
        io.to(roomCode).emit('room_state_update', room);
      }
    }
  });

  socket.on('send_word', ({ roomCode, word }) => {
    const room = rooms[roomCode];
    if (room && room.teacher && room.teacher.id === socket.id) {
      room.currentWord = word;
      
      if (word && word.trim() !== '') {
        // Prevent duplicate consecutive words in history if pending
        const lastWord = room.wordHistory.length > 0 ? room.wordHistory[room.wordHistory.length - 1] : null;
        if (!lastWord || lastWord.word !== word || lastWord.status !== 'pending') {
          room.wordHistory.push({ word, status: 'pending' });
        }
      }

      // Emit the word to all clients in the room
      io.to(roomCode).emit('word_update', word);
      // Also update the room state
      io.to(roomCode).emit('room_state_update', room);
    }
  });

  socket.on('send_feedback', ({ roomCode, type }) => {
    const room = rooms[roomCode];
    if (room && room.teacher && room.teacher.id === socket.id) {
      if (room.wordHistory.length > 0 && room.currentWord) {
        room.wordHistory[room.wordHistory.length - 1].status = type;
      }
      room.currentWord = ''; // Clear word
      
      io.to(roomCode).emit('feedback', type);
      io.to(roomCode).emit('word_update', '');
      io.to(roomCode).emit('room_state_update', room);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Cleanup
    for (const [roomCode, room] of Object.entries(rooms)) {
      if (room.teacher && room.teacher.id === socket.id) {
        room.teacher = null;
        io.to(roomCode).emit('room_state_update', room);
      } else {
        const studentIndex = room.students.findIndex(s => s.id === socket.id);
        if (studentIndex !== -1) {
          room.students.splice(studentIndex, 1);
          io.to(roomCode).emit('room_state_update', room);
        }
      }
      
      // If room is empty, delete it
      if (!room.teacher && room.students.length === 0) {
        delete rooms[roomCode];
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
