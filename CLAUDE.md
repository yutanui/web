# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
npm run start:db      # Start JSON Server on port 3000 with db.json
npm run start:parcel  # Start Parcel dev server with index.html
```

Both commands should be run in separate terminals for full development environment. The JSON Server provides the backend API, while Parcel bundles and serves the TypeScript frontend.

### Development Workflow
1. Start JSON Server first: `npm run start:db`
2. In a separate terminal, start Parcel: `npm run start:parcel`
3. Access the application through the Parcel dev server URL

## Architecture Overview

This is a TypeScript learning project implementing a user management system with a modular, composition-based architecture using advanced design patterns.

### Core Design Patterns

#### 1. **Composition Pattern** (Primary)
The codebase demonstrates **composition over inheritance** through reusable utility classes:

- **Attributes** (`src/models/Attributes.ts`): Data/state management with get/set/getAll methods
- **Eventing** (`src/models/Eventing.ts`): Event system for pub/sub functionality (on/trigger methods)
- **ApiSync** (`src/models/ApiSync.ts`): Generic HTTP synchronization layer for CRUD operations
- **Model** (`src/models/Model.ts`): Generic base class composing all three utilities
- **User** (`src/models/User.ts`): Domain model extending Model with static factory method

#### 2. **Dependency Injection Pattern**
Model receives its dependencies (Attributes, Eventing, ApiSync) through constructor injection rather than creating them internally. This enables:
- Loose coupling between components
- Easy testing with mocks/stubs
- Flexibility to swap implementations

#### 3. **Delegation Pattern**
Model acts as a facade, delegating method calls to composed objects:
- `get()/set()` → delegates to Attributes
- `on()/trigger()` → delegates to Eventing
- `fetch()/save()` → delegates to ApiSync (with coordination)

#### 4. **Generic Programming**
Model is a generic class `Model<T extends HasId>` that works with any domain object type, providing:
- Type safety across all operations
- Reusability for different models (User, Post, Product, etc.)
- Compile-time type checking

#### 5. **Static Factory Pattern**
User uses `User.build()` static factory instead of direct constructor, which:
- Encapsulates complex instantiation logic
- Ensures consistent configuration
- Provides convenience for users

#### 6. **Interface Segregation**
Model depends on minimal interfaces (ModelAttributes, Events, Sync) rather than concrete classes, enabling flexibility and decoupling.

### Component Details

**Attributes Layer (`src/models/Attributes.ts`)**
- Generic class `Attributes<T extends object>` for data management
- Methods: `get<K>(key: K)`, `set(update: Partial<T>)`, `getAll(): T`
- Handles internal state using Object.assign for updates

**Eventing System (`src/models/Eventing.ts`)**
- Simple event emitter with `on()` and `trigger()` methods
- Stores callbacks in dictionary: `{ [eventName: string]: Callback[] }`
- Fully integrated and actively used in the application

**ApiSync Layer (`src/models/ApiSync.ts`)**
- Generic class `ApiSync<T extends HasId>` for API communication
- Configurable endpoint URL via constructor
- `fetch(id)`: GET request to `${url}/${id}`
- `save(data)`: POST (new) or PUT (existing) based on id presence
- Returns AxiosResponse objects

**Model Base Class (`src/models/Model.ts`)**
- Generic class composing Attributes, Events, and Sync via dependency injection
- Provides unified interface delegating to composed instances
- Implements Active Record pattern: `fetch()` and `save()` coordinate sync + state updates
- Uses TypeScript interfaces for type-safe, flexible composition

**User Model (`src/models/User.ts`)**
- Extends `Model<IUser>` generic base class
- Uses static factory `User.build(user: IUser)` for instantiation
- Factory instantiates all three utilities with proper configuration
- IUser interface: `{ id?: string; name?: string; age?: number }`

### Current State
The codebase has been successfully refactored from a monolithic User class to a clean, modular architecture:

**Previous Design** (commented code in User.ts:24-58):
- User directly instantiated and managed events, sync, attr
- Hard to reuse for other domain models
- Tight coupling between User and utilities

**Current Design**:
- Generic Model class provides reusable infrastructure
- User simply extends Model with domain-specific type
- Clean separation of concerns with single responsibility per class
- Easy to add new models (Post, Comment, etc.) by extending Model
- Eventing system is fully integrated and functional

### Backend API
Uses json-server with `db.json` containing a `users` collection. The API is expected at `http://localhost:3000`.
