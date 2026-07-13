FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

RUN npm config set registry https://registry.npmmirror.com/ && \
    yarn config set registry https://registry.npmmirror.com/

# 设置 node-gyp 编译时下载 Node 头文件的镜像源
ENV NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node

# Copy the repository contents into the image and install all dependencies
COPY . .

# The container only runs the backend dev server, so strip Electron-only
# packages before installing to avoid downloading desktop binaries.
# --no-optional: skip onnxruntime-node (optional dep of @huggingface/transformers)
# which requires downloading binaries from GitHub and often fails in China
RUN node -e "const fs=require('fs');const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));for(const section of ['dependencies','devDependencies']){if(!pkg[section]) continue;for(const name of ['custom-electron-titlebar','electron','electron-builder','electron-rebuild','electronmon']) delete pkg[section][name];}fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2)+'\n');" && \
    yarn install --frozen-lockfile --no-optional --network-timeout 100000 && \
    yarn cache clean

ENV NODE_ENV=dev
ENV PORT=10588

EXPOSE 10588

CMD ["yarn", "dev"]