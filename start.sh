#!/bin/bash
export VUE_APP_API_URL=http://localhost:8081
export RUNNING_IN_DOCKER=true


# yarn install && yarn build

# cd ./

docker build -t frontend-service ./frontend

docker run -d \
    -p 8080:80 \
    --restart unless-stopped \
    -e SITE=abhipobs.dev \
    -e VIRTUAL_PORT=80:8080 \
    -e VIRTUAL_HOST=abhipobs.dev \
    -e VIRTUAL_PATH=/ \
    --link api_service:api_service \
    --name frontend-service \
    -e LETSENCRYPT_HOST=abhipobs.dev \
    frontend-service
# TODO: Update application.properties

    # docker save frontend-service > frontend.tar  
    # scp -rp ./frontend.tar anish@139.59.231.241:~/home
    # docker load --input frontend.tar