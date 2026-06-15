FROM node:24-bookworm-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

RUN npm config set registry https://registry.npmmirror.com/ && \
    yarn config set registry https://registry.npmmirror.com/

# Copy the repository contents into the image and install all dependencies
COPY . .

# The container only runs the backend dev server, so strip Electron-only
# packages before installing to avoid downloading desktop binaries.
RUN node -e "const fs=require('fs');const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));for(const section of ['dependencies','devDependencies']){if(!pkg[section]) continue;for(const name of ['custom-electron-titlebar','electron','electron-builder','electron-rebuild','electronmon']) delete pkg[section][name];}fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2)+'\n');" && \
    yarn install --frozen-lockfile && \
    yarn cache clean

ENV NODE_ENV=dev
ENV PORT=10588

EXPOSE 10588

CMD ["yarn", "dev"]