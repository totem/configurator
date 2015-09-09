# Totem configurator

# Use node 0.10.x
FROM totem/nodejs-base:0.10.29-trusty

# Add files necessary for npm install (For caching purposes)
ADD package.json /opt/totem-configurator/

# Install node modules
RUN cd /opt/totem-configurator; rm -rf node_modules; npm install

# Update configurator directory files
ADD . /opt/totem-configurator

# Expose port
EXPOSE 5000

# Set discover var
ENV DISCOVER totem-configurator:5000

WORKDIR /opt/totem-configurator

# Set default command to gulp
ENTRYPOINT ["npm"]

# Set default param for gulp to the output directory
CMD ["start"]
