#!/bin/bash
#生产环境第一次部署新包chmod 777 test.sh
rm -rf dist/
npm run build
cp package.json dist/
zip -r  dist.zip dist/*
echo "=================deploy done!!!=================="
