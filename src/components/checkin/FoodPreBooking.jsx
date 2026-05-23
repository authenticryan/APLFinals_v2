import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import GrassIcon from '@mui/icons-material/Grass';
import { FOOD_MENU, FOOD_CATEGORIES, getOrderTotal } from '../../data/foodMenu';
import { useAppContext } from '../../context/AppContext';

export default function FoodPreBooking({ onNext, onBack }) {
  const { checkinData, updateCheckin } = useAppContext();
  const [order, setOrder] = useState(checkinData.foodOrder || []);
  const [tab, setTab] = useState(0);

  const getQty = (id) => order.find((i) => i.id === id)?.qty || 0;

  const adjustQty = (item, delta) => {
    setOrder((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (!existing && delta > 0) return [...prev, { ...item, qty: 1 }];
      if (existing) {
        const newQty = existing.qty + delta;
        return newQty <= 0
          ? prev.filter((i) => i.id !== item.id)
          : prev.map((i) => i.id === item.id ? { ...i, qty: newQty } : i);
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    updateCheckin({ foodOrder: order });
    onNext();
  };

  const category = FOOD_CATEGORIES[tab];
  const filtered = category === 'All' ? FOOD_MENU : FOOD_MENU.filter((f) => f.category === category);
  const total = getOrderTotal(order);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={700} color="primary.main">Pre-Book Food</Typography>
          <Typography variant="caption" color="text.secondary">Order now, skip the queue at the stall</Typography>
        </Box>
        {order.length > 0 && (
          <Badge badgeContent={order.reduce((s, i) => s + i.qty, 0)} color="secondary">
            <ShoppingBagIcon color="primary" />
          </Badge>
        )}
      </Box>

      {/* Category tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2, '& .MuiTab-root': { minHeight: 36, py: 0.5, fontSize: '0.78rem', textTransform: 'none', fontWeight: 600 } }}
      >
        {FOOD_CATEGORIES.map((c) => <Tab key={c} label={c} />)}
      </Tabs>

      {/* Menu items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
        {filtered.map((item) => {
          const qty = getQty(item.id);
          return (
            <Card key={item.id} variant="outlined" sx={{ borderColor: qty > 0 ? 'primary.main' : 'divider', transition: 'border-color 0.15s' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="h5" sx={{ minWidth: 36 }}>{item.emoji}</Typography>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                      {item.isVeg && (
                        <GrassIcon sx={{ fontSize: 14, color: 'success.main' }} />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">{item.description}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                    <Typography variant="body2" fontWeight={700} color="primary.main">₹{item.price}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.5 }}>
                      {qty > 0 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <IconButton size="small" onClick={() => adjustQty(item, -1)} sx={{ p: 0.25, bgcolor: 'grey.100' }}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="body2" fontWeight={700} sx={{ minWidth: 20, textAlign: 'center' }}>{qty}</Typography>
                          <IconButton size="small" onClick={() => adjustQty(item, 1)} sx={{ p: 0.25, bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Button variant="outlined" size="small" sx={{ py: 0.25, px: 1, minWidth: 0, fontSize: '0.75rem' }} onClick={() => adjustQty(item, 1)}>
                          Add
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Order summary */}
      {order.length > 0 && (
        <Card sx={{ mb: 2, bgcolor: 'primary.main', color: '#fff' }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="subtitle2" fontWeight={700} mb={1}>Your Order</Typography>
            {order.map((i) => (
              <Box key={i.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>{i.emoji} {i.name} × {i.qty}</Typography>
                <Typography variant="caption" fontWeight={700}>₹{i.price * i.qty}</Typography>
              </Box>
            ))}
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.25)', my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" fontWeight={700}>Total</Typography>
              <Typography variant="subtitle2" fontWeight={700}>₹{total}</Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={onBack} sx={{ flex: 1 }}>Back</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          sx={{ flex: 2, py: 1.4 }}
        >
          {order.length > 0 ? `Confirm Order · ₹${total}` : 'Skip Food'}
        </Button>
      </Box>
    </Box>
  );
}
