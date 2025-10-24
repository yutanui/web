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

This is a TypeScript learning project implementing a user management system with a modular, composition-based architecture.

### Core Design Pattern
The codebase demonstrates **composition over inheritance** through reusable utility classes that can be composed into domain models:

- **Eventing**: Event system for pub/sub functionality (on/trigger methods)
- **Sync**: Generic HTTP synchronization layer for CRUD operations with json-server
- **User**: Domain model that composes Eventing and Sync instances

### Key Architectural Points

**Sync Layer (`src/models/Sync.ts`)**
- Generic class `Sync<T extends HasId>` for API communication
- Hardcoded to `http://localhost:3000/users` endpoint
- Supports fetch (GET), save (POST/PUT) operations
- Returns AxiosResponse objects

**Eventing System (`src/models/Eventing.ts`)**
- Simple event emitter with `on()` and `trigger()` methods
- Stores callbacks in object with event name as key
- Currently instantiated in User but not fully integrated

**User Model (`src/models/User.ts`)**
- Contains both `events` and `sync` instances (composition)
- Implements its own fetch/save methods that duplicate Sync functionality
- Uses `IUser` interface with optional id, name, age fields
- Note: There's architectural inconsistency - User has Sync instance but doesn't use it, instead implements duplicate HTTP logic directly

### Current State
The User class is in transition - it has both:
1. Direct axios calls in its fetch/save methods
2. Unused Sync instance that could handle the same operations

The Eventing system is also instantiated but not actively used (see commented code in `src/index.ts:6-16`).

### Backend API
Uses json-server with `db.json` containing a `users` collection. The API is expected at `http://localhost:3000`.
