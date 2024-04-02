#!/bin/bash
export VUE_APP_API_URL=http://localhost:8081
export RUNNING_IN_DOCKER=true


# yarn install && yarn build

# cd ./

docker build -t frontend-service ./frontend

docker run -d \
    -p 80:80 \
    -e SITE=www.abhipobs.dev \
    -e VIRTUAL_PORT=80 \
    -e VIRTUAL_HOST=www.abhipobs.dev \
    -e VIRTUAL_PATH=/ \
    --name frontend-service \
    --network host \
    -e LETSENCRYPT_HOST=www.abhipobs.dev \
    frontend-service

    # docker save frontend-service > frontend.tar  
    # scp -rp ./frontend.tar anish@139.59.231.241:~/home
    # docker load --input frontend.tar