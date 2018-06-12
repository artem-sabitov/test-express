#!/usr/bin/env bash
sudo su postgres <<'EOF'
psql -c "CREATE USER test_express ENCRYPTED PASSWORD 'test_express'"
psql -c "CREATE DATABASE test_express_db0 OWNER test_express"
psql -d test_express_db0 -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
psql -d test_express_db0 -c "CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";"

psql -d test_express_db0 -c "
CREATE TABLE customers (id UUID NOT NULL, encrypted_email VARCHAR(256) DEFAULT NULL, email_hash VARCHAR(256) DEFAULT NULL, phone VARCHAR(256) DEFAULT NULL, PRIMARY KEY(id));
CREATE UNIQUE INDEX UNIQ_PHONE ON customers (phone);
ALTER TABLE customers OWNER to test_express;"
EOF