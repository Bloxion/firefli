FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Create non-root user for security
RUN addgroup -S firefli && adduser -S firefli -G firefli

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json pnpm-lock.yaml ./
# Copy Prisma schema
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client for the specific platform
RUN pnpm exec prisma generate

# Bundle app source
COPY . .

# Build the app
RUN pnpm run build

# Set ownership to non-root user
RUN chown -R firefli:firefli /usr/src/app

# Switch to non-root user
USER firefli

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["pnpm", "run", "start"]