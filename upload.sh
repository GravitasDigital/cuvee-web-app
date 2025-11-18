#!/bin/bash

echo "📦 Preparing files for upload..."

# Create a deployment package
mkdir -p deploy-package
cp -r dist/* deploy-package/
cp server.js deploy-package/api-server.js

echo "✅ Files ready in ./deploy-package/"
echo ""
echo "📁 Contents:"
ls -la deploy-package/
echo ""
echo "🚀 Next steps:"
echo "1. Use your SFTP client (FileZilla, Cyberduck, etc.)"
echo "2. Connect to: ssh.experiments.digital (port 18765)"
echo "3. Username: u1897-3ull1ca1xot6"
echo "4. Upload contents of ./deploy-package/ to: www/experiments.digital/public_html/cuvee-app/"
echo ""
echo "📡 Your app will be live at: https://experiments.digital/cuvee-app/"
