# Diamond-Lux Backend

## Static Categories Implementation

This backend has been updated to use static diamond shape categories instead of dynamic categories.

### Categories

Categories are now predefined and cannot be modified through the API. The available categories are:

- Round
- Oval
- Pear
- Emerald
- Sq. Emerald
- Cushion Brilliant
- Cushion Modified
- Crisscut
- Marquise
- Radiant
- Sq. Radiant
- Princess
- Asscher
- Heart
- Old Miner
- European Cut
- Octagonal
- Pentagonal
- Hexagonal
- Trapzoid
- Traingular
- Trilliant
- Lozenge
- Kite
- Baguette
- Shield
- Butterfly
- Half Moon
- Rose Cut

### Migration Instructions

If you're upgrading from a version with dynamic categories, you need to run the migration script to update your existing products:

```bash
npm run migrate-categories
```

This script will:

1. Connect to your MongoDB database
2. Find all existing categories and create a mapping to the new static categories
3. Update all products to use the new category system
4. Log the results of the migration

### API Changes

- All previous category API endpoints continue to work but with modified behavior:
  - `GET /api/category` - Returns the static list of categories
  - `POST /api/category` - Returns a message that categories are static
  - `PUT /api/category/:id` - Returns a message that categories are static
  - `DELETE /api/category/:id` - Returns a message that categories are static

### Database Schema Changes

- `Product` model: Changed `category` field from ObjectId reference to String ID
