CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS entries (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  custom_date TIMESTAMP,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  mood TEXT,
  location TEXT,
  media_urls JSONB,
  search_vector TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS user_id_idx ON entries(user_id);
CREATE INDEX IF NOT EXISTS custom_date_idx ON entries(custom_date);
CREATE INDEX IF NOT EXISTS tags_idx ON entries(tags);
CREATE INDEX IF NOT EXISTS search_vector_idx ON entries(search_vector); 