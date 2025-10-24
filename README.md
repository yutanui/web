# TypeScript Web - User Management System

A TypeScript learning project demonstrating modern architectural patterns for building a user management system with a composition-based design.

## Overview

This project showcases key TypeScript and software engineering concepts including:

- **Composition over Inheritance** - Building complex models from simple, reusable utilities
- **Generic Types** - Type-safe, reusable components
- **Event-Driven Architecture** - Pub/Sub pattern for loosely coupled components
- **RESTful API Integration** - HTTP operations with Axios and json-server

## Features

- Fetch user data from REST API
- Create new users with automatic ID generation
- Update existing user information
- Event system for reactive programming
- Type-safe model attributes with generic getters/setters

## Architecture

### Core Components

The application is built using three main utility classes that compose together:

#### 1. **Eventing** ([src/models/Eventing.ts](src/models/Eventing.ts))
Event system providing pub/sub functionality:
- `on(eventName, callback)` - Subscribe to events
- `trigger(eventName)` - Publish events to subscribers

#### 2. **Sync** ([src/models/Sync.ts](src/models/Sync.ts))
Generic HTTP synchronization layer for CRUD operations:
- `fetch(id)` - GET request to retrieve data
- `save(data)` - POST/PUT request to persist data
- Works with any type extending `HasId` interface

#### 3. **Attributes** ([src/models/Attributes.ts](src/models/Attributes.ts))
Type-safe attribute management:
- `get(key)` - Retrieve attribute values
- `set(data)` - Update attributes
- Generic implementation for any data structure

#### 4. **User** ([src/models/User.ts](src/models/User.ts))
Domain model composing all utilities:
- Manages user data (id, name, age)
- Integrates Eventing, Sync, and Attributes
- Provides high-level API for user operations

### Design Pattern

The codebase demonstrates **composition over inheritance**:

```typescript
class User {
  constructor(
    private events: Eventing,
    private sync: Sync<UserProps>,
    private attributes: Attributes<UserProps>
  ) {}

  // Compose behavior from utilities
  on = this.events.on;
  trigger = this.events.trigger;
  get = this.attributes.get;
}
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

```bash
# Clone the repository
git clone https://github.com/yutanui/web.git

# Navigate to project directory
cd web

# Install dependencies
npm install
```

## Development

### Running the Application

This project requires two services running simultaneously:

1. **Start the JSON Server** (Backend API)
   ```bash
   npm run start:db
   ```
   This starts json-server on `http://localhost:3000` serving the [db.json](db.json) database.

2. **Start the Parcel Dev Server** (Frontend)
   ```bash
   npm run start:parcel
   ```
   This bundles and serves the TypeScript application with hot module replacement.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start:db` | Start JSON Server on port 3000 |
| `npm run start:parcel` | Start Parcel dev server with HMR |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## Usage Examples

### Fetching a User

```typescript
import { User } from './models/User';

const user = new User({ id: "5784" });
user.fetch().then(() => {
  console.log(user.get("name")); // "Nui"
  console.log(user.get("age"));  // 20
});
```

### Creating a New User

```typescript
const newUser = new User({ name: "Thee", age: 3 });
newUser.save().then(() => {
  console.log(newUser.get("id")); // Auto-generated ID
});
```

### Using Events

```typescript
const user = new User({ id: "1", name: "Nui", age: 20 });

user.on("change", () => {
  console.log("User data changed!");
});

user.trigger("change"); // Fires event
```

## Project Structure

```
web/
├── src/
│   ├── models/
│   │   ├── Attributes.ts    # Generic attribute management
│   │   ├── Eventing.ts      # Event system (pub/sub)
│   │   ├── Sync.ts          # HTTP synchronization layer
│   │   └── User.ts          # User domain model
│   └── index.ts             # Application entry point
├── db.json                  # JSON Server database
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── CLAUDE.md               # AI assistant guidance

```

## API Endpoints

The JSON Server provides the following REST endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

## Technology Stack

- **TypeScript** - Type-safe JavaScript
- **Axios** - HTTP client for API requests
- **json-server** - Mock REST API backend
- **Parcel** - Zero-config bundler with HMR
- **Prettier** - Code formatting

## Learning Objectives

This project demonstrates:

1. **Generic Types in TypeScript** - `Sync<T>`, `Attributes<T>` for reusable components
2. **Composition Pattern** - Building complex objects from simple utilities
3. **Interface Constraints** - `HasId` interface for type safety
4. **Event-Driven Design** - Decoupled components via pub/sub
5. **Modern Tooling** - Parcel bundler, Prettier, TypeScript compiler

## Contributing

This is a learning project. Feel free to fork and experiment!

## License

ISC

## Repository

[https://github.com/yutanui/web](https://github.com/yutanui/web)

## Issues

Report issues at: [https://github.com/yutanui/web/issues](https://github.com/yutanui/web/issues)
