
set -o nounset
set -o errexit

ADDON=$1
URL=https://github.com/alexrs95/shield-studies-addon-template

git clone --depth 1  $URL "$1" >> /dev/null

set +x
cd "$1";
rm -rf .git

# alter the package.json
$(dirname "$0")/alter-package-json.js "`pwd`/package.json" "$1"

git init >> /dev/null
git add .
git commit -m "Initial commit, from shield-studies-addon-template" >> /dev/null

echo "
# Success: Shield Study created
- from:  alexrs95/shield-studies-addon-template
- to:    '$1'

## Next Steps

- cd '$1'
- npm install
- npm run build
"
