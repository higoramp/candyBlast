
FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Copy over the working HEAD we downloaded from S3
COPY . .

# Run the init script to get our working directory set up if it needs to be
RUN chmod +x ./.remy/scripts/init.sh
RUN ./.remy/scripts/init.sh https://projects.koji-cdn.com/9e16d283-29d4-4751-9bcf-5916c4c14764.git

# Run install commands if we have them
RUN npm install --prefix .remy


# Start remy
CMD npm start --prefix ./.remy
