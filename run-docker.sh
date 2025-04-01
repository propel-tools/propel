#!/bin/bash

# This script builds, runs, and stops the Docker container for the application

IMAGE_NAME="propel-v1"
CONTAINER_NAME="propel-container"
PORT=3000

function build() {
  echo "Building Docker image..."
  docker build -t $IMAGE_NAME .
}

function start() {
  echo "Running Docker container..."
  docker run -d -p $PORT:3000 --name $CONTAINER_NAME $IMAGE_NAME
  echo "Displaying running containers..."
  docker ps
  echo "Starting application"
  npm run start
}

function stop() {
  echo "Stopping Docker container..."
  docker stop $CONTAINER_NAME
  docker rm $CONTAINER_NAME
  echo "Container stopped and removed."
}

function logs() {
  echo "Displaying logs of Docker container..."
  docker logs -f $CONTAINER_NAME
}

function help() {
  echo "Usage: $0 {build|start|stop|logs}"
  exit 1
}

case "$1" in
  build)
    build
    ;;
  start)
    start
    ;;
  stop)
    stop
    ;;
  logs)
    logs
    ;;
  *)
    help
    ;;
esac