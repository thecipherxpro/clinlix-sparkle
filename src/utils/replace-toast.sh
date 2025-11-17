#!/bin/bash

# Script to replace all toast calls with banner calls
# This is a helper script for developers

FILES=$(find src -name "*.tsx" -o -name "*.ts" | grep -v "node_modules" | grep -v ".d.ts")

for file in $FILES; do
    if grep -q "import.*toast.*from.*sonner" "$file"; then
        sed -i "s/import { toast } from ['\"]sonner['\"]/import { banner } from \"@\/hooks\/use-banner\"/g" "$file"
        sed -i "s/import { toast } from ['\"]@\/hooks\/use-toast['\"]/import { banner } from \"@\/hooks\/use-banner\"/g" "$file"
        sed -i "s/import.*toast.*from.*use-toast.*/import { banner } from \"@\/hooks\/use-banner\"/g" "$file"
        
        sed -i "s/toast\.success(/banner.success(/g" "$file"
        sed -i "s/toast\.error(/banner.error(/g" "$file"
        sed -i "s/toast\.info(/banner.info(/g" "$file"
        sed -i "s/toast\.warning(/banner.warning(/g" "$file"
        
        echo "Updated: $file"
    fi
done

echo "Toast replacement complete!"
