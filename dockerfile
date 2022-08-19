# Include node image
FROM node:erbium

# Point to the working directory in the container
WORKDIR /user/src/devYelp

# Copy all from current folder to the container WORKDIR
COPY ./ ./

RUN npm install

CMD ["/bin/bash"]