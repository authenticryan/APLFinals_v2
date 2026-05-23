import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LuggageIcon from '@mui/icons-material/Luggage';
import { createBagCheckSession, sendBagCheckMessage } from '../../services/geminiService';

export default function BagCheckChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const sessionRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    sessionRef.current = createBagCheckSession();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const response = await sendBagCheckMessage(sessionRef.current, text);
      setMessages((prev) => [...prev, { role: 'assistant', text: response }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Something went wrong. Please try again.', error: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <Box sx={{ border: '1.5px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{
        px: 2, py: 1.5,
        background: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)',
        display: 'flex', alignItems: 'center', gap: 1,
      }}>
        <LuggageIcon sx={{ color: '#FFB300', fontSize: 20 }} />
        <Typography variant="subtitle2" fontWeight={700} color="#fff">
          Bag Check Assistant
        </Typography>
        <Chip
          icon={<AutoAwesomeIcon sx={{ fontSize: '13px !important', color: '#FFD54F !important' }} />}
          label="Powered by Gemini"
          size="small"
          sx={{
            ml: 'auto',
            bgcolor: 'rgba(255,179,0,0.18)',
            color: '#FFD54F',
            border: '1px solid rgba(255,179,0,0.3)',
            fontSize: '0.68rem',
            height: 22,
          }}
        />
      </Box>

      {/* Messages area */}
      <Box sx={{ minHeight: 130, maxHeight: 250, overflowY: 'auto', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: '#FAFAFA' }}>
        {messages.length === 0 && !loading && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3, fontSize: '0.8rem' }}>
            Tell me what you plan to bring — I'll flag anything that might not be allowed at the gate.
          </Typography>
        )}

        {messages.map((msg, i) => (
          <Box key={i} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <Paper
              elevation={0}
              sx={{
                px: 1.5, py: 1,
                maxWidth: '88%',
                bgcolor: msg.role === 'user' ? 'primary.main' : '#fff',
                color: msg.role === 'user' ? '#fff' : msg.error ? 'error.main' : 'text.primary',
                border: msg.role === 'assistant' ? '1px solid' : 'none',
                borderColor: 'divider',
                borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              }}
            >
              <Typography variant="body2" sx={{ fontSize: '0.82rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {msg.text}
              </Typography>
            </Paper>
          </Box>
        ))}

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={13} sx={{ color: 'primary.main' }} />
            <Typography variant="caption" color="text.secondary">Checking your items…</Typography>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Box sx={{ px: 1.5, py: 1, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1, alignItems: 'flex-end', bgcolor: '#fff' }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          size="small"
          placeholder="What are you planning to take with you?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.82rem', borderRadius: 2 } }}
        />
        <IconButton
          onClick={send}
          disabled={!input.trim() || loading}
          color="primary"
          size="small"
          sx={{ mb: 0.25, flexShrink: 0 }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
