const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');
html = html.replace(
  /<script>\s*if \('serviceWorker' in navigator\).*?<\/script>/s,
  `<script>
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(let registration of registrations) {
            registration.unregister();
          }
        });
      }
    </script>`
);
fs.writeFileSync('index.html', html);
