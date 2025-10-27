# Inventory System - Project Structure

## Overview
This is an alloy rim factory inventory management system with 4 main modules.

## Folder Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication routes
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── production/           # Production Line module
│   │   ├── administration/       # Administration module
│   │   ├── inventory/            # Inventory module
│   │   └── customer/             # Customer module
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/                   # React components
│   ├── production/               # Production Line components
│   ├── administration/           # Administration components
│   ├── inventory/                # Inventory components
│   ├── customer/                 # Customer components
│   ├── layout/                   # Layout components (Navbar, Sidebar, etc.)
│   └── ui/                       # Reusable UI components (shadcn/ui)
│
├── lib/                          # Utility functions & configurations
│   ├── db.ts                     # Database connection (Prisma client)
│   ├── auth.ts                   # Authentication config
│   ├── utils.ts                  # Helper functions
│   └── pdf.ts                    # PDF generation utilities
│
├── types/                        # TypeScript type definitions
│   ├── production.ts             # Production module types
│   ├── administration.ts         # Administration module types
│   ├── inventory.ts              # Inventory module types
│   └── customer.ts               # Customer module types
│
├── schemas/                      # Zod validation schemas
│   ├── production.ts             # Production validation schemas
│   ├── administration.ts         # Administration validation schemas
│   ├── inventory.ts              # Inventory validation schemas
│   └── customer.ts               # Customer validation schemas
│
└── actions/                      # Server actions
    ├── production.ts             # Production server actions
    ├── administration.ts         # Administration server actions
    ├── inventory.ts              # Inventory server actions
    └── customer.ts               # Customer server actions

prisma/
└── schema.prisma                 # Database schema

public/                           # Static assets
└── receipts/                     # Generated PDF receipts (if needed)
```

## Module Organization

### 1. Production Line
- Raw Material Management
- Items (Design, Codes)
- Machining (CNC tracking)
- Paint Department
- Quality Control
- Packing
- Supply Chain
- Shift Management

### 2. Administration
- Admin Management
- Account (Financial tracking)
- HR
- Attendance

### 3. Inventory
- Raw Materials
- Total Stores

### 4. Customer
- Customer Information
- Receipt/Invoice Generation
- Order History
- Payment Tracking

## Code Organization Principles

1. **Separation of Concerns**: Each module has its own components, types, schemas, and actions
2. **Reusability**: Common UI components in `components/ui`
3. **Type Safety**: TypeScript types and Zod schemas for validation
4. **Server Actions**: Business logic in separate action files
5. **Clean Architecture**: Clear separation between presentation, business logic, and data access


