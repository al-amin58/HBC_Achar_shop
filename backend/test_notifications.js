import { notifyNewCustomer, notifyNewOrder, notifyProductReview, notifyProductQuestion, notifyDeliveryCompleted } from './utils/notificationHelper.js';

async function testNotifications() {
  console.log('Testing notification system...\n');

  // Test 1: New Customer Notification
  console.log('1. Testing New Customer Notification...');
  const customerResult = await notifyNewCustomer({
    _id: 'test_customer_id',
    name: 'রহিম মিয়া',
    phonenumber: '01712345678'
  });
  console.log('New Customer Notification:', customerResult ? 'Success' : 'Failed');

  // Test 2: New Order Notification
  console.log('\n2. Testing New Order Notification...');
  const orderResult = await notifyNewOrder({
    _id: 'test_order_id',
    orderId: 'ACH-260518-ABCD',
    totalAmount: 2500,
    customerName: 'করিম মিয়া'
  });
  console.log('New Order Notification:', orderResult ? 'Success' : 'Failed');

  // Test 3: Product Review Notification
  console.log('\n3. Testing Product Review Notification...');
  const reviewResult = await notifyProductReview(
    {
      _id: 'test_review_id',
      customerName: 'সালমা খাতুন',
      rating: 4.5
    },
    {
      _id: 'test_product_id',
      name: 'আচার বিশেষ'
    }
  );
  console.log('Product Review Notification:', reviewResult ? 'Success' : 'Failed');

  // Test 4: Product Question Notification
  console.log('\n4. Testing Product Question Notification...');
  const questionResult = await notifyProductQuestion(
    {
      _id: 'test_question_id',
      customerName: 'জাহিদ হাসান',
      question: 'এই আচার কতদিন সংরক্ষণ করা যাবে?'
    },
    {
      _id: 'test_product_id',
      name: 'আচার বিশেষ'
    }
  );
  console.log('Product Question Notification:', questionResult ? 'Success' : 'Failed');

  // Test 5: Delivery Completed Notification
  console.log('\n5. Testing Delivery Completed Notification...');
  const deliveryResult = await notifyDeliveryCompleted({
    _id: 'test_order_id',
    orderId: 'ACH-260518-ABCD'
  });
  console.log('Delivery Completed Notification:', deliveryResult ? 'Success' : 'Failed');

  console.log('\nAll notification tests completed!');
  process.exit(0);
}

testNotifications().catch(error => {
  console.error('Error testing notifications:', error);
  process.exit(1);
});