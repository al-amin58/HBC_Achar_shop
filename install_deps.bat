@echo off
cd backend
call npm install socket.io
cd ..
cd website
call npm install socket.io-client