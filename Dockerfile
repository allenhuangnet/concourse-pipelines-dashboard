FROM launcher.gcr.io/google/nodejs

RUN install_node v7.9.0

WORKDIR /app
ADD . /app
RUN npm --unsafe-perm install

EXPOSE 8080

ENTRYPOINT ["node", "index.js"]
