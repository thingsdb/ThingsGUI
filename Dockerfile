FROM node:25 AS build-node
ADD ./react /react
WORKDIR /react
RUN rm -rf /react/node_modules && \
    cd /react && \
    npm config set registry http://registry.npmjs.org/ && \
    npm config set loglevel warn && \
    cd /react && \
    npm install --silent && \
    npm run build:prod


FROM golang:alpine AS build-go
ENV GOPATH=""
RUN go env -w GOPROXY=direct
RUN apk add git python3

WORKDIR /build
ADD go.mod go.sum ./
RUN go mod download
ADD . .
COPY --from=build-node /react /build/react
RUN python3 ./gobuild.py -o things-gui

FROM alpine:latest
COPY --from=build-go /build/things-gui ./things-gui
EXPOSE 5000
VOLUME ["/root/.config/ThingsGUI"]
ENTRYPOINT [ "./things-gui" ]