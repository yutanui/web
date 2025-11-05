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

This project implements a sophisticated, modular architecture using multiple design patterns to create reusable, type-safe components.

### Design Patterns

#### 1. **Composition Pattern** (Primary)
Building complex models from simple, reusable utilities rather than using inheritance:

```typescript
// Model composes three utilities via dependency injection
class Model<T> {
  constructor(
    private attributes: ModelAttributes<T>,
    private events: Events,
    private sync: Sync<T>
  ) {}
}
```

#### 2. **Dependency Injection**
Dependencies are injected through constructors, enabling loose coupling and testability:

```typescript
// User factory injects configured dependencies
static build(user: IUser): User {
  return new User(
    new Attributes<IUser>(user),
    new Eventing(),
    new ApiSync<IUser>('http://localhost:3000/users')
  );
}
```

#### 3. **Delegation Pattern**
Model acts as a facade, delegating method calls to specialized components:

```typescript
get(prop: keyof T) {
  return this.attributes.get(prop);  // Delegates to Attributes
}

on(eventName: string, callback: () => void) {
  this.events.on(eventName, callback);  // Delegates to Eventing
}
```

#### 4. **Generic Programming**
Type-safe, reusable components that work with any data structure:

```typescript
class Model<T extends HasId> {  // Works with User, Post, etc.
  async save(): Promise<void> {
    const res = await this.sync.save(this.attributes.getAll());
    this.attributes.set(res.data);
  }
}
```

#### 5. **Static Factory Pattern**
Encapsulates complex instantiation logic behind a simple interface:

```typescript
const user = User.build({ name: 'Nui', age: 20 });
// Instead of: new User(new Attributes(...), new Eventing(), new ApiSync(...))
```

#### 6. **Interface Segregation**
Model depends on minimal interfaces, not concrete implementations:

```typescript
interface Events {
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void;
}
// Any class implementing this interface will work
```

### Core Components

#### **Model** ([src/models/Model.ts](src/models/Model.ts))
Generic base class that composes all utilities:
- Delegates to Attributes, Eventing, and ApiSync
- Provides unified interface: `get()`, `set()`, `on()`, `trigger()`, `fetch()`, `save()`
- Implements Active Record pattern (data + behavior in one class)
- Reusable for any domain model

#### **Attributes** ([src/models/Attributes.ts](src/models/Attributes.ts))
Type-safe data management:
- `get<K>(key: K)` - Retrieve attribute values with type safety
- `set(update: Partial<T>)` - Update attributes (partial updates supported)
- `getAll(): T` - Get complete data object
- Generic implementation for any data structure

#### **Eventing** ([src/models/Eventing.ts](src/models/Eventing.ts))
Event system providing pub/sub functionality:
- `on(eventName, callback)` - Subscribe to events
- `trigger(eventName)` - Publish events to all subscribers
- Stores callbacks in dictionary structure

#### **ApiSync** ([src/models/ApiSync.ts](src/models/ApiSync.ts))
Generic HTTP synchronization layer for CRUD operations:
- `fetch(id)` - GET request to retrieve data
- `save(data)` - POST (create) or PUT (update) based on ID presence
- Works with any type extending `HasId` interface
- Configurable endpoint URL

#### **User** ([src/models/User.ts](src/models/User.ts))
Domain model extending Model:
- Defines `IUser` interface: `{ id?, name?, age? }`
- Static factory method `User.build()` for easy instantiation
- Inherits all Model functionality automatically

### Architecture Benefits

**Reusability**: Create new models (Post, Comment, Product) by extending Model:

```typescript
export class Post extends Model<IPost> {
  static build(post: IPost): Post {
    return new Post(
      new Attributes<IPost>(post),
      new Eventing(),
      new ApiSync<IPost>('http://localhost:3000/posts')
    );
  }
}
```

**Type Safety**: TypeScript generics ensure compile-time correctness:
```typescript
user.get('name');  // ✓ Returns string | undefined
user.get('foo');   // ✗ Compile error: 'foo' not in IUser
```

**Testability**: Easy to mock dependencies for unit testing:
```typescript
const mockSync = { fetch: jest.fn(), save: jest.fn() };
const user = new User(attributes, events, mockSync);
```

