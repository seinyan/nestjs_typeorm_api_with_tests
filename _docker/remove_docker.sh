docker image rm

docker container stop $(docker container ls -aq)
docker container rm $(docker container ls -aq)

docker image prune -a

