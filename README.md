# Riftbound Cards - Simple Retail Website

A modern, fully-functional retail website for trading cards and collectibles. Built with HTML, CSS, and vanilla JavaScript.

## Features

✨ **Product Catalog**
- 12 pre-loaded products with categories (Rare, Common, Boosters, Decks)
- Responsive product grid layout
- Beautiful product cards with emojis and descriptions

🛒 **Shopping Cart**
- Add/remove products
- Adjust quantities with +/- buttons
- Real-time cart updates
- Persistent cart (saved to localStorage)
- Cart item counter in navigation

🔍 **Advanced Filtering**
- Search by product name or description
- Filter by category
- Filter by price range
- Combined filters work together

💰 **Checkout System**
- View cart total
- Complete order checkout
- Order confirmation

🎨 **Design**
- Modern gradient design with purple/blue theme
- Fully responsive (desktop, tablet, mobile)
- Smooth animations and transitions
- Professional styling

📱 **User Experience**
- Sticky navigation bar
- Smooth scroll navigation
- Toast notifications
- No products message when filters return empty
- Clear and intuitive interface

## File Structure

```
riftbound-cards/
├── index.html      # Main HTML file
├── styles.css      # All CSS styling
├── script.js       # JavaScript functionality
└── README.md       # Documentation
```

## Getting Started

1. Clone the repository
2. Open `index.html` in your web browser
3. Start shopping!

## How to Use

### Shopping
1. Browse products in the grid
2. Click "Add" to add items to your cart
3. View your cart by clicking the 🛒 icon in the top-right

### Filtering
1. Use the search box to find products by name
2. Select a category from the dropdown
3. Choose a price range
4. Filters work together for precise results

### Cart Management
1. View all items in the cart sidebar
2. Adjust quantities with +/- buttons
3. Remove items with the Remove button
4. View total price in real-time
5. Click "Checkout" to complete purchase
6. Click "Clear Cart" to remove all items

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox and grid
- **JavaScript (Vanilla)** - No dependencies, pure JS
- **localStorage API** - For cart persistence

## Features Showcase

### Responsive Design
The website is fully responsive and works great on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (480px - 767px)
- Small devices (<480px)

### Product Categories
- 🐉 Rare Cards
- 🪖 Common Cards
- 🌲 Booster Packs
- 📚 Deck Sets

### Color Scheme
- Primary: Deep Blue (#1a237e)
- Secondary: Indigo (#3949ab)
- Accent: Purple (#7c4dff)
- Success: Green (#4caf50)
- Danger: Red (#f44336)

## Product Data

Products are stored as an array in `script.js`. Each product contains:
```javascript
{
    id: number,
    name: string,
    category: string,
    price: number,
    description: string,
    emoji: string
}
```

## Customization

### Add More Products
Edit the `products` array in `script.js` and add new product objects.

### Change Colors
Modify the CSS custom properties in `styles.css`:
```css
:root {
    --primary-color: #1a237e;
    --secondary-color: #3949ab;
    --accent-color: #7c4dff;
    /* ... */
}
```

### Add New Filters
Modify the `filterProducts()` function in `script.js` to add additional filter criteria.

## Browser Compatibility

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- User authentication
- Product detail pages
- Image uploads
- Payment gateway integration
- Order history
- User reviews and ratings
- Wishlist feature
- Admin dashboard

## License

MIT License - feel free to use this project for learning and commercial purposes.

## Support

For questions or issues, please open an issue on GitHub.

---

**Made with ❤️ for card game enthusiasts**