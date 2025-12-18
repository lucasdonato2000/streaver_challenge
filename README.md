# Streaver Challenge - Community Posts

A Next.js application that displays and manages community posts with user filtering, pagination, and error handling capabilities.

## Prerequisites

- Node.js 18+ installed
- npm package manager

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```bash
DATABASE_URL="file:./db/dev.db"
API_URL="https://jsonplaceholder.typicode.com"
```

- `DATABASE_URL`: SQLite database file path
- `API_URL`: External API endpoint for seeding data

## Database Setup

### 1. Run Prisma Migrations

```bash
npx prisma db push
```

This creates the database schema with User and Post tables.

### 2. Seed the Database

```bash
npm run prisma:seed
```

The seed script performs the following operations:

- Fetches users and posts from JSONPlaceholder API
- Creates users in the database
- **Shuffles posts using Fisher-Yates algorithm** to randomize order
- Inserts posts with auto-generated sequential IDs
- Maps original user IDs to new database IDs

**Why shuffle?** Posts are naturally grouped by user in the source API (posts 1-10 belong to user 1, posts 11-20 to user 2, etc.). Shuffling ensures posts from different users appear mixed in the feed, creating a more realistic community posts experience.

## Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The application will automatically redirect to the posts page.

## Features

- **Post List**: Paginated display of community posts
- **User Filtering**: Search and filter posts by user
- **Post Deletion**: Delete posts with confirmation modal
- **Error Handling**: Comprehensive error states with user feedback
- **Responsive Design**: Mobile-friendly interface

## Testing Error Handling

The application includes a built-in error simulation system for testing error states without breaking the API or database.

### Available Error Types

The `NEXT_PUBLIC_FORCE_ERRORS` environment variable accepts these values:

| Value | Effect | Where to See It |
|-------|--------|-----------------|
| `load_posts` | Simulates failure when loading posts list | Error banner on posts page |
| `delete_post` | Simulates failure when deleting a post | Error banner inside PostCard |
| `search_users` | Simulates failure when searching users | Error message in UserFilter dropdown |

### How to Test Errors

1. Open `.env.local` file
2. Add one of these lines:

```bash
# Test post loading errors
NEXT_PUBLIC_FORCE_ERRORS=load_posts

# Test post deletion errors
NEXT_PUBLIC_FORCE_ERRORS=delete_post

# Test user search errors
NEXT_PUBLIC_FORCE_ERRORS=search_users
```

3. Restart the development server
4. Interact with the corresponding feature to see the error state

**Note:** Only one error type can be active at a time. This allows normal operation of other features while testing a specific error scenario.

### Disable Error Simulation

To disable error simulation:
- Remove the `NEXT_PUBLIC_FORCE_ERRORS` variable, or
- Set it to any other value: `NEXT_PUBLIC_FORCE_ERRORS=disabled`
- Restart the development server

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Lucide React icons
- **State Management**: TanStack Query (React Query)
- **Type Safety**: TypeScript

## Project Structure

```
/app                    # Next.js app router pages
/components            # React components
  /posts              # Post-related components
  /users              # User-related components
  /ui                 # Reusable UI components
/db                    # Database schema and seed script
/features              # Feature-based code organization
  /posts/actions      # Server actions for posts
  /users/actions      # Server actions for users
/hooks                 # Custom React hooks
/lib                   # Utility functions and configurations
```
