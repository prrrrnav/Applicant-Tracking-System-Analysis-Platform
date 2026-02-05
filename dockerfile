# --- Base Image ---
    FROM node:20-alpine

    # --- Set Working Directory ---
    WORKDIR /app
    
    # --- Copy package.json & package-lock.json first for caching ---
    COPY package*.json ./
    
    # --- Install Dependencies ---
    RUN npm install --omit=dev
    
    # --- Copy all project files ---
    COPY . .
    
    # --- Expose app port ---
    EXPOSE 5000
    
    # --- Start App ---
    CMD ["npm", "start"]
    