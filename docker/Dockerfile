# AtomizerTemplate Docker Build Environment
# AtomizerTemplate Version: <version>

# Ubuntu 20.04 base
FROM ubuntu:20.04

# Specific program version arguments for easy adjustment
ARG NODE_JS_VERSION=14

# Exposed ports:
# 3000: Web UI default port
# 3001: Web Docs default port
# 6080: noVNC server
# 8080: Mock Api REST port
# 2883: Mock Api MQTT port
# 9229: Web debug port
EXPOSE 3000/tcp 3001/tcp 6080/tcp 8080/tcp 2883/tcp  9229/tcp

# The development folder
VOLUME /devel

# Set the development folder as the entry folder
WORKDIR /devel

# Package dependencies
RUN apt-get update \
  && apt-get install -y curl software-properties-common \
  && curl -sSL https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public | apt-key add - \
  && add-apt-repository --yes https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/ \
  && curl -sSL https://deb.nodesource.com/setup_${NODE_JS_VERSION}.x | bash - \
  && apt-get install -y nodejs xvfb x11vnc novnc adoptopenjdk-11-hotspot \
  && apt-get install -y libgtk-3-0 libnss3 libxss1 libasound2 libx11-xcb1 \
  && apt-get install -y libva-glx2 libva-x11-2 i965-va-driver chromium-codecs-ffmpeg-extra libgl1-mesa-glx \
  && apt-get install -y squashfs-tools binutils jq rsync \
  && apt-get install -y ruby ruby-dev rubygems build-essential \
  && apt-get install -y git net-tools iputils-ping vim bash-completion \
  && gem install --no-document fpm \
  && curl -sL http://git.yoctoproject.org/cgit/cgit.cgi/opkg-utils/snapshot/opkg-utils-0.4.3.tar.gz | tar --wildcards -C /usr/local/bin --strip-components 1 -xz opkg*/opkg* opkg*/*.py \
  # Add Wine so we can build windows desktop apps in the linux container
  # See: https://www.electron.build/multi-platform-build#to-build-app-for-windows-on-linux
  && dpkg --add-architecture i386 \
  && curl -sSL https://dl.winehq.org/wine-builds/winehq.key | apt-key add - \
  && add-apt-repository --yes https://dl.winehq.org/wine-builds/ubuntu/ \
  && apt-get update \
  && apt-get install -y --no-install-recommends winehq-stable \
  # Cleanup apt to reduce image size
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Java installation path
ENV JAVA_HOME /usr/lib/jvm/adoptopenjdk-11-hotspot-amd64

# Enable colors in terminal
ENV TERM xterm-256color

# Display used by Xvfb
ENV DISPLAY :99

# Create the entrypoint script
RUN echo "#!/bin/bash\n" \
  '( Xvfb -ac -listen tcp -screen 0 1920x920x24 $DISPLAY ) &\n' \
  "( x11vnc -forever -shared ) &\n" \
  "( /usr/share/novnc/utils/launch.sh ) &\n" \
  "trap 'echo \"Stopping docker entrypoint script due to SIGTERM\" ; exit 0' SIGTERM\n" \
  "while true; do sleep 1; done\n" > /usr/bin/entrypoint.sh && chmod 755 /usr/bin/entrypoint.sh

# Check the latest version of pnpm to ensure the next run command is not cached if newer
ADD https://registry.npmjs.org/pnpm/latest /tmp/pnpm-version
# Upgrade npm and install npm global dependencies
RUN npm i -g npm pnpm@7 \
  && pnpm install-completion bash

# Create a user so created files won't be owned by root
RUN useradd -r -m -U -u 1000 dev

# give the user access to the global npm folder
RUN chown root:dev -R /usr/lib/node_modules \
  && chmod g+w -R /usr/lib/node_modules/

# Use dev user by default
USER dev

# Set the entrypoint script that keeps the image running
ENTRYPOINT /usr/bin/entrypoint.sh
