### Building and running your application

When you're ready, start your application by running:
`docker compose up --build`.

Docker-comple.yaml example:
```
version: '3'
services:
  actual_server:
    container_name: myedenredactual
    image: docker.io/rodriguestiago0/myedenredactual
    environment:
      - PUID=1003
      - PGID=100
      - TZ=Europe/Lisbon
      - EDENRED_USERNAME=
      - EDENRED_PASSWORD=
      - EDENRED_ACCOUNT_MAP=comma separated vlue (Both EDENRED_ACCOUNT_MAP and ACTUAL_ACCOUNT_MAP need to have the same size)
      - ACTUAL_ACCOUNT_MAP=#comma separated vlue
      - ACTUAL_SERVER_URL= 
      - ACTUAL_SERVER_PASSWORD=
      - ACTUAL_SYNC_ID=
      - CRON_EXPRESSION= # default value is "0 */4 * * *"
    restart: unless-stopped
```

```
docker run -d --name myedenredactual \
    - e 'EDENRED_USERNAME=' \
    - e 'EDENRED_PASSWORD=' \
    - e 'EDENRED_ACCOUNT_MAP=' \
    - e 'ACTUAL_ACCOUNT_MAP=' \
    - e 'ACTUAL_SERVER_URL= ' \
    - e 'ACTUAL_SERVER_PASSWORD=' \
    - e 'ACTUAL_SYNC_ID=' \
    - e CRON_EXPRESSION= # default value is "0 */4 * '* *"' \
  --restart=on-failure rodriguestiago0/myedenredactual:latest
```