**Flexibility**: Swap implementations without changing Model:
```typescript
new User(attrs, events, new LocalStorageSync());  // Different sync
new User(attrs, new CustomEventing(), sync);      // Different events
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

### Creating a User with Factory Method

```typescript
import { User } from './models/User';

// Use static factory method for easy instantiation
const user = User.build({ name: "Nui", age: 20 });

console.log(user.get("name")); // "Nui"
console.log(user.get("age"));  // 20
```

### Fetching a User from API

```typescript
// Create user with existing ID
const user = User.build({ id: "5784" });

// Fetch data from server
await user.fetch();

console.log(user.get("name")); // "Nui" (from server)
console.log(user.get("age"));  // 20 (from server)
```

### Creating and Saving a New User

```typescript
const newUser = User.build({ name: "Thee", age: 3 });

// Save to server (POST request, auto-generates ID)
await newUser.save();

console.log(newUser.get("id")); // "f8c2" (auto-generated by json-server)
```

### Updating an Existing User

```typescript
const user = User.build({ id: "5784", name: "Nui", age: 20 });

// Update attributes
user.set({ age: 21 });

// Save to server (PUT request)
await user.save();
```

### Using Events for Reactive Programming

```typescript
const user = User.build({ name: "Nui", age: 20 });

// Subscribe to events
user.on("change", () => {
  console.log("User data changed!");
});

user.on("save", () => {
  console.log("User saved to server!");
});

// Trigger events
user.trigger("change");  // Logs: "User data changed!"

// Events work with async operations
await user.save();
user.trigger("save");    // Logs: "User saved to server!"
```

### Extending Model for New Domain Objects

```typescript
interface IPost {
  id?: string;
  title?: string;
  content?: string;
  userId?: string;
}

export class Post extends Model<IPost> {
  static build(post: IPost): Post {
    return new Post(
      new Attributes<IPost>(post),
      new Eventing(),
      new ApiSync<IPost>('http://localhost:3000/posts')
    );
  }
}

// Use exactly like User!
const post = Post.build({ title: "My Post", content: "Hello World" });
await post.save();
```

## Project Structure

```
web/
├── src/
│   ├── models/
│   │   ├── Model.ts         # Generic base class (composition & delegation)
│   │   ├── Attributes.ts    # Generic data/state management
│   │   ├── Eventing.ts      # Event system (pub/sub pattern)
│   │   ├── ApiSync.ts       # HTTP synchronization layer
│   │   └── User.ts          # User domain model (extends Model)
│   └── index.ts             # Application entry point
├── db.json                  # JSON Server database
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── CLAUDE.md                # AI assistant guidance
└── README.md                # Project documentation
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

This project demonstrates advanced TypeScript and software engineering concepts:

### Design Patterns
1. **Composition over Inheritance** - Building Model from reusable Attributes, Eventing, and ApiSync utilities
2. **Dependency Injection** - Constructor-based injection for loose coupling and testability
3. **Delegation Pattern** - Model delegates method calls to composed components
4. **Static Factory Pattern** - `User.build()` encapsulates complex instantiation logic
5. **Interface Segregation** - Minimal interfaces (ModelAttributes, Events, Sync) for flexibility

### TypeScript Features
6. **Generic Types** - `Model<T>`, `Attributes<T>`, `ApiSync<T>` for type-safe reusability
7. **Generic Constraints** - `T extends HasId` ensures type compatibility
8. **keyof Operator** - Type-safe property access with `get<K extends keyof T>(key: K)`
9. **Partial Types** - `set(update: Partial<T>)` for partial updates
10. **Interface-Based Design** - Contract-based programming for decoupling

### Architecture Patterns
11. **Active Record Pattern** - Models combine data and persistence behavior
12. **Event-Driven Architecture** - Pub/sub pattern for reactive programming
13. **RESTful API Integration** - HTTP CRUD operations with axios
14. **Facade Pattern** - Model provides unified interface to subsystems

### Modern Development
15. **Modern Tooling** - Parcel bundler, Prettier formatter, TypeScript compiler
16. **Mock REST API** - json-server for rapid prototyping
17. **Async/Await** - Promise-based asynchronous operations

## Contributing

This is a learning project. Feel free to fork and experiment!

## License

ISC

## Repository

[https://github.com/yutanui/web](https://github.com/yutanui/web)

## Issues

Report issues at: [https://github.com/yutanui/web/issues](https://github.com/yutanui/web/issues)
