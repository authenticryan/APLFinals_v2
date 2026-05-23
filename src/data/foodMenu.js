export const FOOD_CATEGORIES = ['All', 'Snacks', 'Mains', 'Beverages', 'Desserts', 'Combos'];

export const FOOD_MENU = [
  { id: 'f1', name: 'Samosa (2 pcs)', price: 50, category: 'Snacks', emoji: '🥟', isVeg: true, description: 'Crispy potato-filled pastry, served with mint chutney' },
  { id: 'f2', name: 'Vada Pav', price: 40, category: 'Snacks', emoji: '🍞', isVeg: true, description: "Mumbai's favourite street food with spicy green chutney" },
  { id: 'f3', name: 'Popcorn (Large)', price: 80, category: 'Snacks', emoji: '🍿', isVeg: true, description: 'Salted, caramel, or masala flavour' },
  { id: 'f4', name: 'Nachos with Dip', price: 100, category: 'Snacks', emoji: '🌽', isVeg: true, description: 'Crispy nachos with salsa and cheese dip' },
  { id: 'f5', name: 'Dahi Puri (6 pcs)', price: 80, category: 'Snacks', emoji: '🫙', isVeg: true, description: 'Crispy puri with yogurt, tamarind, and sev' },
  { id: 'f6', name: 'Pav Bhaji', price: 90, category: 'Snacks', emoji: '🍲', isVeg: true, description: 'Mumbai-style spiced vegetable mash with buttered pav' },
  { id: 'f7', name: 'Chicken Biryani', price: 180, category: 'Mains', emoji: '🍛', isVeg: false, description: 'Aromatic basmati rice with tender chicken and spices' },
  { id: 'f8', name: 'Veg Biryani', price: 150, category: 'Mains', emoji: '🍚', isVeg: true, description: 'Fragrant basmati rice with fresh vegetables' },
  { id: 'f9', name: 'Chicken Burger', price: 130, category: 'Mains', emoji: '🍔', isVeg: false, description: 'Crispy fried chicken with lettuce and special sauce' },
  { id: 'f10', name: 'Aloo Tikki Burger', price: 100, category: 'Mains', emoji: '🥗', isVeg: true, description: 'Spiced potato patty with tangy chutney' },
  { id: 'f11', name: 'Pizza Slice', price: 90, category: 'Mains', emoji: '🍕', isVeg: false, description: 'Loaded with chicken tikka, peppers, and cheese' },
  { id: 'f12', name: 'Masala Chai', price: 30, category: 'Beverages', emoji: '☕', isVeg: true, description: 'Freshly brewed spiced tea' },
  { id: 'f13', name: 'Cold Drink (500ml)', price: 60, category: 'Beverages', emoji: '🥤', isVeg: true, description: 'Coca-Cola, Pepsi, or Sprite' },
  { id: 'f14', name: 'Fresh Lime Soda', price: 50, category: 'Beverages', emoji: '🍋', isVeg: true, description: 'Sweet, salted, or mixed' },
  { id: 'f15', name: 'Mineral Water (1L)', price: 30, category: 'Beverages', emoji: '💧', isVeg: true, description: 'Sealed Bisleri or Aquafina bottle' },
  { id: 'f16', name: 'Mango Lassi', price: 70, category: 'Beverages', emoji: '🥭', isVeg: true, description: 'Thick, creamy blended yogurt with Alphonso mango' },
  { id: 'f17', name: 'Ice Cream Cup', price: 70, category: 'Desserts', emoji: '🍦', isVeg: true, description: 'Vanilla, chocolate, or strawberry' },
  { id: 'f18', name: 'Gulab Jamun (3 pcs)', price: 60, category: 'Desserts', emoji: '🍮', isVeg: true, description: 'Soft milk-solid dumplings soaked in rose syrup' },
  { id: 'f19', name: 'Biryani + Cold Drink', price: 220, category: 'Combos', emoji: '🎁', isVeg: false, description: 'Chicken biryani with your choice of cold drink — save ₹20' },
  { id: 'f20', name: 'Snack Combo', price: 160, category: 'Combos', emoji: '🎯', isVeg: true, description: 'Samosa + Vada Pav + Masala Chai — save ₹10' },
];

export const getOrderTotal = (order) =>
  order.reduce((sum, item) => sum + item.price * item.qty, 0);
