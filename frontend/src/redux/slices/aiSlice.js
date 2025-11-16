import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// --- Async thunk gọi AI API
export const sendMessage = createAsyncThunk(
  "ai/sendMessage",
  async (message) => {
    const res = await axios.post(`${API_URL}/api/ai/ask`, { message });
    return res.data.reply;
  }
);

// --- Initial state
const initialState = {
  messages: [], // {from: 'user'|'bot', text: string}
};

// --- Slice
const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ from: "user", text: action.payload });
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.messages.push({ from: "bot", text: action.payload });
    });
  },
});

export const { addUserMessage, clearMessages } = aiSlice.actions;
export default aiSlice.reducer;
