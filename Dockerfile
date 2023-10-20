FROM node:alpine

# RUN mkdir -p /usr/src/dropbox-hackathon-backend && chown -R node:node /usr/src/dropbox-hackathon-backend
RUN mkdir -p /dropbox-hackathon-backend && chown -R node:node /dropbox-hackathon-backend

WORKDIR /dropbox-hackathon-backend

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000

CMD npm start