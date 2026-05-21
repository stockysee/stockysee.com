// FINAL PREMIUM WORKER - ROBUST VERSION
self.addEventListener('push', function(event) {
  console.log('📬 [SW] Push event received');
  
  let title = 'Stockysee Notif 💰';
  let body = 'Ada aktivitas baru di toko lu bor!';
  let url = '/dashboard/orders';

  if (event.data) {
    try {
      const data = event.data.json();
      title = data.title || title;
      body = data.body || body;
      url = data.url || url;
    } catch (e) {
      console.error('❌ [SW] Data parsing failed, using fallback');
    }
  }

  const options = {
    body: body,
    icon: location.origin + '/logo.png?v=99',
    badge: location.origin + '/logo.png?v=99',
    vibrate: [200, 100, 200],
    silent: false,
    tag: 'stockysee-order',
    renotify: true,
    data: {
      url: url
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/dashboard/orders';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});
