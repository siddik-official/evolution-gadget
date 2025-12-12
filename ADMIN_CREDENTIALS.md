# Admin User Credentials

## Admin Profile - UPDATED ✅

### ✅ CORRECT Login Credentials:

**Email:** `official.evolutiongadget@gmail.com`  
**Password:** `adminev34578@`  
**Username:** admin-evolution987  
**Role:** ADMIN  
**User ID:** 691323cefd58ff7a8267755f

---

## How to Login:

1. **Make sure backend is running:** `cd backend && npm run dev`
2. **Make sure frontend is running:** `cd frontend && npm start`
3. Go to: `http://localhost:3000/admin/login`
4. Enter the email: `official.evolutiongadget@gmail.com`
5. Enter the password: `adminev34578@`
6. Click "Login to Dashboard"

---

## ✅ Verification Complete:

- ✅ Admin user exists in database
- ✅ Email is correct: `official.evolutiongadget@gmail.com`
- ✅ Password is correctly hashed and verified
- ✅ JWT_SECRET is properly configured
- ✅ JWT token generation working
- ✅ Backend authentication test PASSED
- ✅ MongoDB connection successful
- ✅ Backend server running on port 5000
- ✅ Frontend proxy configured to port 5000

---

## How to Login:

1. Go to: `http://localhost:3000/admin/login`
2. Enter the email: `admin@evulation.com`
3. Enter the password: `adminev34578@`
4. Click "Login to Dashboard"

---

## Admin Features Available:

- ✅ **Dashboard** - View analytics, sales, orders, customers stats
- ✅ **Products Management** - Add, edit, delete products
- ✅ **Customers Management** - View and manage customer accounts
- ✅ **Orders Management** - Track and manage orders
- ✅ **Chat System** - Communicate with customers
- ✅ **Analytics** - View detailed reports (coming soon)
- ✅ **Settings** - System configurations (coming soon)

---

## Re-run Admin Creation:

If you need to create the admin again or reset the password:

```bash
cd backend
npm run create-admin
```

This script will:
- Create a new admin user if it doesn't exist
- Update the password if the admin already exists

---

## Security Notes:

⚠️ **Important:** Change the default password after first login in production!

🔒 The password is automatically hashed using bcrypt with a cost factor of 12.

---

## Database Location:

The admin user is stored in MongoDB Atlas:
- Database: `evolution-gadget`
- Collection: `users`
- Role: `admin`
