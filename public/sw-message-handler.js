/**
 * Handle messages from the service worker
 * This allows the service worker to navigate the app when notifications are clicked
 */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('📨 Message from service worker:', event.data);
    
    if (event.data?.type === 'navigate' && event.data?.url) {
      // Navigate to the URL specified by the service worker
      window.location.href = event.data.url;
    }
  });
}
