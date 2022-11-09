yarn build

zipname="NextJS-DevTools.zip"
cd dist && zip -r "$zipname" .

echo "Extension generated at $zipname"
