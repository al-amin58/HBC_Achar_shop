# Real-time Notification System using Socket.io

## Overview
A complete real-time notification system has been implemented for the HBC Achar Shop admin panel using Socket.io. The system provides instant notifications for various admin activities.

## Features Implemented

### 1. Notification Types
- **নতুন কাস্টমার রেজিস্ট্রেশন** - When a new customer signs up
- **নতুন অর্ডার** - When a new order is placed
- **নতুন প্রোডাক্ট রিভিউ** - When a product review is submitted
- **নতুন প্রোডাক্ট প্রশ্ন** - When a question is asked about a product
- **ডেলিভারি সম্পন্ন** - When product delivery is completed

### 2. Backend Implementation
- **Socket.io Server** - Real-time bidirectional communication
- **Notification Model** - MongoDB schema for storing notifications
- **Notification Controller** - CRUD operations for notifications
- **Notification Helper** - Utility functions for emitting notifications
- **Integration Points**:
  - Customer signup triggers notification
  - New order creation triggers notification

### 3. Frontend Implementation
- **Socket Context** - React context for Socket.io client
- **Notification Dropdown** - Interactive notification panel
- **Real-time Updates** - Live notification count and display
- **Admin Profile Page** - Profile update functionality

## File Structure

### Backend (`/backend`)
```
models/
  ├── Notification.js          # Notification schema
  ├── Admin.js                # Updated with name field
controllers/
  ├── notificationController.js # Notification CRUD operations
  ├── auth/
  │   └── adminController.js   # Added profile update functions
  ├── authController.js       # Updated with new customer notification
  └── orderController.js      # Updated with new order notification
routes/
  ├── notificationRoutes.js   # Notification API routes
  └── adminAuthRoute.js       # Updated with profile routes
utils/
  └── notificationHelper.js   # Notification emission utilities
server.js                     # Updated with Socket.io setup
```

### Frontend (`/website`)
```
src/
  ├── context/
  │   └── SocketContext.jsx   # Socket.io React context
  ├── pages/admin/Layouts/
  │   ├── NavBar.jsx          # Updated with notification dropdown
  │   └── NotificationDropdown.jsx # Notification panel component
  └── pages/admin/
      └── Profile.jsx         # Admin profile update page
```

## API Endpoints

### Notifications
- `GET /api/notifications` - Get all notifications (admin only)
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification

### Admin Profile
- `GET /api/auth/admin/profile` - Get admin profile
- `PUT /api/auth/admin/profile` - Update admin profile (name, email, password)

## How It Works

### 1. Real-time Communication
- Frontend connects to Socket.io server on page load
- Admin joins `admin_room` for receiving notifications
- Backend emits notifications to `admin_room` when events occur

### 2. Notification Flow
1. Event occurs (e.g., new customer signup)
2. Backend creates notification in database
3. Socket.io emits notification to admin room
4. Frontend receives notification in real-time
5. Notification count updates immediately
6. Notification appears in dropdown panel

### 3. User Interaction
- Click bell icon to open notification panel
- Click notification to mark as read and navigate
- Click "সব পড়া হয়েছে" to mark all as read
- Click trash icon to delete notification

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install socket.io

cd ../website
npm install socket.io-client
```

### 2. Update Admin Model
The Admin model now includes a `name` field. Update existing admins or run seed:
```bash
cd backend
node adminSeed.js
```

### 3. Start Servers
```bash
# Backend (Port 5001)
cd backend
npm run dev

# Frontend (Port 5173)
cd ../website
npm run dev
```

## Testing

### Manual Testing
1. Register a new customer - Should trigger notification
2. Place a new order - Should trigger notification
3. Click bell icon - Should show notifications
4. Click notification - Should mark as read and navigate
5. Update admin profile - Should save changes

### Automated Testing
Run notification test:
```bash
cd backend
node test_notifications.js
```

## Future Enhancements

### 1. Additional Notification Types
- Product stock alerts
- Payment status updates
- Customer support requests

### 2. Advanced Features
- Notification categories
- Priority levels
- Scheduled notifications
- Email/SMS integration

### 3. UI Improvements
- Notification sounds
- Desktop notifications
- Grouped notifications
- Search/filter functionality

## Troubleshooting

### Common Issues

1. **Notifications not appearing**
   - Check Socket.io connection in browser console
   - Verify backend is running on port 5001
   - Check MongoDB connection

2. **Notification count not updating**
   - Refresh page to re-establish Socket.io connection
   - Check admin authentication token

3. **Profile update failing**
   - Verify current password is correct
   - Check password requirements (min 8 characters)

### Debugging
- Check browser console for Socket.io errors
- Check backend console for notification emission logs
- Verify API endpoints are accessible

## Security Considerations

1. **Authentication Required** - All notification endpoints require admin auth
2. **Data Validation** - Input validation on all API endpoints
3. **Secure Communication** - Socket.io with CORS restrictions
4. **Password Security** - BCrypt hashing for passwords

## Performance Notes

1. **Database Indexing** - Notifications indexed by recipient and read status
2. **Real-time Efficiency** - Socket.io rooms for targeted notifications
3. **Client-side Optimization** - Debounced notification updates
4. **Memory Management** - Notification limit (20 by default)