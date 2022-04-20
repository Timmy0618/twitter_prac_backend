# 透過 image node 進行 npm install
echo ""
echo "Setup npm and install dependencies"
echo ""
docker run --rm -v `pwd`/myapp:/app --workdir /app node:lts npm install && npm run prod