import { io } from '../server.js';
import { createNotification } from '../controllers/notificationController.js';

export const emitNotification = async (type, title, message, data = {}) => {
  try {
    const notification = await createNotification(type, title, message, data);
    
    if (notification) {
      io.to('admin_room').emit('new_notification', {
        notification,
        unreadCount: await getUnreadCount()
      });
      
      return notification;
    }
    
    return null;
  } catch (error) {
    console.error('Error emitting notification:', error);
    return null;
  }
};

export const getUnreadCount = async () => {
  try {
    const Notification = (await import('../models/Notification.js')).default;
    return await Notification.countDocuments({ 
      recipient: 'admin', 
      read: false 
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

export const notifyNewCustomer = async (customerData) => {
  return await emitNotification(
    'new_customer',
    'নতুন কাস্টমার রেজিস্ট্রেশন',
    `${customerData.name} নামে একজন নতুন কাস্টমার রেজিস্ট্রেশন করেছেন`,
    { customerId: customerData._id, customerName: customerData.name }
  );
};

export const notifyNewOrder = async (orderData) => {
  return await emitNotification(
    'new_order',
    'নতুন অর্ডার',
    `একটি নতুন অর্ডার প্লেস করা হয়েছে, অর্ডার আইডি: ${orderData.orderId}`,
    { orderId: orderData._id, orderNumber: orderData.orderId, amount: orderData.totalAmount }
  );
};

export const notifyProductReview = async (reviewData, productData) => {
  return await emitNotification(
    'product_review',
    'নতুন প্রোডাক্ট রিভিউ',
    `${reviewData.customerName} ${productData.name} প্রোডাক্টের জন্য রিভিউ দিয়েছেন`,
    { 
      reviewId: reviewData._id, 
      productId: productData._id, 
      productName: productData.name,
      rating: reviewData.rating 
    }
  );
};

export const notifyProductQuestion = async (questionData, productData) => {
  return await emitNotification(
    'product_question',
    'নতুন প্রোডাক্ট প্রশ্ন',
    `${questionData.customerName} ${productData.name} প্রোডাক্ট সম্পর্কে প্রশ্ন করেছেন`,
    { 
      questionId: questionData._id, 
      productId: productData._id, 
      productName: productData.name,
      question: questionData.question 
    }
  );
};

export const notifyDeliveryCompleted = async (orderData) => {
  return await emitNotification(
    'delivery_completed',
    'ডেলিভারি সম্পন্ন',
    `অর্ডার আইডি: ${orderData.orderId} এর ডেলিভারি সম্পন্ন হয়েছে`,
    { 
      orderId: orderData._id, 
      orderNumber: orderData.orderId,
      deliveryDate: new Date()
    }
  );
};