// src/pages/Login/authLocal.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const AUTH_KEY = "flagit_auth";
const USERS_KEY = "flagit_users";

function ensureSeed() {
  if (!localStorage.getItem(USERS_KEY)) {
    const seed = [
      { name: "테스트유저", email: "test@flagit.com", password: "1234" },
      { name: "관리자",     email: "admin@flagit.com", password: "admin" },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(seed));
  }
}
function readUsers() {
  ensureSeed();
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}
function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loginLocal(email, password) {
  const users = readUsers();
  const u = users.find(v => v.email === email && v.password === password);
  if (!u) return null;
  const payload = { email: u.email, name: u.name, loggedInAt: Date.now() };
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  return payload;
}

export function registerLocal({ name, email, password }) {
  const users = readUsers();
  if (users.some(v => v.email === email)) throw new Error("이미 사용 중인 이메일입니다.");
  users.push({ name, email, password });
  writeUsers(users);
  return loginLocal(email, password); // 가입 후 자동 로그인
}

export function getAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}
export function isAuthed() { return !!getAuth(); }
export function logoutLocal() { localStorage.removeItem(AUTH_KEY); }
